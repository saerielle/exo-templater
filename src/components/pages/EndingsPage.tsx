import { Image, Plus } from 'lucide-react'

import React, { useState } from 'react'

import { useEndingModifications, useEndings } from '../../hooks/useDexie'
import { Ending, EndingModification, ModProject } from '../../lib/exoloader'
import EndingDisplay from '../cards/EndingDisplay'
import EndingModificationDisplay from '../cards/EndingModificationDisplay'
import EndingForm from '../forms/EndingForm/EndingForm'
import EndingModificationForm from '../forms/EndingModificationForm/EndingModificationForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const EndingsPage: React.FC<PageProps> = ({ projectId, project }) => {
  const [showForm, setShowForm] = useState(false)
  const [showModificationForm, setShowModificationForm] = useState(false)
  const [editingEnding, setEditingEnding] = useState<Ending | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Ending | null>(null)
  const [editingEndingModification, setEditingEndingModification] =
    useState<EndingModification | null>(null)
  const [deleteModificationTarget, setDeleteModificationTarget] =
    useState<EndingModification | null>(null)

  const { endings, images, addEnding, updateEnding, deleteEnding } = useEndings(projectId)
  const {
    endingModifications,
    addEndingModification,
    updateEndingModification,
    deleteEndingModification
  } = useEndingModifications(projectId)

  const handleSave = (ending: Ending) => {
    if (editingEnding) {
      updateEnding(ending.dbId, ending)
    } else {
      addEnding(ending)
    }
    setShowForm(false)
    setEditingEnding(null)
  }

  const handleEdit = (ending: Ending) => {
    setEditingEnding(ending)
    setShowForm(true)
  }

  const handleModifySave = (endingModification: EndingModification) => {
    if (editingEndingModification) {
      updateEndingModification(endingModification.dbId, endingModification)
    } else {
      addEndingModification(endingModification)
    }
    setShowModificationForm(false)
    setEditingEndingModification(null)
  }

  const handleModifyEdit = (endingModification: EndingModification) => {
    setEditingEndingModification(endingModification)
    setShowModificationForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Endings</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(true)
              setEditingEnding(null)
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Ending
          </button>
          <button
            onClick={() => {
              setShowModificationForm(true)
              setEditingEndingModification(null)
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Ending Modification
          </button>
        </div>
      </div>

      {endings.length === 0 && endingModifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Endings Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first ending to get started with your mod.
          </p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingEnding(null)
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Ending
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {endings.map((ending: Ending) => (
            <EndingDisplay
              key={ending.id}
              ending={ending}
              onEdit={() => handleEdit(ending)}
              onDelete={() => setDeleteTarget(ending)}
              endingImage={images[ending.dbId]}
            />
          ))}
          {endingModifications.map((endingModification: EndingModification) => (
            <EndingModificationDisplay
              key={endingModification.id}
              endingModification={endingModification}
              onEdit={() => handleModifyEdit(endingModification)}
              onDelete={() => setDeleteModificationTarget(endingModification)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <EndingForm
          ending={editingEnding || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingEnding(null)
          }}
          projectId={projectId}
        />
      )}

      {showModificationForm && (
        <EndingModificationForm
          ending={editingEndingModification || undefined}
          onSave={handleModifySave}
          onCancel={() => setShowModificationForm(false)}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Ending"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteEnding(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={!!deleteModificationTarget}
        title="Delete Ending Modification"
        description={`Are you sure you want to delete '${deleteModificationTarget?.id}'? This action cannot be undone.`}
        onCancel={() => setDeleteModificationTarget(null)}
        onConfirm={() => {
          if (deleteModificationTarget) deleteEndingModification(deleteModificationTarget.dbId)
          setDeleteModificationTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default EndingsPage
