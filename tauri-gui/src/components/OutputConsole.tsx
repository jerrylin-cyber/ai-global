import React, { useEffect, useRef } from 'react'
import './OutputConsole.css'

interface LogEntry {
  type: 'stdout' | 'stderr' | 'info' | 'error'
  message: string
  timestamp: string
}

interface OutputConsoleProps {
  logs: LogEntry[]
}

// 移除 ANSI escape 序列（如 \x1b[38;5;180m 等顏色碼）
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*[mGKHF]/g, '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
}

const TYPE_LABEL: Record<LogEntry['type'], string> = {
  stdout: 'OUT',
  stderr: 'STDERR',
  info:   'INFO',
  error:  'FAIL',
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="output-console">
      <div className="console-header">
        <span className="console-title">輸出記錄</span>
        <span className="console-count">{logs.length} 行</span>
      </div>
      <div className="console-content">
        {logs.length === 0 ? (
          <div className="console-placeholder">等待命令執行...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`log-line ${log.type}`}>
              <span className="log-time">{log.timestamp}</span>
              <span className={`log-type type-${log.type}`}>{TYPE_LABEL[log.type]}</span>
              <span className="log-message">{stripAnsi(log.message)}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
