import React, { useState } from 'react'

import { useCharacters } from '@/hooks/useDexie'

import { DatabaseService } from '../../lib/database'
import { CardSuit, Character } from '../../lib/exoloader'
import Autocomplete from '../ui/Autocomplete'
import InputGroup from '../ui/InputGroup'
import SelectGroup from '../ui/SelectGroup'

interface CardCharacterPresetProps {
  projectId: string
  onClose: () => void
}

const cardSuitOptions = [
  { value: CardSuit.Physical, label: '🔴 Physical' },
  { value: CardSuit.Mental, label: '🔵 Mental' },
  { value: CardSuit.Social, label: '🟡 Social' },
  { value: CardSuit.Wild, label: '💗 Wild' }
]

const CardCharacterPreset: React.FC<CardCharacterPresetProps> = ({ projectId, onClose }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [cardName, setCardName] = useState('')
  const [cardSuit, setCardSuit] = useState<CardSuit>(CardSuit.Physical)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { characters } = useCharacters(projectId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCharacter) {
      setError('Please select a character')
      return
    }

    if (!cardName.trim()) {
      setError('Please enter a card name')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const existingCards = await DatabaseService.getCharacterCards(projectId, selectedCharacter.id)
      if (existingCards.length > 0) {
        setError(
          `Character "${selectedCharacter.nickname}" already has ${existingCards.length} card(s)`
        )
        setIsSubmitting(false)
        return
      }

      await DatabaseService.createCharacterCards(projectId, selectedCharacter, cardName, cardSuit)
      await DatabaseService.createCharacterAchievement(projectId, selectedCharacter, cardName)

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating cards')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Generate Character Cards and Achievement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Generate 3 upgradeable cards for a character. If the character has portraits, they will be
          automatically added to the cards as art (don't forget to update artist's details!).
          <br />
          Achievement for the character also will be generated, because base game awards the
          achievement for unlocking the last character card.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Autocomplete
            label="Select Character"
            options={characters}
            value={selectedCharacter}
            onChange={setSelectedCharacter}
            placeholder="Search for a character..."
            getOptionLabel={(char) => char.nickname}
            getOptionDescription={(char) => char.name}
            disabled={isSubmitting}
          />

          <InputGroup
            label="Card Name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Insight"
            required
            disabled={isSubmitting}
            helpText={`The cards will be named "${selectedCharacter?.nickname || '[character]'}'s ${cardName || '[card name]'} I", etc.`}
          />

          <SelectGroup
            label="Card Suit"
            value={cardSuit}
            onChange={(e) => setCardSuit(e.target.value as CardSuit)}
            options={cardSuitOptions}
            required
            disabled={isSubmitting}
          />

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
              disabled={isSubmitting || !selectedCharacter || !cardName.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Generate Cards'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CardCharacterPreset
