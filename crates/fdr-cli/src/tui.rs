//! Interactive terminal UI for browsing and picking food, drinks, snacks,
//! and meal schedules. Run with `fdr tui`.

use crate::data::{self, Food, ScheduleEntry};
use crossterm::event::{self, Event, KeyCode, KeyEventKind, KeyModifiers};
use crossterm::execute;
use crossterm::terminal::{
    disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen,
};
use ratatui::layout::{Constraint, Direction, Layout, Rect};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, Borders, List, ListItem, Paragraph, Tabs};
use ratatui::{Frame, Terminal};
use std::io;

const TABS: [&str; 4] = ["Foods", "Drinks", "Snacks", "Schedules"];

type MealRow = (String, ScheduleEntry);

struct App {
    tab: usize,
    foods: Vec<Food>,
    drinks: Vec<Food>,
    snacks: Vec<Food>,
    meals: Vec<MealRow>,
    filter: String,
    filter_mode: bool,
    cursor: usize,
    picked: Option<String>,
}

impl App {
    fn load() -> Result<Self, String> {
        let mut meals = Vec::new();
        for name in data::schedules()? {
            for entry in data::schedule(&name)? {
                meals.push((name.clone(), entry));
            }
        }
        Ok(Self {
            tab: 0,
            foods: data::foods()?,
            drinks: data::drinks()?,
            snacks: data::snacks()?,
            meals,
            filter: String::new(),
            filter_mode: false,
            cursor: 0,
            picked: None,
        })
    }

    fn items(&self) -> &[Food] {
        match self.tab {
            0 => &self.foods,
            1 => &self.drinks,
            _ => &self.snacks,
        }
    }

    fn is_meals(&self) -> bool {
        self.tab == 3
    }

    fn matches(&self, haystack: &str) -> bool {
        let q = self.filter.to_lowercase();
        q.is_empty() || haystack.to_lowercase().contains(&q)
    }

    fn food_indices(&self) -> Vec<usize> {
        self.items()
            .iter()
            .enumerate()
            .filter(|(_, f)| {
                self.matches(&format!(
                    "{} {} {} {} {}",
                    f.label, f.value, f.country, f.category, f.subcategory
                ))
            })
            .map(|(i, _)| i)
            .collect()
    }

    fn meal_indices(&self) -> Vec<usize> {
        self.meals
            .iter()
            .enumerate()
            .filter(|(_, (name, e))| {
                self.matches(&format!(
                    "{} {} {} {} {}",
                    name,
                    e.day,
                    e.week.as_deref().unwrap_or(""),
                    e.meal,
                    e.restaurant
                ))
            })
            .map(|(i, _)| i)
            .collect()
    }

    fn len(&self) -> usize {
        if self.is_meals() {
            self.meal_indices().len()
        } else {
            self.food_indices().len()
        }
    }

    fn selected_food(&self) -> Option<&Food> {
        if self.is_meals() {
            return None;
        }
        self.food_indices()
            .get(self.cursor)
            .map(|&i| &self.items()[i])
    }

    fn selected_meal(&self) -> Option<&MealRow> {
        if !self.is_meals() {
            return None;
        }
        self.meal_indices()
            .get(self.cursor)
            .map(|&i| &self.meals[i])
    }

    fn random_pick(&mut self) {
        if self.is_meals() {
            let idx = self.meal_indices();
            if let Some(&i) = data::pick(&idx, data::rng()).as_ref() {
                self.picked = Some(data::format_schedule(&self.meals[i].1));
            }
        } else {
            let idx = self.food_indices();
            if let Some(&i) = data::pick(&idx, data::rng()).as_ref() {
                self.picked = Some(data::format_food(&self.items()[i]));
            }
        }
    }

    fn move_cursor(&mut self, delta: isize) {
        let len = self.len();
        if len == 0 {
            return;
        }
        self.cursor = (self.cursor as isize + delta).rem_euclid(len as isize) as usize;
    }

    fn handle_key(&mut self, code: KeyCode) -> bool {
        match code {
            KeyCode::Char('q') if !self.filter_mode => return true,
            KeyCode::Tab | KeyCode::Right => self.tab = (self.tab + 1) % TABS.len(),
            KeyCode::BackTab | KeyCode::Left => self.tab = (self.tab + TABS.len() - 1) % TABS.len(),
            KeyCode::Up | KeyCode::Char('k') => self.move_cursor(-1),
            KeyCode::Down | KeyCode::Char('j') => self.move_cursor(1),
            KeyCode::Enter | KeyCode::Char('r') => self.random_pick(),
            KeyCode::Char('/') => self.filter_mode = true,
            KeyCode::Esc => {
                if self.filter_mode {
                    self.filter_mode = false;
                } else {
                    self.filter.clear();
                }
                self.cursor = 0;
            }
            KeyCode::Backspace if self.filter_mode => {
                self.filter.pop();
                self.cursor = 0;
            }
            KeyCode::Char(c) if self.filter_mode => {
                self.filter.push(c);
                self.cursor = 0;
            }
            _ => {}
        }
        false
    }

