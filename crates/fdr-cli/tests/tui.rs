//! Tests for the interactive TUI state machine and rendering, using
//! ratatui's headless `TestBackend`.

use crossterm::event::KeyCode;
use fdr_cli::tui::App;
use ratatui::Terminal;
use ratatui::backend::TestBackend;

fn new_app() -> App {
    App::load().expect("app loads")
}

/// Render the app once and return the visible screen text.
fn screen(app: &App) -> String {
    let backend = TestBackend::new(120, 40);
    let mut terminal = Terminal::new(backend).unwrap();
    terminal.draw(|f| app.draw(f)).unwrap();
    let buffer = terminal.backend().buffer();
    let area = buffer.area;
    let mut rows = Vec::new();
    for y in 0..area.height {
        let mut row = String::new();
        for x in 0..area.width {
            row.push_str(buffer[(x, y)].symbol());
        }
        rows.push(row.trim_end().to_string());
    }
    rows.join("\n")
}

#[test]
fn loads_all_tabs_with_data() {
    let mut app = new_app();
    assert_eq!(app.len(), 360);
    for _ in 0..3 {
        assert!(!app.handle_key(KeyCode::Tab));
    }
    assert!(app.is_meals());
    assert!(!app.is_empty());
    // BackTab moves to snacks (tab 2).
    assert!(!app.handle_key(KeyCode::BackTab));
    assert!(!app.is_meals());
    assert_eq!(app.len(), 60);
    // Two more BackTabs wrap around to foods.
    assert!(!app.handle_key(KeyCode::BackTab));
    assert!(!app.handle_key(KeyCode::BackTab));
    assert_eq!(app.len(), 360);
}

#[test]
fn tabs_cycle_with_arrow_keys() {
    let mut app = new_app();
    assert!(!app.handle_key(KeyCode::Right)); // drinks
    assert_eq!(app.len(), 60);
    assert!(!app.handle_key(KeyCode::Right)); // snacks
    assert_eq!(app.len(), 60);
    assert!(!app.handle_key(KeyCode::Left)); // back to drinks
    assert!(!app.handle_key(KeyCode::Left)); // foods
    assert_eq!(app.len(), 360);
}

#[test]
fn cursor_moves_and_wraps() {
    let mut app = new_app();
    let first = app.selected_food().unwrap().value.clone();
    assert!(!app.handle_key(KeyCode::Up)); // wraps to last item
    let last = app.selected_food().unwrap().value.clone();
    assert_ne!(first, last);
    assert!(!app.handle_key(KeyCode::Down));
    assert_eq!(app.selected_food().unwrap().value, first);
    // j/k aliases
    assert!(!app.handle_key(KeyCode::Char('j')));
    assert_ne!(app.selected_food().unwrap().value, first);
    assert!(!app.handle_key(KeyCode::Char('k')));
    assert_eq!(app.selected_food().unwrap().value, first);
}

#[test]
fn quit_key_only_works_outside_filter_mode() {
    let mut app = new_app();
    assert!(app.handle_key(KeyCode::Char('q')));

    let mut app = new_app();
    assert!(!app.handle_key(KeyCode::Char('/')));
    // 'q' inside filter mode types into the filter instead of quitting.
    assert!(!app.handle_key(KeyCode::Char('q')));
    let text = screen(&app);
    assert!(text.contains("/q/"));
}

#[test]
fn filter_mode_edits_filter() {
    let mut app = new_app();
    assert!(!app.handle_key(KeyCode::Char('/')));
    for c in "sushi".chars() {
        assert!(!app.handle_key(KeyCode::Char(c)));
    }
    assert!(app.len() < 360);
    assert!(!app.is_empty());
    // Backspace removes the last character.
    assert!(!app.handle_key(KeyCode::Backspace));
    // Esc exits filter mode, second Esc clears the filter.
    assert!(!app.handle_key(KeyCode::Esc));
    assert!(!app.handle_key(KeyCode::Esc));
    assert_eq!(app.len(), 360);
}

#[test]
fn impossible_filter_shows_empty_state() {
    let mut app = new_app();
    assert!(!app.handle_key(KeyCode::Char('/')));
    for c in "zzz-no-match".chars() {
        app.handle_key(KeyCode::Char(c));
    }
    assert_eq!(app.len(), 0);
    assert!(app.selected_food().is_none());
    let text = screen(&app);
    assert!(text.contains("No items match the filter."));
    // Moving with an empty list is a no-op, not a panic.
    assert!(!app.handle_key(KeyCode::Down));
    assert!(!app.handle_key(KeyCode::Up));
}

#[test]
fn meals_tab_filters_and_selects_entries() {
    let mut app = new_app();
    for _ in 0..3 {
        app.handle_key(KeyCode::Tab);
    }
    assert!(app.is_meals());
    assert!(app.selected_meal().is_some());

    app.handle_key(KeyCode::Char('/'));
    for c in "monday".chars() {
        app.handle_key(KeyCode::Char(c));
    }
    assert!(!app.is_empty());
    assert!(app.len() < 63);
    assert!(
        app.selected_meal()
            .unwrap()
            .1
            .day
            .eq_ignore_ascii_case("monday")
    );
}

#[test]
fn random_pick_sets_picked_for_foods() {
    let mut app = new_app();
    assert!(!app.handle_key(KeyCode::Enter));
    let text = screen(&app);
    assert!(text.contains("Picked:"));
}

#[test]
fn random_pick_sets_picked_for_meals() {
    let mut app = new_app();
    for _ in 0..3 {
        app.handle_key(KeyCode::Tab);
    }
    assert!(!app.handle_key(KeyCode::Char('r')));
    let text = screen(&app);
    assert!(text.contains("Picked:"));
}

#[test]
fn random_pick_with_empty_filter_keeps_previous_pick() {
    let mut app = new_app();
    app.handle_key(KeyCode::Char('/'));
    for c in "zzz-no-match".chars() {
        app.handle_key(KeyCode::Char(c));
    }
    assert!(!app.handle_key(KeyCode::Enter));
    let text = screen(&app);
    assert!(!text.contains("Picked:"));
}

#[test]
fn unrelated_keys_are_ignored() {
    let mut app = new_app();
    for code in [
        KeyCode::F(1),
        KeyCode::Home,
        KeyCode::PageDown,
        KeyCode::Char('x'),
    ] {
        assert!(!app.handle_key(code));
    }
    assert_eq!(app.len(), 360);
}

#[test]
fn draw_renders_every_tab() {
    let mut app = new_app();
    for _ in 0..4 {
        let text = screen(&app);
        assert!(text.contains("Foods"));
        assert!(text.contains("Detail"));
        assert!(text.contains("q quit"));
        app.handle_key(KeyCode::Tab);
    }
}

#[test]
fn meals_tab_shows_schedule_names() {
    let mut app = new_app();
    for _ in 0..3 {
        app.handle_key(KeyCode::Tab);
    }
    let text = screen(&app);
    assert!(text.contains("scheldon"));
    assert!(text.contains("Schedules ("));
}

#[test]
fn selected_meal_details_render() {
    let mut app = new_app();
    for _ in 0..3 {
        app.handle_key(KeyCode::Tab);
    }
    let text = screen(&app);
    assert!(text.contains("schedule:"));
    assert!(text.contains("restaurant:"));
}
