// Command Safety & Whitelist Configuration Module

use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AllowedAction {
    Status,
    List,
    Backups,
    Relink,
    Clean,
    Upgrade,
    Unlink,
    AddSkill,
    AddRule,
    AddCommand,
}

impl AllowedAction {
    pub fn as_str(&self) -> &'static str {
        match self {
            AllowedAction::Status => "status",
            AllowedAction::List => "list",
            AllowedAction::Backups => "backups",
            AllowedAction::Relink => "relink",
            AllowedAction::Clean => "clean",
            AllowedAction::Upgrade => "upgrade",
            AllowedAction::Unlink => "unlink",
            AllowedAction::AddSkill => "add-skill",
            AllowedAction::AddRule => "add-rule",
            AllowedAction::AddCommand => "add-command",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "status" => Ok(AllowedAction::Status),
            "list" => Ok(AllowedAction::List),
            "backups" => Ok(AllowedAction::Backups),
            "relink" => Ok(AllowedAction::Relink),
            "clean" => Ok(AllowedAction::Clean),
            "upgrade" => Ok(AllowedAction::Upgrade),
            "unlink" => Ok(AllowedAction::Unlink),
            "add-skill" => Ok(AllowedAction::AddSkill),
            "add-rule" => Ok(AllowedAction::AddRule),
            "add-command" => Ok(AllowedAction::AddCommand),
            _ => Err(format!("Unknown action: {}", s)),
        }
    }

    pub fn is_risky(&self) -> bool {
        matches!(self, AllowedAction::Clean | AllowedAction::Upgrade | AllowedAction::Relink | AllowedAction::Unlink)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandRequest {
    pub action: String,
    pub key: Option<String>,
    pub repo: Option<String>,
    pub path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResponse {
    pub success: bool,
    pub output: String,
    pub error: Option<String>,
    pub exit_code: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandParams {
    pub action: AllowedAction,
    pub key: Option<String>,
    pub repo: Option<String>,
    pub path: Option<String>,
}

// Whitelist validation for parameters
pub struct CommandValidator;

impl CommandValidator {
    // Validate key parameter (alphanumeric + hyphens/underscores)
    pub fn validate_key(key: &str) -> bool {
        Regex::new(r"^[a-zA-Z0-9_-]+$")
            .map(|re| re.is_match(key))
            .unwrap_or(false)
    }

    // Validate repo parameter (GitHub-style repo names)
    pub fn validate_repo(repo: &str) -> bool {
        Regex::new(r"^[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+$")
            .map(|re| re.is_match(repo))
            .unwrap_or(false)
    }

    // Validate path parameter (no absolute paths, no ../.. escapes)
    pub fn validate_path(path: &str) -> bool {
        !path.starts_with('/') && !path.contains("..") && !path.is_empty()
    }

    // Validate complete command params
    pub fn validate_params(params: &CommandParams) -> Result<(), String> {
        if let Some(key) = &params.key {
            if !Self::validate_key(key) {
                return Err(format!("Invalid key parameter: {}", key));
            }
        }

        if let Some(repo) = &params.repo {
            if !Self::validate_repo(repo) {
                return Err(format!("Invalid repo parameter: {}", repo));
            }
        }

        if let Some(path) = &params.path {
            if !Self::validate_path(path) {
                return Err(format!("Invalid path parameter: {}", path));
            }
        }

        match params.action {
            AllowedAction::Unlink => {
                if params.key.as_deref().unwrap_or_default().is_empty() {
                    return Err("unlink 需要提供 key（或 all）".to_string());
                }
            }
            AllowedAction::AddSkill | AllowedAction::AddRule | AllowedAction::AddCommand => {
                if params.repo.as_deref().unwrap_or_default().is_empty() {
                    return Err(format!("{} 需要提供 repo 參數", params.action.as_str()));
                }
            }
            _ => {}
        }

        Ok(())
    }

    // Parse and validate request from frontend
    pub fn parse_request(req: CommandRequest) -> Result<CommandParams, String> {
        let action = AllowedAction::from_str(&req.action)?;
        let params = CommandParams {
            action,
            key: req.key,
            repo: req.repo,
            path: req.path,
        };
        Self::validate_params(&params)?;
        Ok(params)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_key() {
        assert!(CommandValidator::validate_key("my-key"));
        assert!(CommandValidator::validate_key("key_123"));
        assert!(!CommandValidator::validate_key("key!@#"));
    }

    #[test]
    fn test_validate_repo() {
        assert!(CommandValidator::validate_repo("owner/repo"));
        assert!(CommandValidator::validate_repo("my-org/my-repo-name"));
        assert!(!CommandValidator::validate_repo("invalid"));
    }

    #[test]
    fn test_validate_path() {
        assert!(CommandValidator::validate_path("relative/path"));
        assert!(!CommandValidator::validate_path("/absolute/path"));
        assert!(!CommandValidator::validate_path("../escape"));
    }

    #[test]
    fn test_action_from_str() {
        assert_eq!(AllowedAction::from_str("status").unwrap(), AllowedAction::Status);
        assert!(AllowedAction::from_str("invalid").is_err());
    }

    #[test]
    fn test_risky_actions() {
        assert!(AllowedAction::Clean.is_risky());
        assert!(AllowedAction::Upgrade.is_risky());
        assert!(!AllowedAction::Status.is_risky());
    }

    #[test]
    fn test_parse_request_rejects_command_injection_in_key() {
        let request = CommandRequest {
            action: "status".to_string(),
            key: Some("tool;rm -rf /".to_string()),
            repo: None,
            path: None,
        };

        let result = CommandValidator::parse_request(request);
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_request_rejects_invalid_repo_format() {
        let request = CommandRequest {
            action: "relink".to_string(),
            key: None,
            repo: Some("https://github.com/owner/repo".to_string()),
            path: None,
        };

        let result = CommandValidator::parse_request(request);
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_request_rejects_path_traversal() {
        let request = CommandRequest {
            action: "status".to_string(),
            key: None,
            repo: None,
            path: Some("../secrets".to_string()),
        };

        let result = CommandValidator::parse_request(request);
        assert!(result.is_err());
    }
}
