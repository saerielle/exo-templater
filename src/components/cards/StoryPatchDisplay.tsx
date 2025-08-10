import { ArrowRight, Code, Edit, FileText, Replace, Trash2 } from 'lucide-react'

import React, { useMemo } from 'react'

import { StoryPatch, StoryPatchType } from '../../lib/exoloader'

interface StoryPatchDisplayProps {
  storyPatch: StoryPatch
  onEdit: (storyPatch: StoryPatch) => void
  onDelete: (storyPatch: StoryPatch) => void
  projectId: string
}

const getPatchTypeInfo = (type: StoryPatchType) => {
  switch (type) {
    case StoryPatchType.Insert:
      return {
        label: 'Insert',
        icon: <ArrowRight size={14} />,
        color: 'bg-green-100 text-green-700 border-green-200'
      }
    case StoryPatchType.Replace:
      return {
        label: 'Replace',
        icon: <Replace size={14} />,
        color: 'bg-blue-100 text-blue-700 border-blue-200'
      }
    default:
      return {
        label: 'Unknown',
        icon: <Code size={14} />,
        color: 'bg-gray-100 text-gray-700 border-gray-200'
      }
  }
}

const StoryPatchDisplay: React.FC<StoryPatchDisplayProps> = ({
  storyPatch,
  onEdit,
  onDelete,
  projectId
}) => {
  const typeInfo = useMemo(() => getPatchTypeInfo(storyPatch.type), [storyPatch.type])

  const bodyPreview = useMemo(() => {
    if (storyPatch.body.length <= 120) return storyPatch.body
    return storyPatch.body.substring(0, 120) + '...'
  }, [storyPatch.body])

  const locationInfo = useMemo(() => {
    if (storyPatch.type === StoryPatchType.Insert) {
      return `Insert before: ${storyPatch.locationKey || 'N/A'} (index: ${storyPatch.locationIndex || 0})`
    } else {
      const endInfo = storyPatch.endKey
        ? ` to ${storyPatch.endKey} (${storyPatch.endIndex || 0})`
        : ''
      return `Replace from: ${storyPatch.startKey || 'N/A'} (${storyPatch.startIndex || 0})${endInfo}`
    }
  }, [storyPatch])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
      <div className="p-6 pb-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeInfo.color}`}
            >
              {typeInfo.icon}
              {typeInfo.label}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-gray-600" />
            {storyPatch.storyId}
          </h3>
        </div>

        {storyPatch.description && (
          <p className="text-sm text-gray-600 mb-3 italic">"{storyPatch.description}"</p>
        )}

        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700 font-mono">{locationInfo}</p>
          </div>
        </div>

        <div className="flex-grow">
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code size={14} className="text-gray-400" />
            </div>
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
              {bodyPreview}
            </pre>
          </div>
        </div>
      </div>

      <div className="px-6 pt-2 pb-6 border-t border-gray-100 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(storyPatch)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(storyPatch)}
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

export default StoryPatchDisplay
