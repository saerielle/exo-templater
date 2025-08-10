import React from 'react'

interface ModalOverlayProps {
  children: React.ReactNode
  className?: string
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, className = '' }) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`.trim()}
  >
    {children}
  </div>
)

export default ModalOverlay
