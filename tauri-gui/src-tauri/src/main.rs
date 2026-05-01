// Tauri GUI for ai-global - Main Backend Entry Point

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(debug_assertions)]
use tauri::Manager;
use tauri_gui::tauri_commands;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            tauri_commands::execute_ai_global_command,
            tauri_commands::get_command_info,
            tauri_commands::resolve_executable,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
