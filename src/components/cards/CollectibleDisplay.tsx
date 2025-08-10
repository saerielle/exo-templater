import { Edit, Trash2 } from 'lucide-react'

import React, { useMemo } from 'react'

import { abilityToLabel } from '@/lib/utils'

import { Card, Collectible, EntityImage } from '../../lib/exoloader'

const getSuitColors = () => {
  return {
    bg: 'bg-gradient-to-b from-orange-300 to-brown-500',
    border: 'border-orange-300',
    accent: 'bg-orange-600',
    accentDark: 'bg-orange-700',
    text: 'text-white',
    valueColor: '#9333ea'
  }
}

interface CollectibleDisplayProps {
  card: Collectible
  image?: EntityImage
  onEdit: () => void
  onDelete: () => void
  projectId: string
}

const CollectibleDisplay: React.FC<CollectibleDisplayProps> = ({
  card,
  image,
  onEdit,
  onDelete,
  projectId
}) => {
  const abilities = useMemo(() => {
    const abilities = []
    if (card.ability1?.id) abilities.push(abilityToLabel(card.ability1))
    if (card.ability2?.id) abilities.push(abilityToLabel(card.ability2))
    if (card.ability3?.id) abilities.push(abilityToLabel(card.ability3))
    return abilities
  }, [
    card.ability1?.id,
    card.ability1?.value,
    card.ability1?.suit,
    card.ability2?.id,
    card.ability2?.value,
    card.ability2?.suit,
    card.ability3?.id,
    card.ability3?.value,
    card.ability3?.suit
  ])

  const colors = getSuitColors()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex flex-col items-center p-6">
        <div
          className={`
          relative w-52 h-90 rounded-2xl border-4 ${colors.border} ${colors.bg}
          shadow-lg overflow-hidden
        `}
        >
          <div className="absolute top-0 left-0 right-0 z-10">
            <div
              className={`
            ${colors.accent} rounded-t-xl border-b-2 ${colors.border} py-2 px-4
            text-center shadow-sm
          `}
            >
              <div className={`font-bold text-sm ${colors.text} truncate`}>
                {card.name.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-38 h-38 rounded-full bg-white/90 overflow-hidden shadow-inner border-4 border-white/50">
            {image?.imageBlob ? (
              <img
                src={URL.createObjectURL(image.imageBlob)}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div className="text-xs">No Art</div>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div
              className={`
            rounded-lg p-3 bg-black/30 backdrop-blur-sm shadow-sm min-h-[110px]
          `}
            >
              <div className="space-y-1 mt-2">
                {abilities
                  .filter((ability) => ability.trim() !== '')
                  .map((ability, index) => (
                    <div
                      key={index}
                      className="text-sm text-white text-center leading-tight font-bold"
                    >
                      {ability}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 w-full max-w-52">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Trash2 size={14} className="mr-1.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectibleDisplay
