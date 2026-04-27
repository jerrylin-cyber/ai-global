// Error handling and response structures

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CommandError {
    InvalidAction(String),
    InvalidParameter(String),
    CommandNotFound,
    ExecutionFailed(String),
    PermissionDenied,
    Timeout,
    UnknownError(String),
}

impl CommandError {
    pub fn message(&self) -> String {
        match self {
            CommandError::InvalidAction(msg) => format!("Invalid action: {}", msg),
            CommandError::InvalidParameter(msg) => format!("Invalid parameter: {}", msg),
            CommandError::CommandNotFound => "Command 'ai-global' not found".to_string(),
            CommandError::ExecutionFailed(msg) => format!("Execution failed: {}", msg),
            CommandError::PermissionDenied => "Permission denied".to_string(),
            CommandError::Timeout => "Command execution timeout".to_string(),
            CommandError::UnknownError(msg) => format!("Unknown error: {}", msg),
        }
    }

    pub fn code(&self) -> i32 {
        match self {
            CommandError::InvalidAction(_) => 1001,
            CommandError::InvalidParameter(_) => 1002,
            CommandError::CommandNotFound => 1003,
            CommandError::ExecutionFailed(_) => 1004,
            CommandError::PermissionDenied => 1005,
            CommandError::Timeout => 1006,
            CommandError::UnknownError(_) => 9999,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub error: String,
    pub code: i32,
}

impl ErrorResponse {
    pub fn from_error(error: CommandError) -> Self {
        ErrorResponse {
            success: false,
            error: error.message(),
            code: error.code(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuccessResponse {
    pub success: bool,
    pub output: String,
    pub exit_code: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Response {
    Success(SuccessResponse),
    Error(ErrorResponse),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_message() {
        let err = CommandError::InvalidParameter("bad repo".to_string());
        assert_eq!(err.message(), "Invalid parameter: bad repo");
    }

    #[test]
    fn test_error_code() {
        assert_eq!(CommandError::InvalidParameter("x".to_string()).code(), 1002);
        assert_eq!(CommandError::CommandNotFound.code(), 1003);
    }

    #[test]
    fn test_error_response() {
        let resp = ErrorResponse::from_error(CommandError::CommandNotFound);
        assert!(!resp.success);
        assert_eq!(resp.code, 1003);
    }
}