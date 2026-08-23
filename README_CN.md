# AI Global

[繁體中文](README.md) · [English](README_EN.md) · 简体中文 · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Fork 自 [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**，感谢原作者的开源贡献。

### 与原版的差异

这个 Fork 默认只使用系统模式，并新增多项功能。

原版根据你在哪个目录执行来切换模式：在 `~` 就是系统模式，其他目录就是项目模式，会在项目目录下创建独立的 `.ai-global/` 配置。这个版本调整为：

- 不再根据执行目录自动切换模式，所有命令默认为全局目录模式
- 保留明确 opt-in 的项目模式：`-p` / `--project`
- 新增 `relink` 命令：重建所有软链
- 新增 `clean` 命令：清理孤立备份
- 新增 `agents/` 子目录支持
- 卸载时保留 `~/.ai-global/` 目录（原版会删除）
- 卸载前会先确认（Y/N）
- 下载资源时加入确认对话与来源追踪（`source.md`）
- 界面语言为繁体中文

需要按项目分开管理 AI 配置时，可在支持的命令加上 `-p` / `--project`。

**AI 编程工具统一配置管理器。**

编辑一个文件，同步到所有 AI 工具。

## 安装

### curl（推荐）

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

### 首次运行

```bash
ai-global
```

不带参数会进入交互式菜单，可选择全局模式或项目模式的常用操作。

若要直接执行原本的扫描、合并、更新 symlink，请使用：

```bash
ai-global update
```

这将会：

1. 扫描已安装的 AI 工具
2. 备份原始配置到 `.ai-global/backups/`
3. 合并检测到的工具的 AGENTS.md/skills/agents/rules/commands
4. 创建从各工具配置到共享目录的软链

注意：AI Global 只会处理已经存在的工具目录，不会帮你创建 `.github`、`.kiro` 这类目录。

### 命令列表

| 命令                                     | 说明                         |
| ---------------------------------------- | ---------------------------- |
| `ai-global`                              | 打开交互式菜单               |
| `ai-global update`                       | 扫描、合并、更新软链         |
| `ai-global status`                       | 显示软链状态                 |
| `ai-global list`                         | 列出支持的工具               |
| `ai-global backups`                      | 列出可用的备份               |
| `ai-global relink`                       | 重建所有软链                 |
| `ai-global unlink <key>`                 | 恢复某个工具的原始配置       |
| `ai-global unlink all`                   | 恢复所有工具                 |
| `ai-global clean`                        | 清理孤立备份                 |
| `ai-global add-skill <user/repo>`        | 添加技能                     |
| `ai-global add-rule <user/repo>`         | 添加规则                     |
| `ai-global add-command <user/repo>`      | 添加命令                     |
| `ai-global render-skills` `ai-global -rs`| 依 v-skills 重建 skills 投影层   |
| `ai-global disable <name>`               | 停用技能（不投影给各工具）       |
| `ai-global enable <name>`                | 解除停用                         |
| `ai-global list-skills` `ai-global -ls`  | 列出全局 skills              |
| `ai-global list-rules` `ai-global -lr`   | 列出全局 rules               |
| `ai-global list-commands` `ai-global -lc`| 列出全局 commands            |
| `ai-global list-agents` `ai-global -la`  | 列出全局 agents              |
| `ai-global upgrade`                      | 升级到最新版本               |
| `ai-global uninstall`                    | 彻底卸载                     |
| `ai-global version`                      | 显示版本号                   |
| `ai-global help`                         | 显示帮助                     |

### 项目模式

`-p` / `--project` 只支持 `update`、`list`、`list-*`、`relink`、`unlink`、`add-*` 命令。使用时会先确认当前目录不是家目录，并询问是否把当前目录视为项目目录。

```bash
ai-global -p list
ai-global -p update
ai-global --project list-skills
ai-global -p relink
ai-global -p unlink codex
ai-global -p add-skill <user/repo>
```

项目模式会使用当前目录下的 `.ai-global/`，不影响 `~/.ai-global/`。

项目模式有独立的工具目录对应，避免直接套用全局配置目录。主要差异：

| 工具 | 项目模式位置 |
| ---- | ------------ |
| Claude Code | `.claude/CLAUDE.md`、`.claude/commands/`、`.claude/skills/`、`.claude/agents/` |
| Codex Skills | `.agents/skills/` |
| Copilot CLI | `.github/copilot-instructions.md`、`.github/instructions/`、`.github/prompts/` |
| Antigravity CLI | `.gemini/GEMINI.md`、`.gemini/.agents/rules/` |
| OpenCode | `.opencode/AGENTS.md`、`.opencode/commands/`、`.opencode/skills/`、`.opencode/agents/` |

### 添加资源

```bash
ai-global add-skill <user/repo>       # 添加技能
ai-global add-rule <user/repo>        # 添加规则
ai-global add-command <user/repo>     # 添加命令
ai-global render-skills               # 重建 skills 投影层
ai-global disable <name>              # 停用技能
ai-global enable <name>               # 解除停用
ai-global list-skills                 # 列出 skills
ai-global list-rules                  # 列出 rules
ai-global list-commands               # 列出 commands
ai-global list-agents                 # 列出 agents
```

支持 `user/repo` 或 `https://github.com/user/repo` 格式，资源将被下载至 `.ai-global/` 对应子目录。

也可使用短命令：`-ls`、`-lr`、`-lc`、`-la`。

## 工作原理

### 目录结构

```
~/.ai-global/
├── AGENTS.md            <- 共享 AGENTS.md（编辑这个）
├── v-skills/            <- 技能实体，多层分类（要编辑就改这里）
│   ├── anthropics/skills/pdf/
│   ├── lazyjerry/mattpocock-skills/engineering/codebase-design/
│   └── manual/my-own-skill/
├── skills/              <- 扁平投影层，各工具读这里（全是 symlink）
│   ├── pdf             -> ../v-skills/anthropics/skills/pdf
│   └── codebase-design -> ../v-skills/lazyjerry/mattpocock-skills/engineering/codebase-design
├── disable-skills.md    <- 停用清单
├── source.md            <- 安装来源记录
├── agents/              <- 共享代理
├── rules/               <- 共享规则
├── commands/            <- 共享斜线命令
└── backups/             <- 原始配置（备份）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (符号链接)
├── skills/   -> ~/.ai-global/skills/          (符号链接)
└── commands/ -> ~/.ai-global/commands/        (符号链接)

~/.agents/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (符号链接)
└── skills/   -> ~/.ai-global/skills/          (符号链接)

... 以及更多工具
```

### 技能分类（v-skills）

各 AI 工具都只扫描 skills 目录的**第一层**，没有一个支持分类子文件夹。所以 AI Global 把技能实体放在 `v-skills/` 做多层分类，再投影成扁平的 symlink 供工具读取。

- **安装路径由来源决定**：`v-skills/<作者>/<repo>/<来源分类>/<技能名>/`，手动放置的则进 `manual/`。**没有修改分类的命令**——路径完全由来源决定才可预测、可重现，`update-skills` 也才对得上；确实需要调整就直接移动 `v-skills/` 下的目录，再运行 `render-skills`
- **要编辑技能就改 `v-skills/` 那份**，`skills/` 下面都是 symlink
- **同名技能可共存于不同分类，但只能有一个启用**，其余用 `disable` 停用
- 手动放进 `v-skills/<任意分类>/` 的技能，运行 `render-skills` 就会被投影出来，不需要安装记录
- `update-skills` 会把还留在 `skills/` 下面的实体技能收拢进 `v-skills/`（会先列出对照清单并要求确认）

停用清单 `disable-skills.md` 一行一个 v-skills 相对路径，`/` 结尾表示整个分类：

```
# 整个分类停用
lazyjerry/mattpocock-skills/in-progress/

# 单个技能
anthropics/skills/pdf
```

停用只影响投影层，实体目录与安装记录都不会被改动。

### 合并行为

运行 `ai-global` 时，会按文件名合并所有工具的内容：

- Codex 有 skills: `react/`, `typescript/`
- Claude 有 skills: `typescript/`, `python/`
- 合并结果: `react/`, `typescript/`, `python/`

**最后找到的优先**（后找到的会覆盖同名文件夹）。

## 支持的工具

| 工具           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |

## 卸载

```bash
ai-global uninstall
```

这将会：

1. 恢复所有工具的原始配置
2. 移除 `ai-global` 命令

注意：`~/.ai-global/` 目录不会被删除，你的配置文件会保留。如需移除请手动删除。

如果通过 npm 安装：

```bash
npm uninstall -g ai-global
```

## 许可证

MIT
