import {
  BookOpen,
  Briefcase,
  CreditCard,
  Heart,
  Image,
  Scissors,
  Star,
  Trophy,
  Users
} from 'lucide-react'

import React from 'react'

import Link from 'next/link'

import { useStories, useStoryPatches } from '../../hooks/useDexie'
import {
  bgColorMap,
  borderColorMap,
  iconColorMap,
  labelTextColorMap,
  textColorMap
} from '../../lib/contentTypeColors'
import { FullModProject } from '../../lib/exoloader'

interface PageProps {
  projectId: string
  project: FullModProject
  setCurrentPage: (page: string) => void
}

const DashboardPage: React.FC<PageProps> = ({ projectId, project, setCurrentPage }) => {
  const { stories } = useStories(projectId)
  const { storyPatches } = useStoryPatches(projectId)
  const stats = {
    characters: project?.characters?.length || 0,
    cards: project?.cards?.length || 0,
    collectibles: project?.collectibles?.length || 0,
    jobs: project?.jobs?.length || 0,
    stories: stories.length,
    backgrounds: project?.backgrounds?.length || 0,
    achievements: project?.achievements?.length || 0,
    endings: project?.endings?.length || 0,
    storypatches: storyPatches.length
  }

  const totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {project?.name || 'Project Dashboard'}
          </h1>
          <p className="text-gray-600">{project?.description}</p>
        </div>
        <div className="text-sm text-gray-500">
          {totalItems} total items • Updated {project?.updatedAt?.toLocaleDateString()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {[
          { key: 'characters', label: 'Characters', icon: Users, color: 'blue' },
          { key: 'cards', label: 'Cards', icon: CreditCard, color: 'green' },
          { key: 'collectibles', label: 'Collectibles', icon: Star, color: 'purple' },
          { key: 'jobs', label: 'Jobs', icon: Briefcase, color: 'orange' },
          { key: 'backgrounds', label: 'Backgrounds', icon: Image, color: 'pink' },
          { key: 'endings', label: 'Endings', icon: Heart, color: 'red' },
          { key: 'stories', label: 'Stories', icon: BookOpen, color: 'indigo' },
          { key: 'storypatches', label: 'Story Patches', icon: Scissors, color: 'teal' },
          { key: 'achievements', label: 'Achievements', icon: Trophy, color: 'yellow' }
        ].map(({ key, label, icon: Icon, color }) => (
          <Link
            key={key}
            href={`/mod/${projectId}/${key}`}
            className={`block transition-shadow focus:outline-none focus:ring-2 focus:ring-${color}-400 ${bgColorMap[color]} ${borderColorMap[color]} border p-4 rounded-lg hover:shadow-lg hover:bg-opacity-90 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={iconColorMap[color]} size={20} />
              <span className={`text-2xl font-bold ${textColorMap[color]}`}>
                {stats[key as keyof typeof stats]}
              </span>
            </div>
            <p className={`text-sm font-medium ${labelTextColorMap[color]}`}>{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Project Structure</h3>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <pre className="text-sm text-gray-700 font-mono">
            {`${project?.folderName || 'ProjectFolder'}/
├── Achievements/        (${stats.achievements} items)
├── Backgrounds/         (${stats.backgrounds} items)
├── Cards/               (${stats.cards} items)
├── Characters/          (${stats.characters} items)
├── Collectibles/        (${stats.collectibles} items)
├── Endings/             (${stats.endings} items)
├── Jobs/                (${stats.jobs} items)
├── Stories/             (${stats.stories} items)
└── StoryPatches/        (${stats.storypatches} items)`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
