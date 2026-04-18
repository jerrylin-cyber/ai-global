# AI Global

[繁體中文](README.md) · [English](README_EN.md) · [简体中文](README_CN.md) · [日本語](README_JP.md) · 한국어

---

> **[nanxiaobei/ai-global](https://github.com/nanxiaobei/ai-global)**에서 포크되었습니다. 원작자의 오픈소스 기여에 감사드립니다.

### 원본과의 차이점

이 포크는 프로젝트 모드를 제거하고 시스템 모드만 유지하며, 여러 기능을 추가했습니다.

원본은 실행 디렉토리에 따라 모드를 전환합니다. `~`에서는 시스템 모드, 그 외에는 프로젝트 모드로 동작하며, 프로젝트 디렉토리에 독립적인 `.ai-global/` 설정을 생성합니다. 이 버전은 다음과 같이 단순화했습니다:

- 모드 구분 없이 모든 명령어가 글로벌 디렉토리 모드로 실행됩니다
- 프로젝트 모드 제거
- `relink` 명령어 추가: 모든 심볼릭 링크 재구성
- `clean` 명령어 추가: 고아 백업 정리
- `agents/` 하위 디렉토리 지원 추가
- 제거 시 `~/.ai-global/` 디렉토리 보존 (원본은 삭제함)
- 제거 전 확인(Y/N) 요청
- 리소스 다운로드 시 확인 대화 및 소스 추적(`source.md`) 추가
- UI 언어는 번체 중국어

프로젝트별로 AI 설정을 분리해야 하는 경우 [원본](https://github.com/nanxiaobei/ai-global)을 사용하세요.

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

## 사용법

### 첫 실행

```bash
ai-global
```

실행 시:

1. 설치된 AI 도구를 스캔합니다
2. 원본 설정을 `.ai-global/backups/`에 백업합니다
3. 감지된 도구의 AGENTS.md/skills/agents/rules/commands를 병합합니다
4. 각 도구의 설정에서 공유 디렉토리로 심볼릭 링크를 생성합니다

참고: AI Global은 이미 존재하는 도구 디렉토리만 처리하며, `.github`, `.kiro`, `.cursor` 같은 디렉토리를 자동으로 만들지는 않습니다.

### 명령어 목록

| 명령어                                | 설명                                    |
| ----------------------------------- | --------------------------------------- |
| `ai-global`                         | 스캔, 병합, 심볼릭 링크 업데이트 (기본) |
| `ai-global status`                  | 심볼릭 링크 상태 표시                   |
| `ai-global list`                    | 지원되는 도구 목록 표시                 |
| `ai-global backups`                 | 사용 가능한 백업 목록 표시              |
| `ai-global relink`                  | 모든 심볼릭 링크 재구성                 |
| `ai-global unlink <key>`            | 특정 도구의 원본 설정 복원              |
| `ai-global unlink all`              | 모든 도구 복원                          |
| `ai-global clean`                   | 고아 백업 정리                          |
| `ai-global add-skill <user/repo>`   | 스킬 추가                               |
| `ai-global add-rule <user/repo>`    | 규칙 추가                               |
| `ai-global add-command <user/repo>` | 명령어 추가                             |
| `ai-global upgrade`                 | 최신 버전으로 업그레이드                |
| `ai-global uninstall`               | 완전히 제거                             |
| `ai-global version`                 | 버전 번호 표시                          |
| `ai-global help`                    | 도움말 표시                             |

### 리소스 추가

```bash
ai-global add-skill <user/repo>       # 스킬 추가
ai-global add-rule <user/repo>        # 규칙 추가
ai-global add-command <user/repo>     # 명령어 추가
```

`user/repo` 또는 `https://github.com/user/repo` 형식을 지원합니다. 리소스는 `.ai-global/` 하위의 해당 서브디렉토리에 다운로드됩니다.

## 작동 원리

### 디렉토리 구조

```
~/.ai-global/
├── AGENTS.md        <- 공유 AGENTS.md (이 파일을 편집하세요)
├── skills/          <- 공유 스킬 (모든 도구에서 병합됨)
├── agents/          <- 공유 에이전트
├── rules/           <- 공유 규칙
├── commands/        <- 공유 슬래시 명령어
└── backups/         <- 원본 설정 (백업)

~/.claude/
├── CLAUDE.md -> ~/.ai-global/AGENTS.md        (심볼릭 링크)
├── skills/   -> ~/.ai-global/skills/          (심볼릭 링크)
└── commands/ -> ~/.ai-global/commands/        (심볼릭 링크)

~/.cursor/
├── AGENTS.md -> ~/.ai-global/AGENTS.md        (심볼릭 링크)
└── skills/   -> ~/.ai-global/skills/          (심볼릭 링크)

... 기타 도구들
```

### 병합 동작

`ai-global`을 실행하면 파일 이름을 기준으로 모든 도구의 내용을 병합합니다:

- Cursor의 스킬: `react/`, `typescript/`
- Claude의 스킬: `typescript/`, `python/`
- 병합 결과 `.ai-global/skills/`: `react/`, `typescript/`, `python/`

**나중에 발견된 파일이 우선됩니다** (나중에 발견된 도구가 동일한 이름의 파일을 덮어씁니다).

## 지원되는 도구

| 도구           | Key           | AGENTS.md | Rules | Commands | Skills | Agents |
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
ai-global uninstall

npm uninstall -g ai-global
```

## 라이선스

MIT
