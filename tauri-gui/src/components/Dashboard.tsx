import React from 'react'
import './Dashboard.css'
import type { AllowedAction } from '../types'

interface DashboardProps {
  title: string
  actions: AllowedAction[]
  onActionClick: (action: AllowedAction) => void
  loading: boolean
  loadingAction?: AllowedAction | null
}

interface ActionDef {
  label: string
  desc: string
  risky: boolean
  icon: React.ReactNode
}

const ACTION_MAP: Record<AllowedAction, ActionDef> = {
  status: {
    label: '檢查狀態',
    desc: '顯示 symlink 連結狀態',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  list: {
    label: '工具清單',
    desc: '列出所有支援的 AI 工具',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 4.5h12M3 9h12M3 13.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  relink: {
    label: '重建連結',
    desc: '重建所有 symlink（高風險）',
    risky: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M7 9a3 3 0 0 0 4.5.4l1.5-1.5a3 3 0 0 0-4.24-4.24L7.5 4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 9a3 3 0 0 0-4.5-.4L5 10.1a3 3 0 0 0 4.24 4.24l1.26-1.26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  clean: {
    label: '清理備份',
    desc: '清理孤立備份（高風險）',
    risky: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 5h11M7 5V3.5h4V5M14.5 5l-.75 9.5a1 1 0 0 1-1 .9H5.25a1 1 0 0 1-1-.9L3.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 8v4M10.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  upgrade: {
    label: '升級版本',
    desc: '升級至最新版本（高風險）',
    risky: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  backups: {
    label: '備份清單',
    desc: '列出所有可用備份',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5.5h12v8H3z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 3.5h8v2H5z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  unlink: {
    label: '還原連結',
    desc: '還原指定工具設定（高風險）',
    risky: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 4H6a3 3 0 0 0 0 6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 10l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'add-skill': {
    label: '新增 Skill',
    desc: '安裝全域 skill（需 repo）',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9h10M9 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'add-rule': {
    label: '新增 Rule',
    desc: '安裝全域 rule（需 repo）',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 5h8M5 9h8M5 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'add-command': {
    label: '新增 Command',
    desc: '安裝全域 command（需 repo）',
    risky: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 5.5L7 9l-3.5 3.5M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
}

const WarnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1.5L10.5 10H1.5L6 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M6 5v2.5M6 9v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const Dashboard: React.FC<DashboardProps> = ({ title, actions, onActionClick, loading, loadingAction }) => {
  return (
    <div className="dashboard">
      <p className="dashboard-title">{title}</p>
      <div className="action-grid">
        {actions.map((action) => {
          const def = ACTION_MAP[action]
          const isLoading = loadingAction === action
          return (
            <button
              key={action}
              className={`action-card ${def.risky ? 'risky' : ''} ${isLoading ? 'is-loading' : ''}`}
              onClick={() => onActionClick(action)}
              disabled={loading}
              title={def.desc}
            >
              <span className="action-card-icon">{isLoading ? <Spinner /> : def.icon}</span>
              <span className="action-card-body">
                <span className="action-card-label">{def.label}</span>
                <span className="action-card-desc">{def.desc}</span>
              </span>
              {def.risky && !isLoading && (
                <span className="action-card-warn">
                  <WarnIcon />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="spinner-icon">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22 22" strokeLinecap="round"/>
  </svg>
)
