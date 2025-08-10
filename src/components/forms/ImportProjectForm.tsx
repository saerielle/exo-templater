import { Upload, X } from 'lucide-react'

import React, { useRef, useState } from 'react'

import { importProject } from '@/lib/import'

interface ImportProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: (projectId: string) => void
}

interface ProjectImportData {
  name: string
  description: string
  folderName: string
  files: File[]
}

const ImportProjectForm: React.FC<ImportProjectFormProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [importData, setImportData] = useState<ProjectImportData | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    if (files.length === 0) {
      setErrors(['Please select a folder to import'])
      return
    }

    setErrors([])

    try {
      const firstFile = files[0]
      const pathParts = firstFile.webkitRelativePath?.split('/') || [firstFile.name]
      const rootFolderName = pathParts[0]

      const readmeFile = files.find(
        (f) =>
          f.name.toLowerCase() === 'readme.md' &&
          f.webkitRelativePath?.startsWith(rootFolderName + '/')
      )

      let projectName = rootFolderName
      let projectDescription = ''

      if (readmeFile) {
        try {
          const readmeContent = await readmeFile.text()
          const nameMatch = readmeContent.match(/^#\s*(.+)$/m)
          if (nameMatch) {
            projectName = nameMatch[1].trim()
          }

          const descMatch = readmeContent.match(/^#\s*.+?\n\n(.+?)(?=\n##|\n$)/)
          if (descMatch) {
            projectDescription = descMatch[1].trim()
          }
        } catch (error) {
          console.warn('Could not parse README.md:', error)
        }
      }

      setImportData({
        name: projectName,
        description: projectDescription,
        folderName: rootFolderName,
        files: files
      })
    } catch (error) {
      setErrors(['Error processing files: ' + error])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importData) return

    setIsSubmitting(true)
    try {
      const projectId = await importProject(importData)
      onImportComplete(projectId)
      onClose()
    } catch (error) {
      setErrors(['Error importing project: ' + error])
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
          <h2 className="text-lg font-semibold text-gray-900">Import Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Folder</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white rounded-lg p-6">
              <input
                ref={inputRef}
                type="file"
                // @ts-ignore
                webkitdirectory=""
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center text-gray-400 mb-4">
                <Upload size={40} className="mb-2" />
                <span className="text-sm text-center">Select the main project folder</span>
                <span className="text-xs text-center mt-1 text-gray-500">
                  Choose the folder that contains your mod's content
                </span>
                <span className="text-xs text-center text-gray-500">
                  (the main folder, not individual files or subfolders)
                </span>
              </div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Choose Folder
              </button>
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

          {importData && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Project Preview</label>
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {importData.name}
                  </div>
                  <div>
                    <span className="font-medium">Folder:</span> {importData.folderName}
                  </div>
                  {importData.description && (
                    <div>
                      <span className="font-medium">Description:</span> {importData.description}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Files:</span> {importData.files.length} files
                    found
                  </div>
                </div>
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
              disabled={!importData || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Importing...' : 'Import Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImportProjectForm
