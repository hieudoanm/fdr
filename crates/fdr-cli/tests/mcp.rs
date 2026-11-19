//! Integration tests for the JSON-RPC dispatch and tool implementations in
//! `fdr_mcp::mcp`.

use fdr_cli::mcp::{handle_request, run_structured, tools_list};
use serde_json::{Value, json};

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

fn call(name: &str, arguments: Value) -> Value {
    let request = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": arguments}
    });
    handle_request(&request)
        .expect("response")
        .get("result")
        .cloned()
        .unwrap_or(Value::Null)
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
fn every_tool_has_title_description_schema_and_annotations() {
    for tool in tools() {
        let name = tool["name"].as_str().expect("tool name");
        assert!(
            tool["title"].as_str().is_some_and(|t| !t.is_empty()),
            "{name}"
        );
        assert!(
            tool["description"].as_str().is_some_and(|d| !d.is_empty()),
            "{name}"
        );
        assert_eq!(
            tool["annotations"],
            json!({
                "readOnlyHint": true,
                "destructiveHint": false,
                "idempotentHint": true,
                "openWorldHint": false
            }),
            "unexpected annotations on {name}"
        );
        assert!(
            tool.get("outputSchema").is_some(),
            "missing outputSchema on {name}"
        );
        assert!(tool["inputSchema"].is_object(), "{name}");
    }
}

#[test]
fn only_list_tools_accept_limit() {
    for tool in tools() {
        let name = tool["name"].as_str().expect("tool name");
        let has_limit = tool["inputSchema"]["properties"].get("limit").is_some();
        let expects_limit = matches!(name, "list_foods" | "list_drinks" | "list_snacks");
        assert_eq!(has_limit, expects_limit, "limit mismatch on {name}");
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
        assert!(structured.is_object(), "{name} not an object");
    }
}

#[test]
fn list_countries_returns_cuisines() {
    let (text, structured) = run_structured("list_countries", &json!({})).unwrap();
    assert!(text.contains('('));
    assert!(structured["count"].as_u64().unwrap() > 0);
    assert!(structured["items"].as_array().unwrap()[0]["value"].is_string());
}

#[test]
fn stats_reports_counts() {
    let (text, structured) = run_structured("stats", &json!({})).unwrap();
    assert!(text.contains("Countries:"));
    assert!(text.contains("Total items:"));
    assert!(text.contains("Schedules:"));
    let total = structured["total_items"].as_u64().unwrap();
    assert_eq!(
        total,
        structured["dishes"].as_u64().unwrap()
            + structured["drinks"].as_u64().unwrap()
            + structured["snacks"].as_u64().unwrap()
    );
    assert!(structured["schedules"].as_array().unwrap().len() >= 3);
}

#[test]
fn list_schedules_returns_names() {
    let (text, structured) = run_structured("list_schedules", &json!({})).unwrap();
    let names = structured["schedules"].as_array().unwrap();
    assert!(names.len() >= 3);
    assert!(names.iter().any(|n| n == "scheldon"));
    assert!(text.contains("scheldon"));
}

#[test]
fn get_schedule_returns_entries() {
    let (text, structured) = run_structured("get_schedule", &json!({"name": "scheldon"})).unwrap();
    assert!(!text.is_empty());
    assert!(!structured["entries"].as_array().unwrap().is_empty());
}

#[test]
fn get_schedule_filters_by_week_and_day() {
    let (_, all) = run_structured("get_schedule", &json!({"name": "vietnam"})).unwrap();
    let (_, filtered) = run_structured(
        "get_schedule",
        &json!({"name": "vietnam", "week": "1", "day": "monday"}),
    )
    .unwrap();
    let entries = filtered["entries"].as_array().unwrap();
    assert!(!entries.is_empty());
    assert!(entries.len() < all["entries"].as_array().unwrap().len());
    for entry in entries {
        assert_eq!(entry["week"], json!("1"));
        assert_eq!(entry["day"].as_str().unwrap().to_lowercase(), "monday");
    }
}

#[test]
fn get_schedule_with_no_matches_returns_empty() {
    let (text, structured) = run_structured(
        "get_schedule",
        &json!({"name": "scheldon", "day": "funday"}),
    )
    .unwrap();
    assert_eq!(text, "No schedule entries match.");
    assert_eq!(structured["entries"], json!([]));
}

#[test]
fn get_schedule_unknown_name_is_error() {
    assert!(run_structured("get_schedule", &json!({"name": "nope"})).is_err());
}

#[test]
fn get_schedule_missing_name_is_error() {
    assert!(run_structured("get_schedule", &json!({})).is_err());
}

#[test]
fn list_foods_supports_filters_and_limit() {
    let (text, structured) =
        run_structured("list_foods", &json!({"country": "japanese", "limit": 3})).unwrap();
    let items = structured["items"].as_array().unwrap();
    assert_eq!(items.len(), 3);
    assert_eq!(structured["count"], json!(3));
    assert!(structured["total"].as_u64().unwrap() > 3);
    for item in items {
        assert_eq!(item["country"], json!("japanese"));
    }
    assert_eq!(text.lines().count(), 3);
}

#[test]
fn list_foods_empty_result() {
    let (text, structured) =
        run_structured("list_foods", &json!({"search": "zzz-no-such-food"})).unwrap();
    assert!(text.contains("No foods match"));
    assert_eq!(structured["count"], json!(0));
    assert_eq!(structured["total"], json!(0));
}

#[test]
fn list_drinks_and_snacks_work() {
    for (tool, kind) in [("list_drinks", "drinks"), ("list_snacks", "snacks")] {
        let (_, structured) = run_structured(tool, &json!({})).unwrap();
        assert!(structured["total"].as_u64().unwrap() > 0, "{kind}");
        let (text, empty) = run_structured(tool, &json!({"search": "zzz-no-such-item"})).unwrap();
        assert!(text.contains(&format!("No {kind} match")), "{tool}");
        assert_eq!(empty["count"], json!(0));
    }
}

