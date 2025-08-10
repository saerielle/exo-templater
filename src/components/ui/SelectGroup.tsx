import React from 'react'

interface Option {
  value: string
  label: string
}

interface SelectGroupProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helpText?: string
  error?: boolean
  required?: boolean
  options: Option[]
  className?: string
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  helpText,
  error = false,
  required = false,
  options,
  className = '',
  id,
  ...selectProps
}) => {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span>*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} h-10.5 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        aria-invalid={error}
        aria-describedby={helpText ? `${selectId}-help` : undefined}
        required={required}
        {...selectProps}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p id={selectId ? `${selectId}-help` : undefined} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}

export default SelectGroup
