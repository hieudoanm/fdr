//! MCP server over stdio/HTTP JSON-RPC.
//!
//! Tools read the bundled static JSON directly and return both human-readable
//! text and `structuredContent` matching each tool's `outputSchema`.
//! Configure an MCP client with: `fdr mcp`

use crate::data::{self, Filters, Food};
use serde_json::{json, Value};
use std::io::{BufRead, Write};

const SERVER_INFO: &str = "fdr-mcp";
const PROTOCOL_VERSION: &str = "2025-11-25";

fn arg(params: &Value, key: &str) -> Option<String> {
    params
        .get(key)
        .and_then(Value::as_str)
        .map(str::to_owned)
        .filter(|s| !s.is_empty())
}

fn filters_from(params: &Value) -> Filters {
    Filters {
        country: arg(params, "country"),
        category: arg(params, "category"),
        subcategory: arg(params, "subcategory"),
        search: arg(params, "search"),
    }
}

fn limit_from(params: &Value) -> usize {
    params
        .get("limit")
        .and_then(Value::as_u64)
        .map(|n| n as usize)
        .unwrap_or(usize::MAX)
}

fn to_value<T: serde::Serialize>(v: &T) -> Result<Value, String> {
    serde_json::to_value(v).map_err(|e| e.to_string())
}

fn items_for(kind: &str) -> Result<Vec<Food>, String> {
    match kind {
        "foods" => data::foods(),
        "drinks" => data::drinks(),
        "snacks" => data::snacks(),
        _ => Err(format!("unknown kind: {kind}")),
    }
}

