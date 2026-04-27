// Stream and event handling for real-time output

use serde::{Deserialize, Serialize};
use std::io::{BufRead, BufReader};
use std::process::Child;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StreamEvent {
    pub event_type: String, // "stdout" | "stderr" | "started" | "completed" | "error"
    pub data: String,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionEvent {
    pub action: String,
    pub status: String, // "pending" | "running" | "success" | "error"
    pub output: Vec<StreamEvent>,
    pub start_time: i64,
    pub end_time: Option<i64>,
}

pub struct StreamHandler;

impl StreamHandler {
    /// Create a stream event
    pub fn create_event(event_type: &str, data: String) -> StreamEvent {
        StreamEvent {
            event_type: event_type.to_string(),
            data,
            timestamp: chrono::Local::now().timestamp_millis(),
        }
    }

    /// Parse stdout/stderr from child process
    pub fn read_stream<R: std::io::Read>(
        reader: BufReader<R>,
        stream_type: &str,
    ) -> Vec<StreamEvent> {
        let mut events = Vec::new();

        for line in reader.lines() {
            if let Ok(line) = line {
                let event = Self::create_event(stream_type, line);
                events.push(event);
            }
        }

        events
    }

    /// Read stream from child process and collect events
    pub fn read_child_streams(child: &mut Child) -> (Vec<StreamEvent>, Option<i32>) {
        let mut events = Vec::new();

        // Collect stdout
        if let Some(stdout) = child.stdout.take() {
            let reader = BufReader::new(stdout);
            let stdout_events = Self::read_stream(reader, "stdout");
            events.extend(stdout_events);
        }

        // Collect stderr
        if let Some(stderr) = child.stderr.take() {
            let reader = BufReader::new(stderr);
            let stderr_events = Self::read_stream(reader, "stderr");
            events.extend(stderr_events);
        }

        // Wait for child to complete
        let exit_code = match child.wait() {
            Ok(status) => status.code(),
            Err(_) => Some(1),
        };

        (events, exit_code)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_event() {
        let event = StreamHandler::create_event("stdout", "test message".to_string());
        assert_eq!(event.event_type, "stdout");
        assert_eq!(event.data, "test message");
        assert!(event.timestamp > 0);
    }
}