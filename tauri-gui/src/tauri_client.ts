import { invoke } from '@tauri-apps/api/core'
import type { CommandRequest, CommandResponse } from './types'

class TauriClient {
  async executeCommand(request: CommandRequest): Promise<CommandResponse> {
    try {
      return await invoke<CommandResponse>('execute_ai_global_command', {
        action: request.action,
        key: request.key,
        repo: request.repo,
        path: request.path,
      })
    } catch (error) {
      throw new Error(`Command execution failed: ${error}`)
    }
  }

  async getCommandInfo(action: string): Promise<string> {
    try {
      const result = await invoke<string>('get_command_info', { action })
      return result
    } catch (error) {
      throw new Error(`Failed to get command info: ${error}`)
    }
  }

  async resolveExecutable(): Promise<string> {
    try {
      const result = await invoke<string>('resolve_executable')
      return result
    } catch (error) {
      throw new Error(`Failed to resolve executable: ${error}`)
    }
  }
}

export const tauriClient = new TauriClient()
