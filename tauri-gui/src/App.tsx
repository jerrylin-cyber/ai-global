import { listen } from '@tauri-apps/api/event'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Dashboard, Tools, OutputConsole, ConfirmDialog } from './components'
import { tauriClient } from './tauri_client'
import { extractVersionFromPath, parseToolsFromListOutput, stripAnsi } from './tooling'
import type { AllowedAction, CommandRequest } from './types'
import { MAINTENANCE_ACTIONS, RISKY_ACTIONS } from './types'

interface LogEntry {
  type: 'stdout' | 'stderr' | 'info' | 'error'
  message: string
  timestamp: string
}

interface ToolItem {
  name: string
  status: string
  version?: string
}

interface StatusSection {
  title: string
  items: string[]
}

const cleanOutputLine = (line: string) =>
  stripAnsi(line)
    .trim()
    .replace(/^\[(INFO|OUT|WARN|ERR|ERROR)\]\s*/i, '')

const isDividerLine = (line: string) => /^[-_=]{3,}$/.test(line)

const resourceInstallHelpLines = [
  'add-skill <user/repo>    新增 skill (全域)',
  'add-rule <user/repo>     新增 rule (全域)',
  'add-command <user/repo>  新增 command (全域)',
]

const restoreBackupHelpLines = [
  'backups, -b         列出可用備份',
  'unlink <key>        還原工具的原始設定',
  'unlink all          還原所有工具',
]

const parseStatusOutput = (output: string): { meta: string[]; sections: StatusSection[] } => {
  const lines = output
    .split('\n')
    .map(cleanOutputLine)
    .filter((line) => line.length > 0 && !isDividerLine(line))

  const meta: string[] = []
  const sections: StatusSection[] = []
  let currentSection: StatusSection | null = null

  for (const line of lines) {
    const headerMatch = line.match(/^\[([^\]]+)\]$/)
    if (headerMatch) {
      currentSection = { title: headerMatch[1], items: [] }
      sections.push(currentSection)
      continue
    }

    if (currentSection) {
      currentSection.items.push(line)
    } else {
      meta.push(line)
    }
  }

  const normalizedSections = sections.filter((section) => section.items.length > 0)
  if (normalizedSections.length === 0 && meta.length > 0) {
    return {
      meta: [],
      sections: [{ title: '狀態明細', items: meta }],
    }
  }

  return { meta, sections: normalizedSections }
}

const parseBackupsOutput = (output: string): string[] => {
  const lines = output
    .split('\n')
    .map(cleanOutputLine)
    .filter((line) => line.length > 0 && !isDividerLine(line))

  return Array.from(new Set(lines))
}

const JOKE_POOL = [
  '//TODO 是最常見的承諾。',
  '工程師在電腦前也可能是廢物。',
  '除 bug 可拜雍正，專治八阿哥。',
  '工程師背電腦包，常常沒電腦。',
  '我有一個 idea，只差工程師。',
  '我的 API 已經準備好了。',
  '工程師年薪高，時薪不一定高。',
  '很多技術部落格是炫耀用。',
  '提升效率最強工具：單身。',
  '我的 C++ 實力世界第 0。',
  '再過兩年就跟哥哥一樣大。',
  '不能上網？請連網解決。',
  '為什麼沒有自毀無人機？你是說導彈嗎。',
  '買筆電打遊戲，因為桌機要有房。',
  '好耳機不震撼，換回爛耳機才震撼。',
  'Chrome 不耗電，我估ㄐ。',
  '電話一來，全家蘋果一起響。',
  '如何用 iPad 關機 PC？丟電源鍵。',
  '垃圾簡訊被過濾，還是會想偷看。',
  '電腦世界經典謠言：我已閱讀條款。',
  'Hello Jack, my name is Jackson.',
  '把地主殺了，不代表你會變富。',
]

const pickRandomJoke = (current?: string): string => {
  if (JOKE_POOL.length === 1) {
    return JOKE_POOL[0]
  }

  let candidate = JOKE_POOL[Math.floor(Math.random() * JOKE_POOL.length)]
  while (candidate === current) {
    candidate = JOKE_POOL[Math.floor(Math.random() * JOKE_POOL.length)]
  }
  return candidate
}

