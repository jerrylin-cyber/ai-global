// State management for command execution lifecycle

use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ExecutionState {
    Pending,
    Running,
    Success,
    Error,
    Timeout,
}

impl ExecutionState {
    pub fn as_str(&self) -> &'static str {
        match self {
            ExecutionState::Pending => "pending",
            ExecutionState::Running => "running",
            ExecutionState::Success => "success",
            ExecutionState::Error => "error",
            ExecutionState::Timeout => "timeout",
        }
    }
}

#[derive(Debug, Clone)]
pub struct ExecutionContext {
    pub state: ExecutionState,
    pub start_time: Option<Instant>,
    pub end_time: Option<Instant>,
    pub retry_count: u32,
    pub max_retries: u32,
    pub timeout: Duration,
    pub output: String,
    pub error_message: Option<String>,
}

impl ExecutionContext {
    pub fn new(max_retries: u32, timeout_secs: u64) -> Self {
        ExecutionContext {
            state: ExecutionState::Pending,
            start_time: None,
            end_time: None,
            retry_count: 0,
            max_retries,
            timeout: Duration::from_secs(timeout_secs),
            output: String::new(),
            error_message: None,
        }
    }

    pub fn start(&mut self) {
        self.state = ExecutionState::Running;
        self.start_time = Some(Instant::now());
    }

    pub fn complete_success(&mut self, output: String) {
        self.state = ExecutionState::Success;
        self.end_time = Some(Instant::now());
        self.output = output;
    }

    pub fn complete_error(&mut self, error: String) {
        self.state = ExecutionState::Error;
        self.end_time = Some(Instant::now());
        self.error_message = Some(error);
    }

    pub fn mark_timeout(&mut self) {
        self.state = ExecutionState::Timeout;
        self.end_time = Some(Instant::now());
        self.error_message = Some("Command execution timeout".to_string());
    }

    pub fn can_retry(&self) -> bool {
        self.retry_count < self.max_retries && matches!(self.state, ExecutionState::Error | ExecutionState::Timeout)
    }

    pub fn retry(&mut self) {
        if self.can_retry() {
            self.retry_count += 1;
            self.state = ExecutionState::Pending;
            self.start_time = None;
            self.end_time = None;
            self.error_message = None;
        }
    }

    pub fn is_elapsed(&self) -> bool {
        if let Some(start) = self.start_time {
            start.elapsed() > self.timeout
        } else {
            false
        }
    }

    pub fn elapsed_secs(&self) -> f64 {
        if let Some(start) = self.start_time {
            let end = self.end_time.unwrap_or_else(Instant::now);
            end.duration_since(start).as_secs_f64()
        } else {
            0.0
        }
    }
}

pub struct StateManager;

impl StateManager {
    /// Handle normal completion
    pub fn handle_success(ctx: &mut ExecutionContext, output: String) {
        ctx.complete_success(output);
    }

    /// Handle error and determine if retry should be attempted
    pub fn handle_error(ctx: &mut ExecutionContext, error: String) -> bool {
        ctx.complete_error(error);
        
        if ctx.can_retry() {
            ctx.retry();
            true
        } else {
            false
        }
    }

    /// Handle timeout
    pub fn handle_timeout(ctx: &mut ExecutionContext) -> bool {
        ctx.mark_timeout();
        
        if ctx.can_retry() {
            ctx.retry();
            true
        } else {
            false
        }
    }

    /// Check if process needs termination
    pub fn should_terminate(ctx: &ExecutionContext) -> bool {
        ctx.is_elapsed()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_execution_state() {
        let mut ctx = ExecutionContext::new(2, 30);
        assert_eq!(ctx.state, ExecutionState::Pending);

        ctx.start();
        assert_eq!(ctx.state, ExecutionState::Running);

        ctx.complete_success("output".to_string());
        assert_eq!(ctx.state, ExecutionState::Success);
    }

    #[test]
    fn test_retry_logic() {
        let mut ctx = ExecutionContext::new(2, 30);
        ctx.start();
        ctx.complete_error("error".to_string());
        assert!(ctx.can_retry());
        assert_eq!(ctx.retry_count, 0);

        ctx.retry();
        assert_eq!(ctx.state, ExecutionState::Pending);
        assert_eq!(ctx.retry_count, 1);
    }

    #[test]
    fn test_max_retries_exceeded() {
        let mut ctx = ExecutionContext::new(1, 30);
        ctx.start();
        ctx.complete_error("error 1".to_string());
        ctx.retry();
        ctx.complete_error("error 2".to_string());
        
        assert!(!ctx.can_retry());
    }

    #[test]
    fn test_timeout_detection() {
        let mut ctx = ExecutionContext::new(1, 1);
        ctx.start();
        std::thread::sleep(Duration::from_millis(1100));
        assert!(ctx.is_elapsed());
    }
}