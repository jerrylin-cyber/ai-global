# ai-global GUI

以 [Tauri v2](https://tauri.app) + React 18 打包的桌面 GUI，為 [ai-global](https://github.com/lazyjerry/ai-global) CLI 提供圖形操作介面，支援 5 個核心命令：`status`、`list`、`relink`、`clean`、`upgrade`。

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

macOS 產出位置範例：`src-tauri/target/release/bundle/macos/ai-global GUI.app`

---

## 執行測試

```bash
# 前端單元測試（Vitest）
npm run test:unit

# Rust 後端單元測試
cd src-tauri
source "$HOME/.cargo/env"
cargo test
```

---

## 專案結構

```
tauri-gui/
├── src/                    # React 前端
│   ├── App.tsx             # 主應用、狀態管理
│   ├── tauri_client.ts     # invoke 封裝（前後端橋接）
│   ├── tooling.ts          # 輸出解析工具函式
│   └── *.test.ts           # Vitest 單元測試
├── src-tauri/              # Rust 後端
│   ├── src/
│   │   ├── main.rs         # 入口，註冊 Tauri commands
│   │   ├── tauri_commands.rs   # IPC 橋接層
│   │   ├── command_safety.rs   # 輸入驗證、白名單
│   │   ├── command_mapper.rs   # action → CLI 命令映射
│   │   ├── process_runner.rs   # 子行程執行（同步/串流）
│   │   ├── stream_handler.rs   # 串流事件處理
│   │   ├── state_manager.rs    # 執行狀態管理
│   │   └── error_handling.rs   # 錯誤型別
│   ├── capabilities/
│   │   └── default.json    # Tauri 權限設定
│   └── tauri.conf.json     # Tauri 建置設定
└── package.json
```

---

## 支援命令

| 命令 | 說明 | 執行模式 |
|------|------|----------|
| `status` | 顯示目前安裝狀態 | 同步（完整輸出） |
| `list` | 列出所有已安裝工具 | 同步（完整輸出） |
| `relink` | 重建所有 symlink | 同步（完整輸出） |
| `clean` | 清除快取與暫存檔 | 串流（即時輸出） |
| `upgrade` | 升級所有工具 | 串流（即時輸出） |

`clean` / `upgrade` 採串流模式，輸出透過 Tauri 事件 `stream-event` 即時推送至前端。
