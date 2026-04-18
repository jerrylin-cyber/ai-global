# AI Global

[繁體中文](README.md) · [English](README_EN.md) · [简体中文](README_CN.md) · 日本語 · [한국어](README_KR.md)

---

> **[nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)** からフォークしました。オリジナル作者のオープンソース貢献に感謝します。

### オリジナル版との違い

このフォークはプロジェクトモードを削除し、システムモードのみを残しています。

オリジナル版は実行ディレクトリに応じてモードを切り替えます。`~` ではシステムモード、それ以外ではプロジェクトモードとなり、プロジェクトディレクトリに独立した `.ai-global/` 設定を作成します。このバージョンでは以下のように簡素化しました：

- モードの区別を廃止し、すべてのコマンドは現在のディレクトリで直接実行されます
- プロジェクトパスを `~/.ai-global/projects` に書き込まなくなりました
- プロジェクトモードの確認プロンプトを削除しました
- アンインストール時に各プロジェクトの設定をクリーンアップしなくなりました

プロジェクトごとに AI 設定を分けたい場合は、[オリジナル版](https://github.com/nanxiaobei/ai-global)をご利用ください。

**AI プログラミングアシスタント統合設定管理ツールです。**

1つのファイルを編集して、すべての AI ツールに同期します。

## インストール

### curl

```bash
curl -fsSL https://raw.githubusercontent.com/lazyjerry/ai-global/main/install.sh | bash
```

### npm

```bash
npm install -g ai-global
# または
pnpm add -g ai-global
# または
yarn global add ai-global
# または
bun add -g ai-global
```

## 使い方

### 初回実行

```bash
ai-global
```

これにより：

1. インストールされている AI ツールをスキャン
2. 元の設定を `.ai-global/backups/` にバックアップ
3. 検出されたツールの AGENTS.md/skills/agents/rules/commands をマージ
4. 各ツールの設定から共有ディレクトリへのシンボリックリンクを作成

注意：AI Global が処理するのは、すでに存在するツールディレクトリだけです。`.github`、`.kiro`、`.cursor` のようなディレクトリは自動作成されません。

### コマンド一覧

| コマンド                            | 説明                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `ai-global`                         | スキャン、マージ、シンボリックリンク更新（デフォルト） |
| `ai-global status`                  | シンボリックリンクの状態を表示                       |
| `ai-global list`                    | サポートされているツールを一覧表示                   |
| `ai-global backups`                 | 利用可能なバックアップを一覧表示                     |
| `ai-global unlink <key>`            | 特定のツールの元の設定を復元                         |
| `ai-global unlink all`              | すべてのツールを復元                                 |
| `ai-global add-skill <user/repo>`   | スキルを追加                                         |
| `ai-global add-rule <user/repo>`    | ルールを追加                                         |
| `ai-global add-command <user/repo>` | コマンドを追加                                       |
| `ai-global upgrade`                 | 最新バージョンにアップグレード                       |
| `ai-global uninstall`               | 完全にアンインストール                               |
| `ai-global version`                 | バージョン番号を表示                                 |
| `ai-global help`                    | ヘルプを表示                                         |

### リソースを追加

```bash
ai-global add-skill <user/repo>       # スキルを追加
ai-global add-rule <user/repo>        # ルールを追加
ai-global add-command <user/repo>     # コマンドを追加
```

`user/repo` または `https://github.com/user/repo` 形式をサポートしています。リソースは `.ai-global/` の対応するサブディレクトリにダウンロードされます。

## 動作原理

### ディレクトリ構造

```
~/.ai-global/
├── AGENTS.md        <- 共有 AGENTS.md（これを編集）
├── skills/          <- 共有スキル（すべてのツールからマージ）
├── agents/          <- 共有エージェント
├── rules/           <- 共有ルール
├── commands/        <- 共有スラッシュコマンド
└── backups/         <- 元の設定（バックアップ）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (シンボリックリンク)
├── skills/   -> ~/.ai-global/skills/          (シンボリックリンク)
└── commands/ -> ~/.ai-global/commands/        (シンボリックリンク)

~/.cursor/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (シンボリックリンク)
└── skills/   -> ~/.ai-global/skills/          (シンボリックリンク)

... その他のツール
```

### マージ動作

`ai-global` を実行すると、ファイル名に基づいてすべてのツールの内容をマージします：

- Cursor のスキル: `react/`, `typescript/`
- Claude のスキル: `typescript/`, `python/`
- マージ結果 `.ai-global/skills/`: `react/`, `typescript/`, `python/`

**最後に見つかったファイルが優先されます**（後のツールが同名ファイルを上書きします）。

## サポートされているツール

| ツール         | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
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
| Command Code   | `commandcode` |     ✓     |       |          |   ✓    |        |
| Kilo Code      | `kilocode`    |     ✓     |   ✓   |    ✓     |   ✓    |        |
| Neovate        | `neovate`     |     ✓     |       |    ✓     |   ✓    |   ✓    |
| OpenHands      | `openhands`   |     ✓     |       |          |   ✓    |        |
| TRAE           | `trae`        |     ✓     |   ✓   |          |   ✓    |        |
| Zencoder       | `zencoder`    |     ✓     |   ✓   |          |   ✓    |        |
| GitHub         | `github`      |     ✓     |       |          |   ✓    |   ✓    |

## アンインストール

```bash
ai-global uninstall
```

これにより：

1. すべてのツールの元の設定を復元
2. `~/.ai-global` ディレクトリを削除
3. `ai-global` コマンドを削除

npm でインストールした場合：

```bash
ai-global uninstall

npm uninstall -g ai-global
```

## ライセンス

MIT
