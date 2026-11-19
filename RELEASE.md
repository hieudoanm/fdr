## FDR — latest build

CLI and MCP server for the FDR food & drink dataset: query dishes, drinks,
snacks, and weekly meal schedules from the terminal or over MCP.

### Download

| Platform            | Assets                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| Linux x86_64        | `fdr-x86_64-unknown-linux-gnu`, `fdr-mcp-x86_64-unknown-linux-gnu`     |
| macOS Apple Silicon | `fdr-aarch64-apple-darwin`, `fdr-mcp-aarch64-apple-darwin`             |
| Windows x86_64      | `fdr-x86_64-pc-windows-msvc.exe`, `fdr-mcp-x86_64-pc-windows-msvc.exe` |

### Quick start

```sh
fdr stats                  # dataset overview
fdr pick any --country japanese
fdr schedule vietnam --week 1
fdr tui                    # interactive terminal UI
fdr-mcp                    # MCP server over stdio
fdr-mcp --http 127.0.0.1:8080   # streamable HTTP at /mcp
```

Data is read from `packages/landing/src/data/json/` (set `FDR_DATA_DIR` to
override). See the [README](https://github.com/hieudoanm/fdr#readme) for the
full command reference.
