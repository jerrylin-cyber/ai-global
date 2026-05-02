import { beforeEach, describe, expect, it, vi } from 'vitest'
import { tauriClient } from './tauri_client'
import type { AllowedAction, CommandResponse } from './types'

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }))

vi.mock('@tauri-apps/api/core', () => ({
  invoke: invokeMock,
}))

describe('tauriClient.executeCommand', () => {
  beforeEach(() => {
    invokeMock.mockReset()
  })

  it.each<AllowedAction>(['status', 'list', 'backups', 'list-skills', 'list-rules', 'list-commands', 'list-agents', 'relink', 'clean', 'upgrade', 'unlink', 'add-skill', 'add-rule', 'add-command'])(
    'forwards %s to Tauri invoke on success',
    async (action) => {
      const response: CommandResponse = {
        success: true,
        output: `${action} ok`,
        exitCode: 0,
      }
      invokeMock.mockResolvedValue(response)

      await expect(tauriClient.executeCommand({ action })).resolves.toEqual(response)
      expect(invokeMock).toHaveBeenCalledWith('execute_ai_global_command', {
        action,
        key: undefined,
        repo: undefined,
        path: undefined,
      })
    },
  )

  it.each<AllowedAction>(['status', 'list', 'backups', 'list-skills', 'list-rules', 'list-commands', 'list-agents', 'relink', 'clean', 'upgrade', 'unlink', 'add-skill', 'add-rule', 'add-command'])(
    'wraps invoke errors for %s',
    async (action) => {
      invokeMock.mockRejectedValue(new Error('backend failed'))

      await expect(tauriClient.executeCommand({ action })).rejects.toThrow(
        'Command execution failed: Error: backend failed',
      )
    },
  )
})