#[test]
fn category_and_subcategory_filters_apply() {
    let (_, structured) =
        run_structured("list_foods", &json!({"category": "no-such-category"})).unwrap();
    assert_eq!(structured["total"], json!(0));
}

#[test]
fn pick_tools_return_a_single_item() {
    for (tool, kind) in [
        ("pick_food", "foods"),
        ("pick_drink", "drinks"),
        ("pick_snack", "snacks"),
    ] {
        let (text, structured) = run_structured(tool, &json!({})).unwrap();
        assert!(!text.is_empty(), "{tool}");
        assert!(structured["value"].is_string(), "{tool}");
        assert!(structured["label"].is_string(), "{tool}");
        let _ = kind;
    }
}

#[test]
fn pick_with_impossible_filter_is_error() {
    assert!(run_structured("pick_food", &json!({"search": "zzz-no-such-food"})).is_err());
    assert!(run_structured("pick_meal", &json!({"kind": "drinks", "search": "zzz"})).is_err());
}

#[test]
fn pick_meal_supports_each_kind() {
    for kind in ["foods", "drinks", "snacks", "any"] {
        let (_, structured) = run_structured("pick_meal", &json!({"kind": kind})).unwrap();
        assert_eq!(structured["kind"], json!(kind));
        assert!(structured["value"].is_string());
    }
}

#[test]
fn pick_meal_defaults_to_any_and_rejects_unknown_kind() {
    let (_, structured) = run_structured("pick_meal", &json!({})).unwrap();
    assert_eq!(structured["kind"], json!("any"));
    assert!(run_structured("pick_meal", &json!({"kind": "everything"})).is_err());
}

#[test]
fn unknown_tool_is_error() {
    assert!(run_structured("nope", &json!({})).is_err());
}

#[test]
fn empty_string_args_are_treated_as_absent() {
    let (_, structured) =
        run_structured("list_foods", &json!({"country": "", "search": ""})).unwrap();
    assert!(structured["total"].as_u64().unwrap() > 300);
}

#[test]
fn tools_call_returns_structured_content() {
    let result = call("stats", json!({}));
    assert!(result.get("isError").is_none());
    assert!(result["structuredContent"]["total_items"].is_u64());
    assert!(
        result["content"][0]["text"]
            .as_str()
            .unwrap()
            .contains("Countries")
    );
}

#[test]
fn tools_call_unknown_tool_returns_error_result() {
    let result = call("nope", json!({}));
    assert_eq!(result["isError"], json!(true));
    assert!(
        result["content"][0]["text"]
            .as_str()
            .unwrap()
            .contains("Unknown tool")
    );
}

#[test]
fn tools_call_missing_required_arg_returns_error_result() {
    let result = call("get_schedule", json!({}));
    assert_eq!(result["isError"], json!(true));
    assert!(
        result["content"][0]["text"]
            .as_str()
            .unwrap()
            .contains("missing required argument")
    );
}

#[test]
fn tools_call_tool_error_returns_error_result() {
    let result = call("get_schedule", json!({"name": "nope"}));
    assert_eq!(result["isError"], json!(true));
}

#[test]
fn tools_call_without_params_uses_defaults() {
    let request = json!({
        "jsonrpc": "2.0",
        "id": 9,
        "method": "tools/call"
    });
    let response = handle_request(&request).expect("response");
    // No tool name -> unknown tool error, but still a valid result envelope.
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
    assert_eq!(response["jsonrpc"], json!("2.0"));
    assert_eq!(response["id"], json!(3));
    assert_eq!(response["result"]["serverInfo"]["name"], json!("fdr-mcp"));
    assert_eq!(response["result"]["protocolVersion"], json!("2025-11-25"));
    assert!(response["result"]["capabilities"]["tools"].is_object());
}

#[test]
fn ping_returns_null_result() {
    let request = json!({"jsonrpc": "2.0", "id": 4, "method": "ping"});
    let response = handle_request(&request).expect("response");
    assert_eq!(response["result"], Value::Null);
}

#[test]
fn tools_list_over_rpc_returns_tools() {
    let request = json!({"jsonrpc": "2.0", "id": 5, "method": "tools/list"});
    let response = handle_request(&request).expect("response");
    assert_eq!(
        response["result"]["tools"].as_array().unwrap().len(),
        TOOL_NAMES.len()
    );
}

#[test]
fn unknown_method_with_id_returns_method_not_found() {
    let request = json!({"jsonrpc": "2.0", "id": "abc", "method": "bogus/method"});
    let response = handle_request(&request).expect("response");
    assert_eq!(response["id"], json!("abc"));
    assert_eq!(response["error"]["code"], json!(-32601));
    assert!(
        response["error"]["message"]
            .as_str()
            .unwrap()
            .contains("bogus/method")
    );
}

#[test]
fn unknown_method_without_id_is_notification() {
    let request = json!({"jsonrpc": "2.0", "method": "bogus/method"});
    assert!(handle_request(&request).is_none());
}

#[test]
fn notifications_get_no_response() {
    for method in ["ping", "notifications/initialized", "tools/list"] {
        let request = json!({"jsonrpc": "2.0", "method": method});
        assert!(handle_request(&request).is_none(), "{method}");
    }
}

#[test]
fn request_without_method_or_id_is_none() {
    assert!(handle_request(&json!({})).is_none());
    // An id but no method still produces a method-not-found error.
    let response = handle_request(&json!({"id": 1})).expect("response");
    assert_eq!(response["error"]["code"], json!(-32601));
}
