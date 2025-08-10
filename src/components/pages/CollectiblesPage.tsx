'use client'

import { sortBy } from 'lodash-es'
import { Plus, Star } from 'lucide-react'

import React, { useState } from 'react'

import { useCollectibles } from '../../hooks/useDexie'
import { Collectible, ModProject } from '../../lib/exoloader'
import CollectibleDisplay from '../cards/CollectibleDisplay'
import CollectibleForm from '../forms/CollectibleForm/CollectibleForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const CollectiblesPage: React.FC<PageProps> = ({ projectId, project }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCollectible, setEditingCollectible] = useState<Collectible | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Collectible | null>(null)

  const { collectibles, images, addCollectible, updateCollectible, deleteCollectible } =
    useCollectibles(projectId)

  const handleSave = async (collectible: Collectible) => {
    if (editingCollectible) {
      await updateCollectible(collectible.dbId, collectible)
    } else {
      addCollectible(collectible)
    }
    setShowForm(false)
    setEditingCollectible(null)
  }

  const handleEdit = (collectible: Collectible) => {
    setEditingCollectible(collectible)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Collectibles</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingCollectible(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Collectible
        </button>
      </div>

      {collectibles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Collectibles Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first collectible to get started with your mod.
          </p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingCollectible(null)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Collectible
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start">
          {sortBy(collectibles, 'name').map((collectible: Collectible) => (
            <CollectibleDisplay
              key={collectible.id}
              card={collectible}
              image={images[collectible.id]}
              onEdit={() => handleEdit(collectible)}
              onDelete={() => setDeleteTarget(collectible)}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CollectibleForm
          collectible={editingCollectible || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingCollectible(null)
          }}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Collectible"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteCollectible(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CollectiblesPage
