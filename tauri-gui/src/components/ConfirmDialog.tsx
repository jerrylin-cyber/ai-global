import React from 'react'
import './ConfirmDialog.css'
import type { AllowedAction } from '../types'

interface ConfirmDialogProps {
  title: string
  message: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  action?: AllowedAction
  isDangerous?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = '確認',
  cancelText = '取消',
  isDangerous = false
}) => {
  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className={`confirm-dialog ${isDangerous ? 'dangerous' : ''}`} onClick={(e) => e.stopPropagation()}>
      {isDangerous && <div className="danger-badge">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1.5L10.5 10.5H1.5L6 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M6 5.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="6" cy="9" r="0.6" fill="currentColor"/>
        </svg>
        高風險操作
      </div>}
        <h3>{title}</h3>
        <p>{message}</p>
        {isDangerous && (
          <div className="warning-box">
            <strong>此操作無法復原。請確認您了解其影響。</strong>
          </div>
        )}
        <div className="dialog-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn-confirm ${isDangerous ? 'btn-danger' : ''}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
