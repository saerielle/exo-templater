import { Upload, X } from 'lucide-react'

import React, { useRef, useState } from 'react'

import { useStories } from '@/hooks/useDexie'

import { Story } from '../../lib/exoloader'

interface StoriesImportFormProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

interface ParsedStory {
  name: string
  content: string
  category: string
  file?: string
  order: number
}

const finalizeContent = (content: string[]) => {
  for (let i = content.length - 1; i >= 0; i--) {
    if (content[i].trim() === '') {
      content.pop()
    } else {
      break
    }
  }

  return content.join('\n')
}

const StoriesImportForm: React.FC<StoriesImportFormProps> = ({ isOpen, onClose, projectId }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parsedStories, setParsedStories] = useState<ParsedStory[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const { addStories } = useStories(projectId)

  const parseStoryFile = (content: string, filename: string): ParsedStory[] => {
    const stories: ParsedStory[] = []
    const lines = content.split('\n')

    let currentCategory = 'Generic'
    let currentStoryName = ''
    let currentContent: string[] = []
    let inStory = false
    let categoryOrder = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (
        line.includes(
          '/*******************************************************************************'
        ) &&
        line.includes('}*/') &&
        i + 2 < lines.length
      ) {
        if (inStory && currentStoryName && currentContent.length > 0) {
          stories.push({
            name: currentStoryName,
            content: finalizeContent(currentContent),
            category: currentCategory,
            file: filename,
            order: categoryOrder++
          })
          currentStoryName = ''
          currentContent = []
          inStory = false
        }

        const categoryLine = lines[i + 1]?.trim()
        if (categoryLine && categoryLine.startsWith('/**') && categoryLine.includes('*')) {
          let categoryName = categoryLine
            .replace(/^\/\*\*\s*/, '')
            .replace(/\s*\*+\/?$/, '')
            .trim()

          if (categoryName) {
            currentCategory = categoryName
          }
        }
      }

      if (line.startsWith('===')) {
        if (inStory && currentStoryName && currentContent.length > 0) {
          stories.push({
            name: currentStoryName,
            content: finalizeContent(currentContent),
            category: currentCategory,
            file: filename,
            order: categoryOrder++
          })
        }

        currentStoryName = line.replace(/=/g, '').trim()
        currentContent = []
        inStory = true
      } else if (inStory) {
        currentContent.push(lines[i])
      }
    }

    if (inStory && currentStoryName && currentContent.length > 0) {
      stories.push({
        name: currentStoryName,
        content: finalizeContent(currentContent),
        category: currentCategory,
        file: filename,
        order: categoryOrder++
      })
    }

    return stories
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files || [])
    await processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(
      (file) => file.name.endsWith('.txt') || file.name.endsWith('.exo')
    )

    if (validFiles.length === 0) {
      setErrors(['Please select .txt or .exo files only'])
      return
    }

    setErrors([])
    const allStories: ParsedStory[] = []

    for (const file of validFiles) {
      try {
        const content = await file.text()
        const stories = parseStoryFile(content, file.name.replace(/\.(txt|exo)$/, ''))
        allStories.push(...stories)
      } catch (error) {
        setErrors((prev) => [...prev, `Error reading file ${file.name}: ${error}`])
      }
    }

    const groupedStories: Record<string, Record<string, ParsedStory[]>> = {}
    for (const story of allStories) {
      const file = story.file || 'default'
      const category = story.category || 'Generic'

      if (!groupedStories[file]) {
        groupedStories[file] = {}
      }
      if (!groupedStories[file][category]) {
        groupedStories[file][category] = []
      }

      groupedStories[file][category].push(story)
    }

    const finalStories: ParsedStory[] = []
    for (const file in groupedStories) {
      for (const category in groupedStories[file]) {
        const categoryStories = groupedStories[file][category]
        categoryStories.forEach((story, index) => {
          story.order = index
          finalStories.push(story)
        })
      }
    }

    setParsedStories(finalStories)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedStories.length === 0) return

    setIsSubmitting(true)
    try {
      const id = crypto.randomUUID()
      const storiesData: Story[] = parsedStories.map((story) => ({
        id,
        projectId,
        dbId: id,
        name: story.name,
        content: story.content,
        category: story.category,
        file: story.file,
        order: story.order
      }))

      await addStories(storiesData)
      onClose()
    } catch (error) {
      setErrors(['Error importing stories: ' + error])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Import Stories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story Files (.txt or .exo)
            </label>
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              } hover:border-blue-400 hover:bg-blue-50 p-6`}
              onClick={handleButtonClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              tabIndex={0}
              style={{ minHeight: 120 }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.exo"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center text-gray-400">
                <Upload size={40} className="mb-2" />
                <span className="text-sm">Drag & drop story files or click to select</span>
                <span className="text-xs mt-1">Supports .txt and .exo files</span>
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm text-red-800">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          )}

          {parsedStories.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preview ({parsedStories.length} stories found)
              </label>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                {parsedStories.map((story, index) => (
                  <div key={index} className="mb-3 p-2 bg-white rounded border">
                    <div className="font-medium text-sm text-gray-900">{story.name}</div>
                    <div className="text-xs text-gray-600">
                      Category: {story.category} | File: {story.file || 'default'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {story.content.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={parsedStories.length === 0 || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Importing...' : `Import ${parsedStories.length} Stories`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StoriesImportForm
