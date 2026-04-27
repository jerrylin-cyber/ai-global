import { describe, expect, it } from 'vitest'
import { extractVersionFromPath, parseToolsFromListOutput, stripAnsi } from './tooling'

describe('tooling helpers', () => {
  it('strips ansi escape sequences', () => {
    expect(stripAnsi('\u001b[34mhello\u001b[0m')).toBe('hello')
  })

  it('parses ai-global list output into tool rows', () => {
    const output = [
      '  \u001b[34m工具             Key          目錄                          AGENTS.md Rules Commands Skills Agents 狀態\u001b[0m',
      '  \u001b[38;5;180mClaude Code      claude        .claude                        ○        .      ○       ○      ○    已安裝\u001b[0m',
      '  \u001b[90mCodex CLI        codex         .codex                         ○        .      .       .      ○    未找到\u001b[0m',
    ].join('\n')

    expect(parseToolsFromListOutput(output)).toEqual([
      { name: 'Claude Code', status: 'active', version: 'claude' },
      { name: 'Codex CLI', status: 'inactive', version: 'codex' },
    ])
  })

  it('normalizes executable path display', () => {
    expect(extractVersionFromPath('/Users/demo/.ai-global/ai-global')).toBe('installed')
    expect(extractVersionFromPath('/usr/local/bin/ai-global')).toBe('ai-global')
  })
})