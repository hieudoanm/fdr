## FDR — latest build

CLI for the FDR food & drink dataset: query dishes, drinks, snacks, and
weekly meal schedules from the terminal, plus MCP client configuration for
the `fdr-mcp` server.

### Download

| Platform            | Assets                           |
| ------------------- | -------------------------------- |
| Linux x86_64        | `fdr-x86_64-unknown-linux-gnu`   |
| macOS Apple Silicon | `fdr-aarch64-apple-darwin`       |
| Windows x86_64      | `fdr-x86_64-pc-windows-msvc.exe` |

### Quick start

```sh
fdr stats                  # dataset overview
fdr pick any --country japanese
fdr schedule vietnam --week 1
fdr tui                    # interactive terminal UI
fdr mcp                    # print MCP client config for fdr-mcp
fdr mcp --http 127.0.0.1:8080   # streamable HTTP config variant
```

Data is read from `packages/landing/src/data/json/` (set `FDR_DATA_DIR` to
override). See the [README](https://github.com/hieudoanm/fdr#readme) for the
full command reference.
