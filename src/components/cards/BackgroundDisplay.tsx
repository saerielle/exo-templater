import { Edit, Eye, Image, Trash2 } from 'lucide-react'

import React, { useMemo, useState } from 'react'

import { Background, BackgroundImage, BackgroundType } from '../../lib/exoloader'

interface BackgroundDisplayProps {
  background: Background
  onEdit: (background: Background) => void
  onDelete: (background: Background) => void
  projectId: string
  mainImage?: BackgroundImage
  thumbnailImage?: BackgroundImage
}

const BackgroundDisplay: React.FC<BackgroundDisplayProps> = ({
  background,
  onEdit,
  onDelete,
  projectId,
  mainImage,
  thumbnailImage
}) => {
  const [showFullImage, setShowFullImage] = useState(false)

  const displayName = useMemo(() => {
    return background.id
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }, [background.id])

  const typeInfo = useMemo(() => {
    switch (background.type) {
      case BackgroundType.Story:
        return {
          label: 'Story Background',
          color: 'bg-blue-100 text-blue-700',
          description: 'Used in story scenes and dialogue'
        }
      case BackgroundType.Illustration:
        return {
          label: 'Illustration',
          color: 'bg-purple-100 text-purple-700',
          description: 'Full-screen illustration for special events'
        }
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-700',
          description: ''
        }
    }
  }, [background.type])

  const thumbnailUrl = useMemo(() => {
    return thumbnailImage?.imageBlob ? URL.createObjectURL(thumbnailImage.imageBlob) : undefined
  }, [thumbnailImage])
  const mainUrl = useMemo(() => {
    return mainImage?.imageBlob ? URL.createObjectURL(mainImage.imageBlob) : undefined
  }, [mainImage])

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
          {thumbnailUrl || mainUrl ? (
            <div className="relative h-full">
              <img
                src={thumbnailUrl || mainUrl}
                alt={`${background.id} preview`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg pointer-events-auto"
                    title="View full image"
                  >
                    <Eye size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Image size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{displayName}</h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color} flex-shrink-0 ml-2`}
              >
                {typeInfo.label}
              </span>
            </div>
            {typeInfo.description && (
              <p className="text-sm text-gray-600">{typeInfo.description}</p>
            )}
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Usage in stories:</p>
            <code className="text-xs font-mono text-gray-800 break-all">
              ~set bg = {background.type === BackgroundType.Illustration ? 'pinup_' : ''}
              {background.id}
            </code>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(background)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit size={14} className="mr-1.5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(background)}
              className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {showFullImage && mainUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={mainUrl}
              alt={`${background.id} full view`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default BackgroundDisplay
