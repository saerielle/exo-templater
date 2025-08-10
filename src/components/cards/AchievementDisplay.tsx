import { Award, Edit, Eye, EyeOff, Trash2, Trophy, Users } from 'lucide-react'

import React, { useMemo } from 'react'

import { Achievement, EntityImage } from '../../lib/exoloader'

interface AchievementDisplayProps {
  achievement: Achievement
  image?: EntityImage
  onEdit: (achievement: Achievement) => void
  onDelete: (achievement: Achievement) => void
  projectId: string
}

const AchievementDisplay: React.FC<AchievementDisplayProps> = ({
  achievement,
  image,
  onEdit,
  onDelete,
  projectId
}) => {
  const imageUrl = useMemo(() => {
    return image?.imageBlob ? URL.createObjectURL(image.imageBlob) : undefined
  }, [image])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
      <div className="relative h-32 bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${achievement.name} achievement`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy size={24} className="text-white" />
          </div>
        )}

        {achievement.hidden && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            <EyeOff size={12} />
            <span>Hidden</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
            {achievement.name}
          </h3>
          {achievement.id && <p className="text-sm text-gray-500 font-mono">{achievement.id}</p>}
        </div>

        {achievement.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {achievement.description}
            </p>
          </div>
        )}

        {(achievement.loveAll?.length ||
          achievement.requiredCheevos?.length ||
          achievement.id.startsWith('chara_') ||
          achievement.id.startsWith('ending_')) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Auto-Unlock</h4>

            <div className="flex flex-wrap gap-2">
              {achievement.loveAll?.length ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                  <Users size={12} />
                  <span>{achievement.loveAll.length} Love All</span>
                </div>
              ) : null}
              {achievement.requiredCheevos?.length ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  <Award size={12} />
                  <span>{achievement.requiredCheevos.length} Required</span>
                </div>
              ) : null}
              {achievement.id.startsWith('chara_') ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <Users size={12} />
                  <span>Character 100 event (level 3 card)</span>
                </div>
              ) : null}
              {achievement.id.startsWith('ending_') ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <Users size={12} />
                  <span>Ending</span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onEdit(achievement)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(achievement)}
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

export default AchievementDisplay
