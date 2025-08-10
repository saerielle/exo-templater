import React from 'react'

interface CheckRadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: 'checkbox' | 'radio'
  label?: string
  helpText?: string
  error?: boolean
  required?: boolean
  className?: string
}

const CheckRadioGroup: React.FC<CheckRadioGroupProps> = ({
  type,
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
      <label className="flex items-start cursor-pointer select-none" htmlFor={inputId}>
        <input
          id={inputId}
          type={type}
          className={`mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 ${error ? 'border-red-500' : ''}`}
          required={required}
          aria-invalid={error}
          {...inputProps}
        />
        <div className="flex-1">
          <span className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
        </div>
      </label>
    </div>
  )
}

export default CheckRadioGroup
