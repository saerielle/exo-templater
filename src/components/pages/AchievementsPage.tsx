'use client'

import { Image, Plus } from 'lucide-react'

import React, { useState } from 'react'

import { useAchievements } from '../../hooks/useDexie'
import { Achievement, ModProject } from '../../lib/exoloader'
import AchievementDisplay from '../cards/AchievementDisplay'
import AchievementForm from '../forms/AchievementForm/AchievementForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const AchievementsPage: React.FC<PageProps> = ({ projectId, project }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)

  const { achievements, images, addAchievement, updateAchievement, deleteAchievement } =
    useAchievements(projectId)

  const handleSave = (achievement: Achievement) => {
    if (editingAchievement) {
      updateAchievement(achievement.dbId, achievement)
    } else {
      addAchievement(achievement)
    }
    setShowForm(false)
    setEditingAchievement(null)
  }

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingAchievement(null)
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first achievement to get started with your mod.
          </p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingAchievement(null)
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Achievement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement: Achievement) => (
            <AchievementDisplay
              key={achievement.id}
              achievement={achievement}
              image={images[achievement.dbId]}
              onEdit={() => handleEdit(achievement)}
              onDelete={() => setDeleteTarget(achievement)}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AchievementForm
          achievement={editingAchievement || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingAchievement(null)
          }}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Achievement"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAchievement(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default AchievementsPage
