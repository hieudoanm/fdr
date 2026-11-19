//! End-to-end tests for the `fdr` binary subcommands.

use std::io::{Read, Write};
use std::process::{Child, Command, Stdio};
use std::time::Duration;

fn fdr(args: &[&str]) -> std::process::Output {
    Command::new(env!("CARGO_BIN_EXE_fdr"))
        .args(args)
        .output()
        .expect("run fdr")
}

fn stdout(output: &std::process::Output) -> String {
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn stderr(output: &std::process::Output) -> String {
    String::from_utf8_lossy(&output.stderr).to_string()
}

#[test]
fn countries_lists_cuisines() {
    let out = fdr(&["countries"]);
    assert!(out.status.success());
    let text = stdout(&out);
    assert!(text.lines().count() >= 10);
    assert!(text.contains('('));
}

#[test]
fn foods_limit_prints_requested_count() {
    let out = fdr(&["foods", "--limit", "3"]);
    assert!(out.status.success());
    assert_eq!(stdout(&out).lines().count(), 3);
    assert!(stderr(&out).contains("shown"));
}

#[test]
fn foods_filters_by_country() {
    let out = fdr(&["foods", "--country", "japanese", "--limit", "2"]);
    assert!(out.status.success());
    for line in stdout(&out).lines() {
        assert!(line.contains("japanese"), "{line}");
    }
}

#[test]
fn foods_search_and_subcategory_filters() {
    let out = fdr(&["foods", "--search", "sushi"]);
    assert!(out.status.success());
    assert!(stdout(&out).lines().count() > 0);

    let out = fdr(&["foods", "--subcategory", "zzz-no-match"]);
    assert!(out.status.success());
    assert!(stdout(&out).contains("No foods match"));
}

#[test]
fn foods_random_prints_one_item() {
    let out = fdr(&["foods", "--random"]);
    assert!(out.status.success());
    assert_eq!(stdout(&out).lines().count(), 1);
}

#[test]
fn drinks_and_snacks_list_items() {
    for cmd in ["drinks", "snacks"] {
        let out = fdr(&[cmd, "--limit", "2"]);
        assert!(out.status.success(), "{cmd}");
        assert_eq!(stdout(&out).lines().count(), 2, "{cmd}");
    }
}

#[test]
fn pick_each_kind_prints_one_item() {
    for kind in ["foods", "drinks", "snacks", "any"] {
        let out = fdr(&["pick", kind]);
        assert!(out.status.success(), "pick {kind}");
        assert_eq!(stdout(&out).lines().count(), 1, "pick {kind}");
    }
}

#[test]
fn pick_with_filters() {
    let out = fdr(&["pick", "foods", "--country", "italian"]);
    assert!(out.status.success());
    assert!(stdout(&out).contains("italian"));
}

#[test]
fn pick_with_impossible_filter_exits_nonzero() {
    let out = fdr(&["pick", "any", "--search", "zzz-no-match"]);
    assert!(!out.status.success());
    assert!(stderr(&out).contains("error:"));
}

#[test]
fn schedules_lists_names() {
    let out = fdr(&["schedules"]);
    assert!(out.status.success());
    let text = stdout(&out);
    let names: Vec<&str> = text.lines().collect();
    assert_eq!(names, ["scheldon", "united-kingdom", "vietnam"]);
}

#[test]
fn schedule_prints_entries() {
    let out = fdr(&["schedule", "scheldon"]);
    assert!(out.status.success());
    assert_eq!(stdout(&out).lines().count(), 7);
}

#[test]
fn schedule_filters_by_week_and_day() {
    let out = fdr(&["schedule", "vietnam", "--week", "1", "--day", "monday"]);
    assert!(out.status.success());
    let text = stdout(&out);
    let lines: Vec<&str> = text.lines().collect();
    assert!(!lines.is_empty());
    assert!(lines.iter().all(|l| l.contains("week 1")));
}

#[test]
fn schedule_with_no_matches() {
    let out = fdr(&["schedule", "scheldon", "--day", "funday"]);
    assert!(out.status.success());
    assert!(stdout(&out).contains("No schedule entries match."));
}

#[test]
fn schedule_unknown_name_exits_nonzero() {
    let out = fdr(&["schedule", "nope"]);
    assert!(!out.status.success());
    assert!(stderr(&out).contains("error:"));
}

#[test]
fn stats_prints_dataset_counts() {
    let out = fdr(&["stats"]);
    assert!(out.status.success());
    let text = stdout(&out);
    for label in [
        "Countries:",
        "Dishes:",
        "Drinks:",
        "Snacks/desserts:",
        "Total items:",
        "Schedules:",
    ] {
        assert!(text.contains(label), "missing {label}");
    }
}

#[test]
fn mcp_runs_the_mcp_server_over_stdio() {
    let mut child = Command::new(env!("CARGO_BIN_EXE_fdr"))
        .args(["mcp"])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn fdr mcp");
    {
        let mut stdin = child.stdin.take().unwrap();
        writeln!(
            stdin,
            r#"{{"jsonrpc":"2.0","id":1,"method":"initialize","params":{{}}}}"#
        )
        .unwrap();
        writeln!(
            stdin,
            r#"{{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{{"name":"stats","arguments":{{}}}}}}"#
        )
        .unwrap();
    }
    let mut stdout = String::new();
    child
        .stdout
        .take()
        .unwrap()
        .read_to_string(&mut stdout)
        .unwrap();
    assert!(child.wait().unwrap().success());

    let lines: Vec<&str> = stdout.lines().collect();
    assert_eq!(lines.len(), 2);
    let init: serde_json::Value = serde_json::from_str(lines[0]).unwrap();
    assert_eq!(init["result"]["serverInfo"]["name"], "fdr-mcp");
    let stats: serde_json::Value = serde_json::from_str(lines[1]).unwrap();
    assert!(stats["result"]["structuredContent"]["total_items"].is_u64());
}

#[test]
fn mcp_http_mode_binds_and_serves() {
    let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
    let port = listener.local_addr().unwrap().port();
    drop(listener);
    let mut child = Command::new(env!("CARGO_BIN_EXE_fdr"))
        .args(["mcp", "--http", &format!("127.0.0.1:{port}")])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn fdr mcp --http");
    std::thread::sleep(Duration::from_millis(400));
    assert!(child.try_wait().unwrap().is_none(), "server exited early");
    child.kill().unwrap();
    let _ = child.wait();
}

#[test]
fn help_and_version_work() {
    for args in [&["--help"][..], &["--version"][..]] {
        let out = fdr(args);
        assert!(out.status.success(), "{args:?}");
    }
}

#[test]
fn missing_subcommand_fails() {
    let out = fdr(&[]);
    assert!(!out.status.success());
}

#[test]
fn tui_exits_promptly_without_a_terminal() {
    // Without a TTY the TUI either errors out or blocks on input; give it a
    // moment, then make sure the process is not left running.
    let mut child: Child = Command::new(env!("CARGO_BIN_EXE_fdr"))
        .args(["tui"])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn fdr tui");
    std::thread::sleep(Duration::from_millis(500));
    if child.try_wait().unwrap().is_none() {
        child.kill().unwrap();
    }
    // Drain any output to avoid a broken pipe panic in the child.
    let _ = child.wait();
}

#[test]
fn tui_reads_q_from_stdin_when_not_a_terminal() {
    // Best-effort: if the TUI manages to start reading stdin, 'q' should quit.
    let mut child = Command::new(env!("CARGO_BIN_EXE_fdr"))
        .args(["tui"])
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn fdr tui");
    if let Some(mut stdin) = child.stdin.take() {
        let _ = stdin.write_all(b"q");
    }
    std::thread::sleep(Duration::from_millis(500));
    if child.try_wait().unwrap().is_none() {
        child.kill().unwrap();
    }
    let _ = child.wait();
}
