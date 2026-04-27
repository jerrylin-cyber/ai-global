// Tauri GUI for ai-global - Main Backend Entry Point

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod command_safety;
mod command_mapper;
mod error_handling;
mod process_runner;
mod stream_handler;
mod state_manager;
mod tauri_commands;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
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
