# AI Global

繁體中文 · [English](README_EN.md) · [简体中文](README_CN.md) · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Fork 自 [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**，感謝原作者的開源貢獻。

### 與原版的差異

這個 Fork 預設只使用系統模式，並新增多項功能。

原版根據你在哪個目錄執行來切換模式：在 `~` 就是系統模式，其他目錄就是專案模式，會在專案目錄下建立獨立的 `.ai-global/` 設定。這個版本調整：

- 不再依執行目錄自動切換模式，所有指令預設為全域目錄模式
- 保留明確 opt-in 的專案模式：`-p` / `--project`
- 新增 `relink` 指令：重建所有符號連結
- 新增 `clean` 指令：清理孤立備份
- 新增 `agents/` 子目錄支援
- 解除安裝時保留 `~/.ai-global/` 資料夾（原版會刪除）
- 解除安裝前會先確認（Y/N）
- 下載資源時加入確認對話與來源追蹤（`source.md`）
- 介面語言為繁體中文

需要按專案分開管理 AI 設定時，可在支援的指令加上 `-p` / `--project`。

**AI 程式設計助手統一設定管理器。**

編輯一個檔案，同步到所有 AI 工具。

## 安裝

### curl （推薦）

```bash
curl -fsSL https://raw.githubusercontent.com/lazyjerry/ai-global/main/install.sh | bash
```

### npm

```bash
npm install -g ai-global
# 或
pnpm add -g ai-global
# 或
yarn global add ai-global
# 或
bun add -g ai-global
```
---

## 使用方法

### 首次執行

```bash
ai-global
```

不帶參數會進入互動式選單，可選擇全域模式或專案模式的常用操作。

若要直接執行原本的掃描、合併、更新 symlink，請使用：

```bash
ai-global update
```

這將會：

1. 掃描已安裝的 AI 工具
2. 備份原始設定到 `.ai-global/backups/`
3. 合併偵測到的工具的 AGENTS.md/skills/agents/rules/commands
4. 建立從各工具設定到共享目錄的符號連結

注意：AI Global 只會處理已存在的工具目錄，不會替你建立像 `.github`、`.kiro`、`.cursor` 這類目錄。

### 指令列表

| 指令                                     | 說明                             |
| ---------------------------------------- | -------------------------------- |
| `ai-global`                              | 開啟互動式選單                   |
| `ai-global update`                       | 掃描、合併、更新符號連結         |
| `ai-global status`                       | 顯示符號連結狀態                 |
| `ai-global list`                         | 列出支援的工具                   |
| `ai-global backups`                      | 列出可用的備份                   |
| `ai-global relink`                       | 重建所有符號連結                 |
| `ai-global unlink <key>`                 | 還原某個工具的原始設定           |
| `ai-global unlink all`                   | 還原所有工具                     |
| `ai-global clean`                        | 清理孤立備份                     |
| `ai-global add-skill <user/repo>`        | 新增技能                         |
| `ai-global add-rule <user/repo>`         | 新增規則                         |
| `ai-global add-command <user/repo>`      | 新增指令                         |
| `ai-global list-skills` `ai-global -ls`  | 列出全域 skills                  |
| `ai-global list-rules` `ai-global -lr`   | 列出全域 rules                   |
| `ai-global list-commands` `ai-global -lc`| 列出全域 commands                |
| `ai-global list-agents` `ai-global -la`  | 列出全域 agents                  |
| `ai-global upgrade`                      | 升級到最新版本                   |
| `ai-global uninstall`                    | 完整解除安裝                     |
| `ai-global version`                      | 顯示版本號                       |
| `ai-global help`                         | 顯示說明                         |

### 專案模式

`-p` / `--project` 只支援 `update`、`list`、`list-*`、`relink`、`unlink`、`add-*` 指令。使用時會先確認目前目錄不是家目錄，並詢問是否把目前目錄視為專案目錄。

```bash
ai-global -p list
ai-global -p update
ai-global --project list-skills
ai-global -p relink
ai-global -p unlink codex
ai-global -p add-skill <user/repo>
```

專案模式會使用目前目錄下的 `.ai-global/`，不影響 `~/.ai-global/`。

專案模式有獨立的工具目錄對應，避免直接套用全域設定目錄。主要差異：

| 工具 | 專案模式位置 |
| ---- | ------------ |
| Claude Code | `.claude/CLAUDE.md`、`.claude/commands/`、`.claude/skills/`、`.claude/agents/` |
| Codex Skills | `.agents/skills/` |
| Codex CLI | `.codex/agents/` |
| Copilot CLI | `.github/copilot-instructions.md`、`.github/instructions/`、`.github/prompts/` |
| Cursor | `.cursor/AGENTS.md`、`.cursor/rules/`、`.cursor/commands/`、`.cursor/skills/`、`.cursor/agents/` |
| Antigravity CLI | `.gemini/GEMINI.md`、`.gemini/.agents/rules/`、`.gemini/antigravity/skills/` |
| OpenCode | `.opencode/AGENTS.md`、`.opencode/commands/`、`.opencode/skills/`、`.opencode/agents/` |
| Windsurf | `.windsurf/AGENTS.md`、`.windsurf/rules/`、`.windsurf/skills/` |

### 新增資源

```bash
ai-global add-skill <user/repo>       # 新增技能
ai-global add-rule <user/repo>        # 新增規則
ai-global add-command <user/repo>     # 新增指令
ai-global list-skills                 # 列出 skills
ai-global list-rules                  # 列出 rules
ai-global list-commands               # 列出 commands
ai-global list-agents                 # 列出 agents
```

支援 `user/repo` 或 `https://github.com/user/repo` 格式，資源將被下載至 `.ai-global/` 對應子目錄。

也可使用短指令：`-ls`、`-lr`、`-lc`、`-la`。

## 運作原理

### 目錄結構

```
~/.ai-global/
├── AGENTS.md        <- 共享 AGENTS.md（編輯這個）
├── skills/          <- 共享技能（從所有工具合併）
├── agents/          <- 共享代理
├── rules/           <- 共享規則
├── commands/        <- 共享斜線指令
└── backups/         <- 原始設定（備份）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (符號連結)
├── skills/   -> ~/.ai-global/skills/          (符號連結)
└── commands/ -> ~/.ai-global/commands/        (符號連結)

~/.cursor/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (符號連結)
└── skills/   -> ~/.ai-global/skills/          (符號連結)

... 以及更多工具
```

### 合併行為

執行 `ai-global` 時，會按檔案名稱合併所有工具的內容：

- Cursor 有 skills: `react/`, `typescript/`
- Claude 有 skills: `typescript/`, `python/`
- 合併結果 `.ai-global/skills/`: `react/`, `typescript/`, `python/`

**最後找到的檔案優先**（後找到的工具會覆蓋同名檔案）。

## 支援的工具

| 工具           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Cursor         | `cursor`      |     ✓     |   ✓   |    ✓     |   ✓    |   ✓    |
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Windsurf       | `windsurf`    |     ✓     |   ✓   |          |   ✓    |        |

## 解除安裝

```bash
ai-global uninstall
```

這將會：

1. 還原所有工具的原始設定
2. 移除 `ai-global` 指令

注意：`~/.ai-global/` 資料夾不會被刪除，你的設定檔會保留。如需移除請手動刪除。

如果透過 npm 安裝：

```bash
npm uninstall -g ai-global
```

## 授權條款

MIT
