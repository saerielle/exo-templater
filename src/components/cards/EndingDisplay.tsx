import { Briefcase, Edit, Image as ImageIcon, MapPin, Sparkles, Trash2, User } from 'lucide-react'

import React, { useMemo } from 'react'

import { Ending, EndingImage } from '../../lib/exoloader'

interface EndingDisplayProps {
  ending: Ending
  onEdit: (ending: Ending) => void
  onDelete: (ending: Ending) => void
  endingImage?: EndingImage
}

const EndingDisplay: React.FC<EndingDisplayProps> = ({ ending, onEdit, onDelete, endingImage }) => {
  const imageUrl = useMemo(() => {
    return endingImage?.imageBlob ? URL.createObjectURL(endingImage.imageBlob) : null
  }, [endingImage])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
      <div className="relative">
        {imageUrl ? (
          <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              src={imageUrl}
              alt={`${ending.name} preview`}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
        )}

        <div className="absolute top-3 left-3">
          {ending.isSpecial ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              <Sparkles size={12} className="mr-1" />
              Special
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
              <Briefcase size={12} className="mr-1" />
              Career
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
              {ending.name}
            </h3>
            <p className="text-sm text-gray-500 font-mono">{ending.id}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{ending.preamble}</p>
          </div>

          {(ending.location || ending.character) && (
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              {ending.location && (
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                  <MapPin size={10} className="mr-1" />
                  {ending.location.charAt(0).toUpperCase() + ending.location.slice(1)}
                </div>
              )}
              {ending.character && (
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                  <User size={10} className="mr-1" />
                  {ending.character}
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-wrap gap-1 text-xs">
              {ending.requiredJobs?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {ending.requiredJobs.length} Required Job(s)
                </span>
              ) : null}
              {ending.otherJobs?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  {ending.otherJobs.length} Other Job(s)
                </span>
              ) : null}
              {ending.skills?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {ending.skills.length} Skill(s)
                </span>
              ) : null}
              {ending.requiredMemories?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                  {ending.requiredMemories.length} Memory(ies)
                </span>
              ) : null}
              {!ending.requiredJobs?.length &&
                !ending.otherJobs?.length &&
                !ending.skills?.length &&
                !ending.requiredMemories?.length && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    No Requirements
                  </span>
                )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
          <button
            onClick={() => onEdit(ending)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(ending)}
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

export default EndingDisplay
