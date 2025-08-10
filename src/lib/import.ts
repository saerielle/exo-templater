import { DatabaseService } from './database'
import { ExoLoaderConverter } from './conversion'
import type {
  Character,
  Card,
  Collectible,
  Job,
  Achievement,
  Ending,
  EndingModification,
  Story,
  StoryPatch
} from './exoloader'
import { Gender, BackgroundType, StoryPatchType } from './exoloader'

interface ProjectImportData {
  name: string
  description: string
  folderName: string
  files: File[]
}

interface ParsedStory {
  name: string
  content: string
  category: string
  file?: string
  order: number
}

interface ParsedStoryPatch {
  id: string
  type: 'insert' | 'replace'
  storyId: string
  body: string
  description?: string
  category: string
  file?: string
  order: number
  locationKey?: string
  locationIndex?: number
  startKey?: string
  endKey?: string
  startIndex?: number
  endIndex?: number
}

export async function importProject(data: ProjectImportData): Promise<string> {
  try {
    const projectId = await DatabaseService.createProject({
      name: data.name,
      description: data.description,
      folderName: data.folderName
    })

    await importCharacters(projectId, data.files)
    await importCards(projectId, data.files)
    await importCollectibles(projectId, data.files)
    await importJobs(projectId, data.files)
    await importStories(projectId, data.files)
    await importStoryPatches(projectId, data.files)
    await importBackgrounds(projectId, data.files)
    await importAchievements(projectId, data.files)
    await importEndings(projectId, data.files)

    return projectId
  } catch (error) {
    console.error('Import failed:', error)
    throw new Error(`Failed to import project: ${error}`)
  }
}

