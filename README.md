# AI Global

繁體中文 · [English](README_EN.md) · [简体中文](README_CN.md) · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Fork 自 [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**，感謝原作者的開源貢獻。

### 與原版的差異

這個 Fork 拿掉了專案模式，只留系統模式。

原版根據你在哪個目錄執行來切換模式：在 `~` 就是系統模式，其他目錄就是專案模式，會在專案目錄下建立獨立的 `.ai-global/` 設定。這個版本簡化成：

- 不再區分模式，所有指令直接在當前目錄執行
- 不再把專案路徑寫入 `~/.ai-global/projects`
- 拿掉專案模式的確認提示
- 解除安裝時不會去清理各專案的設定

需要按專案分開管理 AI 設定的話，請用[原版](https://github.com/nanxiaobei/ai-global)。

**AI 程式設計助手統一設定管理器。**

編輯一個檔案，同步到所有 AI 工具。

## 安裝

### curl

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

## 使用方法

### 首次執行

```bash
ai-global
```

這將會：

1. 掃描已安裝的 AI 工具
2. 備份原始設定到 `.ai-global/backups/`
3. 合併偵測到的工具的 AGENTS.md/skills/agents/rules/commands
4. 建立從各工具設定到共享目錄的符號連結

注意：AI Global 只會處理已存在的工具目錄，不會替你建立像 `.github`、`.kiro`、`.cursor` 這類目錄。

### 指令列表

| 指令                        | 說明                             |
| --------------------------- | -------------------------------- |
| `ai-global`                 | 掃描、合併、更新符號連結（預設） |
| `ai-global status`          | 顯示符號連結狀態                 |
| `ai-global list`            | 列出支援的工具                   |
| `ai-global backups`         | 列出可用的備份                   |
| `ai-global unlink <key>`    | 還原某個工具的原始設定           |
| `ai-global unlink all`      | 還原所有工具                     |
| `ai-global add <user/repo>` | 新增技能                         |
| `ai-global upgrade`         | 升級到最新版本                   |
| `ai-global uninstall`       | 完整解除安裝                     |
| `ai-global version`         | 顯示版本號                       |
| `ai-global help`            | 顯示說明                         |

### 新增技能

```bash
ai-global add user/repo
ai-global add https://github.com/user/repo
```

技能將被下載並新增到你的 `.ai-global/skills/` 目錄。

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
| OpenAI Codex   | `codex`       |     ✓     |   ✓   |          |   ✓    |   ✓    |
| Cursor         | `cursor`      |     ✓     |   ✓   |    ✓     |   ✓    |   ✓    |
| Factory Droid  | `droid`       |     ✓     |   ✓   |    ✓     |   ✓    |   ✓    |
| Amp            | `amp`         |     ✓     |   ✓   |    ✓     |   ✓    |        |
| Antigravity    | `antigravity` |     ✓     |       |          |   ✓    |        |
| Gemini CLI     | `gemini`      |     ✓     |       |          |   ✓    |        |
| Kiro CLI       | `kiro`        |     ✓     |   ✓   |          |   ✓    |   ✓    |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Qoder          | `qoder`       |     ✓     |   ✓   |    ✓     |   ✓    |   ✓    |
| Qodo           | `qodo`        |     ✓     |       |          |        |   ✓    |
| GitHub Copilot | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Continue       | `continue`    |     ✓     |   ✓   |          |        |        |
| Windsurf       | `windsurf`    |     ✓     |   ✓   |          |   ✓    |        |
| Roo Code       | `roo`         |     ✓     |   ✓   |    ✓     |   ✓    |        |
| Cline          | `cline`       |     ✓     |   ✓   |          |   ✓    |        |
| Blackbox AI    | `blackbox`    |           |       |          |   ✓    |        |
| Goose AI       | `goose`       |     ✓     |       |          |   ✓    |        |
| Augment        | `augment`     |     ✓     |   ✓   |    ✓     |        |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Command Code   | `commandcode` |     ✓     |       |    ✓     |   ✓    |        |
| Kilo Code      | `kilocode`    |     ✓     |   ✓   |    ✓     |   ✓    |        |
| Neovate        | `neovate`     |     ✓     |       |    ✓     |   ✓    |   ✓    |
| OpenHands      | `openhands`   |     ✓     |       |          |   ✓    |        |
| TRAE           | `trae`        |     ✓     |   ✓   |          |   ✓    |        |
| Zencoder       | `zencoder`    |     ✓     |   ✓   |          |   ✓    |        |
| GitHub         | `github`      |           |       |          |   ✓    |   ✓    |

## 解除安裝

```bash
ai-global uninstall
```

這將會：

1. 還原所有工具的原始設定
2. 刪除 `~/.ai-global` 目錄
3. 移除 `ai-global` 指令

如果透過 npm 安裝：

```bash
ai-global uninstall

npm uninstall -g ai-global
```

## 授權條款

MIT
