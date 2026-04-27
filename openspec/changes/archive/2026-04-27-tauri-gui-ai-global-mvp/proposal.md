## Why
目前 ai-global 主要以 CLI 操作，對非終端機使用情境不夠友善，且高風險操作缺少視覺化防呆流程。
此變更要在不改動既有 ai-global 核心腳本的前提下，建立一個可安全操作的 Tauri GUI MVP。

## What Changes
- 新增 Tauri GUI 應用骨架，提供 Dashboard、工具管理與日誌面板。
- 新增 Rust command 中介層，將 GUI action 映射到 ai-global 子命令。
- 新增執行器與輸出串流機制，支援短任務 execute 與長任務 spawn。
- 新增命令與參數驗證規則，限制可呼叫範圍並降低命令注入風險。
- 第一階段僅支援 status、list、relink、clean、upgrade；其餘命令於後續里程碑導入。

## Capabilities

### New Capabilities
- tauri-gui-shell-bridge: 以受控 action 呼叫 ai-global 命令並回傳執行結果。
- tauri-gui-command-safety: 對命令與參數套用白名單與驗證，避免任意 shell 執行。
- tauri-gui-mvp-workflows: 提供 MVP 流程頁面與操作按鈕，覆蓋高頻低風險命令。
- tauri-gui-log-streaming: 在 UI 顯示 stdout/stderr 串流與最終狀態。

### Modified Capabilities
- 無。

## Impact
- 新增 Tauri 專案目錄與 Rust/前端模組：src、src-tauri、capabilities。
- 新增命令映射、參數驗證、程序執行與事件傳遞相關程式碼。
- 影響後續實作流程：/opsx:apply 將以本提案 tasks 為執行依據。
