import { Edit, MapPin, Minus, Plus, Settings, Trash2, User } from 'lucide-react'

import React, { useMemo } from 'react'

import { EndingModification } from '../../lib/exoloader'

interface EndingModificationDisplayProps {
  endingModification: EndingModification
  onEdit: (endingModification: EndingModification) => void
  onDelete: (endingModification: EndingModification) => void
}

const EndingModificationDisplay: React.FC<EndingModificationDisplayProps> = ({
  endingModification,
  onEdit,
  onDelete
}) => {
  const mods = useMemo(
    () => endingModification.modifications ?? {},
    [endingModification.modifications]
  )

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 border-b border-orange-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded-full">
              <Settings size={16} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Modifying: {endingModification.id}
              </h3>
              <p className="text-sm text-orange-700 font-medium">Ending Modification</p>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
            <Settings size={10} className="mr-1" />
            Override
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 text-xs">
              {mods.name ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Name: {mods.name}
                </span>
              ) : null}
              {mods.preamble ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Preamble: {mods.preamble}
                </span>
              ) : null}
              {mods.location ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Location: {mods.location}
                </span>
              ) : null}
              {mods.character ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Character: {mods.character}
                </span>
              ) : null}
              {mods.requiredJobs?.add?.length || mods.requiredJobs?.remove?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {(mods.requiredJobs?.add?.length || 0) + (mods.requiredJobs?.remove?.length || 0)}{' '}
                  Required Job Changes
                </span>
              ) : null}
              {mods.otherJobs?.add?.length || mods.otherJobs?.remove?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {(mods.otherJobs?.add?.length || 0) + (mods.otherJobs?.remove?.length || 0)} Other
                  Job Changes
                </span>
              ) : null}
              {mods.skills?.add?.length || mods.skills?.remove?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {(mods.skills?.add?.length || 0) + (mods.skills?.remove?.length || 0)} Skill
                  Changes
                </span>
              ) : null}
              {mods.requiredMemories?.add?.length || mods.requiredMemories?.remove?.length ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {(mods.requiredMemories?.add?.length || 0) +
                    (mods.requiredMemories?.remove?.length || 0)}{' '}
                  Memory Changes
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => onEdit(endingModification)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(endingModification)}
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

export default EndingModificationDisplay
