import { sortBy } from 'lodash-es'
import { CreditCard, Plus, Users } from 'lucide-react'

import React, { useState } from 'react'

import { useCards } from '../../hooks/useDexie'
import { Card, ModProject } from '../../lib/exoloader'
import CardDisplay from '../cards/CardDisplay'
import CardCharacterPreset from '../forms/CardCharacterPreset'
import CardForm from '../forms/CardForm/CardForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const CardsPage: React.FC<PageProps> = ({ projectId, project }) => {
  const [showForm, setShowForm] = useState(false)
  const [showCharacterPreset, setShowCharacterPreset] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null)

  const { cards, images, addCard, updateCard, deleteCard } = useCards(projectId)

  const handleSave = (card: Card) => {
    if (editingCard) {
      updateCard(card.dbId, card)
    } else {
      addCard(card)
    }
    setShowForm(false)
    setEditingCard(null)
  }

  const handleEdit = (card: Card) => {
    setEditingCard(card)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cards</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCharacterPreset(true)}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Users size={16} className="mr-2" />
            Generate Character Cards
          </button>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingCard(null)
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Card
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Yet</h3>
          <p className="text-gray-600 mb-6">Create your first card to get started with your mod.</p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingCard(null)
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Card
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start">
          {sortBy(cards, 'name').map((card: Card) => (
            <CardDisplay
              key={card.id}
              card={card}
              image={images[card.id]}
              onEdit={() => handleEdit(card)}
              onDelete={() => setDeleteTarget(card)}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CardForm
          card={editingCard || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingCard(null)
          }}
          projectId={projectId}
        />
      )}

      {showCharacterPreset && (
        <CardCharacterPreset projectId={projectId} onClose={() => setShowCharacterPreset(false)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Card"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteCard(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CardsPage
