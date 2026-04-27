export interface ToolItem {
  name: string
  status: string
  version?: string
}

export const stripAnsi = (value: string) => value.replace(/\u001b\[[0-9;]*m/g, '')

export const parseToolsFromListOutput = (output: string): ToolItem[] => {
  return output
    .split('\n')
    .map(stripAnsi)
    .map((line) => line.trim())
    .filter((line) => line && (line.endsWith('已安裝') || line.endsWith('未找到')))
    .map((line) => {
      const columns = line.split(/\s{2,}/).filter(Boolean)
      const [name, key, , , , , , , toolStatus] = columns

      return {
        name: name || key || 'unknown',
        status: toolStatus === '已安裝' ? 'active' : 'inactive',
        version: key || 'N/A',
      }
    })
}

export const extractVersionFromPath = (path: string) => {
  if (path.includes('.ai-global') || path.includes('.local/bin')) {
    return 'installed'
  }

  return path.split('/').pop() || 'installed'
}