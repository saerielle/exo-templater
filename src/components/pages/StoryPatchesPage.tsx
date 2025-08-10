'use client'

import { ChevronDown, ChevronRight, Edit, FileText, GripVertical, Plus, Trash2 } from 'lucide-react'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useStoryPatches } from '../../hooks/useDexie'
import { ModProject, StoryPatch, StoryPatchType } from '../../lib/exoloader'
import StoryPatchForm from '../forms/StoryPatchForm/StoryPatchForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

interface GroupedStoryPatches {
  [file: string]: {
    [category: string]: StoryPatch[]
  }
}

const StoryPatchesPage: React.FC<PageProps> = ({ projectId, project }) => {
  const {
    storyPatches,
    addStoryPatch,
    updateStoryPatch,
    deleteStoryPatch,
    deleteStoryPatchesByFile
  } = useStoryPatches(projectId)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPatch, setEditingPatch] = useState<StoryPatch | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StoryPatch | null>(null)
  const [createPatchFile, setCreatePatchFile] = useState<string>('')
  const [createPatchCategory, setCreatePatchCategory] = useState<string>('')
  const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set())
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  const groupedStoryPatches: GroupedStoryPatches = useMemo(() => {
    const grouped = storyPatches.reduce((acc, patch) => {
      const file = patch.file?.length ? patch.file : `${project.folderName.toLowerCase()}_patches`
      const category = patch.category?.length ? patch.category : 'Generic'

      if (!acc[file]) {
        acc[file] = {}
      }
      if (!acc[file][category]) {
        acc[file][category] = []
      }

      acc[file][category].push(patch)
      return acc
    }, {} as GroupedStoryPatches)

    Object.keys(grouped).forEach((file) => {
      Object.keys(grouped[file]).forEach((category) => {
        grouped[file][category].sort((a, b) => {
          const orderA = a.order ?? 0
          const orderB = b.order ?? 0
          return orderA - orderB
        })
      })
    })

    const sortedGrouped: GroupedStoryPatches = {}
    const sortedFiles = Object.keys(grouped).sort()

    sortedFiles.forEach((file) => {
      sortedGrouped[file] = {}
      const sortedCategories = Object.keys(grouped[file]).sort()

      sortedCategories.forEach((category) => {
        sortedGrouped[file][category] = grouped[file][category]
      })
    })

    return sortedGrouped
  }, [storyPatches, project.folderName])

  useEffect(() => {
    if (storyPatches.length > 0 && !initialized) {
      const files = new Set<string>()

      storyPatches.forEach((patch) => {
        const file = patch.file?.length ? patch.file : `${project.folderName.toLowerCase()}_patches`

        files.add(file)
      })

      setCollapsedFiles(files)
      setInitialized(true)
    }
  }, [storyPatches, project.folderName, initialized])

  const handleCreatePatch = async (patchData: Partial<StoryPatch>) => {
    const file = patchData.file?.length
      ? patchData.file
      : `${project.folderName.toLowerCase()}_patches`
    const category = patchData.category?.length ? patchData.category : 'Generic'

    const categoryPatches = storyPatches.filter((patch) => {
      const patchFile = patch.file?.length
        ? patch.file
        : `${project.folderName.toLowerCase()}_patches`
      const patchCategory = patch.category?.length ? patch.category : 'Generic'
      return patchFile === file && patchCategory === category
    })

    const maxOrder =
      categoryPatches.length > 0 ? Math.max(...categoryPatches.map((p) => p.order ?? 0)) : -1

    let newPatch: StoryPatch
    if (patchData.type === 'insert') {
      newPatch = {
        id: crypto.randomUUID(),
        projectId,
        dbId: crypto.randomUUID(),
        storyId: patchData.storyId || '',
        type: StoryPatchType.Insert,
        body: patchData.body || '',
        file: patchData.file,
        category: patchData.category,
        description: patchData.description,
        order: maxOrder + 1,
        locationKey: (patchData as any).locationKey || '',
        locationIndex: (patchData as any).locationIndex ?? 0
      }
    } else {
      newPatch = {
        id: crypto.randomUUID(),
        projectId,
        dbId: crypto.randomUUID(),
        storyId: patchData.storyId || '',
        type: StoryPatchType.Replace,
        body: patchData.body || '',
        file: patchData.file,
        category: patchData.category,
        description: patchData.description,
        order: maxOrder + 1,
        startKey: (patchData as any).startKey || '',
        endKey: (patchData as any).endKey || '',
        startIndex: (patchData as any).startIndex ?? 0,
        endIndex: (patchData as any).endIndex ?? 0
      }
    }
    await addStoryPatch(newPatch)
    setShowCreateModal(false)
  }

  const handleCreatePatchInFile = async (file: string) => {
    setCreatePatchFile(file)
    setCreatePatchCategory('')
    setShowCreateModal(true)
  }

  const handleCreatePatchInCategory = async (file: string, category: string) => {
    setCreatePatchFile(file)
    setCreatePatchCategory(category)
    setShowCreateModal(true)
  }

  const handleUpdatePatch = async (patchData: Partial<StoryPatch>) => {
    if (editingPatch) {
      await updateStoryPatch(editingPatch.dbId, patchData)
      setEditingPatch(null)
    }
  }

  const handleDeleteAllPatchesInFile = async (file: string) => {
    const patchCount = Object.values(groupedStoryPatches[file]).reduce(
      (sum, patches) => sum + patches.length,
      0
    )
    if (
      confirm(
        `Are you sure you want to delete all ${patchCount} patches from "${file}"? This action cannot be undone.`
      )
    ) {
      const actualFile = file === `${project.folderName.toLowerCase()}_patches` ? '' : file
      await deleteStoryPatchesByFile(actualFile)
    }
  }

  const handleDeleteAllPatchesInCategory = async (file: string, category: string) => {
    const categoryPatches = groupedStoryPatches[file][category]
    if (
      confirm(
        `Are you sure you want to delete all ${categoryPatches.length} patches from category "${category}" in "${file}"? This action cannot be undone.`
      )
    ) {
      for (const patch of categoryPatches) {
        await deleteStoryPatch(patch.dbId)
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

  const getPatchPreview = (patch: StoryPatch): string => {
    if (patch.type === 'insert') {
      const locationKey = (patch as any).locationKey || ''
      return `Insert ${patch.storyId} @ ${locationKey}`
    } else {
      const startKey = (patch as any).startKey || ''
      const endKey = (patch as any).endKey || ''
      return `Replace ${patch.storyId} ${startKey} ${endKey}`
    }
  }

  const handleDragStart = useCallback((e: React.DragEvent, patch: StoryPatch) => {
    e.dataTransfer.setData('text/plain', patch.dbId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetPatch: StoryPatch) => {
      e.preventDefault()
      const draggedPatchId = e.dataTransfer.getData('text/plain')

      if (draggedPatchId === targetPatch.dbId) return

      const draggedPatch = storyPatches.find((p) => p.dbId === draggedPatchId)
      if (!draggedPatch) return

      const draggedFile = draggedPatch.file?.length
        ? draggedPatch.file
        : `${project.folderName.toLowerCase()}_patches`
      const draggedCategory = draggedPatch.category?.length ? draggedPatch.category : 'Generic'
      const targetFile = targetPatch.file?.length
        ? targetPatch.file
        : `${project.folderName.toLowerCase()}_patches`
      const targetCategory = targetPatch.category?.length ? targetPatch.category : 'Generic'

      if (draggedFile !== targetFile || draggedCategory !== targetCategory) return

      const categoryPatches = storyPatches
        .filter((patch) => {
          const patchFile = patch.file?.length
            ? patch.file
            : `${project.folderName.toLowerCase()}_patches`
          const patchCategory = patch.category?.length ? patch.category : 'Generic'
          return patchFile === targetFile && patchCategory === targetCategory
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const targetIndex = categoryPatches.findIndex((p) => p.dbId === targetPatch.dbId)
      const draggedIndex = categoryPatches.findIndex((p) => p.dbId === draggedPatchId)

      if (targetIndex === -1 || draggedIndex === -1) return

      const reorderedPatches = [...categoryPatches]
      const [movedPatch] = reorderedPatches.splice(draggedIndex, 1)
      reorderedPatches.splice(targetIndex, 0, movedPatch)

      for (let i = 0; i < reorderedPatches.length; i++) {
        const patch = reorderedPatches[i]
        if (patch.order !== i) {
          await updateStoryPatch(patch.dbId, { order: i })
        }
      }
    },
    [storyPatches, project.folderName, updateStoryPatch]
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
        <h1 className="text-2xl font-bold text-gray-900">Story Patches</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Patch
        </button>
      </div>

      {Object.keys(groupedStoryPatches).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Story Patches Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first patch to start modifying base game stories.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Patch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedStoryPatches).map(([file, categories]) => (
            <div key={file} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => toggleFileCollapse(file)}
                  className="flex items-center space-x-2 hover:text-teal-600 transition-colors flex-1 p-2 rounded cursor-pointer"
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
                    {Object.values(categories).reduce((sum, patches) => sum + patches.length, 0)}{' '}
                    patches
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCreatePatchInFile(file)}
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      title="Add Patch to File"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteAllPatchesInFile(file)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete All Patches in File"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {!collapsedFiles.has(file) && (
                <div className="space-y-3">
                  {Object.entries(categories).map(([category, categoryPatches]) => (
                    <div key={`${file}-${category}`} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => toggleCategoryCollapse(file, category)}
                          className="flex items-center space-x-2 hover:text-teal-600 transition-colors flex-1 p-1 rounded cursor-pointer"
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
                            {categoryPatches.length}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleCreatePatchInCategory(file, category)}
                              className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                              title="Add Patch to Category"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteAllPatchesInCategory(file, category)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                              title="Delete All Patches in Category"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {!collapsedCategories.has(`${file}-${category}`) && (
                        <div className="space-y-1">
                          {categoryPatches.map((patch) => (
                            <div
                              key={patch.dbId}
                              draggable
                              onDragStart={(e) => handleDragStart(e, patch)}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, patch)}
                              className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors cursor-move"
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <GripVertical
                                  size={14}
                                  className="text-gray-400 mr-2 flex-shrink-0"
                                />
                                <div className="font-mono text-xs text-gray-600 truncate">
                                  {getPatchPreview(patch)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => setEditingPatch(patch)}
                                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                  title="Edit Patch"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(patch)}
                                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                  title="Delete Patch"
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
        <StoryPatchForm
          storyPatch={undefined}
          onSave={handleCreatePatch}
          onCancel={() => setShowCreateModal(false)}
          projectId={projectId}
          initialFile={createPatchFile || undefined}
          initialCategory={createPatchCategory || undefined}
        />
      )}

      {editingPatch && (
        <StoryPatchForm
          storyPatch={editingPatch}
          onSave={handleUpdatePatch}
          onCancel={() => setEditingPatch(null)}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Story Patch"
        description={`Are you sure you want to delete patch for story '${deleteTarget?.storyId}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteStoryPatch(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default StoryPatchesPage
