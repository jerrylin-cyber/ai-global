# AI Global

[繁體中文](README.md) · [English](README_EN.md) · [简体中文](README_CN.md) · 日本語 · [한국어](README_KR.md)

---

> **[nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)** からフォークしました。オリジナル作者のオープンソース貢献に感謝します。

### オリジナル版との違い

このフォークはデフォルトでシステムモードのみを使用し、複数の機能を追加しています。

オリジナル版は実行ディレクトリに応じてモードを切り替えます。`~` ではシステムモード、それ以外ではプロジェクトモードとなり、プロジェクトディレクトリに独立した `.ai-global/` 設定を作成します。このバージョンでは以下のように変更しました：

- 実行ディレクトリによる自動モード切り替えを廃止し、すべてのコマンドはデフォルトでグローバルディレクトリモードになります
- 明示的にオプトインするプロジェクトモードを維持：`-p` / `--project`
- `relink` コマンドを追加：すべてのシンボリックリンクを再構築
- `clean` コマンドを追加：孤立したバックアップをクリーンアップ
- `agents/` サブディレクトリのサポートを追加
- アンインストール時に `~/.ai-global/` ディレクトリを保持（オリジナル版は削除します）
- アンインストール前に確認（Y/N）を求めます
- リソースダウンロード時に確認ダイアログとソース追跡（`source.md`）を追加
- UI 言語は繁体字中国語

プロジェクトごとに AI 設定を分けて管理したい場合は、対応するコマンドに `-p` / `--project` を付けてください。

**AI プログラミングアシスタント統合設定管理ツールです。**

1つのファイルを編集して、すべての AI ツールに同期します。

## インストール

### curl（推奨）

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
---

## 使い方

### 初回実行

```bash
ai-global
```

引数なしで実行すると対話式メニューが開き、グローバルモードまたはプロジェクトモードの一般的な操作を選択できます。

元のスキャン、マージ、シンボリックリンク更新を直接実行するには、次を使用します：

```bash
ai-global update
```

これにより：

1. インストールされている AI ツールをスキャン
2. 元の設定を `.ai-global/backups/` にバックアップ
3. 検出されたツールの AGENTS.md/skills/agents/rules/commands をマージ
4. 各ツールの設定から共有ディレクトリへのシンボリックリンクを作成

注意：AI Global が処理するのは、すでに存在するツールディレクトリだけです。`.github`、`.kiro` のようなディレクトリは自動作成されません。

### コマンド一覧

| コマンド                                 | 説明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `ai-global`                              | 対話式メニューを開く                                 |
| `ai-global update`                       | スキャン、マージ、シンボリックリンク更新             |
| `ai-global status`                       | シンボリックリンクの状態を表示                       |
| `ai-global list`                         | サポートされているツールを一覧表示                   |
| `ai-global backups`                      | 利用可能なバックアップを一覧表示                     |
| `ai-global relink`                       | すべてのシンボリックリンクを再構築                   |
| `ai-global unlink <key>`                 | 特定のツールの元の設定を復元                         |
| `ai-global unlink all`                   | すべてのツールを復元                                 |
| `ai-global clean`                        | 孤立したバックアップをクリーンアップ                 |
| `ai-global add-skill <user/repo>`        | スキルを追加                                         |
| `ai-global add-rule <user/repo>`         | ルールを追加                                         |
| `ai-global add-command <user/repo>`      | コマンドを追加                                       |
| `ai-global render-skills` `ai-global -rs`| v-skills から skills 投影層を再構築 |
| `ai-global disable <name>`               | スキルを無効化（各ツールへ投影しない） |
| `ai-global enable <name>`                | 無効化を解除                     |
| `ai-global list-skills` `ai-global -ls`  | グローバル skills を一覧表示                         |
| `ai-global list-rules` `ai-global -lr`   | グローバル rules を一覧表示                          |
| `ai-global list-commands` `ai-global -lc`| グローバル commands を一覧表示                       |
| `ai-global list-agents` `ai-global -la`  | グローバル agents を一覧表示                         |
| `ai-global upgrade`                      | 最新バージョンにアップグレード                       |
| `ai-global uninstall`                    | 完全にアンインストール                               |
| `ai-global version`                      | バージョン番号を表示                                 |
| `ai-global help`                         | ヘルプを表示                                         |

### プロジェクトモード

`-p` / `--project` は `update`、`list`、`list-*`、`relink`、`unlink`、`add-*` コマンドのみをサポートします。使用時は、まず現在のディレクトリがホームディレクトリでないことを確認し、現在のディレクトリをプロジェクトディレクトリとして扱うかどうかを尋ねます。

```bash
ai-global -p list
ai-global -p update
ai-global --project list-skills
ai-global -p relink
ai-global -p unlink codex
ai-global -p add-skill <user/repo>
```

プロジェクトモードは現在のディレクトリ下の `.ai-global/` を使用し、`~/.ai-global/` には影響しません。

プロジェクトモードはグローバル設定ディレクトリをそのまま適用しないよう、独自のツールディレクトリ対応を持ちます。主な違い：

