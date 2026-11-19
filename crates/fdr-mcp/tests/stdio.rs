//! End-to-end tests for the `fdr-mcp` binary: stdio JSON-RPC framing and the
//! `--http` transport entrypoint.

use serde_json::Value;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::process::{Child, Command, Stdio};
use std::time::Duration;

fn free_port() -> u16 {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    listener.local_addr().unwrap().port()
}

fn spawn(args: &[&str]) -> Child {
    Command::new(env!("CARGO_BIN_EXE_fdr-mcp"))
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn fdr-mcp")
}

#[test]
fn stdio_answers_requests_and_reports_parse_errors() {
    let mut child = spawn(&[]);
    let mut stdin = child.stdin.take().unwrap();
    writeln!(
        stdin,
        r#"{{"jsonrpc":"2.0","id":1,"method":"initialize","params":{{}}}}"#
    )
    .unwrap();
    // Notification: no response expected.
    writeln!(
        stdin,
        r#"{{"jsonrpc":"2.0","method":"notifications/initialized"}}"#
    )
    .unwrap();
    writeln!(
        stdin,
        r#"{{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{{"name":"stats","arguments":{{}}}}}}"#
    )
    .unwrap();
    // Invalid JSON produces a -32700 parse error response.
    writeln!(stdin, "this is not json").unwrap();
    // Blank lines are skipped.
    writeln!(stdin).unwrap();
    drop(stdin);

    let mut stdout = String::new();
    child
        .stdout
        .take()
        .unwrap()
        .read_to_string(&mut stdout)
        .unwrap();
    assert!(child.wait().unwrap().success());

    let lines: Vec<&str> = stdout.lines().collect();
    assert_eq!(lines.len(), 3, "unexpected output: {stdout}");

    let init: Value = serde_json::from_str(lines[0]).unwrap();
    assert_eq!(init["id"], serde_json::json!(1));
    assert_eq!(init["result"]["serverInfo"]["name"], "fdr-mcp");

    let stats: Value = serde_json::from_str(lines[1]).unwrap();
    assert_eq!(stats["id"], serde_json::json!(2));
    assert!(stats["result"]["structuredContent"]["total_items"].is_u64());

    let parse_error: Value = serde_json::from_str(lines[2]).unwrap();
    assert_eq!(parse_error["error"]["code"], serde_json::json!(-32700));
}

#[test]
fn http_mode_serves_mcp_and_rejects_bad_json() {
    let port = free_port();
    let mut child = spawn(&["--http", &format!("127.0.0.1:{port}")]);
    std::thread::sleep(Duration::from_millis(300));

    let post = |body: &str| -> String {
        let mut stream = std::net::TcpStream::connect(("127.0.0.1", port)).unwrap();
        write!(
            stream,
            "POST /mcp HTTP/1.1\r\nhost: localhost\r\ncontent-type: application/json\r\ncontent-length: {}\r\n\r\n{}",
            body.len(),
            body
        )
        .unwrap();
        let mut raw = String::new();
        stream.read_to_string(&mut raw).unwrap();
        raw.split("\r\n\r\n").nth(1).unwrap_or("").to_string()
    };

    let body = post(r#"{"jsonrpc":"2.0","id":1,"method":"initialize"}"#);
    let response: Value = serde_json::from_str(&body).expect("json response");
    assert_eq!(response["result"]["serverInfo"]["name"], "fdr-mcp");

    let body = post("garbage{");
    let response: Value = serde_json::from_str(&body).expect("json response");
    assert_eq!(response["error"]["code"], serde_json::json!(-32700));

    child.kill().unwrap();
    child.wait().unwrap();
}

#[test]
fn http_mode_with_unbindable_addr_exits_nonzero() {
    let output = Command::new(env!("CARGO_BIN_EXE_fdr-mcp"))
        .args(["--http", "not-an-address"])
        .stderr(Stdio::null())
        .output()
        .unwrap();
    assert!(!output.status.success());
}
