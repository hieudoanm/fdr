//! MCP server for FDR food, drink, snack, and schedule data.
//!
//! Tools read the bundled static JSON via `fdr_cli::data` and return both
//! human-readable text and `structuredContent` matching each tool's
//! `outputSchema`.

pub mod mcp;
pub mod mcp_http;
