import React from 'react'

interface TabBarProps {
  children: React.ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export const TabBar: React.FC<TabBarProps> = ({ children, className = '', as = 'div' }) => {
  const Component = as as any
  return <Component className={`flex border-b ${className}`}>{children}</Component>
}

interface TabButtonProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  className = ''
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    } ${className}`.trim()}
  >
    {children}
  </button>
)
