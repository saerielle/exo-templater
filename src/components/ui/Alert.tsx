import React from 'react'

type AlertType = 'error' | 'info' | 'success' | 'warning'

interface AlertProps {
  type?: AlertType
  children: React.ReactNode
  className?: string
}

const typeClasses: Record<AlertType, string> = {
  error: 'bg-red-50 border border-red-200 text-red-800',
  info: 'bg-blue-50 border border-blue-200 text-blue-800',
  success: 'bg-green-50 border border-green-200 text-green-800',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800'
}

const Alert: React.FC<AlertProps> = ({ type = 'info', children, className = '' }) => (
  <div className={`p-4 ${typeClasses[type]} rounded-lg ${className}`.trim()}>{children}</div>
)

export default Alert
