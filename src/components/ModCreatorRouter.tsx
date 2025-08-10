import {
  BookOpen,
  Briefcase,
  CreditCard,
  Download,
  Folder,
  Heart,
  Home,
  Image,
  Plus,
  Scissors,
  Star,
  Trophy,
  Upload,
  Users
} from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useErrorHandler, useLoadingState, useProject, useProjects } from '../hooks/useDexie'
import ImportProjectForm from './forms/ImportProjectForm'
import ProjectForm from './forms/ProjectForm'
import AchievementsPage from './pages/AchievementsPage'
import BackgroundsPage from './pages/BackgroundsPage'
import CardsPage from './pages/CardsPage'
import CharactersPage from './pages/CharactersPage'
import CollectiblesPage from './pages/CollectiblesPage'
import DashboardPage from './pages/DashboardPage'
import EndingsPage from './pages/EndingsPage'
import JobsPage from './pages/JobsPage'
import StoriesPage from './pages/StoriesPage'
import StoryPatchesPage from './pages/StoryPatchesPage'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'collectibles', label: 'Collectibles', icon: Star },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'backgrounds', label: 'Backgrounds', icon: Image },
  { id: 'endings', label: 'Endings', icon: Heart },
  { id: 'stories', label: 'Stories', icon: BookOpen },
  { id: 'storypatches', label: 'Story Patches', icon: Scissors },
  { id: 'achievements', label: 'Achievements', icon: Trophy }
]

