import React from 'react'

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => (
  <div className={`flex justify-end space-x-2 p-6 border-t bg-gray-50 ${className}`.trim()}>
    {children}
  </div>
)

export default ModalFooter
