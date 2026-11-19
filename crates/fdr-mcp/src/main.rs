//! `fdr-mcp` — MCP server over stdio (default) or streamable HTTP.

use clap::Parser;
use fdr_mcp::mcp;

#[derive(Parser)]
#[command(
    name = "fdr-mcp",
    version,
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
        mcp::run_http(
            &addr,
            cli.token.or_else(|| std::env::var("MCP_AUTH_TOKEN").ok()),
        )
    } else {
        mcp::run()
    };
    if let Err(error) = result {
        eprintln!("error: {error}");
        std::process::exit(1);
    }
}
