import React from 'react'
import './Tools.css'

interface ToolsProps {
  tools: Array<{
    name: string
    status: string
    version?: string
  }>
}

export const Tools: React.FC<ToolsProps> = ({ tools }) => {
  const statusLabel: Record<string, string> = {
    active:   '已安裝',
    inactive: '未找到',
    checking: '偵測中',
  }

  return (
    <div className="tools">
      <p className="tools-title">工具清單</p>
      <table className="tools-table">
        <thead>
          <tr>
            <th>工具名稱</th>
            <th>狀態</th>
            <th>版本</th>
          </tr>
        </thead>
        <tbody>
          {tools.length === 0 ? (
            <tr><td colSpan={3} className="tools-empty">尚未載入工具資訊，請至控制台執行「工具清單」</td></tr>
          ) : (
            tools.map((tool) => (
            <tr key={tool.name}>
              <td>{tool.name}</td>
              <td><span className={`status-badge ${tool.status}`}>{statusLabel[tool.status] ?? tool.status}</span></td>
              <td>{tool.version || 'N/A'}</td>
            </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="note">工具狀態說明：active ＝ 已安裝並連結，checking ＝ 偵測中，inactive ＝ 未找到</p>
    </div>
  )
}
