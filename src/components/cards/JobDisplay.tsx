import {
  Beaker,
  Brain,
  Building,
  Edit,
  Heart,
  Home,
  MapPin,
  Trash2,
  Users,
  Wrench,
  Zap
} from 'lucide-react'

import React, { useMemo } from 'react'

import { Job, LocationId, SkillId } from '../../lib/exoloader'

interface JobDisplayProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
  characters?: Array<{ id: string; name: string; nickname: string }>
}

const JobDisplay: React.FC<JobDisplayProps> = ({ job, onEdit, onDelete, characters = [] }) => {
  const formatLocationName = (location: LocationId): string => {
    return location.charAt(0).toUpperCase() + location.slice(1)
  }

  const jobCharacters = useMemo(() => {
    return (
      job.characters?.map(
        (id) =>
          characters.find((c) => c.id === id)?.nickname ||
          characters.find((c) => c.id === id)?.name ||
          id
      ) || []
    )
  }, [job.characters, characters])

  const primaryReward = useMemo(() => {
    if (job.primarySkill && job.primaryValue) {
      const sign = job.primaryValue > 0 ? '+' : ''
      return `${sign}${job.primaryValue} ${job.primarySkill}`
    }
    return null
  }, [job.primarySkill, job.primaryValue])

  const secondaryReward = useMemo(() => {
    if (job.secondSkill && job.secondValue) {
      const sign = job.secondValue > 0 ? '+' : ''
      return `${sign}${job.secondValue} ${job.secondSkill}`
    }
    return null
  }, [job.secondSkill, job.secondValue])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="relative p-6 pb-4">
        <div className="pr-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{job.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            {formatLocationName(job.location)}
            {job.id && (
              <>
                <span className="mx-2">•</span>
                <span className="font-mono text-xs">{job.id}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        {job.battleHeaderText && (
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
            {job.battleHeaderText}
          </p>
        )}
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {job.isRelax && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              😌 Relaxing
            </span>
          )}
          {primaryReward ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              <span className="ml-1">{primaryReward}</span>
            </span>
          ) : null}
          {secondaryReward ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <span className="ml-1">{secondaryReward}</span>
            </span>
          ) : null}
          {job.kudos && job.kudos !== 0 ? (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                job.kudos > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {job.kudos > 0 ? '+' : ''}
              {job.kudos} Kudos
            </span>
          ) : null}
          {job.stress && job.stress !== 0 ? (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                job.stress > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {job.stress > 0 ? '+' : ''}
              {job.stress} Stress
            </span>
          ) : null}
        </div>

        {jobCharacters.length ? (
          <div className="flex items-center text-sm text-gray-600">
            <Users size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {jobCharacters.join(', ')}
              {job.characters && job.characters.length > 3 && (
                <span className="text-gray-400"> +{job.characters.length - 3} more</span>
              )}
            </span>
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(job)}
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

export default JobDisplay
