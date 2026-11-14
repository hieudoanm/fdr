//! FDR CLI — query food, drink, snack, and schedule data; `fdr mcp` serves MCP.

mod data;
mod mcp;
mod tui;

use clap::{Parser, Subcommand, ValueEnum};
use data::{countries, drinks, foods, schedule, schedules, snacks, Filters};

#[derive(Parser)]
#[command(
    name = "fdr",
    version,
    about = "Food & Drink randomizer data CLI with an MCP server"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(clap::Args, Debug, Default)]
struct ItemArgs {
    /// Filter by country slug (e.g. japanese, french)
    #[arg(long)]
    country: Option<String>,
    /// Filter by category
    #[arg(long)]
    category: Option<String>,
    /// Filter by subcategory
    #[arg(long)]
    subcategory: Option<String>,
    /// Search label/value substring
    #[arg(long)]
    search: Option<String>,
    /// Print a single random match instead of the full list
    #[arg(long)]
    random: bool,
    /// Limit printed results
    #[arg(long)]
    limit: Option<usize>,
}

impl ItemArgs {
    fn filters(&self) -> Filters {
        Filters {
            country: self.country.clone(),
            category: self.category.clone(),
            subcategory: self.subcategory.clone(),
            search: self.search.clone(),
        }
    }
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// List available cuisines/countries
    Countries,
    /// List dishes
    Foods(#[command(flatten)] ItemArgs),
    /// List drinks
    Drinks(#[command(flatten)] ItemArgs),
    /// List snacks and desserts
    Snacks(#[command(flatten)] ItemArgs),
    /// Pick a random dish, drink, snack, or any of them
    Pick {
        /// What to pick
        #[arg(value_enum)]
        kind: PickKind,
        #[command(flatten)]
        args: ItemArgs,
    },
    /// List available meal schedules
    Schedules,
    /// Show a meal schedule (scheldon, vietnam, united-kingdom)
    Schedule {
        /// Schedule name (see `fdr schedules`)
        name: String,
        /// Filter by week number
        #[arg(long)]
        week: Option<String>,
        /// Filter by day (e.g. Monday)
        #[arg(long)]
        day: Option<String>,
    },
    /// Print dataset statistics
    Stats,
    /// Run an MCP server over stdio JSON-RPC
    Mcp,
    /// Open the interactive terminal UI
    Tui,
}

#[derive(Clone, Copy, ValueEnum, Debug)]
enum PickKind {
    Foods,
    Drinks,
    Snacks,
    Any,
}

fn run_items(name: &str, args: &ItemArgs) -> Result<(), String> {
    let all = match name {
        "foods" => foods()?,
        "drinks" => drinks()?,
        "snacks" => snacks()?,
        _ => unreachable!(),
    };
    let filtered = args.filters().apply(all);
    if filtered.is_empty() {
        println!("No {name} match the given filters.");
        return Ok(());
    }
    if args.random {
        let pick = data::pick(&filtered, data::rng()).unwrap();
        println!("{}", data::format_food(&pick));
        return Ok(());
    }
    let limit = args.limit.unwrap_or(usize::MAX);
    for food in filtered.iter().take(limit) {
        println!("{}", data::format_food(food));
    }
    eprintln!(
        "{} {name} ({} shown)",
        filtered.len(),
        filtered.len().min(limit)
    );
    Ok(())
}

fn run_pick(kind: PickKind, args: &ItemArgs) -> Result<(), String> {
    let mut all = Vec::new();
    match kind {
        PickKind::Foods => all.extend(foods()?),
        PickKind::Drinks => all.extend(drinks()?),
        PickKind::Snacks => all.extend(snacks()?),
        PickKind::Any => {
            all.extend(foods()?);
            all.extend(drinks()?);
            all.extend(snacks()?);
        }
    }
    let filtered = args.filters().apply(all);
    match data::pick(&filtered, data::rng()) {
        Some(food) => {
            println!("{}", data::format_food(&food));
            Ok(())
        }
        None => Err("No items match the given filters.".to_string()),
    }
}

fn run_schedule(name: &str, week: Option<&str>, day: Option<&str>) -> Result<(), String> {
    let entries = schedule(name)?;
    let filtered: Vec<_> = entries
        .iter()
        .filter(|e| {
            week.is_none_or(|w| e.week.as_deref() == Some(w))
                && day.is_none_or(|d| e.day.eq_ignore_ascii_case(d))
        })
        .collect();
    if filtered.is_empty() {
        println!("No schedule entries match.");
        return Ok(());
    }
    for entry in filtered {
        println!("{}", data::format_schedule(entry));
    }
    Ok(())
}

fn run_stats() -> Result<(), String> {
    let f = foods()?;
    let d = drinks()?;
    let s = snacks()?;
    let c = countries()?;
    println!("Countries: {}", c.len());
    println!("Dishes: {}", f.len());
    println!("Drinks: {}", d.len());
    println!("Snacks/desserts: {}", s.len());
    println!("Total items: {}", f.len() + d.len() + s.len());
    println!("Schedules: {}", schedules()?.join(", "));
    Ok(())
}

fn main() {
    let cli = Cli::parse();
    let result = match cli.command {
        Commands::Countries => countries().map(|list| {
            for c in list {
                println!("{} {} ({})", c.emoji, c.label, c.value);
            }
        }),
        Commands::Foods(args) => run_items("foods", &args),
        Commands::Drinks(args) => run_items("drinks", &args),
        Commands::Snacks(args) => run_items("snacks", &args),
        Commands::Pick { kind, args } => run_pick(kind, &args),
        Commands::Schedules => schedules().map(|names| {
            for name in names {
                println!("{name}");
            }
        }),
        Commands::Schedule { name, week, day } => {
            run_schedule(&name, week.as_deref(), day.as_deref())
        }
        Commands::Stats => run_stats(),
        Commands::Mcp => mcp::run().map_err(|e| e.to_string()),
        Commands::Tui => tui::run(),
    };
    if let Err(error) = result {
        eprintln!("error: {error}");
        std::process::exit(1);
    }
}
