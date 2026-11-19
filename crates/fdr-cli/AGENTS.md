# AGENTS.md — fdr-cli

Rust CLI crate (`fdr` binary) over the static landing data, including the
MCP server. See the root [`AGENTS.md`](../../AGENTS.md).

- Dual target: `src/lib.rs` exposes `pub mod data`, `pub mod tui`,
  `pub mod mcp`, and `pub mod mcp_http` (the `fdr_cli` library);
  `src/main.rs` is the `fdr` binary (`clap` subcommands, including
  `fdr mcp [--http <addr>] [--token <tok>]` which runs the MCP server
  in-process).
- `data.rs` locates `packages/landing/src/data/json` by walking up from the
  cwd (`FDR_DATA_DIR` overrides) — keep that resolution logic stable; the
  landing JSON filenames (`meal-foods.json`, `schedule-*.json`, …) are the
  contract.
- `mcp.rs`/`mcp_http.rs` are the MCP server (JSON-RPC dispatch, tool
  schemas, stdio + streamable-HTTP transports). `fdr-mcp` re-exports them —
  do not fork the implementation; tool names are stable because MCP clients
  cache schemas.
- `App`/TUI internals are `#[doc(hidden)] pub` for tests.
- The standalone `fdr-mcp` binary lives in `crates/fdr-mcp` as a thin
  wrapper over this library.
- Tests live in `tests/`: `data.rs`, `tui.rs` (headless `TestBackend`),
  `mcp.rs`, `mcp_http.rs`, `cli.rs` (spawns the `fdr` binary).
- `cargo test -p fdr-cli`, `cargo clippy -p fdr-cli --all-targets -- -D warnings`.
