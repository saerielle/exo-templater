import { Edit, Trash2, User } from 'lucide-react'

import React from 'react'

import { Character, CharacterPortrait, Gender } from '../../lib/exoloader'

interface CharacterDisplayProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (character: Character) => void
  projectId: string
  portrait?: CharacterPortrait
}

const getPronouns = (gender: Gender): string => {
  switch (gender) {
    case Gender.Female:
      return 'She/her'
    case Gender.Male:
      return 'He/him'
    case Gender.NonBinary:
      return 'They/them'
    default:
      return ''
  }
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  character,
  onEdit,
  onDelete,
  projectId,
  portrait
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
      <div className="relative p-6 pb-4">
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
          {portrait?.imageBlob ? (
            <img
              src={URL.createObjectURL(portrait.imageBlob)}
              alt={`${character.nickname} portrait`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <User size={20} className="text-gray-500" />
            </div>
          )}
        </div>

        <div className="pr-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
            {character.nickname}
          </h3>
          {character.id && <p className="text-sm text-gray-500 font-mono">{character.id}</p>}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-6">
        <div className="flex flex-wrap gap-1 pb-4">
          {character.love && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
              Friend
            </span>
          )}
          {character.onMap && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              On Map
            </span>
          )}
          {character.ages && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Ages
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            {character.helioOnly ? 'Helio' : 'Stratos'}
          </span>
        </div>
        <div className="flex-1">
          {character.basics && (
            <div className="text-sm text-gray-700 leading-relaxed pb-4">
              <p className="line-clamp-3">
                {character.basics} {character.more ?? ''} {getPronouns(character.gender)}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 pb-6 border-t border-gray-100 mt-auto">
          <button
            onClick={() => onEdit(character)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(character)}
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

export default CharacterDisplay
