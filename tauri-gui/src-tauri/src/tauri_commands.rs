// Tauri Commands - Frontend-Backend Bridge

use tauri::Emitter;
use crate::process_runner::ExecutionMode;
use crate::stream_handler::StreamHandler;

#[tauri::command]
pub fn execute_ai_global_command(
    app: tauri::AppHandle,
    action: String,
    key: Option<String>,
    repo: Option<String>,
    path: Option<String>,
) -> Result<crate::command_safety::CommandResponse, String> {
    use crate::command_safety::{CommandRequest, CommandResponse, CommandValidator};
    use crate::process_runner::ProcessRunner;

    let req = CommandRequest { action, key, repo, path };
    let params = CommandValidator::parse_request(req)?;
    let action_label = params.action.as_str().to_string();

    match ProcessRunner::get_execution_mode(&params) {
        ExecutionMode::Spawn => {
            // Emit start event to frontend
            let _ = app.emit("stream-event", StreamHandler::create_event(
                "started",
                format!("執行命令: ai-global {}", action_label),
            ));

            match ProcessRunner::spawn(&params) {
                Ok(mut spawned) => {
                    let (events, exit_code) = StreamHandler::read_child_streams(&mut spawned.child);

                    // Emit each line event as it was collected
                    for event in &events {
                        let _ = app.emit("stream-event", event);
                    }

                    let success = exit_code.map(|c| c == 0).unwrap_or(false);
                    let stdout: String = events.iter()
                        .filter(|e| e.event_type == "stdout")
                        .map(|e| e.data.as_str())
                        .collect::<Vec<_>>()
                        .join("\n");
                    let stderr: String = events.iter()
                        .filter(|e| e.event_type == "stderr")
                        .map(|e| e.data.as_str())
                        .collect::<Vec<_>>()
                        .join("\n");

                    let _ = app.emit("stream-event", StreamHandler::create_event(
                        "completed",
                        format!("exit code: {}", exit_code.unwrap_or(0)),
                    ));

                    Ok(CommandResponse {
                        success,
                        output: stdout,
                        error: if stderr.is_empty() { None } else { Some(stderr) },
                        exit_code,
                    })
                }
                Err(e) => Err(e),
            }
        }
        ExecutionMode::Execute => {
            match ProcessRunner::execute(&params) {
                Ok(result) => Ok(CommandResponse {
                    success: result.success,
                    output: result.stdout,
                    error: if result.stderr.is_empty() { None } else { Some(result.stderr) },
                    exit_code: result.exit_code,
                }),
                Err(error) => Err(error),
            }
        }
    }
}

#[tauri::command]
pub fn get_command_info(action: String) -> Result<String, String> {
    use crate::command_mapper::CommandMapper;

    let allowed_action = match action.as_str() {
        "status" => crate::command_safety::AllowedAction::Status,
        "list" => crate::command_safety::AllowedAction::List,
        "backups" => crate::command_safety::AllowedAction::Backups,
        "relink" => crate::command_safety::AllowedAction::Relink,
        "clean" => crate::command_safety::AllowedAction::Clean,
        "upgrade" => crate::command_safety::AllowedAction::Upgrade,
        "unlink" => crate::command_safety::AllowedAction::Unlink,
        "add-skill" => crate::command_safety::AllowedAction::AddSkill,
        "add-rule" => crate::command_safety::AllowedAction::AddRule,
        "add-command" => crate::command_safety::AllowedAction::AddCommand,
        _ => return Err("Unknown action".to_string()),
    };

    let info = format!(
        "Action: {}\nDescription: {}\nRequired: {:?}\nOptional: {:?}",
        allowed_action.as_str(),
        CommandMapper::get_description(&allowed_action),
        CommandMapper::get_required_params(&allowed_action),
        CommandMapper::get_optional_params(&allowed_action)
    );

    Ok(info)
}

#[tauri::command]
pub fn resolve_executable() -> Result<String, String> {
    use crate::process_runner::ProcessRunner;
    ProcessRunner::resolve_executable()
}