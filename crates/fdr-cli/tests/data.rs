//! Tests for the `fdr_cli::data` access layer.

use fdr_cli::data::{
    Filters, countries, data_dir, drinks, foods, format_food, format_schedule, pick, rng, schedule,
    schedules, snacks,
};

#[test]
fn data_dir_points_at_json_directory() {
    let dir = data_dir();
    assert!(dir.join("countries.json").is_file());
    assert!(dir.join("meal-foods.json").is_file());
}

#[test]
fn data_dir_honors_fdr_data_dir_override() {
    let expected = data_dir();
    // Point the override at the same directory other tests resolve, so
    // concurrent data loads are unaffected.
    unsafe { std::env::set_var("FDR_DATA_DIR", &expected) };
    assert_eq!(data_dir(), expected);
    unsafe { std::env::remove_var("FDR_DATA_DIR") };
}

#[test]
fn countries_loads_cuisines() {
    let list = countries().unwrap();
    assert!(list.len() >= 10);
    let first = &list[0];
    assert!(!first.value.is_empty());
    assert!(!first.label.is_empty());
    assert!(!first.emoji.is_empty());
}

#[test]
fn foods_drinks_snacks_load_expected_counts() {
    assert_eq!(foods().unwrap().len(), 360);
    assert_eq!(drinks().unwrap().len(), 60);
    assert_eq!(snacks().unwrap().len(), 60);
}

#[test]
fn food_entries_have_all_fields() {
    for food in foods().unwrap().iter().take(20) {
        assert!(!food.country.is_empty());
        assert!(!food.category.is_empty());
        assert!(!food.subcategory.is_empty());
        assert!(!food.value.is_empty());
        assert!(!food.label.is_empty());
        assert!(!food.emoji.is_empty());
    }
}

#[test]
fn schedules_lists_known_names_sorted() {
    let names = schedules().unwrap();
    assert_eq!(names, vec!["scheldon", "united-kingdom", "vietnam"]);
}

#[test]
fn schedule_loads_entries() {
    let entries = schedule("scheldon").unwrap();
    assert_eq!(entries.len(), 7);
    assert!(entries.iter().all(|e| !e.day.is_empty()));
    assert!(entries.iter().all(|e| !e.meal.is_empty()));
}

#[test]
fn schedule_unknown_name_is_error() {
    assert!(schedule("does-not-exist").is_err());
}

#[test]
fn multi_week_schedule_entries_have_week() {
    let entries = schedule("vietnam").unwrap();
    assert!(entries.iter().all(|e| e.week.is_some()));
    let weeks: std::collections::HashSet<_> =
        entries.iter().filter_map(|e| e.week.as_deref()).collect();
    assert_eq!(weeks.len(), 4);
}

#[test]
fn filters_apply_country_case_insensitively() {
    let filtered = Filters {
        country: Some("JAPANESE".to_string()),
        ..Default::default()
    }
    .apply(foods().unwrap());
    assert!(!filtered.is_empty());
    assert!(filtered.iter().all(|f| f.country == "japanese"));
}

#[test]
fn filters_apply_category_and_subcategory() {
    let foods = foods().unwrap();
    let category = foods[0].category.clone();
    let subcategory = foods[0].subcategory.clone();

    let by_category = Filters {
        category: Some(category.clone()),
        ..Default::default()
    }
    .apply(foods.clone());
    assert!(by_category.iter().all(|f| f.category == category));

    let by_subcategory = Filters {
        subcategory: Some(subcategory.clone()),
        ..Default::default()
    }
    .apply(foods);
    assert!(by_subcategory.iter().all(|f| f.subcategory == subcategory));
}

#[test]
fn filters_search_matches_label_or_value() {
    let filtered = Filters {
        search: Some("sushi".to_string()),
        ..Default::default()
    }
    .apply(foods().unwrap());
    assert!(!filtered.is_empty());
    assert!(filtered.iter().all(|f| {
        f.label.to_lowercase().contains("sushi") || f.value.to_lowercase().contains("sushi")
    }));
}

#[test]
fn filters_combine_with_and_semantics() {
    let filtered = Filters {
        country: Some("japanese".to_string()),
        search: Some("zzz-no-match".to_string()),
        ..Default::default()
    }
    .apply(foods().unwrap());
    assert!(filtered.is_empty());
}

#[test]
fn filters_with_no_criteria_return_everything() {
    let all = foods().unwrap();
    let filtered = Filters::default().apply(all.clone());
    assert_eq!(filtered.len(), all.len());
}

#[test]
fn rng_is_odd_and_nonzero() {
    for _ in 0..10 {
        let state = rng();
        assert_ne!(state, 0);
        assert_eq!(state & 1, 1);
    }
}

#[test]
fn pick_returns_none_for_empty() {
    let empty: Vec<i32> = Vec::new();
    assert!(pick(&empty, 42).is_none());
}

#[test]
fn pick_returns_the_only_element() {
    assert_eq!(pick(&["only"], 42), Some("only"));
}

#[test]
fn pick_is_deterministic_for_a_seed() {
    let items = vec![1, 2, 3, 4, 5];
    assert_eq!(pick(&items, 7), pick(&items, 7));
}

#[test]
fn pick_stays_in_bounds_across_seeds() {
    let items = vec!["a", "b", "c"];
    for seed in 0..100u64 {
        let picked = pick(&items, seed).unwrap();
        assert!(items.contains(&picked));
    }
}

#[test]
fn format_food_includes_all_parts() {
    let food = foods().unwrap().remove(0);
    let text = format_food(&food);
    assert!(text.contains(&food.emoji));
    assert!(text.contains(&food.label));
    assert!(text.contains(&food.country));
    assert!(text.contains(&food.category));
    assert!(text.contains(&food.subcategory));
}

#[test]
fn format_schedule_without_week_or_note() {
    let entry = schedule("scheldon").unwrap().remove(0);
    let text = format_schedule(&entry);
    assert!(text.contains(&entry.day));
    assert!(text.contains(&entry.meal));
    assert!(text.contains(&entry.restaurant));
}

#[test]
fn format_schedule_with_week() {
    let entry = schedule("vietnam")
        .unwrap()
        .into_iter()
        .find(|e| e.week.is_some())
        .unwrap();
    let text = format_schedule(&entry);
    assert!(text.contains(&format!("week {}", entry.week.unwrap())));
}
