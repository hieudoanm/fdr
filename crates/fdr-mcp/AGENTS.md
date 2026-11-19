# AGENTS.md — fdr-mcp

MCP server crate (`fdr-mcp` binary + `fdr_mcp` library). See the root
[`AGENTS.md`](../../AGENTS.md).

- Depends on `fdr-cli` for data access (`fdr_cli::data`) — do not duplicate
  the data layer here.
- `src/mcp.rs` holds JSON-RPC dispatch, tool definitions (`tools/list`
  schemas + `outputSchema`s), and the `run()`/`run_http()` entrypoints.
- `src/mcp_http.rs` is a minimal streamable-HTTP transport: `POST /mcp`
  only, optional bearer auth, no batching, `GET`/`DELETE` → 405.
- Framing on stdio: one JSON-RPC message per line; diagnostics on stderr.
- Tool names are stable — MCP clients cache schemas; keep
  `readOnlyHint`/`idempotentHint`/`openWorldHint` annotations accurate.
- `cargo test -p fdr-mcp`.
