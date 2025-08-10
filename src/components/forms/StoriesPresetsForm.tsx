'use client'

import React, { useCallback, useMemo, useState } from 'react'

import { DatabaseService } from '@/lib/database'

import {
  characterFriendStoryPatches,
  endingPresets,
  friendPresets,
  jobPresets,
  jobStoryPatches,
  nonFriendPresets
} from '../../api/presets/story'
import {
  useCharacters,
  useCollectibles,
  useEndings,
  useJobs,
  useStories,
  useStoryPatches
} from '../../hooks/useDexie'
import { CardSuit, SkillId, Story, StoryPatch } from '../../lib/exoloader'
import Autocomplete from '../ui/Autocomplete'
import CheckRadioGroup from '../ui/CheckRadioGroup'
import ModalFooter from '../ui/ModalFooter'
import ModalHeader from '../ui/ModalHeader'
import ModalOverlay from '../ui/ModalOverlay'
import ModalPanel from '../ui/ModalPanel'

interface StoriesPresetsFormProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  project: any
}

type ContentType = 'character' | 'job' | 'ending'

const contentTypes = [
  {
    id: 'character' as ContentType,
    name: 'Character',
    description: 'Create template stories (and story patches) for a character'
  },
  {
    id: 'job' as ContentType,
    name: 'Job',
    description: 'Create template stories (and story patches) for a job'
  },
  {
    id: 'ending' as ContentType,
    name: 'Ending',
    description: 'Create template story and achievement for an ending'
  }
]

const skillOptions = Object.values(SkillId)
  .map((id) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1)
  }))
  .filter((s) => s.id !== SkillId.Kudos && s.id !== SkillId.Stress && s.id !== SkillId.Rebellion)

const suitOptions = Object.values(CardSuit)
  .map((id) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1)
  }))
  .filter((s) => s.id !== CardSuit.None && s.id !== CardSuit.Wild)

const StoriesPresetsForm: React.FC<StoriesPresetsFormProps> = ({
  isOpen,
  onClose,
  projectId,
  project
}) => {
  const { characters } = useCharacters(projectId)
  const { jobs } = useJobs(projectId)
  const { endings } = useEndings(projectId)
  const { addStories } = useStories(projectId)
  const { addStoryPatches } = useStoryPatches(projectId)
  const { collectibles } = useCollectibles(projectId)

  const [contentType, setContentType] = useState<ContentType>('character')
  const [selectedCharacter, setSelectedCharacter] = useState<{
    id: string
    name: string
    nickname: string
    love: boolean
  } | null>(null)
  const [selectedJob, setSelectedJob] = useState<{ id: string; name: string } | null>(null)
  const [selectedEnding, setSelectedEnding] = useState<{ id: string; name: string } | null>(null)
  const [primarySkill, setPrimarySkill] = useState<SkillId | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const characterOptions = useMemo(
    () =>
      characters.map((char) => ({
        id: char.dbId,
        name: char.name,
        nickname: char.nickname,
        love: char.love
      })),
    [characters]
  )

  const jobOptions = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.dbId,
        name: job.name
      })),
    [jobs]
  )

  const endingOptions = useMemo(
    () =>
      endings.map((ending) => ({
        id: ending.dbId,
        name: ending.name
      })),
    [endings]
  )

  const handleContentTypeChange = useCallback((type: ContentType) => {
    setContentType(type)
    setSelectedCharacter(null)
    setSelectedJob(null)
    setSelectedEnding(null)
  }, [])

  const handleCreatePresets = useCallback(async () => {
    if (!projectId) return

    setIsCreating(true)
    try {
      let stories: Story[] = []
      let patches: StoryPatch[] = []

      switch (contentType) {
        case 'character':
          if (!selectedCharacter) return
          const character = characters.find((c) => c.dbId === selectedCharacter.id)
          if (!character || !primarySkill) return
          if (character.love) {
            stories = friendPresets(character, collectibles, primarySkill, project)
            patches = characterFriendStoryPatches(character, primarySkill)
          } else {
            stories = nonFriendPresets(character, primarySkill)
          }
          break
        case 'job':
          if (!selectedJob) return
          const job = jobs.find((j) => j.dbId === selectedJob.id)
          if (!job) return
          stories = jobPresets(job, project)
          patches = jobStoryPatches(job)
          break
        case 'ending':
          if (!selectedEnding) return
          const ending = endings.find((e) => e.dbId === selectedEnding.id)
          if (!ending) return
          stories = endingPresets(ending, project)
          break
      }

      if (patches.length > 0) {
        await addStoryPatches(patches)
      }

      if (contentType === 'ending' && selectedEnding) {
        const achievement = await DatabaseService.getEndingAchievement(projectId, selectedEnding.id)
        if (!achievement) {
          const ending = await DatabaseService.getEnding(selectedEnding.id)
          if (ending) {
            await DatabaseService.createEndingAchievement(projectId, ending)
          }
        }
      }

      if (stories.length > 0) {
        await addStories(stories)
        onClose()
      }
    } catch (error) {
      console.error('Error creating presets:', error)
    } finally {
      setIsCreating(false)
    }
  }, [
    contentType,
    selectedCharacter,
    selectedJob,
    selectedEnding,
    primarySkill,
    projectId,
    project,
    addStories,
    addStoryPatches,
    onClose,
    characters,
    jobs,
    endings
  ])

  const canCreate = useMemo(() => {
    switch (contentType) {
      case 'character':
        return selectedCharacter !== null
      case 'job':
        return selectedJob !== null
      case 'ending':
        return selectedEnding !== null
      default:
        return false
    }
  }, [contentType, selectedCharacter, selectedJob, selectedEnding])

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onClose}>Create Stories & Patches from Presets</ModalHeader>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Type *</label>
            <div className="space-y-3">
              {contentTypes.map((type) => (
                <div key={type.id} className="relative">
                  <CheckRadioGroup
                    type="radio"
                    name="contentType"
                    value={type.id}
                    checked={contentType === type.id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleContentTypeChange(e.target.value as ContentType)
                    }
                    label={type.name}
                    helpText={type.description}
                    className="items-start"
                  />
                </div>
              ))}
            </div>
          </div>

          {contentType === 'character' && (
            <div className="space-y-4">
              <Autocomplete
                label="Select Character *"
                options={characterOptions}
                value={selectedCharacter}
                onChange={setSelectedCharacter}
                placeholder="Search for a character..."
                getOptionLabel={(option) => `${option.name} (${option.nickname})`}
                clearable
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Autocomplete
                    label="Interaction Skill *"
                    options={skillOptions}
                    value={skillOptions.find((s) => s.id === primarySkill) || null}
                    onChange={(skill) => skill && setPrimarySkill(skill.id as SkillId)}
                    clearable
                    helpText="Used for 20/40/60 skill interactions"
                  />
                </div>
              </div>
            </div>
          )}

          {contentType === 'job' && (
            <Autocomplete
              label="Select Job *"
              options={jobOptions}
              value={selectedJob}
              onChange={setSelectedJob}
              placeholder="Search for a job..."
              clearable
            />
          )}

          {contentType === 'ending' && (
            <Autocomplete
              label="Select Ending *"
              options={endingOptions}
              value={selectedEnding}
              onChange={setSelectedEnding}
              placeholder="Search for an ending..."
              clearable
            />
          )}
        </div>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreatePresets}
            disabled={!canCreate || isCreating}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Stories'}
          </button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default StoriesPresetsForm
