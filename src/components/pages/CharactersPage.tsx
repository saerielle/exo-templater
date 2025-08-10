import { Plus, Users } from 'lucide-react'

import React, { useState } from 'react'

import { useCharacters } from '../../hooks/useDexie'
import { Character, ModProject } from '../../lib/exoloader'
import CharacterDisplay from '../cards/CharacterDisplay'
import CharacterForm from '../forms/CharacterForm/CharacterForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const CharactersPage: React.FC<PageProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Character | null>(null)

  const { characters, portraits, addCharacter, updateCharacter, deleteCharacter } =
    useCharacters(projectId)

  const handleSave = (character: Character) => {
    if (editingCharacter) {
      updateCharacter(character.dbId, character)
    } else {
      addCharacter(character)
    }
    setShowForm(false)
    setEditingCharacter(null)
  }

  const handleEdit = (character: Character) => {
    setEditingCharacter(character)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Characters</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingCharacter(null)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Characters Yet</h3>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingCharacter(null)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character: Character) => (
            <CharacterDisplay
              key={character.id}
              character={character}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              projectId={projectId}
              portrait={portraits[character.dbId]}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CharacterForm
          character={editingCharacter || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingCharacter(null)
          }}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Character"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteCharacter(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CharactersPage
