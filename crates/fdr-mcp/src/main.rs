//! `fdr-mcp` — standalone MCP server binary over stdio (default) or
//! streamable HTTP. Thin wrapper around `fdr_cli::mcp`; `fdr mcp` runs the
//! same server.

use clap::Parser;

#[derive(Parser)]
#[command(
    name = "fdr-mcp",
    version = concat!(
        env!("CARGO_PKG_VERSION"),
        " (build ",
        env!("BUILD_TIMESTAMP"),
        ")"
    ),
    about = "MCP server for FDR food, drink, snack, and schedule data"
)]
struct Cli {
    /// Serve MCP over HTTP at this address instead of stdio
    /// (e.g. 127.0.0.1:8080). Requires POST /mcp.
    #[arg(long)]
    http: Option<String>,
    /// Bearer token required on HTTP requests (or MCP_AUTH_TOKEN)
    #[arg(long)]
    token: Option<String>,
}

fn main() {
    let cli = Cli::parse();
    let result = if let Some(addr) = cli.http {
        fdr_cli::mcp::run_http(
            &addr,
            cli.token.or_else(|| std::env::var("MCP_AUTH_TOKEN").ok()),
        )
    } else {
        fdr_cli::mcp::run()
    };
    if let Err(error) = result {
        eprintln!("error: {error}");
        std::process::exit(1);
    }
}
