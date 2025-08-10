import { useLiveQuery } from 'dexie-react-hooks'

import { useCallback, useMemo, useState } from 'react'

import { DatabaseService, db } from '../lib/database'
import type {
  Achievement,
  Background,
  BackgroundImage,
  Card,
  Character,
  CharacterPortrait,
  Collectible,
  Ending,
  EndingImage,
  EndingModification,
  EntityImage,
  Job,
  ModProject,
  Story,
  StoryPatch
} from '../lib/exoloader'
import { ModExporter } from '../lib/export'

export function useProjects() {
  const projects = useLiveQuery(() => DatabaseService.getAllProjects(), [])

  const createProject = useCallback(
    async (projectData: Omit<ModProject, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await DatabaseService.createProject(projectData)
    },
    []
  )

  const updateProject = useCallback(async (id: string, updates: Partial<ModProject>) => {
    return await DatabaseService.updateProject(id, updates)
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    return await DatabaseService.deleteProject(id)
  }, [])

  const exportProject = useCallback(async (id: string) => {
    return await DatabaseService.exportProject(id)
  }, [])

  const exportProjectZip = useCallback(async (id: string) => {
    try {
      const project = await DatabaseService.getProject(id)
      if (!project) throw new Error('Project not found')
      return await ModExporter.exportAsZip(project)
    } catch (error) {
      console.error('Error exporting project:', error)
      throw error
    }
  }, [])

  return {
    projects: projects || [],
    createProject,
    updateProject,
    deleteProject,
    exportProject,
    exportProjectZip
  }
}

export function useProject(projectId: string | null) {
  const project = useLiveQuery(
    () => (projectId ? DatabaseService.getProject(projectId) : undefined),
    [projectId]
  )

  return project
}

