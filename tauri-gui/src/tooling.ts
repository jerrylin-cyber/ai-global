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

export const parseGlobalResourceListOutput = (output: string): string[] => {
  return output
    .split('\n')
    .map(stripAnsi)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\[(INFO|WARN|ERROR|ERR|OUT)\]\s*/i, ''))
    .filter((line) => line.length > 0)
    .filter((line) => !/^[-_=]{3,}$/.test(line))
    .filter((line) => !/^目錄:/.test(line))
    .filter((line) => !/ 列表$/.test(line))
    .filter((line) => !/^未找到任何 /.test(line))
    .filter((line) => !/^目錄不存在:/.test(line))
}

export const extractVersionFromPath = (path: string) => {
  if (path.includes('.ai-global') || path.includes('.local/bin')) {
    return 'installed'
  }

  return path.split('/').pop() || 'installed'
}