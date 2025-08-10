import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react'

import { createPortal } from 'react-dom'

export interface AutocompleteOption {
  id: string
  name: string
}

interface BaseAutocompleteProps<T extends AutocompleteOption> {
  options: T[]
  label?: string
  helpText?: string
  placeholder?: string
  freeSolo?: boolean
  disabled?: boolean
  className?: string
  clearable?: boolean
  clearOnSelect?: boolean
  getOptionLabel?: (option: T) => string | React.ReactNode
  getOptionDescription?: (option: T) => string | null | React.ReactNode
  searchFields?: Array<keyof T>
  groupByField?: keyof T
}

interface AutocompleteSingleProps<T extends AutocompleteOption> extends BaseAutocompleteProps<T> {
  multiselect?: false
  value: T | null
  onChange: (value: T | null) => void
}

interface AutocompleteMultiProps<T extends AutocompleteOption> extends BaseAutocompleteProps<T> {
  multiselect: true
  value: T[]
  onChange: (value: T[]) => void
}

type AutocompleteProps<T extends AutocompleteOption> =
  | AutocompleteSingleProps<T>
  | AutocompleteMultiProps<T>

function isMultiSelect<T extends AutocompleteOption>(
  props: AutocompleteProps<T>
): props is AutocompleteMultiProps<T> {
  return props.multiselect === true
}

function isSingleSelect<T extends AutocompleteOption>(
  props: AutocompleteProps<T>
): props is AutocompleteSingleProps<T> {
  return props.multiselect !== true
}

export function Autocomplete<T extends AutocompleteOption>(
  props: AutocompleteSingleProps<T>
): JSX.Element
export function Autocomplete<T extends AutocompleteOption>(
  props: AutocompleteMultiProps<T>
): JSX.Element
export function Autocomplete<T extends AutocompleteOption>(props: AutocompleteProps<T>) {
  const {
    options,
    value,
    onChange,
    label,
    helpText,
    placeholder = '',
    freeSolo = false,
    multiselect = false,
    disabled = false,
    className = '',
    clearable = false,
    clearOnSelect = false,
    getOptionLabel,
    getOptionDescription,
    searchFields = ['name'],
    groupByField
  } = props

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const selectedOptions: AutocompleteOption[] = multiselect
    ? Array.isArray(value)
      ? value
      : []
    : value && !Array.isArray(value)
      ? [value]
      : []

  const filteredOptions = options.filter(
    (opt) =>
      searchFields.some((field) =>
        (opt[field] as string).toLowerCase().includes(inputValue.toLowerCase())
      ) &&
      (!multiselect || !selectedOptions.some((sel) => sel.id === opt.id))
  )

  useEffect(() => {
    if (!isOpen) setHighlightedIndex(0)
  }, [isOpen, inputValue])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999
      })
    }
  }, [isOpen, inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (multiselect && e.key === 'Backspace' && inputValue === '' && selectedOptions.length > 0) {
      removeSelected(selectedOptions[selectedOptions.length - 1].id)
      return
    }
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true)
      return
    }
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      if (filteredOptions[highlightedIndex]) {
        selectOption(filteredOptions[highlightedIndex])
      } else if (freeSolo && inputValue.trim()) {
        selectFreeSolo(inputValue.trim())
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const selectOption = (option: AutocompleteOption) => {
    if (isMultiSelect(props)) {
      props.onChange([...selectedOptions, option] as T[])
      setInputValue('')
      if (clearOnSelect) {
        setIsOpen(false)
      }
    } else {
      props.onChange(option as T)
      setInputValue(option.name)
      setIsOpen(false)
      if (clearOnSelect) {
        setIsOpen(false)
        setInputValue('')
      }
    }
  }

  const selectFreeSolo = (val: string) => {
    if (isMultiSelect(props)) {
      props.onChange([...selectedOptions, { id: val, name: val }] as T[])
      setInputValue('')
    } else {
      props.onChange({ id: val, name: val } as T)
      setInputValue(val)
      setIsOpen(false)
    }
  }

  const removeSelected = (id: string) => {
    if (isMultiSelect(props)) {
      props.onChange(selectedOptions.filter((opt) => opt.id !== id) as T[])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100)
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isMultiSelect(props)) {
      props.onChange([] as T[])
    } else {
      props.onChange(null)
    }
    setInputValue('')
    setIsOpen(false)
  }

  useEffect(() => {
    if (!multiselect && value && !Array.isArray(value)) {
      setInputValue(value.name)
    }
    if (!value) setInputValue('')
  }, [value, multiselect])

  const groupBy = useMemo(
    () =>
      groupByField
        ? filteredOptions.reduce(
            (acc, opt) => {
              const group = opt[groupByField] as string
              if (!acc[group]) {
                acc[group] = []
              }
              acc[group].push(opt)
              return acc
            },
            {} as Record<string, T[]>
          )
        : null,
    [filteredOptions, groupByField]
  )

  const dropdown =
    isOpen && (filteredOptions.length > 0 || (freeSolo && inputValue.trim()))
      ? createPortal(
          <ul
            ref={listRef}
            style={dropdownStyle}
            className="bg-white border rounded shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.map((opt, idx) => {
              const isGroupLabel =
                groupBy &&
                (!filteredOptions[idx - 1] ||
                  filteredOptions[idx - 1][groupByField as keyof T] !==
                    opt[groupByField as keyof T])

              return (
                <Fragment key={opt.id}>
                  {isGroupLabel && (
                    <li
                      className="px-4 py-1 bg-gray-100 text-gray-700 font-semibold text-xs uppercase select-none"
                      aria-disabled="true"
                      role="presentation"
                      tabIndex={-1}
                    >
                      {opt[groupByField as keyof T] as string}
                    </li>
                  )}
                  <li
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${idx === highlightedIndex ? 'bg-blue-100' : ''}`}
                    onMouseDown={() => selectOption(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                  >
                    <div className="flex flex-col">
                      <span>{getOptionLabel ? getOptionLabel(opt) : opt.name}</span>
                      {getOptionDescription && (
                        <span className="text-xs text-gray-500 mt-1 block whitespace-pre-line">
                          {getOptionDescription(opt)}
                        </span>
                      )}
                    </div>
                  </li>
                </Fragment>
              )
            })}
            {freeSolo &&
              inputValue.trim() &&
              !filteredOptions.some(
                (opt) => opt.name.toLowerCase() === inputValue.trim().toLowerCase()
              ) && (
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${highlightedIndex === filteredOptions.length ? 'bg-blue-100' : ''}`}
                  onMouseDown={() => selectFreeSolo(inputValue.trim())}
                  onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                >
                  Add "{inputValue.trim()}"
                </li>
              )}
          </ul>,
          document.body
        )
      : null

  const showClear =
    clearable && ((multiselect && selectedOptions.length > 0) || (!multiselect && value))

  return (
    <>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className={`relative w-full ${className}`}>
        <div
          className={`flex flex-wrap min-h-[42px] px-2 py-0 items-center bg-white border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {multiselect
            ? selectedOptions.map((opt) => (
                <span
                  key={opt.id}
                  className="flex items-center bg-blue-100 text-blue-700 rounded px-1 py-1 mr-1 mt-1 mb-1 text-xs cursor-pointer hover:bg-blue-200"
                  onClick={() => removeSelected(opt.id)}
                  tabIndex={-1}
                >
                  {opt.name}
                  <svg
                    className="ml-1 w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ))
            : null}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 outline-none bg-transparent min-w-[80px] h-10"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-1 p-1 rounded hover:bg-gray-200 focus:outline-none"
              tabIndex={-1}
              aria-label="Clear"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {dropdown}
      </div>
      {helpText && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
    </>
  )
}

export default Autocomplete
