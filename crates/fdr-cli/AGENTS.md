# AGENTS.md — fdr-cli

Rust CLI crate (`fdr` binary) over the static landing data. See the root
[`AGENTS.md`](../../AGENTS.md).

- Dual target: `src/lib.rs` exposes `pub mod data` (the `fdr_cli` library);
  `src/main.rs` is the `fdr` binary (`clap` subcommands + `tui` module).
- `data.rs` locates `packages/landing/src/data/json` by walking up from the
  cwd (`FDR_DATA_DIR` overrides) — keep that resolution logic stable; the
  landing JSON filenames (`meal-foods.json`, `schedule-*.json`, …) are the
  contract.
- `fdr-mcp` depends on this crate's library for data access — do not move
  `data.rs` or rename the public types (`Food`, `Cuisine`, `ScheduleEntry`,
  `Filters`).
- The MCP server is NOT here — it lives in `crates/fdr-mcp`.
- `cargo test -p fdr-cli`, `cargo clippy -p fdr-cli --all-targets -- -D warnings`.
