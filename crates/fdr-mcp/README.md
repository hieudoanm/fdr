# fdr-mcp

Model Context Protocol server for FDR — exposes the food, drink, snack, and
meal-schedule datasets as MCP tools.

## Transports

- **stdio** (default): newline-delimited JSON-RPC 2.0 on stdin/stdout.
- **streamable HTTP**: `fdr-mcp --http 127.0.0.1:8080` serves `POST /mcp`;
  optional `--token <token>` or `MCP_AUTH_TOKEN` requires
  `Authorization: Bearer <token>`.

Configure an MCP client with: `fdr-mcp` (or `fdr-mcp --http <addr>`).

## Tools

`list_countries`, `stats`, `list_schedules`, `get_schedule`, `list_foods`,
`pick_food`, `list_drinks`, `pick_drink`, `list_snacks`, `pick_snack`,
`pick_meal` — all read-only, returning text content plus `structuredContent`
matching each tool's `outputSchema`.

## Layout

- `src/lib.rs` — `pub mod mcp`, `pub mod mcp_http`.
- `src/mcp.rs` — JSON-RPC dispatch, tool schemas, `run()`/`run_http()`.
- `src/mcp_http.rs` — minimal streamable-HTTP transport (POST /mcp only).
- `src/main.rs` — `fdr-mcp` binary (`--http`, `--token`).

Data comes from `fdr_cli::data` (the `fdr-cli` library crate).

## Rules

- Handlers must return real data — no stubbed responses.
- Tool names are stable — MCP clients cache schemas.
- `cargo test -p fdr-mcp`.