/// Run a tool against the data layer, returning `(text, structuredContent)`.
fn run_structured(name: &str, params: &Value) -> Result<(String, Value), String> {
    match name {
        "list_countries" => {
            let list = data::countries()?;
            let text = list
                .iter()
                .map(|c| format!("{} {} ({})", c.emoji, c.label, c.value))
                .collect::<Vec<_>>()
                .join("\n");
            let structured = json!({
                "items": to_value(&list)?,
                "count": list.len(),
            });
            Ok((text, structured))
        }
        "stats" => {
            let f = data::foods()?;
            let d = data::drinks()?;
            let s = data::snacks()?;
            let c = data::countries()?;
            let names = data::schedules()?;
            let text = format!(
                "Countries: {}\nDishes: {}\nDrinks: {}\nSnacks/desserts: {}\nTotal items: {}\nSchedules: {}",
                c.len(),
                f.len(),
                d.len(),
                s.len(),
                f.len() + d.len() + s.len(),
                names.join(", ")
            );
            let structured = json!({
                "countries": c.len(),
                "dishes": f.len(),
                "drinks": d.len(),
                "snacks": s.len(),
                "total_items": f.len() + d.len() + s.len(),
                "schedules": names,
            });
            Ok((text, structured))
        }
        "list_schedules" => {
            let names = data::schedules()?;
            let text = names.join("\n");
            let structured = json!({"schedules": names});
            Ok((text, structured))
        }
        "get_schedule" => {
            let name = arg(params, "name").ok_or("missing required argument: name")?;
            let week = arg(params, "week");
            let day = arg(params, "day");
            let entries = data::schedule(&name)?;
            let filtered: Vec<_> = entries
                .iter()
                .filter(|e| {
                    week.as_deref().is_none_or(|w| e.week.as_deref() == Some(w))
                        && day.as_deref().is_none_or(|d| e.day.eq_ignore_ascii_case(d))
                })
                .collect();
            if filtered.is_empty() {
                return Ok((
                    "No schedule entries match.".to_string(),
                    json!({"entries": []}),
                ));
            }
            let text = filtered
                .iter()
                .map(|e| data::format_schedule(e))
                .collect::<Vec<_>>()
                .join("\n");
            let structured = json!({"entries": to_value(&filtered)?});
            Ok((text, structured))
        }
        "list_foods" | "list_drinks" | "list_snacks" => {
            let kind = name.trim_start_matches("list_");
            let filtered = filters_from(params).apply(items_for(kind)?);
            if filtered.is_empty() {
                return Ok((
                    format!("No {kind} match the given filters."),
                    json!({"items": [], "count": 0, "total": 0}),
                ));
            }
            let limit = limit_from(params);
            let shown: Vec<_> = filtered.iter().take(limit).collect();
            let text = shown
                .iter()
                .map(|f| data::format_food(f))
                .collect::<Vec<_>>()
                .join("\n");
            let structured = json!({
                "items": to_value(&shown)?,
                "count": shown.len(),
                "total": filtered.len(),
            });
            Ok((text, structured))
        }
        "pick_food" | "pick_drink" | "pick_snack" => {
            let kind = match name {
                "pick_food" => "foods",
                "pick_drink" => "drinks",
                _ => "snacks",
            };
            let filtered = filters_from(params).apply(items_for(kind)?);
            let food =
                data::pick(&filtered, data::rng()).ok_or("No items match the given filters.")?;
            Ok((data::format_food(&food), to_value(&food)?))
        }
        "pick_meal" => {
            let kind = arg(params, "kind").unwrap_or_else(|| "any".to_string());
            let mut all = match kind.as_str() {
                "foods" | "drinks" | "snacks" => items_for(&kind)?,
                "any" => {
                    let mut v = data::foods()?;
                    v.extend(data::drinks()?);
                    v.extend(data::snacks()?);
                    v
                }
                other => return Err(format!("unknown kind: {other}")),
            };
            all = filters_from(params).apply(all);
            let food = data::pick(&all, data::rng()).ok_or("No items match the given filters.")?;
            let mut structured = to_value(&food)?;
            structured["kind"] = json!(kind);
            Ok((data::format_food(&food), structured))
        }
        _ => Err(format!("Unknown tool: {name}")),
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

/// All tools read bundled static JSON; none touch the network or mutate state.
fn annotations() -> Value {
    json!({
        "readOnlyHint": true,
        "destructiveHint": false,
        "idempotentHint": true,
        "openWorldHint": false
    })
}

fn food_item_schema() -> Value {
    json!({
        "type": "object",
        "properties": {
            "country": {"type": "string"},
            "category": {"type": "string"},
            "subcategory": {"type": "string"},
            "value": {"type": "string"},
            "label": {"type": "string"},
            "emoji": {"type": "string"}
        },
        "required": ["country", "category", "subcategory", "value", "label", "emoji"],
        "additionalProperties": false
    })
}

fn cuisine_item_schema() -> Value {
    json!({
        "type": "object",
        "properties": {
            "value": {"type": "string"},
            "label": {"type": "string"},
            "emoji": {"type": "string"}
        },
        "required": ["value", "label", "emoji"],
        "additionalProperties": false
    })
}

fn list_output(item_schema: Value) -> Value {
    json!({
        "type": "object",
        "properties": {
            "items": {"type": "array", "items": item_schema},
            "count": {"type": "integer"},
            "total": {"type": "integer"}
        },
        "required": ["items", "count"],
        "additionalProperties": false
    })
}

/// JSON Schema describing each tool's `structuredContent` payload.
fn output_schema(name: &str) -> Option<Value> {
    let food = food_item_schema();
    match name {
        "list_countries" => Some(json!({
            "type": "object",
            "properties": {
                "items": {"type": "array", "items": cuisine_item_schema()},
                "count": {"type": "integer"}
            },
            "required": ["items", "count"],
            "additionalProperties": false
        })),
        "stats" => Some(json!({
            "type": "object",
            "properties": {
                "countries": {"type": "integer"},
                "dishes": {"type": "integer"},
                "drinks": {"type": "integer"},
                "snacks": {"type": "integer"},
                "total_items": {"type": "integer"},
                "schedules": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["countries", "dishes", "drinks", "snacks", "total_items", "schedules"],
            "additionalProperties": false
        })),
        "list_schedules" => Some(json!({
            "type": "object",
            "properties": {
                "schedules": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["schedules"],
            "additionalProperties": false
        })),
        "get_schedule" => Some(json!({
            "type": "object",
            "properties": {
                "entries": {"type": "array", "items": {
                    "type": "object",
                    "properties": {
                        "day": {"type": "string"},
                        "week": {"type": ["string", "null"]},
                        "meal": {"type": "string"},
                        "emoji": {"type": "string"},
                        "restaurant": {"type": "string"},
                        "note": {"type": ["string", "null"]}
                    },
                    "required": ["day", "meal", "emoji", "restaurant"],
                    "additionalProperties": false
                }}
            },
            "required": ["entries"],
            "additionalProperties": false
        })),
        "list_foods" | "list_drinks" | "list_snacks" => Some(list_output(food.clone())),
        "pick_food" | "pick_drink" | "pick_snack" => Some(food.clone()),
        "pick_meal" => {
            let mut schema = food;
            if let Some(props) = schema.get_mut("properties").and_then(Value::as_object_mut) {
                props.insert(
                    "kind".to_string(),
                    json!({"type": "string", "enum": ["foods", "drinks", "snacks", "any"]}),
                );
            }
            Some(schema)
        }
        _ => None,
    }
}

/// Human-readable display title derived from the tool name
/// (`pick_meal` -> `Pick Meal`). MCP hosts show `title` in pickers.
fn titleize(name: &str) -> String {
    name.split(['_', '-'])
        .filter(|part| !part.is_empty())
        .map(|part| {
            let mut chars = part.chars();
            match chars.next() {
                Some(first) => first.to_uppercase().chain(chars).collect::<String>(),
                None => String::new(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

fn tools_list() -> Value {
    let mut result = json!({
        "tools": [
            {
                "name": "list_countries",
                "description": "List available cuisines/countries",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false},
                "annotations": annotations()
            },
            {
                "name": "stats",
                "description": "Print dataset statistics (countries, dishes, drinks, snacks, schedules)",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false},
                "annotations": annotations()
            },
            {
                "name": "list_schedules",
                "description": "List available meal schedules",
                "inputSchema": {"type": "object", "properties": {}, "additionalProperties": false},
                "annotations": annotations()
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
                },
                "annotations": annotations()
            },
            {
                "name": "list_foods",
                "description": "List dishes, optionally filtered",
                "inputSchema": item_schema(false),
                "annotations": annotations()
            },
            {
                "name": "pick_food",
                "description": "Pick a random dish, optionally filtered",
                "inputSchema": item_schema(true),
                "annotations": annotations()
            },
            {
                "name": "list_drinks",
                "description": "List drinks, optionally filtered",
                "inputSchema": item_schema(false),
                "annotations": annotations()
            },
            {
                "name": "pick_drink",
                "description": "Pick a random drink, optionally filtered",
                "inputSchema": item_schema(true),
                "annotations": annotations()
            },
            {
                "name": "list_snacks",
                "description": "List snacks and desserts, optionally filtered",
                "inputSchema": item_schema(false),
                "annotations": annotations()
            },
            {
                "name": "pick_snack",
                "description": "Pick a random snack or dessert, optionally filtered",
                "inputSchema": item_schema(true),
                "annotations": annotations()
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
                },
                "annotations": annotations()
            }
        ]
    });
    if let Some(tools) = result["tools"].as_array_mut() {
        for tool in tools {
            let name = tool["name"].as_str().map(str::to_owned);
            if let Some(name) = name {
                if tool.get("title").is_none() {
                    tool["title"] = json!(titleize(&name));
                }
                if let Some(schema) = output_schema(&name) {
                    tool["outputSchema"] = schema;
                }
            }
        }
    }
    result
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
            match run_structured(name, &arguments) {
                Ok((text, structured)) => json!({
                    "content": [{"type": "text", "text": text}],
                    "structuredContent": structured
                }),
                Err(message) => json!({
                    "content": [{"type": "text", "text": message}],
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

/// Run the MCP server over streamable HTTP on `addr` until the process exits.
/// `token` (when set) requires `Authorization: Bearer <token>` on every request.
pub fn run_http(addr: &str, token: Option<String>) -> std::io::Result<()> {
    crate::mcp_http::serve(addr, token, |body: &str| {
        match serde_json::from_str::<Value>(body) {
            Ok(request) => {
                handle_request(&request).and_then(|response| serde_json::to_string(&response).ok())
            }
            Err(err) => Some(
                serde_json::to_string(&json!({
                    "jsonrpc": "2.0",
                    "id": Value::Null,
                    "error": {"code": -32700, "message": format!("Parse error: {err}")}
                }))
                .unwrap_or_default(),
            ),
        }
    })
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

#[cfg(test)]
mod tests {
    use super::*;

    const TOOL_NAMES: [&str; 11] = [
        "list_countries",
        "stats",
        "list_schedules",
        "get_schedule",
        "list_foods",
        "pick_food",
        "list_drinks",
        "pick_drink",
        "list_snacks",
        "pick_snack",
        "pick_meal",
    ];

    fn tools() -> Vec<Value> {
        tools_list()["tools"]
            .as_array()
            .expect("tools array")
            .clone()
    }

    #[test]
    fn tools_list_returns_all_expected_names() {
        let tools = tools();
        let names: Vec<&str> = tools
            .iter()
            .map(|t| t["name"].as_str().expect("tool name"))
            .collect();
        for expected in TOOL_NAMES {
            assert!(names.contains(&expected), "missing tool {expected}");
        }
        assert_eq!(names.len(), TOOL_NAMES.len());
    }

    #[test]
    fn every_tool_declares_all_four_hints() {
        for tool in tools() {
            let name = tool["name"].as_str().expect("tool name");
            let annotations = &tool["annotations"];
            // All tools read bundled static data: read-only, non-destructive,
            // idempotent, and closed-world (no external systems).
            assert_eq!(
                annotations,
                &json!({
                    "readOnlyHint": true,
                    "destructiveHint": false,
                    "idempotentHint": true,
                    "openWorldHint": false
                }),
                "unexpected annotations on {name}"
            );
        }
    }

    #[test]
    fn every_tool_declares_output_schema() {
        for tool in tools() {
            let name = tool["name"].as_str().expect("tool name");
            assert!(
                tool.get("outputSchema").is_some(),
                "missing outputSchema on {name}"
            );
        }
    }

    #[test]
    fn every_tool_produces_structured_content() {
        for name in TOOL_NAMES {
            let params = match name {
                "get_schedule" => json!({"name": "scheldon"}),
                "pick_meal" => json!({"kind": "any"}),
                _ => json!({}),
            };
            let (text, structured) =
                run_structured(name, &params).unwrap_or_else(|e| panic!("{name}: {e}"));
            assert!(!text.is_empty(), "{name} returned empty text");
            assert!(
                structured.is_object(),
                "{name} structuredContent not object"
            );
        }
    }

    #[test]
    fn tools_call_returns_structured_content() {
        let request = json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {"name": "stats", "arguments": {}}
        });
        let response = handle_request(&request).expect("response");
        let result = &response["result"];
        assert!(result.get("isError").is_none());
        assert!(result["structuredContent"]["total_items"].is_u64());
        assert!(result["content"][0]["text"]
            .as_str()
            .unwrap()
            .contains("Countries"));
    }

    #[test]
    fn tools_call_unknown_tool_returns_error_result() {
        let request = json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {"name": "nope", "arguments": {}}
        });
        let response = handle_request(&request).expect("response");
        assert_eq!(response["result"]["isError"], json!(true));
        assert!(response["result"]["content"][0]["text"]
            .as_str()
            .unwrap()
            .contains("Unknown tool"));
    }

    #[test]
    fn tools_call_missing_required_arg_returns_error_result() {
        let request = json!({
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {"name": "get_schedule", "arguments": {}}
        });
        let response = handle_request(&request).expect("response");
        assert_eq!(response["result"]["isError"], json!(true));
    }

    #[test]
    fn initialize_returns_server_info() {
        let request = json!({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "initialize",
            "params": {}
        });
        let response = handle_request(&request).expect("response");
        assert_eq!(response["result"]["serverInfo"]["name"], json!(SERVER_INFO));
    }

    #[test]
    fn notifications_get_no_response() {
        let request = json!({"jsonrpc": "2.0", "method": "ping"});
        assert!(handle_request(&request).is_none());
    }
}
