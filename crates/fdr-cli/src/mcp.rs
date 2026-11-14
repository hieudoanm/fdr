//! MCP server over stdio JSON-RPC.
//!
//! Tools delegate to the `fdr` binary's own subcommands so MCP behaviour
//! always matches the CLI. Configure an MCP client with: `fdr mcp`

use serde_json::{json, Value};
use std::io::{BufRead, Write};
use std::process::Command;

const SERVER_INFO: &str = "fdr-mcp";
const PROTOCOL_VERSION: &str = "2024-11-05";

fn arg(params: &Value, key: &str) -> Option<String> {
    params
        .get(key)
        .and_then(Value::as_str)
        .map(str::to_owned)
        .filter(|s| !s.is_empty())
}

fn num(params: &Value, key: &str) -> Option<String> {
    params.get(key).and_then(|v| {
        v.as_u64()
            .map(|n| n.to_string())
            .or_else(|| v.as_i64().map(|n| n.to_string()))
    })
}

fn filter_args(args: &mut Vec<String>, params: &Value) {
    for (key, flag) in [
        ("country", "--country"),
        ("category", "--category"),
        ("subcategory", "--subcategory"),
        ("search", "--search"),
    ] {
        if let Some(v) = arg(params, key) {
            args.extend([flag.to_string(), v]);
        }
    }
    if let Some(v) = num(params, "limit") {
        args.extend(["--limit".to_string(), v]);
    }
}

fn run_cli(args: &[String]) -> Value {
    let exe = match std::env::current_exe() {
        Ok(exe) => exe,
        Err(err) => {
            return json!({
                "content": [{"type": "text", "text": format!("cannot locate fdr binary: {err}")}],
                "isError": true
            })
        }
    };
    match Command::new(exe).args(args).output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
            if output.status.success() {
                let text = if stdout.is_empty() { stderr } else { stdout };
                json!({"content": [{"type": "text", "text": text}]})
            } else {
                json!({
                    "content": [{"type": "text", "text": stderr}],
                    "isError": true
                })
            }
        }
        Err(err) => json!({
            "content": [{"type": "text", "text": format!("failed to run fdr: {err}")}],
            "isError": true
        }),
    }
}

fn item_args(command: &str, params: &Value, random: bool) -> Option<Vec<String>> {
    let mut args = vec![command.to_string()];
    filter_args(&mut args, params);
    if random {
        args.push("--random".to_string());
    }
    Some(args)
}

fn build_args(name: &str, params: &Value) -> Option<Vec<String>> {
    match name {
        "list_countries" => Some(vec!["countries".to_string()]),
        "stats" => Some(vec!["stats".to_string()]),
        "list_schedules" => Some(vec!["schedules".to_string()]),
        "get_schedule" => {
            let mut args = vec!["schedule".to_string(), arg(params, "name")?];
            if let Some(v) = arg(params, "week") {
                args.extend(["--week".to_string(), v]);
            }
            if let Some(v) = arg(params, "day") {
                args.extend(["--day".to_string(), v]);
            }
            Some(args)
        }
        "list_foods" => item_args("foods", params, false),
        "pick_food" => item_args("foods", params, true),
        "list_drinks" => item_args("drinks", params, false),
        "pick_drink" => item_args("drinks", params, true),
        "list_snacks" => item_args("snacks", params, false),
        "pick_snack" => item_args("snacks", params, true),
        "pick_meal" => {
            let kind = arg(params, "kind").unwrap_or_else(|| "any".to_string());
            let mut args = vec!["pick".to_string(), kind];
            filter_args(&mut args, params);
            Some(args)
        }
        _ => None,
    }
}

fn filter_props() -> Value {
    json!({
        "country": {"type": "string", "description": "Country slug (e.g. japanese, french)"},
        "category": {"type": "string", "description": "Category filter"},
        "subcategory": {"type": "string", "description": "Subcategory filter"},
        "search": {"type": "string", "description": "Search label/value substring"},
        "limit": {"type": "integer", "description": "Maximum results to return"}
    })
}

fn item_schema(random_pick: bool) -> Value {
    let mut props = filter_props();
    if random_pick {
        // picks ignore limit
        if let Some(map) = props.as_object_mut() {
            map.remove("limit");
        }
    }
    json!({
        "type": "object",
        "properties": props,
        "additionalProperties": false
    })
}

