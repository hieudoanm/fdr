//! Static food/drink/snack/schedule data access.

use serde::Deserialize;
use std::env;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Deserialize)]
pub struct Food {
    pub country: String,
    pub category: String,
    pub subcategory: String,
    pub value: String,
    pub label: String,
    pub emoji: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Cuisine {
    pub value: String,
    pub label: String,
    pub emoji: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ScheduleEntry {
    pub day: String,
    #[serde(default)]
    pub week: Option<String>,
    pub meal: String,
    pub emoji: String,
    pub restaurant: String,
    #[serde(default)]
    pub note: Option<String>,
}

/// Locate `packages/landing/src/data/json`, walking up from the cwd.
/// `FDR_DATA_DIR` overrides everything.
pub fn data_dir() -> PathBuf {
    if let Ok(dir) = env::var("FDR_DATA_DIR") {
        return PathBuf::from(dir);
    }
    let mut dir = env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    loop {
        let candidate = dir.join("packages/landing/src/data/json");
        if candidate.is_dir() {
            return candidate;
        }
        if !dir.pop() {
            break;
        }
    }
    PathBuf::from("packages/landing/src/data/json")
}

fn load<T: for<'de> Deserialize<'de>>(name: &str) -> Result<Vec<T>, String> {
    let path = data_dir().join(name);
    let text =
        fs::read_to_string(&path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
    serde_json::from_str(&text).map_err(|e| format!("invalid JSON in {}: {e}", path.display()))
}

pub fn countries() -> Result<Vec<Cuisine>, String> {
    load("countries.json")
}

pub fn foods() -> Result<Vec<Food>, String> {
    load("meal-foods.json")
}

pub fn drinks() -> Result<Vec<Food>, String> {
    load("meal-drinks.json")
}

pub fn snacks() -> Result<Vec<Food>, String> {
    load("meal-snacks.json")
}

pub fn schedule(name: &str) -> Result<Vec<ScheduleEntry>, String> {
    load(&format!("schedule-{name}.json"))
}

pub fn schedules() -> Result<Vec<String>, String> {
    let dir = data_dir();
    let mut names = Vec::new();
    for entry in fs::read_dir(&dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file = entry.file_name().to_string_lossy().to_string();
        if let Some(rest) = file.strip_prefix("schedule-") {
            if let Some(slug) = rest.strip_suffix(".json") {
                names.push(slug.to_string());
            }
        }
    }
    names.sort();
    Ok(names)
}

/// Shared filters for food/drink/snack listings and picks.
#[derive(Debug, Default, Clone)]
pub struct Filters {
    pub country: Option<String>,
    pub category: Option<String>,
    pub subcategory: Option<String>,
    pub search: Option<String>,
}

impl Filters {
    pub fn apply(&self, items: Vec<Food>) -> Vec<Food> {
        items
            .into_iter()
            .filter(|f| {
                self.country
                    .as_deref()
                    .is_none_or(|c| f.country.eq_ignore_ascii_case(c))
                    && self
                        .category
                        .as_deref()
                        .is_none_or(|c| f.category.eq_ignore_ascii_case(c))
                    && self
                        .subcategory
                        .as_deref()
                        .is_none_or(|s| f.subcategory.eq_ignore_ascii_case(s))
                    && self.search.as_deref().is_none_or(|q| {
                        f.label.to_lowercase().contains(&q.to_lowercase())
                            || f.value.to_lowercase().contains(&q.to_lowercase())
                    })
            })
            .collect()
    }
}

/// Tiny xorshift64 PRNG seeded from system time — no extra deps.
pub fn rng() -> u64 {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos() as u64)
        .unwrap_or(0x9e3779b97f4a7c15);
    nanos | 1
}

pub fn pick<T: Clone>(items: &[T], mut state: u64) -> Option<T> {
    if items.is_empty() {
        return None;
    }
    // xorshift64*
    state ^= state >> 12;
    state ^= state << 25;
    state ^= state >> 27;
    let index = (state.wrapping_mul(0x2545F4914F6CDD1D) >> 32) as usize % items.len();
    Some(items[index].clone())
}

pub fn format_food(f: &Food) -> String {
    format!(
        "{} {} — {} · {} · {}",
        f.emoji, f.label, f.country, f.category, f.subcategory
    )
}

pub fn format_schedule(e: &ScheduleEntry) -> String {
    let week = e
        .week
        .as_deref()
        .map(|w| format!(" (week {w})"))
        .unwrap_or_default();
    let note = e
        .note
        .as_deref()
        .filter(|n| !n.is_empty() && *n != "-")
        .map(|n| format!(" — {n}"))
        .unwrap_or_default();
    format!(
        "{} {}{}: {} @ {}{}",
        e.emoji, e.day, week, e.meal, e.restaurant, note
    )
}