const ModCreatorRouter: React.FC = () => {
  const { projects, createProject, updateProject, exportProject, exportProjectZip, deleteProject } =
    useProjects()
  const { isLoading } = useLoadingState()
  const { getError, setError, clearError } = useErrorHandler()
  const router = useRouter()
  const params = useParams()

  let currentProjectId = params?.projectId || null
  let currentPage = params?.page || 'dashboard'
  if (Array.isArray(currentProjectId)) currentProjectId = currentProjectId[0]
  if (Array.isArray(currentPage)) currentPage = currentPage[0]

  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showImportProjectModal, setShowImportProjectModal] = useState(false)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const project = useProject(currentProjectId)

  useEffect(() => {
    if (projects.length > 0 && !currentProjectId) {
      router.replace(`/mod/${projects[0].id}/dashboard`)
    } else if (
      projects.length > 0 &&
      currentProjectId &&
      !projects.find((p) => p.id === currentProjectId)
    ) {
      router.replace(`/mod/${projects[0].id}/dashboard`)
    }
  }, [projects, currentProjectId, router])

  const createNewProject = async (formData: {
    name: string
    description: string
    folderName: string
  }) => {
    try {
      const projectId = await createProject({
        name: formData.name,
        description: formData.description,
        folderName: formData.folderName
      })
      router.replace(`/mod/${projectId}/dashboard`)
      clearError('project-creation')
    } catch (error) {
      setError('project-creation', 'Failed to create project')
      throw error
    }
  }

  const handleEditProject = async (formData: {
    name: string
    description: string
    folderName: string
  }) => {
    if (!currentProjectId) return
    try {
      await updateProject(currentProjectId, {
        name: formData.name,
        description: formData.description,
        folderName: formData.folderName
      })
    } catch (error) {
      setError('project-edit', 'Failed to update project')
      throw error
    }
  }

  const handleExport = async () => {
    if (!currentProjectId) return
    try {
      const blob = await exportProjectZip(currentProjectId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.folderName || 'mod'}_export.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      setError('export', 'Failed to export project as zip')
    }
  }

  const getPageComponent = () => {
    if (!currentProjectId || !project) {
      return (
        <div className="text-center py-12">
          <Folder size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
          <p className="text-gray-600 mb-6">
            Create a new project or select an existing one to get started.
          </p>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create New Project
          </button>
        </div>
      )
    }
    const pageProps = { projectId: currentProjectId, project }
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            {...pageProps}
            setCurrentPage={(page) => router.push(`/mod/${currentProjectId}/${page}`)}
          />
        )
      case 'characters':
        return <CharactersPage {...pageProps} />
      case 'cards':
        return <CardsPage {...pageProps} />
      case 'collectibles':
        return <CollectiblesPage {...pageProps} />
      case 'jobs':
        return <JobsPage {...pageProps} />
      case 'stories':
        return <StoriesPage {...pageProps} />
      case 'storypatches':
        return <StoryPatchesPage {...pageProps} />
      case 'backgrounds':
        return <BackgroundsPage {...pageProps} />
      case 'achievements':
        return <AchievementsPage {...pageProps} />
      case 'endings':
        return <EndingsPage {...pageProps} />
      default:
        return (
          <DashboardPage
            {...pageProps}
            setCurrentPage={(page) => router.push(`/mod/${currentProjectId}/${page}`)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">ExoLoader Mod Templater</h1>
            {project && (
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <span className="font-medium">{project.name}</span>
                <span className="mx-2">•</span>
                <span>{project.folderName}</span>
                <button
                  onClick={() => setShowEditProjectModal(true)}
                  className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                  title="Edit Project"
                >
                  Edit Project
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              New Project
            </button>
            <button
              onClick={() => setShowImportProjectModal(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Import Project
            </button>
            {currentProjectId && (
              <>
                <button
                  onClick={handleExport}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setShowDeleteProjectModal(true)}
                  className="border border-red-600 text-red-600 font-medium py-2 px-4 rounded-md transition-colors flex items-center hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex">
        <nav className="w-64 bg-white border-r border-gray-200 h-full">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Content</h2>
            <div className="space-y-1">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => router.push(`/mod/${currentProjectId}/${id}`)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    currentPage === id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} className="mr-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Projects</h3>
            <div className="space-y-2">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => router.push(`/mod/${proj.id}/dashboard`)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    currentProjectId === proj.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium truncate">{proj.name}</div>
                  <div className="text-xs text-gray-500 truncate">{proj.folderName}</div>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 p-6">{getPageComponent()}</main>
      </div>

      <ProjectForm
        mode="create"
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={createNewProject}
      />
      <ImportProjectForm
        isOpen={showImportProjectModal}
        onClose={() => setShowImportProjectModal(false)}
        onImportComplete={(projectId) => {
          router.replace(`/mod/${projectId}/dashboard`)
        }}
      />
      <ProjectForm
        mode="edit"
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        onSubmit={handleEditProject}
        initialData={
          project
            ? {
                name: project.name || '',
                description: project.description || '',
                folderName: project.folderName || ''
              }
            : undefined
        }
      />
      {showDeleteProjectModal && project && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Delete Project</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to <span className="font-bold text-red-700">delete</span> the
              project <span className="font-semibold">{project.name}</span>? This will permanently
              delete all related data and <span className="font-bold">cannot be undone</span>.
            </p>
            <div className="mb-4">
              <div className="font-semibold mb-2">This will delete:</div>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>{project.characters?.length || 0} Characters</li>
                <li>{project.cards?.length || 0} Cards</li>
                <li>{project.collectibles?.length || 0} Collectibles</li>
                <li>{project.jobs?.length || 0} Jobs</li>
                <li>{project.stories?.length || 0} Stories</li>
                <li>{project.storyPatches?.length || 0} Story Patches</li>
                <li>{project.backgrounds?.length || 0} Backgrounds</li>
                <li>{project.achievements?.length || 0} Achievements</li>
                <li>{project.endings?.length || 0} Endings</li>
                <li>{project.endingModifications?.length || 0} Ending Modifications</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowDeleteProjectModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!currentProjectId) return
                  setIsDeleting(true)
                  await deleteProject(currentProjectId)
                  setShowDeleteProjectModal(false)
                  setIsDeleting(false)
                  if (projects.length > 1) {
                    const next = projects.find((p) => p.id !== currentProjectId)
                    if (next) router.replace(`/mod/${next.id}/dashboard`)
                  } else {
                    router.replace(`/`)
                  }
                }}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModCreatorRouter
