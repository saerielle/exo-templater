import { ChangeEvent, FC, InputHTMLAttributes, useEffect, useState } from 'react'

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | ''
  onChange: (value: number | '') => void
  step?: number | string
  min?: number
  max?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  helpText?: string
  required?: boolean
  error?: boolean
}

const NumberInput: FC<NumberInputProps> = ({
  value,
  onChange,
  step = 'any',
  min,
  max,
  placeholder,
  disabled,
  className = '',
  label,
  helpText,
  required,
  error,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    value === '' || value === undefined ? '' : String(value)
  )

  useEffect(() => {
    if (value === '' && internalValue !== '') setInternalValue('')
    else if (typeof value === 'number' && value !== Number(internalValue))
      setInternalValue(String(value))
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInternalValue(val)
    if (val === '' || val === '-') {
      onChange('')
      return
    }
    const parsed = Number(val)
    if (!isNaN(parsed)) {
      onChange(parsed)
    }
  }

  const inputId = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span>*</span>}
        </label>
      )}
      <input
        type="text"
        inputMode="decimal"
        pattern="^-?\\d*(\\.\\d*)?$"
        value={internalValue}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={disabled}
        className={`${className} w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...rest}
      />
      {helpText && (
        <p id={inputId ? `${inputId}-help` : undefined} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}

export default NumberInput
