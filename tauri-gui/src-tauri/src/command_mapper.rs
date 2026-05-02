// Command mapping module - Maps AllowedAction to ai-global commands

use crate::command_safety::{AllowedAction, CommandParams};

pub struct CommandMapper;

impl CommandMapper {
    /// Map AllowedAction to ai-global command with parameters
    pub fn map_action(params: &CommandParams) -> Result<Vec<String>, String> {
        let mut cmd = vec!["ai-global".to_string(), params.action.as_str().to_string()];

        match params.action {
            AllowedAction::Status => {
                // ai-global status [key]
                if let Some(key) = &params.key {
                    cmd.push(key.clone());
                }
            }
            AllowedAction::List => {
                // ai-global list [--json]
                // No additional params for MVP
            }
            AllowedAction::Backups => {
                // ai-global backups
            }
            AllowedAction::ListSkills => {
                // ai-global list-skills
            }
            AllowedAction::ListRules => {
                // ai-global list-rules
            }
            AllowedAction::ListCommands => {
                // ai-global list-commands
            }
            AllowedAction::ListAgents => {
                // ai-global list-agents
            }
            AllowedAction::Relink => {
                // ai-global relink
            }
            AllowedAction::Clean => {
                // ai-global clean [key]
                if let Some(key) = &params.key {
                    cmd.push(key.clone());
                }
            }
            AllowedAction::Upgrade => {
                // ai-global upgrade [key]
                if let Some(key) = &params.key {
                    cmd.push(key.clone());
                }
            }
            AllowedAction::Unlink => {
                // ai-global unlink <key|all>
                if let Some(key) = &params.key {
                    cmd.push(key.clone());
                } else {
                    return Err("unlink 需要 key（或 all）".to_string());
                }
            }
            AllowedAction::AddSkill => {
                // ai-global add-skill <user/repo>
                if let Some(repo) = &params.repo {
                    cmd.push(repo.clone());
                } else {
                    return Err("add-skill 需要 repo".to_string());
                }
            }
            AllowedAction::AddRule => {
                // ai-global add-rule <user/repo>
                if let Some(repo) = &params.repo {
                    cmd.push(repo.clone());
                } else {
                    return Err("add-rule 需要 repo".to_string());
                }
            }
            AllowedAction::AddCommand => {
                // ai-global add-command <user/repo>
                if let Some(repo) = &params.repo {
                    cmd.push(repo.clone());
                } else {
                    return Err("add-command 需要 repo".to_string());
                }
            }
        }

        Ok(cmd)
    }

    /// Get command description for UI display
    pub fn get_description(action: &AllowedAction) -> &'static str {
        match action {
            AllowedAction::Status => "Check status of installed tools",
            AllowedAction::List => "List all installed tools",
            AllowedAction::Backups => "List available backups",
            AllowedAction::ListSkills => "List global skills",
            AllowedAction::ListRules => "List global rules",
            AllowedAction::ListCommands => "List global commands",
            AllowedAction::ListAgents => "List global agents",
            AllowedAction::Relink => "Relink a tool to a repository",
            AllowedAction::Clean => "Clean up unused tools",
            AllowedAction::Upgrade => "Upgrade installed tools",
            AllowedAction::Unlink => "Restore tool from backup by key/all",
            AllowedAction::AddSkill => "Install a global skill from GitHub repository",
            AllowedAction::AddRule => "Install a global rule from GitHub repository",
            AllowedAction::AddCommand => "Install a global command from GitHub repository",
        }
    }

    /// Get required parameters for an action
    pub fn get_required_params(action: &AllowedAction) -> Vec<&'static str> {
        match action {
            AllowedAction::Status => vec![],
            AllowedAction::List => vec![],
            AllowedAction::Backups => vec![],
            AllowedAction::ListSkills => vec![],
            AllowedAction::ListRules => vec![],
            AllowedAction::ListCommands => vec![],
            AllowedAction::ListAgents => vec![],
            AllowedAction::Relink => vec![],
            AllowedAction::Clean => vec![],
            AllowedAction::Upgrade => vec![],
            AllowedAction::Unlink => vec!["key"],
            AllowedAction::AddSkill => vec!["repo"],
            AllowedAction::AddRule => vec!["repo"],
            AllowedAction::AddCommand => vec!["repo"],
        }
    }

    /// Get optional parameters for an action
    pub fn get_optional_params(action: &AllowedAction) -> Vec<&'static str> {
        match action {
            AllowedAction::Status => vec!["key"],
            AllowedAction::List => vec![],
            AllowedAction::Backups => vec![],
            AllowedAction::ListSkills => vec![],
            AllowedAction::ListRules => vec![],
            AllowedAction::ListCommands => vec![],
            AllowedAction::ListAgents => vec![],
            AllowedAction::Relink => vec![],
            AllowedAction::Clean => vec!["key"],
            AllowedAction::Upgrade => vec!["key"],
            AllowedAction::Unlink => vec![],
            AllowedAction::AddSkill => vec![],
            AllowedAction::AddRule => vec![],
            AllowedAction::AddCommand => vec![],
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_map_status_no_params() {
        let params = CommandParams {
            action: AllowedAction::Status,
            key: None,
            repo: None,
            path: None,
        };
        let cmd = CommandMapper::map_action(&params).unwrap();
        assert_eq!(cmd, vec!["ai-global", "status"]);
    }

    #[test]
    fn test_map_status_with_key() {
        let params = CommandParams {
            action: AllowedAction::Status,
            key: Some("my-tool".to_string()),
            repo: None,
            path: None,
        };
        let cmd = CommandMapper::map_action(&params).unwrap();
        assert_eq!(cmd, vec!["ai-global", "status", "my-tool"]);
    }

    #[test]
    fn test_map_relink_success() {
        let params = CommandParams {
            action: AllowedAction::Relink,
            key: None,
            repo: None,
            path: None,
        };
        let cmd = CommandMapper::map_action(&params).unwrap();
        assert_eq!(cmd, vec!["ai-global", "relink"]);
    }

    #[test]
    fn test_map_relink_ignores_unused_params() {
        let params = CommandParams {
            action: AllowedAction::Relink,
            key: Some("unused".to_string()),
            repo: Some("owner/repo".to_string()),
            path: Some("ignored/path".to_string()),
        };
        let cmd = CommandMapper::map_action(&params).unwrap();
        assert_eq!(cmd, vec!["ai-global", "relink"]);
    }

    #[test]
    fn test_get_description() {
        assert_eq!(CommandMapper::get_description(&AllowedAction::Status), "Check status of installed tools");
    }

    #[test]
    fn test_map_add_skill_with_repo() {
        let params = CommandParams {
            action: AllowedAction::AddSkill,
            key: None,
            repo: Some("owner/repo".to_string()),
            path: None,
        };
        let cmd = CommandMapper::map_action(&params).unwrap();
        assert_eq!(cmd, vec!["ai-global", "add-skill", "owner/repo"]);
    }

    #[test]
    fn test_map_unlink_requires_key() {
        let params = CommandParams {
            action: AllowedAction::Unlink,
            key: None,
            repo: None,
            path: None,
        };
        assert!(CommandMapper::map_action(&params).is_err());
    }

    #[test]
    fn test_get_required_params() {
        let params = CommandMapper::get_required_params(&AllowedAction::Relink);
        assert!(params.is_empty());
    }
}