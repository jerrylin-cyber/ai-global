# AI Global

[繁體中文](README.md) · English · [简体中文](README_CN.md) · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Forked from [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**. Thanks to the original author for the open-source contribution.

### Differences from upstream

This fork removes project mode, keeps only system mode, and adds several features.

The original version switches between system/project mode based on which directory you run it from: `~` for system mode, anything else for project mode, creating an independent `.ai-global/` config under project directories. This version simplifies it to:

- No more mode distinction — all commands run in global directory mode
- Removed project mode
- Added `relink` command: rebuild all symlinks
- Added `clean` command: clean up orphaned backups
- Added `agents/` subdirectory support
- Uninstall preserves `~/.ai-global/` directory (upstream deletes it)
- Uninstall asks for confirmation (Y/N) before proceeding
- Resource downloads include confirmation dialog and source tracking (`source.md`)
- UI language is Traditional Chinese

If you need per-project AI configs, use the [upstream version](https://github.com/nanxiaobei/ai-global).

**Unified Configuration Manager for AI Coding Tools.**

Edit one file, sync to all your AI tools.

## Installation

### curl (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/lazyjerry/ai-global/main/install.sh | bash
```

### npm

```bash
npm install -g ai-global
# or
pnpm add -g ai-global
# or
yarn global add ai-global
# or
bun add -g ai-global
```

## Usage

### First run

```bash
ai-global
```

This will:

1. Scan for installed AI tools
2. Backup original configs to `.ai-global/backups/`
3. Merge AGENTS.md/skills/agents/rules/commands from detected tools
4. Create symlinks from each tool's config to shared directories

Note: AI Global only handles tool directories that already exist. It does not create directories like `.github`, `.kiro`, or `.cursor` for you.

## Commands

| Command                             | Description                            |
| ----------------------------------- | -------------------------------------- |
| `ai-global`                         | Scan, merge, update symlinks (default) |
| `ai-global status`                  | Show symlinks status                   |
| `ai-global list`                    | List all supported AI tools            |
| `ai-global backups`                 | List available backups                 |
| `ai-global relink`                  | Rebuild all symlinks                   |
| `ai-global unlink <key>`            | Restore a tool's original config       |
| `ai-global unlink all`              | Restore all tools                      |
| `ai-global clean`                   | Clean up orphaned backups              |
| `ai-global add-skill <user/repo>`   | Add skills from GitHub repository      |
| `ai-global add-rule <user/repo>`    | Add rules from GitHub repository       |
| `ai-global add-command <user/repo>` | Add commands from GitHub repository    |
| `ai-global upgrade`                 | Upgrade to latest version              |
| `ai-global uninstall`               | Completely remove ai-global            |
| `ai-global version`                 | Show version                           |
| `ai-global help`                    | Show help                              |

### Add resources

```bash
ai-global add-skill <user/repo>       # Add skills
ai-global add-rule <user/repo>        # Add rules
ai-global add-command <user/repo>     # Add commands
```

Supports `user/repo` or `https://github.com/user/repo` format. Resources will be downloaded to the corresponding subdirectory under `.ai-global/`.

## How it works

### Directory Structure

```
~/.ai-global/
├── AGENTS.md        <- Shared AGENTS.md (edit this)
├── skills/          <- Shared skills (merged from all tools)
├── agents/          <- Shared agents
├── rules/           <- Shared rules
├── commands/        <- Shared slash commands
└── backups/         <- Original configs (backups)

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (symlink)
├── skills/   -> ~/.ai-global/skills/          (symlink)
└── commands/ -> ~/.ai-global/commands/        (symlink)

~/.cursor/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (symlink)
└── skills/   -> ~/.ai-global/skills/          (symlink)

... and more tools
```

### Merge behavior

When you run `ai-global`, it merges items from all tools by filename:

- Cursor has skills: `react/`, `typescript/`
- Claude has skills: `typescript/`, `python/`
- Result in `.ai-global/skills/`: `react/`, `typescript/`, `python/`

**Last file wins** (later tools overwrite earlier tools with same filename).

## Supported Tools

| Tool           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
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

## Uninstall

```bash
ai-global uninstall
```

This will:

1. Restore all tools to their original configuration
2. Remove the `ai-global` command

Note: The `~/.ai-global/` directory is preserved — your config files remain intact. Remove it manually if needed.

If installed via npm:

```bash
ai-global uninstall

npm uninstall -g ai-global
```

## License

MIT