    fn draw(&self, frame: &mut Frame) {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Min(6),
                Constraint::Length(2),
            ])
            .split(frame.area());

        let titles: Vec<Line> = TABS.iter().map(|t| Line::from(*t)).collect();
        let tabs = Tabs::new(titles)
            .block(Block::default().borders(Borders::BOTTOM))
            .select(self.tab)
            .style(Style::default().fg(Color::Gray))
            .highlight_style(
                Style::default()
                    .fg(Color::Cyan)
                    .add_modifier(Modifier::BOLD),
            );
        frame.render_widget(tabs, chunks[0]);

        let body = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Percentage(55), Constraint::Percentage(45)])
            .split(chunks[1]);

        self.draw_list(frame, body[0]);
        self.draw_detail(frame, body[1]);

        let filter_text = if self.filter_mode {
            format!("/{}/", self.filter)
        } else if self.filter.is_empty() {
            String::new()
        } else {
            format!("filter: {}", self.filter)
        };
        let footer = Paragraph::new(Line::from(vec![
            Span::styled(
                " tab/←→ switch · ↑↓/jk move · enter/r pick · / filter · esc clear · q quit ",
                Style::default().fg(Color::DarkGray),
            ),
            Span::styled(filter_text, Style::default().fg(Color::Yellow)),
        ]));
        frame.render_widget(footer, chunks[2]);
    }

    fn draw_list(&self, frame: &mut Frame, area: Rect) {
        let block = Block::default().borders(Borders::ALL).title(format!(
            " {} ({}) ",
            TABS[self.tab],
            self.len()
        ));
        let inner = block.inner(area);
        frame.render_widget(block, area);

        let items: Vec<ListItem> = if self.is_meals() {
            self.meal_indices()
                .iter()
                .map(|&i| {
                    let (name, e) = &self.meals[i];
                    let week = e
                        .week
                        .as_deref()
                        .map(|w| format!(" w{w}"))
                        .unwrap_or_default();
                    ListItem::new(Line::from(vec![
                        Span::raw(format!("{} ", e.emoji)),
                        Span::styled(
                            format!("{}{} ", e.day, week),
                            Style::default().add_modifier(Modifier::BOLD),
                        ),
                        Span::raw(format!("{} @ {}  ", e.meal, e.restaurant)),
                        Span::styled(name.clone(), Style::default().fg(Color::DarkGray)),
                    ]))
                })
                .collect()
        } else {
            self.food_indices()
                .iter()
                .map(|&i| {
                    let f = &self.items()[i];
                    ListItem::new(Line::from(vec![
                        Span::raw(format!("{} ", f.emoji)),
                        Span::styled(
                            format!("{} ", f.label),
                            Style::default().add_modifier(Modifier::BOLD),
                        ),
                        Span::styled(
                            format!("{} · {}", f.country, f.category),
                            Style::default().fg(Color::DarkGray),
                        ),
                    ]))
                })
                .collect()
        };

        let mut state = ratatui::widgets::ListState::default();
        if !items.is_empty() {
            state.select(Some(self.cursor.min(items.len() - 1)));
        }
        let list = List::new(items)
            .highlight_symbol("> ")
            .highlight_style(Style::default().bg(Color::Rgb(30, 30, 46)));
        frame.render_stateful_widget(list, inner, &mut state);
    }

    fn draw_detail(&self, frame: &mut Frame, area: Rect) {
        let block = Block::default().borders(Borders::ALL).title(" Detail ");
        let inner = block.inner(area);
        frame.render_widget(block, area);

        let mut lines: Vec<Line> = Vec::new();
        if let Some(pick) = &self.picked {
            lines.push(Line::from(Span::styled(
                format!("Picked: {pick}"),
                Style::default()
                    .fg(Color::Green)
                    .add_modifier(Modifier::BOLD),
            )));
            lines.push(Line::from(""));
        }
        if let Some(f) = self.selected_food() {
            lines.push(Line::from(vec![
                Span::raw(format!("{} ", f.emoji)),
                Span::styled(
                    f.label.clone(),
                    Style::default().add_modifier(Modifier::BOLD),
                ),
            ]));
            for (k, v) in [
                ("country", f.country.as_str()),
                ("category", f.category.as_str()),
                ("subcategory", f.subcategory.as_str()),
                ("value", f.value.as_str()),
            ] {
                lines.push(Line::from(vec![
                    Span::styled(format!("{k}: "), Style::default().fg(Color::DarkGray)),
                    Span::raw(v),
                ]));
            }
        } else if let Some((name, e)) = self.selected_meal() {
            lines.push(Line::from(vec![
                Span::raw(format!("{} ", e.emoji)),
                Span::styled(
                    format!("{} — {}", e.day, e.meal),
                    Style::default().add_modifier(Modifier::BOLD),
                ),
            ]));
            for (k, v) in [
                ("schedule", name.as_str()),
                ("week", e.week.as_deref().unwrap_or("-")),
                ("restaurant", e.restaurant.as_str()),
                ("note", e.note.as_deref().unwrap_or("-")),
            ] {
                lines.push(Line::from(vec![
                    Span::styled(format!("{k}: "), Style::default().fg(Color::DarkGray)),
                    Span::raw(v),
                ]));
            }
        } else {
            lines.push(Line::from(Span::styled(
                "No items match the filter.",
                Style::default().fg(Color::DarkGray),
            )));
        }
        frame.render_widget(Paragraph::new(lines), inner);
    }
}

pub fn run() -> Result<(), String> {
    let mut app = App::load()?;

    enable_raw_mode().map_err(|e| e.to_string())?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen).map_err(|e| e.to_string())?;
    let backend = ratatui::backend::CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend).map_err(|e| e.to_string())?;

    let result = loop {
        if let Err(e) = terminal.draw(|f| app.draw(f)) {
            break Err(e.to_string());
        }
        match event::read() {
            Ok(Event::Key(key)) if key.kind == KeyEventKind::Press => {
                if (key.code == KeyCode::Char('c') && key.modifiers.contains(KeyModifiers::CONTROL))
                    || app.handle_key(key.code)
                {
                    break Ok(());
                }
            }
            Ok(_) => {}
            Err(e) => break Err(e.to_string()),
        }
    };

    disable_raw_mode().ok();
    execute!(io::stdout(), LeaveAlternateScreen).ok();
    result
}
