# AGENTS.md — fdr-mcp

Standalone MCP server binary (`fdr-mcp`) for FDR data. See the root
[`AGENTS.md`](../../AGENTS.md).

- Thin wrapper: the server implementation lives in `fdr-cli`'s library
  (`fdr_cli::mcp` + `fdr_cli::mcp_http`) so `fdr mcp` runs the same server
  in-process. This crate only re-exports it (`fdr_mcp::mcp`,
  `fdr_mcp::mcp_http`) and provides the `fdr-mcp` binary (`--http`,
  `--token`, `MCP_AUTH_TOKEN`).
- Depends on `fdr-cli` for the server and data access — do not duplicate
  the data or transport layer here.
- Tests in `tests/` exercise the binary end-to-end; the JSON-RPC and
  transport unit tests live in `crates/fdr-cli/tests/`.
- `cargo test -p fdr-mcp`.