| ツール | プロジェクトモードの場所 |
| ---- | ------------ |
| Claude Code | `.claude/CLAUDE.md`、`.claude/commands/`、`.claude/skills/`、`.claude/agents/` |
| Codex Skills | `.agents/skills/` |
| Copilot CLI | `.github/copilot-instructions.md`、`.github/instructions/`、`.github/prompts/` |
| Antigravity CLI | `.gemini/GEMINI.md`、`.gemini/.agents/rules/` |
| OpenCode | `.opencode/AGENTS.md`、`.opencode/commands/`、`.opencode/skills/`、`.opencode/agents/` |

### リソースを追加

```bash
ai-global add-skill <user/repo>       # スキルを追加
ai-global add-rule <user/repo>        # ルールを追加
ai-global add-command <user/repo>     # コマンドを追加
ai-global render-skills               # skills 投影層を再構築
ai-global disable <name>              # スキルを無効化
ai-global enable <name>               # 無効化を解除
ai-global list-skills                 # skills を一覧表示
ai-global list-rules                  # rules を一覧表示
ai-global list-commands               # commands を一覧表示
ai-global list-agents                 # agents を一覧表示
```

`user/repo` または `https://github.com/user/repo` 形式をサポートしています。リソースは `.ai-global/` の対応するサブディレクトリにダウンロードされます。

短縮エイリアスも利用できます：`-ls`、`-lr`、`-lc`、`-la`。

## 動作原理

### ディレクトリ構造

```
~/.ai-global/
├── AGENTS.md            <- 共有 AGENTS.md（これを編集）
├── v-skills/            <- スキル実体、多層分類（編集はこちら）
│   ├── anthropics/skills/pdf/
│   ├── lazyjerry/mattpocock-skills/engineering/codebase-design/
│   └── manual/my-own-skill/
├── skills/              <- フラットな投影層、各ツールはここを読む（すべて symlink）
│   ├── pdf             -> ../v-skills/anthropics/skills/pdf
│   └── codebase-design -> ../v-skills/lazyjerry/mattpocock-skills/engineering/codebase-design
├── disable-skills.md    <- 無効化リスト
├── source.md            <- インストール元の記録
├── agents/              <- 共有エージェント
├── rules/               <- 共有ルール
├── commands/            <- 共有スラッシュコマンド
└── backups/             <- 元の設定（バックアップ）

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (シンボリックリンク)
├── skills/   -> ~/.ai-global/skills/          (シンボリックリンク)
└── commands/ -> ~/.ai-global/commands/        (シンボリックリンク)

~/.agents/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (シンボリックリンク)
└── skills/   -> ~/.ai-global/skills/          (シンボリックリンク)

... その他のツール
```

### スキルの分類（v-skills）

各 AI ツールは skills ディレクトリの**第一階層しか**スキャンせず、分類サブフォルダに対応しているものはありません。そのため AI Global はスキル実体を `v-skills/` に多層分類で置き、フラットな symlink として各ツールに投影します。

- **インストール先は取得元から決まります**：`v-skills/<作者>/<repo>/<取得元の分類>/<スキル名>/`、手動で置いたものは `manual/` へ。**分類を変更するコマンドはありません**——パスを取得元だけから決めることで予測可能・再現可能になり、`update-skills` も正しい場所を指し続けます。並べ替えたい場合は `v-skills/` 配下のディレクトリを自分で移動し、`render-skills` を実行してください
- **スキルの編集は `v-skills/` 側で**。`skills/` 配下はすべて symlink です
- **同名スキルは別々の分類に共存できますが、有効にできるのは 1 つだけ**。残りは `disable` で無効化してください
- `v-skills/<任意の分類>/` に手動で置いたスキルは `render-skills` で投影されます。インストール記録は不要です
- `update-skills` は `skills/` 直下に残っている実体スキルを `v-skills/` へ取り込みます（対応表を表示して確認を求めます）

無効化リスト `disable-skills.md` は 1 行 1 つの v-skills 相対パス。末尾が `/` なら分類全体が対象です：

```
# 分類全体を無効化
lazyjerry/mattpocock-skills/in-progress/

# 個別のスキル
anthropics/skills/pdf
```

無効化は投影層にのみ影響し、実体ディレクトリとインストール記録は変更されません。

### マージ動作

`ai-global` を実行すると、ファイル名に基づいてすべてのツールの内容をマージします：

- Codex のスキル: `react/`, `typescript/`
- Claude のスキル: `typescript/`, `python/`
- マージ結果: `react/`, `typescript/`, `python/`

**最後に見つかったファイルが優先されます**（後のツールが同名ファイルを上書きします）。

## サポートされているツール

| ツール         | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |

## アンインストール

```bash
ai-global uninstall
```

これにより：

1. すべてのツールの元の設定を復元
2. `ai-global` コマンドを削除

注意：`~/.ai-global/` ディレクトリは削除されません。設定ファイルはそのまま残ります。必要に応じて手動で削除してください。

npm でインストールした場合：

```bash
npm uninstall -g ai-global
```

## ライセンス

MIT
