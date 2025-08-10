'use client'

import React, { useEffect, useState } from 'react'

import { useErrorHandler } from '../../hooks/useDexie'

interface ProjectFormData {
  name: string
  description: string
  folderName: string
}

interface ProjectFormProps {
  mode: 'create' | 'edit'
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => Promise<void>
  initialData?: Partial<ProjectFormData>
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const { getError, setError, clearError } = useErrorHandler()
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    folderName: ''
  })

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        folderName: initialData.folderName || ''
      })
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        folderName: ''
      })
    }
  }, [initialData, mode, isOpen])

  const handleSubmit = async () => {
    if (!formData.name || !formData.folderName) return

    try {
      await onSubmit(formData)
      onClose()
      clearError('project-form')
    } catch (error) {
      setError('project-form', `Failed to ${mode} project`)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      folderName: mode === 'create' ? name.replace(/[^a-zA-Z0-9]/g, '') : formData.folderName
    })
  }

  const handleFolderNameChange = (folderName: string) => {
    setFormData({
      ...formData,
      folderName: folderName.replace(/[^a-zA-Z0-9]/g, '')
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'create' ? 'Create New Project' : 'Edit Project'}
        </h3>

        {getError('project-form') && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {getError('project-form')}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mod Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <input
              type="text"
              value={formData.folderName}
              onChange={(e) => handleFolderNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ModName"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="A brief description of your mod..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.folderName}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectForm
