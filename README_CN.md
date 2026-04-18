# AI Global

[繁體中文](README.md) · [English](README_EN.md) · 简体中文 · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Fork 自 [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**，感谢原作者的开源贡献。

### 与原版的差异

这个 Fork 去掉了项目模式，只保留系统模式，并新增多项功能。

原版根据你在哪个目录执行来切换模式：在 `~` 就是系统模式，其他目录就是项目模式，会在项目目录下创建独立的 `.ai-global/` 配置。这个版本简化成：

- 不再区分模式，所有命令为全局目录模式
- 去掉项目模式
- 新增 `relink` 命令：重建所有软链
- 新增 `clean` 命令：清理孤立备份
- 新增 `agents/` 子目录支持
- 卸载时保留 `~/.ai-global/` 目录（原版会删除）
- 卸载前会先确认（Y/N）
- 下载资源时加入确认对话与来源追踪（`source.md`）
- 界面语言为繁体中文

需要按项目分开管理 AI 配置的话，请用[原版](https://github.com/nanxiaobei/ai-global)。

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

## 使用方法

### 首次运行

```bash
ai-global
```

这将会：

1. 扫描已安装的 AI 工具
2. 备份原始配置到 `.ai-global/backups/`
3. 合并检测到的工具的 AGENTS.md/skills/agents/rules/commands
4. 创建从各工具配置到共享目录的软链

注意：AI Global 只会处理已经存在的工具目录，不会帮你创建 `.github`、`.kiro`、`.cursor` 这类目录。

### 命令列表

| 命令                                | 说明                         |
| ----------------------------------- | ---------------------------- |
| `ai-global`                         | 扫描、合并、更新软链（默认） |
| `ai-global status`                  | 显示软链状态                 |
| `ai-global list`                    | 列出支持的工具               |
| `ai-global backups`                 | 列出可用的备份               |
| `ai-global relink`                  | 重建所有软链                 |
| `ai-global unlink <key>`            | 恢复某个工具的原始配置       |
| `ai-global unlink all`              | 恢复所有工具                 |
| `ai-global clean`                   | 清理孤立备份                 |
| `ai-global add-skill <user/repo>`   | 添加技能                     |
| `ai-global add-rule <user/repo>`    | 添加规则                     |
| `ai-global add-command <user/repo>` | 添加命令                     |
| `ai-global upgrade`                 | 升级到最新版本               |
| `ai-global uninstall`               | 彻底卸载                     |
| `ai-global version`                 | 显示版本号                   |
| `ai-global help`                    | 显示帮助                     |

### 添加资源

```bash
ai-global add-skill <user/repo>       # 添加技能
ai-global add-rule <user/repo>        # 添加规则
ai-global add-command <user/repo>     # 添加命令
```

支持 `user/repo` 或 `https://github.com/user/repo` 格式，资源将被下载至 `.ai-global/` 对应子目录。

## 工作原理

### 目录结构

```
~/.ai-global/
├── AGENTS.md        <- 共享 AGENTS.md（编辑这个）
├── skills/          <- 共享技能（从所有工具合并）
├── agents/          <- 共享代理
├── rules/           <- 共享规则
├── commands/        <- 共享斜杠命令
└── backups/         <- 原始配置（备份）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (软链)
├── skills/   -> ~/.ai-global/skills/          (软链)
└── commands/ -> ~/.ai-global/commands/        (软链)

~/.cursor/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (软链)
└── skills/   -> ~/.ai-global/skills/          (软链)

... 以及更多工具
```

### 合并行为

运行 `ai-global` 时，会按文件名合并所有工具的内容：

- Cursor 有 skills: `react/`, `typescript/`
- Claude 有 skills: `typescript/`, `python/`
- 合并结果 `.ai-global/skills/`: `react/`, `typescript/`, `python/`

**最后找到的优先**（后找到的会覆盖同名文件夹）。

## 支持的工具

| 工具           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Cursor         | `cursor`      |     ✓     |   ✓   |    ✓     |   ✓    |   ✓    |
| Antigravity    | `antigravity` |     ✓     |       |          |   ✓    |        |
| Gemini CLI     | `gemini`      |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Windsurf       | `windsurf`    |     ✓     |   ✓   |          |   ✓    |        |

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
ai-global uninstall

npm uninstall -g ai-global
```

## 许可证

MIT
