# fdr-cli

Command-line interface for FDR — query the bundled food, drink, snack, and
meal-schedule data, or open the interactive terminal UI.

## Commands

```text
fdr countries                          # list cuisines
fdr foods|drinks|snacks [filters]      # list items (--country/--category/--subcategory/--search/--limit)
fdr pick <foods|drinks|snacks|any>     # random pick (--random style single result)
fdr schedules                          # list schedules
fdr schedule <name> [--week N] [--day D]
fdr stats                              # dataset counts
fdr tui                                # interactive terminal UI
```

## Data

Reads the static JSON under `packages/landing/src/data/json/` (located by
walking up from the cwd; `FDR_DATA_DIR` overrides). The shared `data` module
is exposed as the `fdr_cli` library crate so `fdr-mcp` can reuse it.

## MCP

The MCP server lives in the sibling [`fdr-mcp`](../fdr-mcp) crate — run
`fdr-mcp` (or `fdr-mcp --http 127.0.0.1:8080`) instead of `fdr mcp`.

## Rules

- Keep the CLI dependency-light; no network access at runtime.
- `cargo test -p fdr-cli` / `cargo clippy --workspace --all-targets -- -D warnings`.
