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

注意：AI Global 只會處理已存在的工具目錄，不會替你建立像 `.github`、`.kiro` 這類目錄。

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
| `ai-global update-skills`                | 依安裝紀錄重新安裝所有技能       |
| `ai-global remove-skill <user/repo>`     | 移除該 repo 裝的全部技能與安裝紀錄 |
| `ai-global render-skills` `ai-global -rs`| 依 v-skills 重建 skills 投影層   |
| `ai-global disable <name\|分類路徑>`      | 停用單一技能或整個分類（不投影給各工具） |
| `ai-global enable <name\|分類路徑>`       | 解除停用                         |
| `ai-global list-skills` `ai-global -ls`  | 列出全域 skills（分類樹）        |
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
| Copilot CLI | `.github/copilot-instructions.md`、`.github/instructions/`、`.github/prompts/` |
| Antigravity CLI | `.gemini/GEMINI.md`、`.gemini/.agents/rules/` |
| OpenCode | `.opencode/AGENTS.md`、`.opencode/commands/`、`.opencode/skills/`、`.opencode/agents/` |

### 新增資源

```bash
ai-global add-skill <user/repo>       # 新增技能
ai-global add-rule <user/repo>        # 新增規則
ai-global add-command <user/repo>     # 新增指令
ai-global update-skills               # 依安裝紀錄重新安裝所有技能
ai-global remove-skill <user/repo>    # 移除該 repo 裝的全部技能
ai-global render-skills               # 重建 skills 投影層
ai-global disable <name|分類路徑>     # 停用單一技能或整個分類
ai-global enable <name|分類路徑>      # 解除停用
ai-global list-skills                 # 列出 skills（分類樹）
ai-global list-rules                  # 列出 rules
ai-global list-commands               # 列出 commands
ai-global list-agents                 # 列出 agents
```

`add-*` 會將來源記錄在 `.ai-global/source.md`（格式 `GitHub URL|類型|安裝路徑`）。`update-skills` 依此紀錄重新 clone 並覆蓋既有 skill，只更新紀錄中已安裝的項目，不會安裝倉庫後來新增的 skill（那些請用 `add-skill`）。執行前會將原紀錄備份為 `source.md.bak`。本地自建、未經 `add-skill` 安裝的 skill 沒有紀錄，不受影響。

`remove-skill` 與 `add-skill` 對稱，**以 repo 為單位**：接受 `user/repo` 或完整 GitHub 網址，刪掉 `v-skills/<作者>/<repo>/` 底下的全部技能、對應的投影 symlink、該來源的所有安裝紀錄與停用清單規則。同一個 repo 的技能常互相引用（handoff 交給 implement、research 產出給 to-spec），拆開來單獨移除只會留下叫不動的半套，所以不提供移除單一技能的指令——**要停止使用其中某一個請用 `disable`**，實體與安裝紀錄都會保留，隨時 `enable` 回來。

刪除前會列出即將刪除的完整清單與安裝來源供確認。由於各工具的 skills 目錄是整個目錄的 symlink，刪除後所有工具同步生效，不需逐一清理。**刪除不可復原，skills 不在備份機制涵蓋範圍內。**

手動放進 `v-skills/manual/` 的技能沒有 repo 可指定，`remove-skill` 不受理；直接刪掉該目錄再跑 `render-skills` 即可。

支援 `user/repo` 或 `https://github.com/user/repo` 格式，資源將被下載至 `.ai-global/` 對應子目錄。

也可使用短指令：`-ls`、`-lr`、`-lc`、`-la`。

## 運作原理

### 目錄結構

```
~/.ai-global/
├── AGENTS.md            <- 共享 AGENTS.md（編輯這個）
├── v-skills/            <- 技能實體，多層分類（要編輯就改這裡）
│   ├── anthropics/skills/pdf/
│   ├── lazyjerry/mattpocock-skills/engineering/codebase-design/
│   └── manual/my-own-skill/
├── skills/              <- 扁平投影層，各工具讀這裡（全是 symlink）
│   ├── pdf             -> ../v-skills/anthropics/skills/pdf
│   └── codebase-design -> ../v-skills/lazyjerry/mattpocock-skills/engineering/codebase-design
├── disable-skills.md    <- 停用清單
├── source.md            <- 安裝來源紀錄
├── agents/              <- 共享代理
├── rules/               <- 共享規則
├── commands/            <- 共享斜線指令
└── backups/             <- 原始設定（備份）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (符號連結)
├── skills/   -> ~/.ai-global/skills/          (符號連結)
└── commands/ -> ~/.ai-global/commands/        (符號連結)

~/.agents/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (符號連結)
└── skills/   -> ~/.ai-global/skills/          (符號連結)

... 以及更多工具
```

### 技能分類（v-skills）

各 AI 工具都只掃 skills 目錄的**第一層**，沒有一個支援分類子資料夾。所以 AI Global 把技能實體放在 `v-skills/` 做多層分類，再投影成扁平的 symlink 給工具讀。

- **安裝路徑由來源決定**：`v-skills/<作者>/<repo>/<來源分類>/<技能名>/`，手動放的則進 `manual/`。**沒有改分類的指令**——路徑完全由來源決定才可預測、可重現，`update-skills` 也才對得上；真要調整就直接搬 `v-skills/` 底下的目錄，再跑 `render-skills`
- **要編輯技能就改 `v-skills/` 那份**，`skills/` 底下都是 symlink
- **同名技能可共存於不同分類，但只能有一個啟用**，其餘用 `disable` 停用
- 手動丟進 `v-skills/<任意分類>/` 的技能，跑 `render-skills` 就會被投影出來，不需要安裝紀錄
- `update-skills` 會把還留在 `skills/` 底下的實體技能收攏進 `v-skills/`（會先列出對照清單並要求確認）

#### 停用與啟用

`disable` / `enable` 是控制**個別技能**的地方，也吃分類路徑一次處理整組：

```bash
ai-global disable loop-me                              # 單一技能
ai-global disable lazyjerry/mattpocock-skills/in-progress/loop-me   # 同名時用完整路徑
ai-global disable lazyjerry/mattpocock-skills/in-progress           # 整個 bucket
ai-global disable lazyjerry/mattpocock-skills                       # 整個 repo
ai-global enable  lazyjerry/mattpocock-skills                       # 整組復原
```

停用只影響投影層，**實體目錄與 `source.md` 都不會被動到**，隨時 `enable` 回來。這也是「不提供移除單一技能」的配套：要暫時不用某個技能，停用它，而不是刪掉它。

底層是 `disable-skills.md`，一行一個 v-skills 相對路徑，`/` 結尾表示整個分類：

```
# 整個分類停用
lazyjerry/mattpocock-skills/in-progress/

# 個別技能
anthropics/skills/pdf
```

停用整個分類時，底下原有的個別規則會被收掉（分類規則已經涵蓋）；整組 `enable` 則會把該分類的所有規則一次清乾淨。被分類規則命中的技能不能單獨 `enable`，指令會直接告訴你該對哪個分類下 `enable`。

### 合併行為

執行 `ai-global` 時，會按檔案名稱合併所有工具的內容：

- Codex 有 skills: `react/`, `typescript/`
- Claude 有 skills: `typescript/`, `python/`
- 合併結果: `react/`, `typescript/`, `python/`

**最後找到的檔案優先**（後找到的工具會覆蓋同名檔案）。

## 支援的工具

| 工具           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |

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