async function importCharacters(projectId: string, files: File[]): Promise<void> {
  const characterFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Characters/') &&
    f.name === 'data.json'
  )

  for (const file of characterFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)
      const character = convertExoLoaderToCharacter(exoLoaderData, projectId)

      await DatabaseService.addCharacter(projectId, character)

      const characterFolder = file.webkitRelativePath?.replace('/data.json', '/Sprites/') || `Characters/${character.id}/Sprites/`

      await importCharacterImages(projectId, character, files, characterFolder)
    } catch (error) {
      console.warn(`Failed to import character from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importCharacterImages(projectId: string, character: Character, files: File[], characterFolder: string): Promise<void> {
  const storySpriteFiles = files.filter(f =>
    f.webkitRelativePath?.startsWith(characterFolder) &&
    !f.name.includes('_model_') &&
    !f.name.includes('portrait_') &&
    !f.name.includes('chara_') &&
    f.name.endsWith('.png')
  )

  for (const file of storySpriteFiles) {
    try {
      const filename = file.name.replace('.png', '')
      const match = filename.match(new RegExp(`^${character.id}(\\d+)_(.+)$`))
      if (match) {
        const artStage = parseInt(match[1])
        const expression = match[2]

        await DatabaseService.addCharacterStorySprite(projectId, {
          id: crypto.randomUUID(),
          characterDbId: character.dbId,
          characterId: character.id,
          artStage,
          expression,
          imageBlob: file,
          projectId
        })
      } else {
        const fallbackMatch = filename.match(new RegExp(`^${character.id}_(.+)$`))
        if (fallbackMatch) {
          const expression = fallbackMatch[1]
          if (expression !== 'model') {
            await DatabaseService.addCharacterStorySprite(projectId, {
              id: crypto.randomUUID(),
              characterDbId: character.dbId,
              characterId: character.id,
              artStage: 0,
              expression,
              imageBlob: file,
              projectId
            })
          }
        } else {
          await DatabaseService.addCharacterStorySprite(projectId, {
            id: crypto.randomUUID(),
            characterDbId: character.dbId,
            characterId: character.id,
            artStage: 0,
            expression: filename,
            imageBlob: file,
            projectId
          })
        }
      }
    } catch (error) {
      console.warn(`Failed to import story sprite ${file.name}:`, error)
    }
  }

  const overworldSpriteFiles = files.filter(f =>
    f.webkitRelativePath?.startsWith(characterFolder) &&
    f.name.includes('_model')
  )

  for (const file of overworldSpriteFiles) {
    try {
      const filename = file.name
      const match = filename.match(new RegExp(`^${character.id}_model_(\\d+)\\.png$`))
      if (match) {
        const artStage = parseInt(match[1])

        await DatabaseService.addCharacterOverworldSprite(projectId, {
          id: crypto.randomUUID(),
          characterDbId: character.dbId,
          characterId: character.id,
          artStage,
          imageBlob: file,
          projectId
        })
      } else {
        const noArtStageMatch = filename.match(new RegExp(`^${character.id}_model\\.png$`))
        if (noArtStageMatch) {
          await DatabaseService.addCharacterOverworldSprite(projectId, {
            id: crypto.randomUUID(),
            characterDbId: character.dbId,
            characterId: character.id,
            artStage: 0,
            imageBlob: file,
            projectId
          })
        } else {
          await DatabaseService.addCharacterOverworldSprite(projectId, {
            id: crypto.randomUUID(),
            characterDbId: character.dbId,
            characterId: character.id,
            artStage: 0,
            imageBlob: file,
            projectId
          })
        }
      }
    } catch (error) {
      console.warn(`Failed to import overworld sprite ${file.name}:`, error)
    }
  }

  const portraitFiles = files.filter(f =>
    f.webkitRelativePath?.startsWith(characterFolder) &&
    f.name.startsWith('portrait_')
  )

  for (const file of portraitFiles) {
    try {
      const filename = file.name
      const match = filename.match(new RegExp(`^portrait_${character.id}(\\d+)\\.png$`))
      if (match) {
        const artStage = parseInt(match[1])

        await DatabaseService.addCharacterPortrait(projectId, {
          id: crypto.randomUUID(),
          characterDbId: character.dbId,
          characterId: character.id,
          artStage,
          imageBlob: file,
          projectId
        })
      } else {
        await DatabaseService.addCharacterPortrait(projectId, {
          id: crypto.randomUUID(),
          characterDbId: character.dbId,
          characterId: character.id,
          artStage: 0,
          imageBlob: file,
          projectId
        })
      }
    } catch (error) {
      console.warn(`Failed to import portrait ${file.name}:`, error)
    }
  }

  const mainMenuFile = files.find(f =>
    f.webkitRelativePath?.startsWith(characterFolder) &&
    f.name === `chara_${character.id}.png`
  )

  if (mainMenuFile) {
    try {
      await DatabaseService.addCharacterMainMenuSprite(projectId, {
        id: crypto.randomUUID(),
        characterDbId: character.dbId,
        characterId: character.id,
        imageBlob: mainMenuFile,
        projectId
      })
    } catch (error) {
      console.warn(`Failed to import main menu sprite:`, error)
    }
  }
}

async function importCards(projectId: string, files: File[]): Promise<void> {
  const cardFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Cards/') &&
    f.name.endsWith('.json')
  )

  for (const file of cardFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)
      const card = convertExoLoaderToCard(exoLoaderData, projectId)

      await DatabaseService.addCard(projectId, card)

      const imageFile = files.find(f =>
        f.webkitRelativePath?.includes('/Cards/') &&
        f.name === `${card.id}.png`
      )

      if (imageFile) {
        await DatabaseService.addEntityImage(projectId, {
          id: crypto.randomUUID(),
          projectId,
          entityId: card.id,
          entityDbId: card.dbId,
          entityType: 'card',
          imageBlob: imageFile
        })
      }
    } catch (error) {
      console.warn(`Failed to import card from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importCollectibles(projectId: string, files: File[]): Promise<void> {
  const collectibleFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Collectibles/') &&
    f.name.endsWith('.json')
  )

  for (const file of collectibleFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)
      const collectible = convertExoLoaderToCollectible(exoLoaderData, projectId)

      await DatabaseService.addCollectible(projectId, collectible)

      const imageFile = files.find(f =>
        f.webkitRelativePath?.includes('/Collectibles/') &&
        f.name === `${collectible.id}.png`
      )

      if (imageFile) {
        await DatabaseService.addEntityImage(projectId, {
          id: crypto.randomUUID(),
          projectId,
          entityId: collectible.id,
          entityDbId: collectible.dbId,
          entityType: 'collectible',
          imageBlob: imageFile
        })
      }
    } catch (error) {
      console.warn(`Failed to import collectible from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importJobs(projectId: string, files: File[]): Promise<void> {
  const jobFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Jobs/') &&
    f.name.endsWith('.json')
  )

  for (const file of jobFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)
      const job = convertExoLoaderToJob(exoLoaderData, projectId)

      await DatabaseService.addJob(projectId, job)
    } catch (error) {
      console.warn(`Failed to import job from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importStories(projectId: string, files: File[]): Promise<void> {
  const storyFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Stories/') &&
    f.name.endsWith('.exo')
  )

  for (const file of storyFiles) {
    try {
      const content = await file.text()
      const stories = parseStoryFile(content, file.name.replace(/\.exo$/, ''))

      const storyData: Story[] = stories.map((story, index) => ({
        id: crypto.randomUUID(),
        projectId,
        dbId: crypto.randomUUID(),
        name: story.name,
        content: story.content,
        category: story.category,
        file: story.file,
        order: story.order
      }))

      await DatabaseService.addStories(projectId, storyData)
    } catch (error) {
      console.warn(`Failed to import stories from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importStoryPatches(projectId: string, files: File[]): Promise<void> {
  const patchFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/StoryPatches/') &&
    f.name.endsWith('.exo')
  )

  for (const file of patchFiles) {
    try {
      const content = await file.text()
      const patches = parseStoryPatchFile(content, file.name.replace(/\.exo$/, ''))

      const patchData: StoryPatch[] = patches.map((patch, index) => {
        const basePatch = {
          id: patch.id,
          projectId,
          dbId: crypto.randomUUID(),
          file: patch.file,
          category: patch.category,
          order: patch.order,
          storyId: patch.storyId,
          body: patch.body,
          description: patch.description
        }

        if (patch.type === 'insert') {
          return {
            ...basePatch,
            type: StoryPatchType.Insert,
            locationKey: patch.locationKey!,
            locationIndex: patch.locationIndex!
          }
        } else {
          return {
            ...basePatch,
            type: StoryPatchType.Replace,
            startKey: patch.startKey!,
            endKey: patch.endKey!,
            startIndex: patch.startIndex!,
            endIndex: patch.endIndex!
          }
        }
      })

      await DatabaseService.addStoryPatches(projectId, patchData)
    } catch (error) {
      console.warn(`Failed to import story patches from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importBackgrounds(projectId: string, files: File[]): Promise<void> {
  const allBackgroundFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Backgrounds/') &&
    f.name.endsWith('.png') &&
    !f.name.startsWith('ending_')
  )

  const backgroundFiles: File[] = []
  const thumbnailFiles: File[] = []

  for (const file of allBackgroundFiles) {
    if (file.name.endsWith('_thumbnail.png')) {
      thumbnailFiles.push(file)
    } else {
      backgroundFiles.push(file)
    }
  }

  for (const file of backgroundFiles) {
    try {
      const backgroundId = file.name.replace(/\.png$/, '')

      const backgroundDbId = crypto.randomUUID()

      await DatabaseService.addBackground(projectId, {
        id: backgroundId.replace('pinup_', ''),
        projectId,
        dbId: backgroundDbId,
        type: backgroundId.startsWith('pinup_') ? BackgroundType.Illustration : BackgroundType.Story
      })

      await DatabaseService.addBackgroundImage(projectId, {
        id: crypto.randomUUID(),
        backgroundDbId,
        type: 'main',
        imageBlob: file,
        projectId
      })

      const thumbnailImageFile = thumbnailFiles.find(f => f.name === `${backgroundId}_thumbnail.png`)

      if (thumbnailImageFile) {
        await DatabaseService.addBackgroundImage(projectId, {
          id: crypto.randomUUID(),
          backgroundDbId,
          type: 'thumbnail',
          imageBlob: thumbnailImageFile,
          projectId
        })
      }
    } catch (error) {
      console.warn(`Failed to import background ${file.name}:`, error)
    }
  }
}

async function importAchievements(projectId: string, files: File[]): Promise<void> {
  const achievementFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Achievements/') &&
    f.name.endsWith('.json')
  )

  for (const file of achievementFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)
      const achievement = convertExoLoaderToAchievement(exoLoaderData, projectId)

      await DatabaseService.addAchievement(projectId, achievement)

      const imageFile = files.find(f =>
        f.webkitRelativePath?.includes('/Achievements/') &&
        f.name === `${achievement.id}.png`
      )

      if (imageFile) {
        await DatabaseService.addEntityImage(projectId, {
          id: crypto.randomUUID(),
          projectId,
          entityId: achievement.id,
          entityDbId: achievement.dbId,
          entityType: 'achievement',
          imageBlob: imageFile
        })
      }
    } catch (error) {
      console.warn(`Failed to import achievement from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importEndings(projectId: string, files: File[]): Promise<void> {
  const endingFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Endings/') &&
    f.name.endsWith('.json')
  )

  for (const file of endingFiles) {
    try {
      const content = await file.text()
      const exoLoaderData = JSON.parse(content)

      if (exoLoaderData.Modifications) {
        const mod = convertExoLoaderToEndingModification(exoLoaderData, projectId)
        await DatabaseService.addEndingModification(projectId, mod)
      } else {
        const ending = convertExoLoaderToEnding(exoLoaderData, projectId)
        await DatabaseService.addEnding(projectId, ending)

        await importEndingImages(projectId, ending, files)
      }
    } catch (error) {
      console.warn(`Failed to import ending/modification from ${file.webkitRelativePath}:`, error)
    }
  }
}

async function importEndingImages(projectId: string, ending: Ending, files: File[]): Promise<void> {
  const filename = ending.isSpecial ? `ending_special_${ending.id}.png` : `ending_${ending.id}.png`

  const endingImageFiles = files.filter(f =>
    f.webkitRelativePath?.includes('/Backgrounds/') &&
    f.name === filename
  )

  for (const file of endingImageFiles) {
    try {
      const filename = file.name

      if (filename === `ending_special_${ending.id}.png`) {
        await DatabaseService.upsertEndingImage(projectId, {
          id: `ending_special_${ending.dbId}`,
          endingDbId: ending.dbId,
          endingId: ending.id,
          type: 'special',
          imageBlob: file,
          projectId
        })
      } else {
        const match = filename.match(new RegExp(`^ending_${ending.id}_([fnb])\\.png$`))
        if (match) {
          const gender = match[1] as 'f' | 'm' | 'nb'
          await DatabaseService.upsertEndingImage(projectId, {
            id: `ending_${ending.dbId}_${gender}`,
            endingDbId: ending.dbId,
            endingId: ending.id,
            type: 'career',
            gender,
            imageBlob: file,
            projectId
          })
        }
      }
    } catch (error) {
      console.warn(`Failed to import ending image ${file.name}:`, error)
    }
  }
}

function convertExoLoaderToCharacter(exoLoaderData: any, projectId: string): Character {
  const data = exoLoaderData.Data || {}

  const convertToNumber = (value: string | number): number => {
    if (typeof value === 'number') return value
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  const convertToBoolean = (value: string | boolean): boolean => {
    if (typeof value === 'boolean') return value
    return value === 'TRUE' || value === 'true'
  }

  const convertToArray = (value: any): any[] => {
    if (Array.isArray(value)) return value
    return []
  }

  const convertToMapSpots = (spots: any): { [key: string]: [number, number, number] } => {
    if (!spots || typeof spots !== 'object') {
      return {}
    }

    const result: { [key: string]: [number, number, number] } = {}
    Object.keys(spots).forEach((season) => {
      const spot = spots[season]
      if (Array.isArray(spot) && spot.length >= 3) {
        result[season] = [
          convertToNumber(spot[0]),
          convertToNumber(spot[1]),
          convertToNumber(spot[2])
        ]
      }
    })
    return result
  }

  const convertToMapSpot = (spot: any): [number, number, number] | undefined => {
    if (Array.isArray(spot) && spot.length >= 3) {
      return [convertToNumber(spot[0]), convertToNumber(spot[1]), convertToNumber(spot[2])]
    }
    return undefined
  }

  const convertDataOverride = (
    overrides: any[]
  ): Array<{
    field: string
    value: string
    startDate?: string
    requiredMemories?: string[]
  }> => {
    if (!Array.isArray(overrides)) {
      return []
    }

    return overrides.map((override) => {
      return {
        field: override.Field || '',
        value: override.Value || '',
        startDate: override.StartDate,
        requiredMemories: Array.isArray(override.RequiredMemories) ? override.RequiredMemories : []
      }
    })
  }

  const convertCustomAging = (customAging: any[]) => {
    if (!Array.isArray(customAging)) {
      return []
    }

    return customAging.map((aging) => {
      return {
        stage: aging.Stage || '',
        startDate: aging.StartDate,
        requiredMemories: Array.isArray(aging.RequiredMemories) ? aging.RequiredMemories : []
      }
    })
  }

  return {
    id: data.ID || '',
    name: data.NAME || '',
    nickname: data.NICKNAME || '',
    gender:
      data.GENDER === 'M' ? Gender.Male : data.GENDER === 'F' ? Gender.Female : Gender.NonBinary,
    love: convertToBoolean(data.LOVE),
    age10: convertToNumber(data.AGE10),
    birthday: data.BIRTHDAY || '',
    dialogueColor: data.DIALOGUECOLOR || '',
    defaultBg: data.DEFAULTBG || 'colony',
    basics: data.BASICS || '',
    more: data.MORE || '',
    enhancement: data.ENHANCEMENT || '',
    fillBar1Left: data.FILLBAR1LEFT || '',
    fillBar1Right: data.FILLBAR1RIGHT || '',
    fillBar1Child: convertToNumber(data.FILLBAR1CHILD),
    fillBar1Teen: convertToNumber(data.FILLBAR1TEEN),
    fillBar1Adult: convertToNumber(data.FILLBAR1ADULT),
    fillBar2Left: data.FILLBAR2LEFT || '',
    fillBar2Right: data.FILLBAR2RIGHT || '',
    fillBar2Child: convertToNumber(data.FILLBAR2CHILD),
    fillBar2Teen: convertToNumber(data.FILLBAR2TEEN),
    fillBar2Adult: convertToNumber(data.FILLBAR2ADULT),
    fillBar3Left: data.FILLBAR3LEFT || '',
    fillBar3Right: data.FILLBAR3RIGHT || '',
    fillBar3Child: convertToNumber(data.FILLBAR3CHILD),
    fillBar3Teen: convertToNumber(data.FILLBAR3TEEN),
    fillBar3Adult: convertToNumber(data.FILLBAR3ADULT),
    onMap: convertToBoolean(exoLoaderData.OnMap),
    ages: convertToBoolean(exoLoaderData.Ages),
    helioOnly: convertToBoolean(exoLoaderData.HelioOnly),
    likes: convertToArray(exoLoaderData.Likes),
    dislikes: convertToArray(exoLoaderData.Dislikes),
    jobs: convertToArray(exoLoaderData.Jobs),
    projectId,
    dbId: crypto.randomUUID(),
    skeleton: Array.isArray(exoLoaderData.Skeleton) ? exoLoaderData.Skeleton : [exoLoaderData.Skeleton || 'tang'],
    preHelioMapSpots: convertToMapSpots(exoLoaderData.PreHelioMapSpots),
    postHelioMapSpots: convertToMapSpots(exoLoaderData.PostHelioMapSpots),
    destroyedMapSpot: convertToMapSpot(exoLoaderData.DestroyedMapSpot),
    nearbyStratoMapSpots: convertToMapSpots(exoLoaderData.NearbyStratoMapSpots),
    nearbyHelioMapSpots: convertToMapSpots(exoLoaderData.NearbyHelioMapSpots),
    plainsMapSpots: convertToMapSpots(exoLoaderData.PlainsMapSpots),
    valleyMapSpots: convertToMapSpots(exoLoaderData.ValleyMapSpots),
    ridgeMapSpots: convertToMapSpots(exoLoaderData.RidgeMapSpots),
    defaultOnMap: exoLoaderData.DefaultOnMap ? convertToBoolean(exoLoaderData.DefaultOnMap) : true,
    dataOverride: convertDataOverride(exoLoaderData.DataOverride),
    customAging: convertCustomAging(exoLoaderData.CustomAging),
    spriteSizesByAge: Array.isArray(exoLoaderData.SpriteSizesByAge)
      ? exoLoaderData.SpriteSizesByAge.map(convertToNumber)
      : exoLoaderData.SpriteSize
        ? [
          convertToNumber(exoLoaderData.SpriteSize),
          convertToNumber(exoLoaderData.SpriteSize),
          convertToNumber(exoLoaderData.SpriteSize)
        ]
        : undefined,
    overworldScaleByAge: Array.isArray(exoLoaderData.OverworldScaleByAge)
      ? exoLoaderData.OverworldScaleByAge.map(convertToNumber)
      : undefined,
    mainMenu: exoLoaderData.MainMenu
      ? {
        template: exoLoaderData.MainMenu.Template || '',
        position:
          Array.isArray(exoLoaderData.MainMenu.Position) && exoLoaderData.MainMenu.Position.length >= 2
            ? [
              convertToNumber(exoLoaderData.MainMenu.Position[0]),
              convertToNumber(exoLoaderData.MainMenu.Position[1])
            ]
            : [0, 0]
      }
      : undefined,
  }
}

function convertExoLoaderToCard(exoLoaderData: any, projectId: string): Card {
  return {
    id: exoLoaderData.ID || '',
    name: exoLoaderData.Name || '',
    type: exoLoaderData.Type || 'skill',
    level: parseInt(exoLoaderData.Level) || 1,
    suit: exoLoaderData.Suit || 'none',
    value: parseInt(exoLoaderData.Value) || 0,
    ability1: exoLoaderData.Ability1 ? {
      id: exoLoaderData.Ability1.ID || '',
      value: parseInt(exoLoaderData.Ability1.Value) || 0,
      suit: exoLoaderData.Ability1.Suit || 'none'
    } : undefined,
    ability2: exoLoaderData.Ability2 ? {
      id: exoLoaderData.Ability2.ID || '',
      value: parseInt(exoLoaderData.Ability2.Value) || 0,
      suit: exoLoaderData.Ability2.Suit || 'none'
    } : undefined,
    ability3: exoLoaderData.Ability3 ? {
      id: exoLoaderData.Ability3.ID || '',
      value: parseInt(exoLoaderData.Ability3.Value) || 0,
      suit: exoLoaderData.Ability3.Suit || 'none'
    } : undefined,
    upgradeFrom: exoLoaderData.UpgradeFrom,
    howGet: exoLoaderData.HowGet || 'none',
    kudos: exoLoaderData.Kudos ? parseInt(exoLoaderData.Kudos) : undefined,
    artistName: exoLoaderData.ArtistName,
    artistSocialAt: exoLoaderData.ArtistSocialAt,
    artistSocialLink: exoLoaderData.ArtistSocialLink,
    projectId,
    dbId: crypto.randomUUID()
  }
}

function convertExoLoaderToCollectible(exoLoaderData: any, projectId: string): Collectible {
  return {
    id: exoLoaderData.ID || '',
    name: exoLoaderData.Name || '',
    plural: exoLoaderData.Plural || '',
    howGet: exoLoaderData.HowGet || 'none',
    kudos: exoLoaderData.Kudos ? parseInt(exoLoaderData.Kudos) : undefined,
    like: exoLoaderData.Like?.split(',').map((id: string) => id.trim()),
    dislike: exoLoaderData.Dislike?.split(',').map((id: string) => id.trim()),
    artistName: exoLoaderData.ArtistName,
    artistSocialAt: exoLoaderData.ArtistSocialAt,
    artistLink: exoLoaderData.ArtistLink,
    ability1: exoLoaderData.Ability1 ? {
      id: exoLoaderData.Ability1.ID || '',
      value: parseInt(exoLoaderData.Ability1.Value) || 0,
      suit: exoLoaderData.Ability1.Suit || 'none'
    } : undefined,
    ability2: exoLoaderData.Ability2 ? {
      id: exoLoaderData.Ability2.ID || '',
      value: parseInt(exoLoaderData.Ability2.Value) || 0,
      suit: exoLoaderData.Ability2.Suit || 'none'
    } : undefined,
    ability3: exoLoaderData.Ability3 ? {
      id: exoLoaderData.Ability3.ID || '',
      value: parseInt(exoLoaderData.Ability3.Value) || 0,
      suit: exoLoaderData.Ability3.Suit || 'none'
    } : undefined,
    projectId,
    dbId: crypto.randomUUID()
  }
}

function convertExoLoaderToJob(exoLoaderData: any, projectId: string): Job {
  return {
    id: exoLoaderData.ID || '',
    name: exoLoaderData.Name || '',
    location: exoLoaderData.Location || '',
    battleHeaderText: exoLoaderData.BattleHeaderText,
    isRelax: exoLoaderData.IsRelax === 'TRUE',
    primarySkill: exoLoaderData.PrimarySkill,
    primaryValue: exoLoaderData.PrimaryValue ? parseInt(exoLoaderData.PrimaryValue) : undefined,
    secondSkill: exoLoaderData.SecondSkill,
    secondValue: exoLoaderData.SecondValue ? parseInt(exoLoaderData.SecondValue) : undefined,
    kudos: exoLoaderData.Kudos ? parseInt(exoLoaderData.Kudos) : undefined,
    stress: exoLoaderData.Stress ? parseInt(exoLoaderData.Stress) : undefined,
    characters: Array.isArray(exoLoaderData.Characters) ? exoLoaderData.Characters : [],
    ultimateBonusSkill: exoLoaderData.UltimateBonusSkill,
    ultimateBonusValue: exoLoaderData.UltimateBonusValue ? parseInt(exoLoaderData.UltimateBonusValue) : undefined,
    projectId,
    dbId: crypto.randomUUID()
  }
}

function convertExoLoaderToAchievement(exoLoaderData: any, projectId: string): Achievement {
  return {
    id: exoLoaderData.ID || '',
    name: exoLoaderData.Name || '',
    description: exoLoaderData.Description || '',
    hidden: exoLoaderData.Hidden === 'TRUE',
    loveAll: Array.isArray(exoLoaderData.LoveAll) ? exoLoaderData.LoveAll : [],
    requiredCheevos: Array.isArray(exoLoaderData.RequiredCheevos) ? exoLoaderData.RequiredCheevos : [],
    artistName: exoLoaderData.ArtistName,
    artistSocialAt: exoLoaderData.ArtistSocialAt,
    artistLink: exoLoaderData.ArtistLink,
    projectId,
    dbId: crypto.randomUUID()
  }
}

function convertExoLoaderToEnding(exoLoaderData: any, projectId: string): Ending {
  return {
    id: (exoLoaderData.ID || '').replace('special_', ''),
    name: exoLoaderData.Name || '',
    preamble: exoLoaderData.Preamble || '',
    location: exoLoaderData.Location,
    character: exoLoaderData.Character,
    requiredJobs: Array.isArray(exoLoaderData.RequiredJobs) ? exoLoaderData.RequiredJobs : [],
    otherJobs: Array.isArray(exoLoaderData.OtherJobs) ? exoLoaderData.OtherJobs : [],
    requiredMemories: Array.isArray(exoLoaderData.RequiredMemories) ? exoLoaderData.RequiredMemories : [],
    skills: Array.isArray(exoLoaderData.Skills) ? exoLoaderData.Skills : [],
    isSpecial: exoLoaderData.ID?.startsWith('special_'),
    projectId,
    dbId: crypto.randomUUID()
  }
}

function convertExoLoaderToEndingModification(exoLoaderData: any, projectId: string): EndingModification {
  return {
    id: exoLoaderData.ID || '',
    modifications: {
      name: exoLoaderData.Modifications?.Name,
      preamble: exoLoaderData.Modifications?.Preamble,
      location: exoLoaderData.Modifications?.Location,
      character: exoLoaderData.Modifications?.Character,
      requiredJobs: exoLoaderData.Modifications?.RequiredJobs ? {
        add: Array.isArray(exoLoaderData.Modifications.RequiredJobs.Add) ? exoLoaderData.Modifications.RequiredJobs.Add : [],
        remove: Array.isArray(exoLoaderData.Modifications.RequiredJobs.Remove) ? exoLoaderData.Modifications.RequiredJobs.Remove : []
      } : undefined,
      otherJobs: exoLoaderData.Modifications?.OtherJobs ? {
        add: Array.isArray(exoLoaderData.Modifications.OtherJobs.Add) ? exoLoaderData.Modifications.OtherJobs.Add : [],
        remove: Array.isArray(exoLoaderData.Modifications.OtherJobs.Remove) ? exoLoaderData.Modifications.OtherJobs.Remove : []
      } : undefined,
      requiredMemories: exoLoaderData.Modifications?.RequiredMemories ? {
        add: Array.isArray(exoLoaderData.Modifications.RequiredMemories.Add) ? exoLoaderData.Modifications.RequiredMemories.Add : [],
        remove: Array.isArray(exoLoaderData.Modifications.RequiredMemories.Remove) ? exoLoaderData.Modifications.RequiredMemories.Remove : []
      } : undefined,
      skills: exoLoaderData.Modifications?.Skills ? {
        add: Array.isArray(exoLoaderData.Modifications.Skills.Add) ? exoLoaderData.Modifications.Skills.Add : [],
        remove: Array.isArray(exoLoaderData.Modifications.Skills.Remove) ? exoLoaderData.Modifications.Skills.Remove : []
      } : undefined
    },
    projectId,
    dbId: crypto.randomUUID()
  }
}

function parseStoryFile(content: string, filename: string): ParsedStory[] {
  const stories: ParsedStory[] = []
  const lines = content.split('\n')

  let currentCategory = 'Generic'
  let currentStoryName = ''
  let currentContent: string[] = []
  let inStory = false
  let categoryOrder = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (
      line.includes('/*******************************************************************************') &&
      line.includes('}*/') &&
      i + 2 < lines.length
    ) {
      if (inStory && currentStoryName && currentContent.length > 0) {
        stories.push({
          name: currentStoryName,
          content: finalizeContent(currentContent),
          category: currentCategory,
          file: filename,
          order: categoryOrder++
        })
        currentStoryName = ''
        currentContent = []
        inStory = false
      }

      const categoryLine = lines[i + 1]?.trim()
      if (categoryLine && categoryLine.startsWith('/**') && categoryLine.includes('*')) {
        let categoryName = categoryLine
          .replace(/^\/\*\*\s*/, '')
          .replace(/\s*\*+\/?$/, '')
          .trim()

        if (categoryName) {
          currentCategory = categoryName
        }
      }
    }

    if (line.startsWith('===')) {
      if (inStory && currentStoryName && currentContent.length > 0) {
        stories.push({
          name: currentStoryName,
          content: finalizeContent(currentContent),
          category: currentCategory,
          file: filename,
          order: categoryOrder++
        })
      }

      currentStoryName = line.replace(/=/g, '').trim()
      currentContent = []
      inStory = true
    } else if (inStory) {
      currentContent.push(lines[i])
    }
  }

  if (inStory && currentStoryName && currentContent.length > 0) {
    stories.push({
      name: currentStoryName,
      content: finalizeContent(currentContent),
      category: currentCategory,
      file: filename,
      order: categoryOrder++
    })
  }

  return stories
}

function parseStoryPatchFile(content: string, filename: string): ParsedStoryPatch[] {
  const patches: ParsedStoryPatch[] = []
  const lines = content.split('\n')

  let currentCategory = 'Generic'
  let currentPatch: Partial<ParsedStoryPatch> | null = null
  let currentBody: string[] = []
  let inPatch = false
  let inBody = false
  let categoryOrder = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (
      line.includes('/*******************************************************************************') &&
      line.includes('}*/') &&
      i + 2 < lines.length
    ) {
      if (inPatch && currentPatch && currentBody.length > 0) {
        currentPatch.body = finalizeContent(currentBody)
        currentPatch.category = currentCategory
        currentPatch.file = filename
        currentPatch.order = categoryOrder++
        patches.push(currentPatch as ParsedStoryPatch)

        currentPatch = null
        currentBody = []
        inPatch = false
        inBody = false
      }

      const categoryLine = lines[i + 1]?.trim()
      if (categoryLine && categoryLine.startsWith('/**') && categoryLine.includes('*')) {
        let categoryName = categoryLine
          .replace(/^\/\*\*\s*/, '')
          .replace(/\s*\*+\/?$/, '')
          .trim()

        if (categoryName) {
          currentCategory = categoryName
        }
      }
    }

    if (line.startsWith('@insert|') || line.startsWith('@replace|')) {
      if (inPatch && currentPatch && currentBody.length > 0) {
        currentPatch.body = finalizeContent(currentBody)
        currentPatch.category = currentCategory
        currentPatch.file = filename
        currentPatch.order = categoryOrder++
        patches.push(currentPatch as ParsedStoryPatch)
      }

      const parts = parsePipeSeparatedLine(line)

      if (line.startsWith('@insert|')) {
        if (parts.length >= 4) {
          currentPatch = {
            id: crypto.randomUUID(),
            type: 'insert',
            storyId: parts[1],
            locationKey: parts[2],
            locationIndex: parseInt(parts[3]) || 0
          }
        }
      } else if (line.startsWith('@replace|')) {
        if (parts.length >= 6) {
          currentPatch = {
            id: crypto.randomUUID(),
            type: 'replace',
            storyId: parts[1],
            startKey: parts[2],
            endKey: parts[3],
            startIndex: parseInt(parts[4]) || 0,
            endIndex: parseInt(parts[5]) || 0
          }
        }
      }

      inPatch = true
      inBody = false
      currentBody = []
    } else if (inPatch) {
      if (line.startsWith('//') && !inBody) {
        const description = line.substring(2).trim()
        if (description && currentPatch) {
          currentPatch.description = description
        }
      }
      else if (line === '{') {
        inBody = true
        currentBody = []
      } else if (line === '}' && inBody) {
        inBody = false
      } else if (inBody) {
        currentBody.push(lines[i])
      }
    }
  }

  if (inPatch && currentPatch && currentBody.length > 0) {
    currentPatch.body = finalizeContent(currentBody)
    currentPatch.category = currentCategory
    currentPatch.file = filename
    currentPatch.order = categoryOrder++
    patches.push(currentPatch as ParsedStoryPatch)
  }

  return patches
}

function parsePipeSeparatedLine(line: string): string[] {
  const parts: string[] = []
  let currentPart = ''
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (char === '|') {
      if (i > 0 && line[i - 1] === '\\') {
        currentPart = currentPart.slice(0, -1) + '|'
      } else {
        parts.push(currentPart)
        currentPart = ''
      }
    } else {
      currentPart += char
    }

    i++
  }

  parts.push(currentPart)

  return parts
}

function finalizeContent(content: string[]): string {
  for (let i = content.length - 1; i >= 0; i--) {
    if (content[i].trim() === '') {
      content.pop()
    } else {
      break
    }
  }

  return content.join('\n')
}
