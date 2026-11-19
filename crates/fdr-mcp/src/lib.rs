//! MCP server for FDR food, drink, snack, and schedule data.
//!
//! The implementation lives in `fdr_cli::mcp` / `fdr_cli::mcp_http` so both
//! the `fdr mcp` subcommand and the standalone `fdr-mcp` binary serve the
//! same tools. Re-exported here for existing `fdr_mcp::` paths.

pub use fdr_cli::mcp;
pub use fdr_cli::mcp_http;
