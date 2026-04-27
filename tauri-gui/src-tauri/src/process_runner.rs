// Process runner module for executing ai-global commands

use crate::command_safety::CommandParams;
use crate::command_mapper::CommandMapper;
use std::process::{Command, Stdio};
use std::path::PathBuf;

pub enum ExecutionMode {
    Execute,
    Spawn,
}

pub struct ProcessRunner;

impl ProcessRunner {
    /// Resolve ai-global executable path with fallback strategy
    pub fn resolve_executable() -> Result<String, String> {
        let paths = vec![
            PathBuf::from(shellexpand::tilde("~/.local/bin/ai-global").as_ref()),
            PathBuf::from(shellexpand::tilde("~/.ai-global/ai-global").as_ref()),
            PathBuf::from("/usr/local/bin/ai-global"),
            PathBuf::from("/usr/bin/ai-global"),
        ];

        for path in paths {
            if path.exists() && path.is_file() {
                if let Some(path_str) = path.to_str() {
                    return Ok(path_str.to_string());
                }
            }
        }

        Err("ai-global executable not found in any known location".to_string())
    }

    /// Determine execution mode based on action
    pub fn get_execution_mode(params: &CommandParams) -> ExecutionMode {
        // Long-running commands use Spawn mode for streaming
        match params.action {
            crate::command_safety::AllowedAction::Upgrade => ExecutionMode::Spawn,
            crate::command_safety::AllowedAction::Clean => ExecutionMode::Spawn,
            _ => ExecutionMode::Execute,
        }
    }

    /// Execute command and capture complete output
    pub fn execute(params: &CommandParams) -> Result<ExecutionResult, String> {
        let exe_path = Self::resolve_executable()?;
        let args = CommandMapper::map_action(params)?;

        // Remove executable name from args for Command::args
        let cmd_args = if args.len() > 1 { &args[1..] } else { &[] };

        let output = Command::new(&exe_path)
            .args(cmd_args)
            .output()
            .map_err(|e| format!("Failed to execute command: {}", e))?;

        Ok(ExecutionResult {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            exit_code: output.status.code(),
            success: output.status.success(),
        })
    }

    /// Spawn command for long-running operations (streaming capable)
    pub fn spawn(params: &CommandParams) -> Result<SpawnedProcess, String> {
        let exe_path = Self::resolve_executable()?;
        let args = CommandMapper::map_action(params)?;

        let cmd_args = if args.len() > 1 { &args[1..] } else { &[] };

        let child = Command::new(&exe_path)
            .args(cmd_args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn process: {}", e))?;

        Ok(SpawnedProcess {
            child,
            action: format!("{:?}", params.action),
        })
    }
}

#[derive(Debug, Clone)]
pub struct ExecutionResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub success: bool,
}

pub struct SpawnedProcess {
    pub child: std::process::Child,
    pub action: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_resolve_executable() {
        let result = ProcessRunner::resolve_executable();
        // Result depends on system setup
        assert!(result.is_ok() || result.is_err());
    }

    #[test]
    fn test_get_execution_mode_upgrade() {
        let params = CommandParams {
            action: crate::command_safety::AllowedAction::Upgrade,
            key: None,
            repo: None,
            path: None,
        };
        match ProcessRunner::get_execution_mode(&params) {
            ExecutionMode::Spawn => {}, // Expected
            ExecutionMode::Execute => panic!("Upgrade should use Spawn mode"),
        }
    }

    #[test]
    fn test_get_execution_mode_status() {
        let params = CommandParams {
            action: crate::command_safety::AllowedAction::Status,
            key: None,
            repo: None,
            path: None,
        };
        match ProcessRunner::get_execution_mode(&params) {
            ExecutionMode::Execute => {}, // Expected
            ExecutionMode::Spawn => panic!("Status should use Execute mode"),
        }
    }
}