# AI Global

[繁體中文](README.md) · English · [简体中文](README_CN.md) · [日本語](README_JP.md) · [한국어](README_KR.md)

---

> **Forked from [nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**. Thanks to the original author for the open-source contribution.

### Differences from upstream

This fork defaults to system mode only and adds several features.

The original version switches between system/project mode based on which directory you run it from: `~` for system mode, anything else for project mode, creating an independent `.ai-global/` config under project directories. This version changes that to:

- No longer auto-switches mode by working directory — all commands default to global directory mode
- Keeps an explicit opt-in project mode: `-p` / `--project`
- Added `relink` command: rebuild all symlinks
- Added `clean` command: clean up orphaned backups
- Added `agents/` subdirectory support
- Uninstall preserves the `~/.ai-global/` directory (upstream deletes it)
- Uninstall asks for confirmation (Y/N) before proceeding
- Resource downloads include a confirmation dialog and source tracking (`source.md`)
- UI language is Traditional Chinese

When you need to manage AI configs per project, add `-p` / `--project` to the supported commands.

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
---

## Usage

### First run

```bash
ai-global
```

Running without arguments opens an interactive menu where you can pick common operations for global mode or project mode.

To directly run the original scan, merge, and symlink update, use:

```bash
ai-global update
```

This will:

1. Scan for installed AI tools
2. Backup original configs to `.ai-global/backups/`
3. Merge AGENTS.md/skills/agents/rules/commands from detected tools
4. Create symlinks from each tool's config to shared directories

Note: AI Global only handles tool directories that already exist. It does not create directories like `.github`, `.kiro`, or `.cursor` for you.

### Commands

| Command                                  | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `ai-global`                              | Open the interactive menu              |
| `ai-global update`                       | Scan, merge, update symlinks           |
| `ai-global status`                       | Show symlinks status                   |
| `ai-global list`                         | List all supported AI tools            |
| `ai-global backups`                      | List available backups                 |
| `ai-global relink`                       | Rebuild all symlinks                   |
| `ai-global unlink <key>`                 | Restore a tool's original config       |
| `ai-global unlink all`                   | Restore all tools                      |
| `ai-global clean`                        | Clean up orphaned backups              |
| `ai-global add-skill <user/repo>`        | Add skills from GitHub repository      |
| `ai-global add-rule <user/repo>`         | Add rules from GitHub repository       |
| `ai-global add-command <user/repo>`      | Add commands from GitHub repository    |
| `ai-global list-skills` `ai-global -ls`  | List global skills                     |
| `ai-global list-rules` `ai-global -lr`   | List global rules                      |
| `ai-global list-commands` `ai-global -lc`| List global commands                   |
| `ai-global list-agents` `ai-global -la`  | List global agents                     |
| `ai-global upgrade`                      | Upgrade to latest version              |
| `ai-global uninstall`                    | Completely remove ai-global            |
| `ai-global version`                      | Show version                           |
| `ai-global help`                         | Show help                              |

### Project mode

`-p` / `--project` only supports the `update`, `list`, `list-*`, `relink`, `unlink`, and `add-*` commands. When used, it first confirms the current directory is not your home directory, then asks whether to treat the current directory as a project directory.

```bash
ai-global -p list
ai-global -p update
ai-global --project list-skills
ai-global -p relink
ai-global -p unlink codex
ai-global -p add-skill <user/repo>
```

Project mode uses the `.ai-global/` under the current directory and does not affect `~/.ai-global/`.

Project mode has its own tool directory mapping to avoid applying the global config directories directly. Main differences:

| Tool | Project mode location |
| ---- | --------------------- |
| Claude Code | `.claude/CLAUDE.md`, `.claude/commands/`, `.claude/skills/`, `.claude/agents/` |
| Codex Skills | `.agents/skills/` |
| Copilot CLI | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/` |
| Cursor | `.cursor/AGENTS.md`, `.cursor/rules/`, `.cursor/commands/`, `.cursor/skills/`, `.cursor/agents/` |
| Antigravity CLI | `.gemini/GEMINI.md`, `.gemini/.agents/rules/`, `.gemini/antigravity/skills/` |
| OpenCode | `.opencode/AGENTS.md`, `.opencode/commands/`, `.opencode/skills/`, `.opencode/agents/` |
| Windsurf | `.windsurf/AGENTS.md`, `.windsurf/rules/`, `.windsurf/skills/` |

### Add resources

```bash
ai-global add-skill <user/repo>       # Add skills
ai-global add-rule <user/repo>        # Add rules
ai-global add-command <user/repo>     # Add commands
ai-global list-skills                 # List skills
ai-global list-rules                  # List rules
ai-global list-commands               # List commands
ai-global list-agents                 # List agents
```

Supports `user/repo` or `https://github.com/user/repo` format. Resources will be downloaded to the corresponding subdirectory under `.ai-global/`.

Short aliases are also available: `-ls`, `-lr`, `-lc`, `-la`.

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
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
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
npm uninstall -g ai-global
```

## License

MIT
