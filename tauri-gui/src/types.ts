// Shared types for frontend and backend communication

export type AllowedAction =
  | 'status'
  | 'list'
  | 'backups'
  | 'list-skills'
  | 'list-rules'
  | 'list-commands'
  | 'list-agents'
  | 'relink'
  | 'clean'
  | 'upgrade'
  | 'unlink'
  | 'add-skill'
  | 'add-rule'
  | 'add-command'

export type ResourceListAction =
  | 'list-skills'
  | 'list-rules'
  | 'list-commands'
  | 'list-agents'

export interface CommandRequest {
  action: AllowedAction
  key?: string
  repo?: string
  path?: string
}

export interface CommandResponse {
  success: boolean
  output: string
  error?: string
  exitCode?: number
}

export interface ExecutionState {
  action: AllowedAction
  status: 'pending' | 'running' | 'success' | 'error'
  output: string
  stderr: string
  startTime?: number
  endTime?: number
}

// MVP Actions definition
export const MVP_ACTIONS: AllowedAction[] = ['status', 'list', 'relink', 'clean', 'upgrade']

export const SAFE_ACTIONS: AllowedAction[] = ['status', 'list', 'backups']

export const RESOURCE_ACTIONS: AllowedAction[] = [
  'add-skill',
  'add-rule',
  'add-command',
  'list-skills',
  'list-rules',
  'list-commands',
  'list-agents',
  'unlink',
]

export const MAINTENANCE_ACTIONS: AllowedAction[] = ['relink', 'clean', 'upgrade']

// Risky actions that require confirmation
export const RISKY_ACTIONS: AllowedAction[] = ['clean', 'upgrade', 'relink', 'unlink']