function App() {
  const [activeTab, setActiveTab] = useState<'insights' | 'resources' | 'maintenance' | 'tools'>('insights')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<AllowedAction | null>(null)
  const [status, setStatus] = useState('待命')
  const [statusMeta, setStatusMeta] = useState<string[]>([])
  const [statusSections, setStatusSections] = useState<StatusSection[]>([])
  const [hasStatusQueried, setHasStatusQueried] = useState(false)
  const [backupSummary, setBackupSummary] = useState<string[]>([])
  const [hasBackupsQueried, setHasBackupsQueried] = useState(false)
  const [resourceRepo, setResourceRepo] = useState('')
  const [unlinkKey, setUnlinkKey] = useState('')
  const [footerJoke, setFooterJoke] = useState(() => pickRandomJoke())
  const [tools, setTools] = useState<ToolItem[]>([{ name: 'ai-global', status: 'checking' }])
  const [lastAction, setLastAction] = useState<AllowedAction | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    request?: CommandRequest
  }>({ isOpen: false, title: '', message: '' })
  const toolsSectionRef = useRef<HTMLElement | null>(null)
  const backupsSectionRef = useRef<HTMLElement | null>(null)

  const actionLabel: Partial<Record<AllowedAction, string>> = {
    status: '檢查狀態',
    list: '工具清單',
    backups: '備份清單',
    relink: '重建連結',
    clean: '清理備份',
    upgrade: '升級版本',
    unlink: '還原連結',
    'add-skill': '新增 Skill',
    'add-rule': '新增 Rule',
    'add-command': '新增 Command',
  }

  // Listen for stream events from spawn mode (upgrade/clean)
  const addLogRef = useRef<typeof addLog | null>(null)
  useEffect(() => {
    addLogRef.current = addLog
  })
  useEffect(() => {
    const unlisten = listen<{ event_type: string; data: string }>('stream-event', (event: import('@tauri-apps/api/event').Event<{ event_type: string; data: string }>) => {
      const { event_type, data } = event.payload
      const type: LogEntry['type'] = event_type === 'stderr' ? 'stderr' : event_type === 'error' ? 'error' : event_type === 'completed' ? 'info' : 'stdout'
      addLogRef.current?.(type, data)
    })
    return () => { void unlisten.then((fn: () => void) => fn()) }
  }, [])

  useEffect(() => {
    void refreshTools()
  }, [])

  useEffect(() => {
    if (activeTab === 'tools' || activeTab === 'insights') {
      void refreshTools()
    }
  }, [activeTab])

  const handleActionClick = async (action: AllowedAction) => {
    await runCommand({ action })
  }

  const runCommand = async (request: CommandRequest) => {
    if (RISKY_ACTIONS.includes(request.action)) {
      const riskMessages: Partial<Record<AllowedAction, string>> = {
        relink: '重建所有 symlink，此操作可能覆寫現有連結。',
        clean: '清理孤立備份，此操作無法復原。',
        upgrade: '升級工具版本，可能造成行為改變。',
        unlink: '還原指定工具設定，此操作無法復原。',
      }

      setConfirmDialog({
        isOpen: true,
        title: `確認執行 ${request.action}`,
        message: riskMessages[request.action] ?? '此操作為高風險，請確認後再執行。',
        request,
      })
      return
    }

    await executeAction(request)
  }

  const executeAction = async (request: CommandRequest) => {
    const { action } = request
    setLoading(true)
    setLoadingAction(action)
    setStatus('執行中')
    setLastAction(action)

    addLog('info', `執行命令: ai-global ${action}`)

    try {
      const response = await tauriClient.executeCommand(request)

      if (response.output.trim()) {
        for (const line of response.output.split('\n')) {
          if (line.trim()) {
            addLog('stdout', line)
          }
        }
      }

      if (response.error?.trim()) {
        for (const line of response.error.split('\n')) {
          if (line.trim()) {
            addLog('stderr', line)
          }
        }
      }

      if (response.success) {
        setStatus('成功')
        addLog('info', `命令完成，exit code: ${response.exitCode ?? 0}`)

        if (action === 'status') {
          const parsedStatus = parseStatusOutput(response.output)
          setStatusMeta(parsedStatus.meta)
          setStatusSections(parsedStatus.sections)
          setHasStatusQueried(true)
        }

        if (action === 'backups') {
          const parsedBackups = parseBackupsOutput(response.output)
          setBackupSummary(
            parsedBackups.slice(0, 24),
          )
          setHasBackupsQueried(true)
        }
      } else {
        setStatus('失敗')
        addLog('error', `命令失敗，exit code: ${response.exitCode ?? 'unknown'}`)
      }

      if (action === 'list') {
        void refreshTools(response.output)
      } else if (response.success && (action === 'add-skill' || action === 'add-rule' || action === 'add-command' || action === 'unlink' || action === 'relink')) {
        void refreshTools()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus('失敗')
      addLog('error', message)
    } finally {
      setLoading(false)
      setLoadingAction(null)
    }
  }

  const refreshTools = async (listOutput?: string) => {
    try {
      const executablePath = await tauriClient.resolveExecutable()
      const parsedTools = listOutput ? parseToolsFromListOutput(listOutput) : await fetchToolsFromBackend()

      setTools([
        {
          name: 'ai-global',
          status: 'active',
          version: extractVersionFromPath(executablePath),
        },
        ...parsedTools,
      ])
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setTools([
        { name: 'ai-global', status: 'inactive', version: message },
      ])
    }
  }

  const fetchToolsFromBackend = async (): Promise<ToolItem[]> => {
    const response = await tauriClient.executeCommand({ action: 'list' })
    return parseToolsFromListOutput(response.output)
  }

  const addLog = (type: LogEntry['type'], message: string, timestamp?: string) => {
    const ts = timestamp || new Date().toLocaleTimeString()
    setLogs((prev: LogEntry[]) => [...prev, { type, message, timestamp: ts }])
  }

  const handleConfirmDialog = async () => {
    if (confirmDialog.request) {
      await executeAction(confirmDialog.request)
    }
    setConfirmDialog({ isOpen: false, title: '', message: '' })
  }

  const handleResourceInstall = async (action: 'add-skill' | 'add-rule' | 'add-command') => {
    if (!resourceRepo.trim()) {
      addLog('error', '請先輸入 GitHub repo，格式：user/repo')
      setStatus('失敗')
      return
    }
    await runCommand({ action, repo: resourceRepo.trim() })
  }

  const handleUnlink = async () => {
    if (!unlinkKey.trim()) {
      addLog('error', '請先輸入 unlink key，例如：claude、cursor，或輸入 all')
      setStatus('失敗')
      return
    }
    await runCommand({ action: 'unlink', key: unlinkKey.trim() })
  }

  const openGithubRepo = () => {
    // Tauri WebView 透過 window.open 可交由系統預設瀏覽器處理外部連結
    window.open('https://github.com/lazyjerry/ai-global', '_blank', 'noopener,noreferrer')
    setFooterJoke((current) => pickRandomJoke(current))
  }

  const refreshStatusSummary = async () => {
    await runCommand({ action: 'status' })
  }

  const refreshBackupSummary = async () => {
    await runCommand({ action: 'backups' })
  }

  const runListFromInsights = async () => {
    await runCommand({ action: 'list' })
    toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const runBackupsFromInsights = async () => {
    await refreshBackupSummary()
    backupsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toolStatusLabel: Record<string, string> = {
    active: '已安裝',
    inactive: '未找到',
    checking: '偵測中',
  }

  return (
    <div className="app">
      {/* 標題列（可拖曳）*/}
      <div className="titlebar" data-tauri-drag-region>
        <div className="titlebar-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="var(--primary)" strokeWidth="1.2"/>
            <path d="M1.5 8h13M8 1.5a9 9 0 0 1 0 13M8 1.5a9 9 0 0 0 0 13" stroke="var(--accent)" strokeWidth="1"/>
          </svg>
        </div>
        <span className="titlebar-title">AI-GLOBAL</span>
      </div>

      {/* 工作區 */}
      <div className="workspace">
        {/* 側邊欄 */}
        <aside className="sidebar">
          <span className="sidebar-section-label">功能</span>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 12h11M3.5 10V7.5M7.5 10V4.5M11.5 10V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              檢視面板
            </button>
            <button
              className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 2.5v10M2.5 7.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              資源管理
            </button>
            <button
              className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 3.5h11M2 7.5h11M2 11.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              工具清單
            </button>
            <button
              className={`nav-item ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M4 11l7-7M9 3h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              維護工具
            </button>
          </nav>
          <div className="sidebar-footer">
            <span className="sidebar-version">ai-global v2.2.4</span>
          </div>
        </aside>

        {/* 主要內容 */}
        <main className="content">
          {activeTab === 'insights' && (
            <div className="tab-content tab-content-insights">
              <section className="insight-window">
                <header className="insight-header">
                  <span className="insight-title">檢視面板說明</span>
                </header>
                <div className="insight-body">
                  <p className="insight-help-text">這個頁面用於顯示「查詢結果摘要」，不會自動執行指令。請先按下方按鈕執行查詢。</p>
                  <p className="insight-runtime-hint">
                    {loading
                      ? `執行中：${actionLabel[loadingAction ?? 'status'] ?? loadingAction ?? '命令'}`
                      : `目前狀態：${status}${lastAction ? `，最後指令：${actionLabel[lastAction] ?? lastAction}` : ''}`}
                  </p>
                  <div className="insight-help-actions">
                    <button className="resource-btn" onClick={() => { void refreshStatusSummary() }} disabled={loading}>執行檢查狀態（ai-global status）</button>
                    <button className="resource-btn" onClick={() => { void runListFromInsights() }} disabled={loading}>執行工具清單（ai-global list）</button>
                    <button className="resource-btn" onClick={() => { void runBackupsFromInsights() }} disabled={loading}>執行備份清單（ai-global backups）</button>
                  </div>
                </div>
              </section>

              <section className="insight-window">
                <header className="insight-header">
                  <span className="insight-title">狀態查詢摘要（status）</span>
                </header>
                <div className="insight-body">
                  {!hasStatusQueried ? (
                    <p className="insight-empty">尚未執行 ai-global status。此區會顯示各工具 symlink 狀態重點。</p>
                  ) : statusMeta.length === 0 && statusSections.length === 0 ? (
                    <p className="insight-empty">已執行 ai-global status，但目前沒有可顯示的摘要內容。</p>
                  ) : (
                    <>
                      {statusMeta.length > 0 && (
                        <ul className="insight-list">
                          {statusMeta.map((line, idx) => (<li key={`${line}-${idx}`}>{line}</li>))}
                        </ul>
                      )}
                      {statusSections.map((section) => (
                        <section key={section.title} className="insight-subsection">
                          <h4>{section.title}</h4>
                          <ul className="insight-list">
                            {section.items.map((line, idx) => (<li key={`${section.title}-${line}-${idx}`}>{line}</li>))}
                          </ul>
                        </section>
                      ))}
                    </>
                  )}
                </div>
              </section>

              <section className="insight-window" ref={toolsSectionRef}>
                <header className="insight-header">
                  <span className="insight-title">工具快照（list）</span>
                </header>
                <div className="insight-body">
                  <p className="insight-help-text">此表來自 ai-global list。狀態欄位：active 表示已偵測到工具，inactive 表示目前未找到。</p>
                  <table className="insight-table">
                    <thead>
                      <tr>
                        <th>工具</th>
                        <th>狀態</th>
                        <th>版本</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.map((tool) => (
                        <tr key={tool.name}>
                          <td>{tool.name}</td>
                          <td>{toolStatusLabel[tool.status] ?? tool.status}</td>
                          <td>{tool.version || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="insight-window" ref={backupsSectionRef}>
                <header className="insight-header">
                  <span className="insight-title">備份查詢摘要（backups）</span>
                </header>
                <div className="insight-body">
                  {!hasBackupsQueried ? (
                    <p className="insight-empty">尚未執行 ai-global backups。此區會列出可還原的備份檔案。</p>
                  ) : backupSummary.length === 0 ? (
                    <p className="insight-empty">已執行 ai-global backups，但目前沒有可顯示的備份項目。</p>
                  ) : (
                    <ul className="insight-list">
                      {backupSummary.map((line, idx) => (<li key={`${line}-${idx}`}>{line}</li>))}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="tab-content tab-content-resources">
              <section className="resource-window">
                <header className="insight-header">
                  <span className="insight-title">新增資源</span>
                </header>
                <div className="resource-body">
                  <ul className="insight-list">
                    {resourceInstallHelpLines.map((line) => (<li key={line}>{line}</li>))}
                  </ul>
                  <p className="insight-help-text">輸入格式：user/repo</p>
                  <label className="resource-label" htmlFor="repo">GitHub Repo（user/repo）</label>
                  <input
                    id="repo"
                    className="resource-input"
                    type="text"
                    placeholder="例如：lazyjerry/example-skill"
                    value={resourceRepo}
                    onChange={(e) => setResourceRepo(e.target.value)}
                  />
                  <div className="resource-actions">
                    <button className="resource-btn" onClick={() => { void handleResourceInstall('add-skill') }} disabled={loading}>新增 Skill</button>
                    <button className="resource-btn" onClick={() => { void handleResourceInstall('add-rule') }} disabled={loading}>新增 Rule</button>
                    <button className="resource-btn" onClick={() => { void handleResourceInstall('add-command') }} disabled={loading}>新增 Command</button>
                  </div>
                </div>
              </section>

              <section className="resource-window">
                <header className="insight-header">
                  <span className="insight-title">還原與備份</span>
                </header>
                <div className="resource-body">
                  <ul className="insight-list">
                    {restoreBackupHelpLines.map((line) => (<li key={line}>{line}</li>))}
                  </ul>
                  <p className="insight-help-text">先用工具清單確認 key，再執行 unlink。範例：claude、cursor、all。</p>
                  <label className="resource-label" htmlFor="unlink">unlink key</label>
                  <input
                    id="unlink"
                    className="resource-input"
                    type="text"
                    placeholder="例如：claude、cursor、all"
                    value={unlinkKey}
                    onChange={(e) => setUnlinkKey(e.target.value)}
                  />
                  <div className="resource-actions">
                    <button className="resource-btn risk" onClick={() => { void handleUnlink() }} disabled={loading}>執行 Unlink</button>
                    <button className="resource-btn" onClick={() => { void runCommand({ action: 'backups' }) }} disabled={loading}>查看備份清單</button>
                  </div>
                </div>
              </section>

              <OutputConsole logs={logs} />
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="tab-content tab-content-tools">
              <Tools tools={tools} />
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="tab-content tab-content-maintenance">
              <Dashboard
                title="高風險維護"
                actions={MAINTENANCE_ACTIONS}
                onActionClick={handleActionClick}
                loading={loading}
                loadingAction={loadingAction}
              />
              <OutputConsole logs={logs} />
            </div>
          )}
        </main>
      </div>

      {/* 底部狀態列 */}
      <div className="statusbar">
        <span className="statusbar-item">系統狀態：{status}</span>
        {lastAction && (
          <span className="statusbar-item statusbar-divider">
            最後指令：ai-global {lastAction}
          </span>
        )}
        <span className="statusbar-spacer" />
        <button
          className="statusbar-link"
          onClick={openGithubRepo}
          title={`點擊開啟 AI-GLOBAL GitHub 專案，並切換笑話\n${footerJoke}`}
          aria-label="開啟 AI-GLOBAL GitHub 專案"
        >
          {footerJoke}
        </button>
      </div>

      <ConfirmDialog
        title={confirmDialog.title}
        message={confirmDialog.message}
        isOpen={confirmDialog.isOpen}
        onConfirm={handleConfirmDialog}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '' })}
        confirmText="確認"
        cancelText="取消"
        action={confirmDialog.request?.action}
        isDangerous={confirmDialog.request?.action ? RISKY_ACTIONS.includes(confirmDialog.request.action) : false}
      />
    </div>
  )
}

export default App
