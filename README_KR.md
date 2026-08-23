# AI Global

[繁體中文](README.md) · [English](README_EN.md) · [简体中文](README_CN.md) · [日本語](README_JP.md) · 한국어

---

> **[nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**에서 포크되었습니다. 원작자의 오픈소스 기여에 감사드립니다.

### 원본과의 차이점

이 포크는 기본적으로 시스템 모드만 사용하며, 여러 기능을 추가했습니다.

원본은 실행 디렉토리에 따라 모드를 전환합니다. `~`에서는 시스템 모드, 그 외에는 프로젝트 모드로 동작하며, 프로젝트 디렉토리에 독립적인 `.ai-global/` 설정을 생성합니다. 이 버전은 다음과 같이 변경했습니다:

- 실행 디렉토리에 따른 자동 모드 전환을 없애고, 모든 명령어가 기본적으로 글로벌 디렉토리 모드로 실행됩니다
- 명시적으로 옵트인하는 프로젝트 모드를 유지: `-p` / `--project`
- `relink` 명령어 추가: 모든 심볼릭 링크 재구성
- `clean` 명령어 추가: 고아 백업 정리
- `agents/` 하위 디렉토리 지원 추가
- 제거 시 `~/.ai-global/` 디렉토리 보존 (원본은 삭제함)
- 제거 전 확인(Y/N) 요청
- 리소스 다운로드 시 확인 대화 및 소스 추적(`source.md`) 추가
- UI 언어는 번체 중국어

프로젝트별로 AI 설정을 분리해 관리해야 하는 경우, 지원되는 명령어에 `-p` / `--project`를 추가하세요.

**AI 프로그래밍 어시스턴트 통합 설정 관리 도구입니다.**

하나의 파일을 편집하여 모든 AI 도구에 동기화하세요.

## 설치

### curl (추천)

```bash
curl -fsSL https://raw.githubusercontent.com/lazyjerry/ai-global/main/install.sh | bash
```

### npm

```bash
npm install -g ai-global
# 또는
pnpm add -g ai-global
# 또는
yarn global add ai-global
# 또는
bun add -g ai-global
```
---

## 사용법

### 첫 실행

```bash
ai-global
```

인자 없이 실행하면 대화형 메뉴가 열리며, 글로벌 모드 또는 프로젝트 모드의 일반적인 작업을 선택할 수 있습니다.

원래의 스캔, 병합, 심볼릭 링크 업데이트를 바로 실행하려면 다음을 사용하세요:

```bash
ai-global update
```

실행 시:

1. 설치된 AI 도구를 스캔합니다
2. 원본 설정을 `.ai-global/backups/`에 백업합니다
3. 감지된 도구의 AGENTS.md/skills/agents/rules/commands를 병합합니다
4. 각 도구의 설정에서 공유 디렉토리로 심볼릭 링크를 생성합니다

참고: AI Global은 이미 존재하는 도구 디렉토리만 처리하며, `.github`, `.kiro` 같은 디렉토리를 자동으로 만들지는 않습니다.

### 명령어 목록

| 명령어                                   | 설명                                    |
| ---------------------------------------- | --------------------------------------- |
| `ai-global`                              | 대화형 메뉴 열기                        |
| `ai-global update`                       | 스캔, 병합, 심볼릭 링크 업데이트        |
| `ai-global status`                       | 심볼릭 링크 상태 표시                   |
| `ai-global list`                         | 지원되는 도구 목록 표시                 |
| `ai-global backups`                      | 사용 가능한 백업 목록 표시              |
| `ai-global relink`                       | 모든 심볼릭 링크 재구성                 |
| `ai-global unlink <key>`                 | 특정 도구의 원본 설정 복원              |
| `ai-global unlink all`                   | 모든 도구 복원                          |
| `ai-global clean`                        | 고아 백업 정리                          |
| `ai-global add-skill <user/repo>`        | 스킬 추가                               |
| `ai-global add-rule <user/repo>`         | 규칙 추가                               |
| `ai-global add-command <user/repo>`      | 명령어 추가                             |
| `ai-global render-skills` `ai-global -rs`| v-skills 기준으로 skills 투영 계층 재생성 |
| `ai-global set-category <name> <분류>`   | 스킬 분류 이동 (`-` 는 분류 없음) |
| `ai-global disable <name>`               | 스킬 비활성화 (도구에 투영하지 않음) |
| `ai-global enable <name>`                | 비활성화 해제                    |
| `ai-global list-skills` `ai-global -ls`  | 전역 skills 목록 표시                   |
| `ai-global list-rules` `ai-global -lr`   | 전역 rules 목록 표시                    |
| `ai-global list-commands` `ai-global -lc`| 전역 commands 목록 표시                 |
| `ai-global list-agents` `ai-global -la`  | 전역 agents 목록 표시                   |
| `ai-global upgrade`                      | 최신 버전으로 업그레이드                |
| `ai-global uninstall`                    | 완전히 제거                             |
| `ai-global version`                      | 버전 번호 표시                          |
| `ai-global help`                         | 도움말 표시                             |

### 프로젝트 모드

`-p` / `--project`는 `update`, `list`, `list-*`, `relink`, `unlink`, `add-*` 명령어만 지원합니다. 사용 시 먼저 현재 디렉토리가 홈 디렉토리가 아닌지 확인하고, 현재 디렉토리를 프로젝트 디렉토리로 취급할지 묻습니다.

```bash
ai-global -p list
ai-global -p update
ai-global --project list-skills
ai-global -p relink
ai-global -p unlink codex
ai-global -p add-skill <user/repo>
```

프로젝트 모드는 현재 디렉토리 아래의 `.ai-global/`을 사용하며, `~/.ai-global/`에는 영향을 주지 않습니다.

프로젝트 모드는 글로벌 설정 디렉토리를 그대로 적용하지 않도록 별도의 도구 디렉토리 매핑을 가집니다. 주요 차이점:

| 도구 | 프로젝트 모드 위치 |
| ---- | ------------ |
| Claude Code | `.claude/CLAUDE.md`, `.claude/commands/`, `.claude/skills/`, `.claude/agents/` |
| Codex Skills | `.agents/skills/` |
| Copilot CLI | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/` |
| Antigravity CLI | `.gemini/GEMINI.md`, `.gemini/.agents/rules/` |
| OpenCode | `.opencode/AGENTS.md`, `.opencode/commands/`, `.opencode/skills/`, `.opencode/agents/` |

### 리소스 추가

```bash
ai-global add-skill <user/repo>       # 스킬 추가
ai-global add-rule <user/repo>        # 규칙 추가
ai-global add-command <user/repo>     # 명령어 추가
ai-global render-skills               # skills 투영 계층 재생성
ai-global set-category <name> <분류>  # 스킬 분류 이동
ai-global disable <name>              # 스킬 비활성화
ai-global enable <name>               # 비활성화 해제
ai-global list-skills                 # skills 목록 표시
ai-global list-rules                  # rules 목록 표시
ai-global list-commands               # commands 목록 표시
ai-global list-agents                 # agents 목록 표시
```

`user/repo` 또는 `https://github.com/user/repo` 형식을 지원합니다. 리소스는 `.ai-global/` 하위의 해당 서브디렉토리에 다운로드됩니다.

짧은 별칭도 사용할 수 있습니다: `-ls`, `-lr`, `-lc`, `-la`.

## 작동 원리

### 디렉토리 구조

```
~/.ai-global/
├── AGENTS.md            <- 공유 AGENTS.md (이 파일을 편집)
├── v-skills/            <- 스킬 실체, 다층 분류 (편집은 여기서)
│   ├── anthropics/skills/pdf/
│   ├── lazyjerry/mattpocock-skills/engineering/codebase-design/
│   └── manual/my-own-skill/
├── skills/              <- 평면 투영 계층, 각 도구가 읽는 곳 (모두 symlink)
│   ├── pdf             -> ../v-skills/anthropics/skills/pdf
│   └── codebase-design -> ../v-skills/lazyjerry/mattpocock-skills/engineering/codebase-design
├── disable-skills.md    <- 비활성화 목록
├── source.md            <- 설치 출처 기록
├── agents/              <- 공유 에이전트
├── rules/               <- 공유 규칙
├── commands/            <- 공유 슬래시 명령
└── backups/             <- 원본 설정 (백업)

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (심볼릭 링크)
├── skills/   -> ~/.ai-global/skills/          (심볼릭 링크)
└── commands/ -> ~/.ai-global/commands/        (심볼릭 링크)

~/.agents/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (심볼릭 링크)
└── skills/   -> ~/.ai-global/skills/          (심볼릭 링크)

... 그 외 도구들
```

### 스킬 분류 (v-skills)

모든 AI 도구는 skills 디렉토리의 **첫 번째 계층만** 스캔하며, 분류 하위 폴더를 지원하는 도구는 없습니다. 그래서 AI Global은 스킬 실체를 `v-skills/`에 다층 분류로 두고, 평면 symlink로 투영해 각 도구가 읽도록 합니다.

- **설치 경로는 출처에서 결정됩니다**: `v-skills/<작성자>/<repo>/<출처 분류>/<스킬명>/`, 수동으로 넣은 것은 `manual/` 로
- **스킬을 편집하려면 `v-skills/` 쪽을 수정**하세요. `skills/` 아래는 전부 symlink 입니다
- **같은 이름의 스킬은 서로 다른 분류에 공존할 수 있지만, 활성화는 하나만** 가능합니다. 나머지는 `disable` 로 비활성화하세요
- `v-skills/<임의 분류>/` 에 직접 넣은 스킬은 `render-skills` 를 실행하면 투영됩니다. 설치 기록은 필요 없습니다
- `update-skills` 는 아직 `skills/` 바로 아래에 남아 있는 실체 스킬을 `v-skills/` 로 정리합니다 (대응 목록을 먼저 보여주고 확인을 요청합니다)

비활성화 목록 `disable-skills.md` 는 한 줄에 v-skills 상대 경로 하나이며, `/` 로 끝나면 분류 전체가 대상입니다:

```
# 분류 전체 비활성화
lazyjerry/mattpocock-skills/in-progress/

# 개별 스킬
anthropics/skills/pdf
```

비활성화는 투영 계층에만 영향을 주며, 실체 디렉토리와 설치 기록은 변경되지 않습니다.

### 병합 동작

`ai-global`을 실행하면 파일 이름을 기준으로 모든 도구의 내용을 병합합니다:

- Codex의 스킬: `react/`, `typescript/`
- Claude의 스킬: `typescript/`, `python/`
- 병합 결과: `react/`, `typescript/`, `python/`

**나중에 발견된 파일이 우선됩니다** (나중에 발견된 도구가 동일한 이름의 파일을 덮어씁니다).

## 지원되는 도구

| 도구           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
| -------------- | ------------- | :-------: | :---: | :------: | :----: | :----: |
| Claude Code    | `claude`      |     ✓     |       |    ✓     |   ✓    |   ✓    |
| Clawdbot Code  | `clawdbot`    |     ✓     |       |          |   ✓    |   ✓    |
| Codex CLI      | `codex`       |     ✓     |       |          |        |   ✓    |
| Copilot CLI    | `copilot`     |     ✓     |       |          |   ✓    |   ✓    |
| Antigravity CLI | `agy`        |     ✓     |       |          |   ✓    |        |
| OpenCode       | `opencode`    |     ✓     |       |    ✓     |   ✓    |   ✓    |

## 제거

```bash
ai-global uninstall
```

실행 시:

1. 모든 도구의 원본 설정을 복원합니다
2. `ai-global` 명령어를 제거합니다

참고: `~/.ai-global/` 디렉토리는 삭제되지 않으며, 설정 파일은 그대로 유지됩니다. 필요한 경우 수동으로 삭제하세요.

npm으로 설치한 경우:

```bash
npm uninstall -g ai-global
```

## 라이선스

MIT