export function useCharacters(projectId: string | null) {
  const characters = useLiveQuery(
    () => (projectId ? db.characters.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const portraits = useLiveQuery(
    () => (projectId ? db.characterPortraits.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const portraitsByCharacterId = useMemo(() => {
    return portraits?.reduce((acc, portrait) => {
      if (!portrait.imageBlob) return acc
      acc[portrait.characterDbId] = portrait
      return acc
    }, {} as Record<string, CharacterPortrait>)
  }, [portraits])

  const addCharacter = useCallback(
    async (character: Character) => {
      if (!projectId) return
      return await DatabaseService.addCharacter(projectId, character)
    },
    [projectId]
  )

  const updateCharacter = useCallback(
    async (dbId: string, updates: Character) => {
      if (!projectId) return
      return await DatabaseService.updateCharacter(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteCharacter = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteCharacter(projectId, dbId)
    },
    [projectId]
  )

  return {
    characters: characters ?? [],
    portraits: portraitsByCharacterId ?? {},
    addCharacter,
    updateCharacter,
    deleteCharacter
  }
}

export function useCards(projectId: string | null) {
  const cards = useLiveQuery(
    () => (projectId ? db.cards.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const images = useLiveQuery(
    () => (projectId ? db.entityImages.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const imagesByCardId = useMemo(() => {
    return images?.reduce((acc, image) => {
      if (image.entityType !== 'card') return acc
      acc[image.entityId] = image
      return acc
    }, {} as Record<string, EntityImage>)
  }, [images])

  const addCard = useCallback(
    async (card: Card) => {
      if (!projectId) return
      return await DatabaseService.addCard(projectId, card)
    },
    [projectId]
  )

  const updateCard = useCallback(
    async (dbId: string, updates: Partial<Card>) => {
      if (!projectId) return
      return await DatabaseService.updateCard(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteCard = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteCard(projectId, dbId)
    },
    [projectId]
  )

  return {
    cards: cards ?? [],
    images: imagesByCardId ?? {},
    addCard,
    updateCard,
    deleteCard
  }
}

export function useCollectibles(projectId: string | null) {
  const collectibles = useLiveQuery(
    () => (projectId ? db.collectibles.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const images = useLiveQuery(
    () => (projectId ? db.entityImages.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const imagesByCollectibleId = useMemo(() => {
    return images?.reduce((acc, image) => {
      if (image.entityType !== 'collectible') return acc
      acc[image.entityId] = image
      return acc
    }, {} as Record<string, EntityImage>)
  }, [images])

  const addCollectible = useCallback(
    async (collectible: Collectible) => {
      if (!projectId) return
      return await DatabaseService.addCollectible(projectId, collectible)
    },
    [projectId]
  )

  const updateCollectible = useCallback(
    async (dbId: string, updates: Partial<Collectible>) => {
      if (!projectId) return
      await db.collectibles.where('dbId').equals(dbId).modify(updates)
      const collectible = await db.collectibles.where('dbId').equals(dbId).first()
      return collectible
    },
    [projectId]
  )

  const deleteCollectible = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteCollectible(projectId, dbId)
    },
    [projectId]
  )

  return {
    collectibles: collectibles ?? [],
    images: imagesByCollectibleId ?? {},
    addCollectible,
    updateCollectible,
    deleteCollectible
  }
}

export function useJobs(projectId: string | null) {
  const jobs = useLiveQuery(
    () => (projectId ? db.jobs.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const addJob = useCallback(
    async (job: Job) => {
      if (!projectId) return
      return await DatabaseService.addJob(projectId, job)
    },
    [projectId]
  )

  const updateJob = useCallback(
    async (dbId: string, updates: Partial<Job>) => {
      if (!projectId) return
      return await db.jobs.where('dbId').equals(dbId).modify(updates)
    },
    [projectId]
  )

  const deleteJob = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await db.jobs.where('dbId').equals(dbId).delete()
    },
    [projectId]
  )

  return {
    jobs: jobs || [],
    addJob,
    updateJob,
    deleteJob
  }
}

export function useBackgrounds(projectId: string | null) {
  const backgrounds = useLiveQuery(
    () => (projectId ? db.backgrounds.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const images = useLiveQuery(
    () => (projectId ? db.backgroundImages.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const imagesByBackgroundId = useMemo(() => {
    return images?.reduce((acc, image) => {
      if (!acc[image.backgroundDbId]) {
        acc[image.backgroundDbId] = {
          main: undefined,
          thumbnail: undefined
        }
      }

      acc[image.backgroundDbId][image.type] = image

      return acc
    }, {} as Record<string, Record<string, BackgroundImage | undefined>>)
  }, [images])

  const addBackground = useCallback(
    async (background: Background) => {
      if (!projectId) return
      return await DatabaseService.addBackground(projectId, background)
    },
    [projectId]
  )

  const updateBackground = useCallback(
    async (dbId: string, updates: Partial<Background>) => {
      if (!projectId) return
      return await db.backgrounds.where('dbId').equals(dbId).modify(updates)
    },
    [projectId]
  )

  const deleteBackground = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      await db.backgrounds.where('dbId').equals(dbId).delete()
      await db.backgroundImages.where('backgroundDbId').equals(dbId).delete()
    },
    [projectId]
  )

  return {
    backgrounds: backgrounds ?? [],
    images: imagesByBackgroundId ?? {},
    addBackground,
    updateBackground,
    deleteBackground
  }
}

export function useAchievements(projectId: string | null) {
  const achievements = useLiveQuery(
    () => (projectId ? db.achievements.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const images = useLiveQuery(
    () => (projectId ? db.entityImages.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const imagesByAchievementId = useMemo(() => {
    return images?.reduce((acc, image) => {
      if (image.entityType !== 'achievement') return acc
      acc[image.entityDbId] = image
      return acc
    }, {} as Record<string, EntityImage>)
  }, [images])

  const addAchievement = useCallback(
    async (achievement: Achievement) => {
      if (!projectId) return
      return await DatabaseService.addAchievement(projectId, achievement)
    },
    [projectId]
  )

  const updateAchievement = useCallback(
    async (dbId: string, updates: Partial<Achievement>) => {
      if (!projectId) return
      return await DatabaseService.updateAchievement(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteAchievement = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteAchievement(projectId, dbId)
    },
    [projectId]
  )

  return {
    achievements: achievements ?? [],
    images: imagesByAchievementId ?? {},
    addAchievement,
    updateAchievement,
    deleteAchievement
  }
}

export function useEndings(projectId: string | null) {
  const endings = useLiveQuery(
    () => (projectId ? db.endings.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const images = useLiveQuery(
    () => (projectId ? db.endingImages.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const imagesByEndingId = useMemo(() => {
    return images?.reduce((acc, image) => {
      acc[image.endingDbId] = image
      return acc
    }, {} as Record<string, EndingImage>)
  }, [images])

  const addEnding = useCallback(
    async (ending: Ending) => {
      if (!projectId) return
      return await DatabaseService.addEnding(projectId, ending)
    },
    [projectId]
  )

  const updateEnding = useCallback(
    async (dbId: string, updates: Partial<Ending>) => {
      if (!projectId) return
      return await DatabaseService.updateEnding(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteEnding = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteEnding(projectId, dbId)
    },
    [projectId]
  )

  return {
    endings: endings ?? [],
    images: imagesByEndingId ?? {},
    addEnding,
    updateEnding,
    deleteEnding
  }
}

export function useEndingModifications(projectId: string | null) {
  const endingModifications = useLiveQuery(
    () => (projectId ? db.endingModifications.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const addEndingModification = useCallback(
    async (endingModification: EndingModification) => {
      if (!projectId) return
      return await DatabaseService.addEndingModification(projectId, endingModification)
    },
    [projectId]
  )

  const updateEndingModification = useCallback(
    async (dbId: string, updates: Partial<EndingModification>) => {
      if (!projectId) return
      return await DatabaseService.updateEndingModification(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteEndingModification = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteEndingModification(projectId, dbId)
    },
    [projectId]
  )

  return {
    endingModifications: endingModifications || [],
    addEndingModification,
    updateEndingModification,
    deleteEndingModification
  }
}

export function useStoryPatches(projectId: string | null) {
  const storyPatches = useLiveQuery(
    () => (projectId ? db.storyPatches.where('projectId').equals(projectId).toArray() : []),
    [projectId]
  )

  const addStoryPatch = useCallback(
    async (patch: StoryPatch) => {
      if (!projectId) return
      return await DatabaseService.addStoryPatch(projectId, patch)
    },
    [projectId]
  )

  const addStoryPatches = useCallback(
    async (patches: StoryPatch[]) => {
      if (!projectId) return
      return await DatabaseService.addStoryPatches(projectId, patches)
    },
    [projectId]
  )

  const updateStoryPatch = useCallback(
    async (dbId: string, updates: Partial<StoryPatch>) => {
      if (!projectId) return
      return await DatabaseService.updateStoryPatch(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteStoryPatch = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteStoryPatch(projectId, dbId)
    },
    [projectId]
  )

  const deleteStoryPatchesByFile = useCallback(
    async (file: string) => {
      if (!projectId) return
      return await DatabaseService.deleteStoryPatchesByFile(projectId, file)
    },
    [projectId]
  )

  return {
    storyPatches: storyPatches || [],
    addStoryPatch,
    addStoryPatches,
    updateStoryPatch,
    deleteStoryPatch,
    deleteStoryPatchesByFile
  }
}

export function useStories(projectId: string | null) {
  const stories = useLiveQuery(
    () => (projectId ? DatabaseService.getStories(projectId) : []),
    [projectId]
  )

  const addStory = useCallback(
    async (story: Story) => {
      if (!projectId) return
      return await DatabaseService.addStory(projectId, story)
    },
    [projectId]
  )

  const addStories = useCallback(
    async (stories: Story[]) => {
      if (!projectId) return
      return await DatabaseService.addStories(projectId, stories)
    },
    [projectId]
  )

  const updateStory = useCallback(
    async (dbId: string, updates: Partial<Story>) => {
      if (!projectId) return
      return await DatabaseService.updateStory(projectId, dbId, updates)
    },
    [projectId]
  )

  const deleteStory = useCallback(
    async (dbId: string) => {
      if (!projectId) return
      return await DatabaseService.deleteStory(projectId, dbId)
    },
    [projectId]
  )

  const deleteStoriesByFile = useCallback(
    async (file: string) => {
      if (!projectId) return
      return await DatabaseService.deleteStoriesByFile(projectId, file)
    },
    [projectId]
  )

  const getStoriesByFile = useCallback(
    async (file: string) => {
      if (!projectId) return []
      return await DatabaseService.getStoriesByFile(projectId, file)
    },
    [projectId]
  )

  const getStoriesByFileAndCategory = useCallback(
    async (file: string, category: string) => {
      if (!projectId) return []
      return await DatabaseService.getStoriesByFileAndCategory(projectId, file, category)
    },
    [projectId]
  )

  return {
    stories: stories || [],
    addStory,
    addStories,
    updateStory,
    deleteStory,
    deleteStoriesByFile,
    getStoriesByFile,
    getStoriesByFileAndCategory
  }
}

export function useCharacterImages(characterDbId: string) {
  const storySprites = useLiveQuery(
    () => DatabaseService.getCharacterStorySprites(characterDbId),
    [characterDbId]
  )

  const overworldSprites = useLiveQuery(
    () => DatabaseService.getCharacterOverworldSprites(characterDbId),
    [characterDbId]
  )

  const portraits = useLiveQuery(
    () => DatabaseService.getCharacterPortraits(characterDbId),
    [characterDbId]
  )

  const mainMenuSprite = useLiveQuery(
    () => DatabaseService.getCharacterMainMenuSprite(characterDbId),
    [characterDbId]
  )

  return {
    storySprites: storySprites || [],
    overworldSprites: overworldSprites || [],
    portraits: portraits || [],
    mainMenuSprite
  }
}

export function useLoadingState() {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const setLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }))
  }, [])

  const isLoading = useCallback(
    (key: string) => {
      return loading[key] || false
    },
    [loading]
  )

  return { setLoadingState, isLoading }
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setError = useCallback((key: string, error: string) => {
    setErrors((prev) => ({ ...prev, [key]: error }))
  }, [])

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[key]
      return newErrors
    })
  }, [])

  const getError = useCallback(
    (key: string) => {
      return errors[key]
    },
    [errors]
  )

  return { setError, clearError, getError, errors }
}
