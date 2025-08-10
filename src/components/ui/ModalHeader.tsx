import { X } from 'lucide-react'

import React from 'react'

interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, className = '' }) => (
  <div className={`flex justify-between items-center p-6 border-b ${className}`.trim()}>
    <h2 className="text-xl font-semibold">{children}</h2>
    {onClose && (
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={20} />
      </button>
    )}
  </div>
)

export default ModalHeader
