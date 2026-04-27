## Context

ai-global 已具備完整 CLI 功能，但目前缺少 GUI 操作入口。既有腳本邏輯可重用，不適合在 MVP 階段拆改核心流程。現階段目標是建立一層 Tauri 包裝，讓使用者能在桌面介面執行常用命令並取得清楚回饋，同時維持安全邊界。

## Goals / Non-Goals

**Goals:**
- 以 Tauri 建立可執行的 GUI MVP。
- 透過 Rust command 封裝命令映射，不讓前端直接組 shell 字串。
- 支援 status、list、relink、clean、upgrade 五個高頻命令。
- 提供 stdout/stderr 輸出顯示、執行中狀態與錯誤訊息。

**Non-Goals:**
- 不修改既有 ai-global 核心腳本行為。
- 不在 MVP 導入 add-skill、add-rule、add-command、unlink all、uninstall 的完整流程。
- 不處理 Windows 平台支援。

## Decisions

1. 採三層架構：Frontend -> Rust command -> ai-global process。
- 理由：可明確分離 UI、安全驗證與系統命令執行責任。
- 替代方案：前端直接 shell plugin 呼叫命令。
- 未採用原因：難以集中做命令白名單控管與風險分級。

2. action enum 映射命令，不接受 raw shell 字串。
- 理由：降低命令注入與誤用風險。
- 替代方案：傳入自由字串由後端拼接。
- 未採用原因：無法保障參數安全與可預測性。

3. 短任務使用 execute，長任務使用 spawn 串流輸出。
- 理由：兼顧實作簡單與可觀測性。
- 替代方案：全部使用 execute。
- 未採用原因：長任務缺少即時輸出，不利除錯與使用者回饋。

4. 命令路徑採雙路徑 fallback。
- 理由：在不同安裝方式下提高可用性。
- 順序：先嘗試 ~/.local/bin/ai-global，失敗再嘗試 ~/.ai-global/ai-global。

## Risks / Trade-offs

- [風險] 命令注入或不受控參數 -> [緩解] 僅允許 enum action + repo/key 正規表示式驗證。
- [風險] CLI 互動提示導致程序卡住 -> [緩解] GUI 先做確認與約束輸入，必要時補 --yes 參數策略。
- [風險] PATH 或執行權限差異造成啟動失敗 -> [緩解] 實作 fallback 路徑與明確錯誤提示。
- [風險] 平台差異造成行為不一致 -> [緩解] MVP 僅支援 macOS/Linux，Windows 另開提案。

## Migration Plan

1. 建立 Tauri 專案骨架與基礎頁面。
2. 實作 action enum、驗證器與 process runner。
3. 串接五個 MVP 命令並建立日誌面板。
4. 執行 smoke tests 與基本手動驗證。
5. 釋出 MVP，後續再擴充高風險命令流程。

Rollback:
- 若 GUI 功能異常，直接停用 GUI 入口，不影響既有 ai-global CLI。

## Open Questions

- 是否需要在第一階段就加入程序中止按鈕與 kill 權限？
- add-skill/add-rule/add-command 的來源審核 UI 需要哪一種預設策略？
- 第二階段是否需要為互動命令新增非互動參數以利 GUI 一致化？
