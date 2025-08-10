'use client'

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit,
  GripVertical,
  Plus,
  Trash2,
  Upload
} from 'lucide-react'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useStories } from '../../hooks/useDexie'
import { FullModProject, Story } from '../../lib/exoloader'
import StoriesImportForm from '../forms/StoriesImportForm'
import StoriesPresetsForm from '../forms/StoriesPresetsForm'
import StoryForm from '../forms/StoryForm/StoryForm'

interface PageProps {
  projectId: string
  project: FullModProject
}

interface GroupedStories {
  [file: string]: {
    [category: string]: Story[]
  }
}

const StoriesPage: React.FC<PageProps> = ({ projectId, project }) => {
  const { stories, addStory, updateStory, deleteStory, deleteStoriesByFile } = useStories(projectId)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPresetsModal, setShowPresetsModal] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [createStoryFile, setCreateStoryFile] = useState<string>('')
  const [createStoryCategory, setCreateStoryCategory] = useState<string>('')
  const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set())
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  const groupedStories: GroupedStories = useMemo(() => {
    const grouped = stories.reduce((acc, story) => {
      const file = story.file?.length ? story.file : `${project.folderName.toLowerCase()}_stories`
      const category = story.category?.length ? story.category : 'Generic'

      if (!acc[file]) {
        acc[file] = {}
      }
      if (!acc[file][category]) {
        acc[file][category] = []
      }

      acc[file][category].push(story)
      return acc
    }, {} as GroupedStories)

    Object.keys(grouped).forEach((file) => {
      Object.keys(grouped[file]).forEach((category) => {
        grouped[file][category].sort((a, b) => {
          const orderA = a.order ?? 0
          const orderB = b.order ?? 0
          return orderA - orderB
        })
      })
    })

    const sortedGrouped: GroupedStories = {}
    const sortedFiles = Object.keys(grouped).sort()

    sortedFiles.forEach((file) => {
      sortedGrouped[file] = {}
      const sortedCategories = Object.keys(grouped[file]).sort()

      sortedCategories.forEach((category) => {
        sortedGrouped[file][category] = grouped[file][category]
      })
    })

    return sortedGrouped
  }, [stories, project.folderName])

  useEffect(() => {
    if (stories.length > 0 && !initialized) {
      const files = new Set<string>()
      const categories = new Set<string>()

      stories.forEach((story) => {
        const file = story.file?.length ? story.file : `${project.folderName.toLowerCase()}_stories`
        const category = story.category?.length ? story.category : 'Generic'

        files.add(file)
        categories.add(`${file}-${category}`)
      })

      setCollapsedFiles(files)
      setCollapsedCategories(categories)
      setInitialized(true)
    }
  }, [stories, project.folderName, initialized])

  const handleCreateStory = async (storyData: Partial<Story>) => {
    const file = storyData.file?.length
      ? storyData.file
      : `${project.folderName.toLowerCase()}_stories`
    const category = storyData.category?.length ? storyData.category : 'Generic'

    const categoryStories = stories.filter((story) => {
      const storyFile = story.file?.length
        ? story.file
        : `${project.folderName.toLowerCase()}_stories`
      const storyCategory = story.category?.length ? story.category : 'Generic'
      return storyFile === file && storyCategory === category
    })

    const maxOrder =
      categoryStories.length > 0 ? Math.max(...categoryStories.map((s) => s.order ?? 0)) : -1

    const id = crypto.randomUUID()
    const newStory: Story = {
      id,
      projectId,
      dbId: id,
      name: storyData.name || '',
      content: storyData.content || '',
      file: storyData.file,
      category: storyData.category,
      order: maxOrder + 1
    }
    await addStory(newStory)
    setShowCreateModal(false)
  }

  const handleCreateStoryInFile = async (file: string) => {
    setCreateStoryFile(file)
    setCreateStoryCategory('')
    setShowCreateModal(true)
  }

  const handleCreateStoryInCategory = async (file: string, category: string) => {
    setCreateStoryFile(file)
    setCreateStoryCategory(category)
    setShowCreateModal(true)
  }

  const handleUpdateStory = async (storyData: Partial<Story>) => {
    if (editingStory) {
      await updateStory(editingStory.dbId, storyData)
      setEditingStory(null)
    }
  }

  const handleDeleteStory = async (story: Story) => {
    if (confirm(`Are you sure you want to delete the story "${story.name}"?`)) {
      await deleteStory(story.dbId)
    }
  }

  const handleDeleteAllStoriesInFile = async (file: string) => {
    const storyCount = Object.values(groupedStories[file]).reduce(
      (sum, stories) => sum + stories.length,
      0
    )
    if (
      confirm(
        `Are you sure you want to delete all ${storyCount} stories from "${file}"? This action cannot be undone.`
      )
    ) {
      const actualFile = file === `${project.folderName.toLowerCase()}_stories` ? '' : file
      await deleteStoriesByFile(actualFile)
    }
  }

  const handleDeleteAllStoriesInCategory = async (file: string, category: string) => {
    const categoryStories = groupedStories[file][category]
    if (
      confirm(
        `Are you sure you want to delete all ${categoryStories.length} stories from category "${category}" in "${file}"? This action cannot be undone.`
      )
    ) {
      for (const story of categoryStories) {
        await deleteStory(story.dbId)
      }
    }
  }

  const toggleFileCollapse = (file: string) => {
    setCollapsedFiles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(file)) {
        newSet.delete(file)
      } else {
        newSet.add(file)
      }
      return newSet
    })
  }

  const toggleCategoryCollapse = (file: string, category: string) => {
    const key = `${file}-${category}`
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const handleDragStart = useCallback((e: React.DragEvent, story: Story) => {
    e.dataTransfer.setData('text/plain', story.dbId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetStory: Story) => {
      e.preventDefault()
      const draggedStoryId = e.dataTransfer.getData('text/plain')

      if (draggedStoryId === targetStory.dbId) return

      const draggedStory = stories.find((s) => s.dbId === draggedStoryId)
      if (!draggedStory) return

      const draggedFile = draggedStory.file?.length
        ? draggedStory.file
        : `${project.folderName.toLowerCase()}_stories`
      const draggedCategory = draggedStory.category?.length ? draggedStory.category : 'Generic'
      const targetFile = targetStory.file?.length
        ? targetStory.file
        : `${project.folderName.toLowerCase()}_stories`
      const targetCategory = targetStory.category?.length ? targetStory.category : 'Generic'

      if (draggedFile !== targetFile || draggedCategory !== targetCategory) return

      const categoryStories = stories
        .filter((story) => {
          const storyFile = story.file?.length
            ? story.file
            : `${project.folderName.toLowerCase()}_stories`
          const storyCategory = story.category?.length ? story.category : 'Generic'
          return storyFile === targetFile && storyCategory === targetCategory
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const targetIndex = categoryStories.findIndex((s) => s.dbId === targetStory.dbId)
      const draggedIndex = categoryStories.findIndex((s) => s.dbId === draggedStoryId)

      if (targetIndex === -1 || draggedIndex === -1) return

      const reorderedStories = [...categoryStories]
      const [movedStory] = reorderedStories.splice(draggedIndex, 1)
      reorderedStories.splice(targetIndex, 0, movedStory)

      for (let i = 0; i < reorderedStories.length; i++) {
        const story = reorderedStories[i]
        if (story.order !== i) {
          await updateStory(story.dbId, { order: i })
        }
      }
    },
    [stories, project.folderName, updateStory]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPresetsModal(true)}
            className="border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <BookOpen size={16} className="mr-2" />
            Presets
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Import Stories
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Story
          </button>
        </div>
      </div>

      {Object.keys(groupedStories).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stories Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first story to get started with your mod.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedStories).map(([file, categories]) => (
            <div key={file} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => toggleFileCollapse(file)}
                  className="flex items-center space-x-2 hover:text-indigo-600 transition-colors flex-1 p-2 rounded cursor-pointer"
                >
                  {collapsedFiles.has(file) ? (
                    <ChevronRight size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                  <h3 className="font-semibold text-gray-900 text-lg">{file}</h3>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {Object.values(categories).reduce((sum, stories) => sum + stories.length, 0)}{' '}
                    stories
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCreateStoryInFile(file)}
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      title="Add Story to File"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteAllStoriesInFile(file)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete All Stories in File"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {!collapsedFiles.has(file) && (
                <div className="space-y-3">
                  {Object.entries(categories).map(([category, categoryStories]) => (
                    <div key={`${file}-${category}`} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => toggleCategoryCollapse(file, category)}
                          className="flex items-center space-x-2 hover:text-indigo-60 transition-colors flex-1 p-1 rounded cursor-pointer"
                        >
                          {collapsedCategories.has(`${file}-${category}`) ? (
                            <ChevronRight size={14} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={14} className="text-gray-500" />
                          )}
                          <h4 className="font-medium text-gray-800 text-sm">{category}</h4>
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {categoryStories.length}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleCreateStoryInCategory(file, category)}
                              className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                              title="Add Story to Category"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteAllStoriesInCategory(file, category)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                              title="Delete All Stories in Category"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {!collapsedCategories.has(`${file}-${category}`) && (
                        <div className="space-y-1">
                          {categoryStories.map((story, index) => (
                            <div
                              key={story.dbId}
                              draggable
                              onDragStart={(e) => handleDragStart(e, story)}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, story)}
                              className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors cursor-move"
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <GripVertical
                                  size={14}
                                  className="text-gray-400 mr-2 flex-shrink-0"
                                />
                                <div className="font-mono text-xs text-gray-600 truncate">
                                  === {story.name} ==========
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => setEditingStory(story)}
                                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                  title="Edit Story"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteStory(story)}
                                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                  title="Delete Story"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <StoryForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateStory}
          projectId={projectId}
          initialData={{
            file: createStoryFile || undefined,
            category: createStoryCategory || undefined
          }}
        />
      )}

      {showImportModal && (
        <StoriesImportForm
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          projectId={projectId}
        />
      )}

      {editingStory && (
        <StoryForm
          isOpen={true}
          onClose={() => setEditingStory(null)}
          onSubmit={handleUpdateStory}
          projectId={projectId}
          initialData={editingStory}
        />
      )}

      {showPresetsModal && (
        <StoriesPresetsForm
          isOpen={showPresetsModal}
          onClose={() => setShowPresetsModal(false)}
          projectId={projectId}
          project={project}
        />
      )}
    </div>
  )
}

export default StoriesPage
