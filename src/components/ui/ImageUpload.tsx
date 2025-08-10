import React, { useRef, useState } from 'react'

interface ImageUploadProps {
  label?: string
  value?: Blob
  onChange: (file: Blob) => void
  accept?: string
  preview?: boolean
  helpText?: string
  disabled?: boolean
  compact?: boolean
  children?: React.ReactNode
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*',
  preview = true,
  helpText,
  disabled = false,
  compact = false,
  children
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleButtonClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'} ${compact ? 'p-3' : 'p-6'}`}
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        tabIndex={0}
        aria-disabled={disabled}
        style={{ minHeight: compact ? 60 : 120 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {value && preview ? (
          <img
            src={URL.createObjectURL(value)}
            alt="Preview"
            className="max-h-32 rounded border border-gray-200 shadow mb-2"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <svg
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4m0 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            <span className="text-sm">Drag & drop or click to select</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleButtonClick}
          className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
          style={{ display: 'none' }}
          tabIndex={-1}
        >
          Choose File
        </button>
      </div>
      {helpText && <div className="text-xs text-gray-500">{helpText}</div>}
      {children}
    </div>
  )
}

export default ImageUpload
