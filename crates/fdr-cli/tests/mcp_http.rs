//! Integration tests for the streamable-HTTP transport in `fdr_mcp::mcp_http`.

use fdr_cli::mcp_http::{serve, serve_seq};
use std::io::{Read, Write};
use std::net::TcpListener;
use std::time::Duration;

fn free_port() -> u16 {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    listener.local_addr().unwrap().port()
}

/// Spawn `serve` on a fresh port and return the port. The server runs until the
/// test process exits; each test uses its own port.
fn spawn_serve<F>(token: Option<String>, handler: F) -> u16
where
    F: FnMut(&str) -> Option<String> + Send + 'static,
{
    let port = free_port();
    let addr = format!("127.0.0.1:{port}");
    std::thread::spawn(move || serve(&addr, token, handler).unwrap());
    std::thread::sleep(Duration::from_millis(150));
    port
}

fn spawn_serve_seq<F>(token: Option<String>, handler: F) -> u16
where
    F: FnMut(&str) -> Option<String> + Send + 'static,
{
    let port = free_port();
    let addr = format!("127.0.0.1:{port}");
    std::thread::spawn(move || serve_seq(&addr, token, handler).unwrap());
    std::thread::sleep(Duration::from_millis(150));
    port
}

/// Send a raw HTTP request and return the full raw response.
fn raw_request(port: u16, request: &str) -> String {
    let mut stream = std::net::TcpStream::connect(("127.0.0.1", port)).unwrap();
    stream.write_all(request.as_bytes()).unwrap();
    let mut raw = String::new();
    stream.read_to_string(&mut raw).unwrap();
    raw
}

fn status_of(raw: &str) -> u16 {
    raw.split_whitespace()
        .nth(1)
        .and_then(|s| s.parse().ok())
        .unwrap_or(0)
}

fn body_of(raw: &str) -> &str {
    raw.split("\r\n\r\n").nth(1).unwrap_or("")
}

fn post(port: u16, path: &str, body: &str, auth: Option<&str>) -> (u16, String) {
    let auth_header = auth
        .map(|t| format!("authorization: Bearer {t}\r\n"))
        .unwrap_or_default();
    let raw = raw_request(
        port,
        &format!(
            "POST {path} HTTP/1.1\r\nhost: localhost\r\ncontent-type: application/json\r\ncontent-length: {}\r\n{auth_header}\r\n{body}",
            body.len()
        ),
    );
    (status_of(&raw), body_of(&raw).to_string())
}

#[test]
fn post_with_handler_response_returns_200() {
    let port = spawn_serve(None, |body: &str| Some(format!(r#"{{"echo":"{body}"}}"#)));
    let (status, body) = post(port, "/mcp", r#"{"jsonrpc":"2.0","id":1}"#, None);
    assert_eq!(status, 200);
    assert!(body.contains("echo"));
}

#[test]
fn notification_gets_202() {
    let port = spawn_serve(None, |_| None);
    let (status, _) = post(port, "/mcp", r#"{"jsonrpc":"2.0","method":"ping"}"#, None);
    assert_eq!(status, 202);
}

#[test]
fn wrong_path_returns_404() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    let (status, body) = post(port, "/other", r#"{"jsonrpc":"2.0","id":1}"#, None);
    assert_eq!(status, 404);
    assert!(body.contains("not found"));
}

#[test]
fn get_and_delete_return_405() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    for method in ["GET", "DELETE"] {
        let raw = raw_request(
            port,
            &format!("{method} /mcp HTTP/1.1\r\nhost: localhost\r\ncontent-length: 0\r\n\r\n"),
        );
        assert_eq!(status_of(&raw), 405, "{method}");
    }
}

#[test]
fn bearer_token_is_enforced() {
    let port = spawn_serve(Some("s3cret".to_string()), |_| {
        Some(r#"{"ok":true}"#.to_string())
    });
    let body = r#"{"jsonrpc":"2.0","id":1}"#;

    let (status, _) = post(port, "/mcp", body, None);
    assert_eq!(status, 401);

    let (status, _) = post(port, "/mcp", body, Some("wrong"));
    assert_eq!(status, 401);

    let (status, resp) = post(port, "/mcp", body, Some("s3cret"));
    assert_eq!(status, 200);
    assert!(resp.contains("ok"));
}

#[test]
fn batch_requests_are_rejected() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    let (status, body) = post(port, "/mcp", r#"[{"jsonrpc":"2.0","id":1}]"#, None);
    assert_eq!(status, 400);
    assert!(body.contains("batch"));
}

#[test]
fn oversized_body_returns_413() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    let raw = raw_request(
        port,
        "POST /mcp HTTP/1.1\r\nhost: localhost\r\ncontent-length: 9000000\r\n\r\n",
    );
    assert_eq!(status_of(&raw), 413);
}

#[test]
fn oversized_headers_return_431() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    let mut request = String::from("POST /mcp HTTP/1.1\r\nhost: localhost\r\n");
    request.push_str("x-pad: ");
    request.push_str(&"a".repeat(70 * 1024));
    request.push_str("\r\n\r\n");
    let raw = raw_request(port, &request);
    assert_eq!(status_of(&raw), 431);
}

#[test]
fn response_includes_protocol_version_header() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    let raw = raw_request(
        port,
        "POST /mcp HTTP/1.1\r\nhost: localhost\r\nmcp-protocol-version: 2025-06-18\r\ncontent-length: 2\r\n\r\n{}",
    );
    assert_eq!(status_of(&raw), 200);
    assert!(raw.contains("mcp-protocol-version: 2025-06-18"));
}

#[test]
fn serve_seq_handles_requests_sequentially() {
    let port = spawn_serve_seq(None, |body: &str| {
        Some(format!(r#"{{"len":{}}}"#, body.len()))
    });
    let (status, body) = post(port, "/mcp", r#"{"jsonrpc":"2.0","id":1}"#, None);
    assert_eq!(status, 200);
    assert!(body.contains("len"));
}

#[test]
fn serve_seq_enforces_token() {
    let port = spawn_serve_seq(Some("tok".to_string()), |_| Some("{}".to_string()));
    let body = r#"{"jsonrpc":"2.0","id":1}"#;
    let (status, _) = post(port, "/mcp", body, Some("tok"));
    assert_eq!(status, 200);
    let (status, _) = post(port, "/mcp", body, None);
    assert_eq!(status, 401);
}

#[test]
fn client_disconnect_is_handled() {
    let port = spawn_serve(None, |_| Some("{}".to_string()));
    // Connect and immediately close without sending anything.
    let stream = std::net::TcpStream::connect(("127.0.0.1", port)).unwrap();
    drop(stream);
    // Server should still answer the next request.
    let (status, _) = post(port, "/mcp", r#"{"jsonrpc":"2.0","id":1}"#, None);
    assert_eq!(status, 200);
}
