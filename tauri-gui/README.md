# ai-global GUI

以 [Tauri v2](https://tauri.app) + React 18 打包的桌面 GUI，為 [ai-global](https://github.com/lazyjerry/ai-global) CLI 提供圖形操作介面，涵蓋狀態檢查、全域資源檢視、備份還原與維護操作。

目前介面分成 4 個主要區塊：

- Insights：顯示 `status` 狀態摘要與 `backups` 備份清單
- Resources：顯示 `list-skills`、`list-rules`、`list-commands`、`list-agents`，並支援 `add-skill`、`add-rule`、`add-command`
- Maintenance：提供 `relink`、`clean`、`upgrade`、`unlink`
- Tools：顯示 `list` 工具安裝狀態與版本資訊

---

## macOS 安裝注意事項

從 GitHub Releases 下載的 `.dmg` 尚未通過 Apple 公證（Notarization），macOS 可能顯示「已損毀，無法打開」。

請在安裝後執行以下指令移除隔離屬性：

```bash
xattr -cr /Applications/ai-global.app
```

或在 dmg 掛載後、移入 Applications 前執行：

```bash
xattr -cr /Volumes/ai-global/ai-global.app
```

---

## 系統需求

| 工具 | 版本 | 說明 |
|------|------|------|
| Node.js | ≥ 18 | 前端建置 |
| Rust | stable（≥ 1.75） | Tauri 後端 |
| ai-global | 已安裝並在 `$PATH` | CLI 執行目標 |

### 安裝 Rust（若尚未安裝）

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### 安裝 ai-global（若尚未安裝）

```bash
npm install -g ai-global
```

---

## 安裝相依套件

```bash
cd tauri-gui
npm install
```

---

## 開發模式

```bash
npm run dev
# 等同於 tauri dev，會啟動 Vite dev server + Tauri 視窗
```

> 預設 Vite 監聽 `http://localhost:8001`

---

## 建置正式版

```bash
# 必須在 tauri-gui/ 目錄下執行（非 src-tauri/）
cd tauri-gui
npm run build
# 先建置 Vite 前端，再執行 tauri build
# 產出在 src-tauri/target/release/bundle/
```

macOS 產出位置範例：`src-tauri/target/release/bundle/macos/ai-global.app`

---

## 執行測試

```bash
# 前端型別檢查
npx tsc --noEmit

# 前端單元測試（Vitest）
npm run test:unit

# 前端 E2E 測試（需先安裝 Playwright 瀏覽器）
npm run test:e2e

# Rust 後端單元測試
cd src-tauri
source "$HOME/.cargo/env"
cargo test
```

---

## 專案結構

```
tauri-gui/
├── src/                        # React 前端
│   ├── App.tsx                 # 主應用、分頁與狀態管理
│   ├── components/             # Dashboard、Tools、OutputConsole、ConfirmDialog
│   ├── tauri_client.ts         # invoke 封裝（前後端橋接）
│   ├── tooling.ts              # CLI 輸出解析工具函式
│   ├── types.ts                # 前後端共用 action 型別
│   └── *.test.ts               # Vitest 單元測試
├── src-tauri/                  # Rust 後端
│   ├── src/
│   │   ├── main.rs             # 入口，註冊 Tauri commands
│   │   ├── tauri_commands.rs   # IPC 橋接層
│   │   ├── command_safety.rs   # 輸入驗證、白名單
│   │   ├── command_mapper.rs   # action → CLI 命令映射
│   │   ├── process_runner.rs   # 子行程執行（同步/串流）
│   │   ├── stream_handler.rs   # 串流事件處理
│   │   ├── state_manager.rs    # 執行狀態管理
│   │   └── error_handling.rs   # 錯誤型別
│   ├── capabilities/
│   │   └── default.json        # Tauri 權限設定
│   └── tauri.conf.json         # Tauri 視窗與建置設定
└── package.json
```

---

## 支援命令

| 命令 | 說明 | 執行模式 |
|------|------|----------|
| `status` | 顯示目前安裝狀態 | 同步（完整輸出） |
| `list` | 列出所有已安裝工具 | 同步（完整輸出） |
| `backups` | 列出可用備份 | 同步（完整輸出） |
| `list-skills` | 列出全域 skills | 同步（完整輸出） |
| `list-rules` | 列出全域 rules | 同步（完整輸出） |
| `list-commands` | 列出全域 commands | 同步（完整輸出） |
| `list-agents` | 列出全域 agents | 同步（完整輸出） |
| `relink` | 重建所有 symlink | 同步（完整輸出） |
| `unlink <key\|all>` | 還原指定工具或全部工具 | 同步（完整輸出） |
| `add-skill <user/repo>` | 安裝全域 skill | 同步（完整輸出） |
| `add-rule <user/repo>` | 安裝全域 rule | 同步（完整輸出） |
| `add-command <user/repo>` | 安裝全域 command | 同步（完整輸出） |
| `clean` | 清除快取與暫存檔 | 串流（即時輸出） |
| `upgrade` | 升級所有工具 | 串流（即時輸出） |

`clean` / `upgrade` 採串流模式，輸出透過 Tauri 事件 `stream-event` 即時推送至前端。

`relink`、`clean`、`upgrade`、`unlink` 會在前端先顯示確認對話框，再送出命令。
