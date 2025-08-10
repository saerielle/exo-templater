import React from 'react'

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helpText?: string
  error?: boolean
  required?: boolean
  className?: string
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  helpText,
  error = false,
  required = false,
  className = '',
  id,
  ...inputProps
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        aria-invalid={error}
        aria-describedby={helpText ? `${inputId}-help` : undefined}
        required={required}
        type={inputProps.type || 'text'}
        {...inputProps}
      />
      {helpText && (
        <p id={inputId ? `${inputId}-help` : undefined} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}

export default InputGroup