fn tools_list() -> Value {
    json!({
        "tools": [
            {
                "name": "list_countries",
                "description": "List available cuisines/countries",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false}
            },
            {
                "name": "stats",
                "description": "Print dataset statistics (countries, dishes, drinks, snacks, schedules)",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false}
            },
            {
                "name": "list_schedules",
                "description": "List available meal schedules",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false}
            },
            {
                "name": "get_schedule",
                "description": "Show a meal schedule (scheldon, vietnam, united-kingdom)",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Schedule name (see list_schedules)"},
                        "week": {"type": "string", "description": "Filter by week number"},
                        "day": {"type": "string", "description": "Filter by day (e.g. Monday)"}
                    },
                    "required": ["name"],
                    "additionalProperties": false
                }
            },
            {
                "name": "list_foods",
                "description": "List dishes, optionally filtered",
                "inputSchema": item_schema(false)
            },
            {
                "name": "pick_food",
                "description": "Pick a random dish, optionally filtered",
                "inputSchema": item_schema(true)
            },
            {
                "name": "list_drinks",
                "description": "List drinks, optionally filtered",
                "inputSchema": item_schema(false)
            },
            {
                "name": "pick_drink",
                "description": "Pick a random drink, optionally filtered",
                "inputSchema": item_schema(true)
            },
            {
                "name": "list_snacks",
                "description": "List snacks and desserts, optionally filtered",
                "inputSchema": item_schema(false)
            },
            {
                "name": "pick_snack",
                "description": "Pick a random snack or dessert, optionally filtered",
                "inputSchema": item_schema(true)
            },
            {
                "name": "pick_meal",
                "description": "Pick a random dish, drink, snack, or any of them",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "kind": {"type": "string", "enum": ["foods", "drinks", "snacks", "any"], "description": "What to pick (default: any)"},
                        "country": {"type": "string"},
                        "category": {"type": "string"},
                        "subcategory": {"type": "string"},
                        "search": {"type": "string"}
                    },
                    "additionalProperties": false
                }
            }
        ]
    })
}

fn handle_request(request: &Value) -> Option<Value> {
    let method = request.get("method").and_then(Value::as_str).unwrap_or("");
    let id = request.get("id").cloned().unwrap_or(Value::Null);
    let has_id = request.get("id").is_some();

    let result = match method {
        "initialize" => json!({
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {"tools": {}},
            "serverInfo": {"name": SERVER_INFO, "version": env!("CARGO_PKG_VERSION")}
        }),
        "ping" => Value::Null,
        "tools/list" => tools_list(),
        "tools/call" => {
            let params = request.get("params").cloned().unwrap_or(Value::Null);
            let name = params.get("name").and_then(Value::as_str).unwrap_or("");
            let arguments = params.get("arguments").cloned().unwrap_or(json!({}));
            match build_args(name, &arguments) {
                Some(args) => run_cli(&args),
                None => json!({
                    "content": [{"type": "text", "text": format!("Unknown tool: {name}")}],
                    "isError": true
                }),
            }
        }
        _ => {
            if !has_id {
                return None;
            }
            return Some(json!({
                "jsonrpc": "2.0",
                "id": id,
                "error": {"code": -32601, "message": format!("Method not found: {method}")}
            }));
        }
    };

    if !has_id {
        return None;
    }
    Some(json!({"jsonrpc": "2.0", "id": id, "result": result}))
}

/// Run the MCP server on stdin/stdout until EOF.
pub fn run() -> std::io::Result<()> {
    let stdin = std::io::stdin();
    let mut stdout = std::io::stdout();

    for line in stdin.lock().lines() {
        let line = line?;
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        match serde_json::from_str::<Value>(trimmed) {
            Ok(request) => {
                if let Some(response) = handle_request(&request) {
                    writeln!(stdout, "{}", serde_json::to_string(&response)?)?;
                    stdout.flush()?;
                }
            }
            Err(err) => {
                let response = json!({
                    "jsonrpc": "2.0",
                    "id": Value::Null,
                    "error": {"code": -32700, "message": format!("Parse error: {err}")}
                });
                writeln!(stdout, "{}", serde_json::to_string(&response)?)?;
                stdout.flush()?;
            }
        }
    }
    Ok(())
}
