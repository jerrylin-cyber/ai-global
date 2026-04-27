## 1. 專案骨架與執行環境

- [x] 1.1 建立 Tauri v2 + TypeScript 前後端目錄骨架（src 與 src-tauri）。
- [x] 1.2 建立基本頁面與元件骨架（Dashboard、Tools、Output Console、Confirm Dialog）。
- [x] 1.3 建立能力設定檔與最小權限設定，預留 shell 執行白名單結構。

## 2. 命令模型與安全驗證

- [x] 2.1 定義前後端共用 action 型別，涵蓋 status/list/relink/clean/upgrade。
- [x] 2.2 實作 Rust 端 action -> ai-global 參數映射函式。
- [x] 2.3 實作參數驗證器（key/repo/path）並加入錯誤回傳結構。
- [x] 2.4 建立高風險命令確認閘道介面與禁止直接執行策略。

## 3. 程序執行與輸出串流

- [x] 3.1 實作 process runner，支援 execute 與 spawn 兩種模式。
- [x] 3.2 實作可執行檔路徑解析與 fallback（~/.local/bin/ai-global -> ~/.ai-global/ai-global）。
- [x] 3.3 建立 stdout/stderr 串流事件轉發至前端日誌面板。
- [x] 3.4 實作程序關閉、錯誤、重試三種狀態處理流程。

## 4. MVP 介面流程

- [x] 4.1 在 Dashboard 建立五個 MVP 操作按鈕並綁定 action 觸發。
- [x] 4.2 在 UI 顯示執行中、成功、失敗與時間戳記狀態。
- [x] 4.3 在 Tools 頁面顯示工具狀態，維持第二階段操作預留但不開放。

## 5. 驗證與交付

- [x] 5.1 撰寫 smoke tests，覆蓋五個 MVP action 的成功與失敗路徑。
- [x] 5.2 驗證命令白名單與參數驗證可阻擋未授權輸入。
- [x] 5.3 執行人工驗證流程並記錄已知限制（僅 macOS/Linux，Windows 後續）。
