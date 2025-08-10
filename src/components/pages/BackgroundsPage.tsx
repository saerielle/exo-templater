'use client'

import { Image, Plus } from 'lucide-react'

import React, { useState } from 'react'

import { useBackgrounds } from '../../hooks/useDexie'
import { Background } from '../../lib/exoloader'
import BackgroundDisplay from '../cards/BackgroundDisplay'
import BackgroundForm from '../forms/BackgroundForm/BackgroundForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
}

const BackgroundsPage: React.FC<PageProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingBackground, setEditingBackground] = useState<Background | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Background | null>(null)

  const { backgrounds, addBackground, updateBackground, deleteBackground, images } =
    useBackgrounds(projectId)

  const handleSave = async (background: Background) => {
    if (editingBackground) {
      await updateBackground(editingBackground.dbId, background)
    } else {
      await addBackground(background)
    }
    setShowForm(false)
    setEditingBackground(null)
  }

  const handleEdit = (background: Background) => {
    setEditingBackground(background)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Backgrounds</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingBackground(null)
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Background
        </button>
      </div>

      {backgrounds.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Backgrounds Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first background to get started with your mod.
          </p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingBackground(null)
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Background
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {backgrounds.map((background: Background) => (
            <BackgroundDisplay
              key={background.dbId}
              background={background}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              projectId={projectId}
              mainImage={images[background.dbId]?.main}
              thumbnailImage={images[background.dbId]?.thumbnail}
            />
          ))}
        </div>
      )}

      {showForm && (
        <BackgroundForm
          background={editingBackground || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingBackground(null)
          }}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Background"
        description={`Are you sure you want to delete '${deleteTarget?.id}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteBackground(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default BackgroundsPage
