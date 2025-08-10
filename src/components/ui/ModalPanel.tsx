import React from 'react'

interface ModalPanelProps {
  children: React.ReactNode
  className?: string
}

const ModalPanel: React.FC<ModalPanelProps> = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col ${className}`.trim()}
  >
    {children}
  </div>
)

export default ModalPanel
