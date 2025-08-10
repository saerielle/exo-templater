'use client'

import { Briefcase, Plus } from 'lucide-react'

import React, { useMemo, useState } from 'react'

import { gameCharacters } from '@/api/characters'

import { useCharacters, useJobs } from '../../hooks/useDexie'
import { borderColorMap } from '../../lib/contentTypeColors'
import { Job, ModProject } from '../../lib/exoloader'
import JobDisplay from '../cards/JobDisplay'
import JobForm from '../forms/JobForm/JobForm'
import ConfirmDialog from '../ui/ConfirmDialog'

interface PageProps {
  projectId: string
  project: ModProject
}

const JobsPage: React.FC<PageProps> = ({ projectId, project }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null)

  const { jobs, addJob, updateJob, deleteJob } = useJobs(projectId)

  const { characters } = useCharacters(projectId)

  const charactersOptions = useMemo(() => {
    return [...characters, ...gameCharacters]
  }, [characters])

  const handleSave = async (job: Job) => {
    if (editingJob) {
      await updateJob(job.dbId, job)
    } else {
      await addJob(job)
    }
    setShowForm(false)
    setEditingJob(null)
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingJob(null)
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Yet</h3>
          <p className="text-gray-600 mb-6">Create your first job to get started with your mod.</p>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingJob(null)
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job: Job) => (
            <JobDisplay
              key={job.id}
              job={job}
              onEdit={() => handleEdit(job)}
              onDelete={() => setDeleteTarget(job)}
              characters={charactersOptions}
            />
          ))}
        </div>
      )}

      {showForm && (
        <JobForm
          job={editingJob || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingJob(null)
          }}
          projectId={projectId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Job"
        description={`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteJob(deleteTarget.dbId)
          setDeleteTarget(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default JobsPage
