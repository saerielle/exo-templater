import Dexie, { Table } from 'dexie'

import {
  type Achievement,
  type Background,
  type BackgroundImage,
  type Card,
  CardSuit,
  CardType,
  type Character,
  type CharacterMainMenuSprite,
  type CharacterOverworldSprite,
  type CharacterPortrait,
  type CharacterStorySprite,
  type Collectible,
  type Ending,
  type EndingImage,
  type EndingModification,
  type EntityImage,
  FullModProject,
  HowGet,
  type Job,
  type ModProject,
  type Story,
  type StoryPatch
} from './exoloader'

export class ExoLoaderDB extends Dexie {
  projects!: Table<ModProject>
  characters!: Table<Character>
  cards!: Table<Card>
  collectibles!: Table<Collectible>
  jobs!: Table<Job>
  backgrounds!: Table<Background>
  achievements!: Table<Achievement>
  endings!: Table<Ending>
  endingModifications!: Table<EndingModification>
  storyPatches!: Table<StoryPatch>
  stories!: Table<Story>

  characterStorySprites!: Table<CharacterStorySprite>
  characterOverworldSprites!: Table<CharacterOverworldSprite>
  characterPortraits!: Table<CharacterPortrait>
  characterMainMenuSprites!: Table<CharacterMainMenuSprite>
  entityImages!: Table<EntityImage>
  backgroundImages!: Table<BackgroundImage>
  endingImages!: Table<EndingImage>

  constructor() {
    super('ExoLoaderModDB')

    this.version(3).stores({
      projects: '++id, name, folderName, createdAt, updatedAt',
      characters: '++dbId, projectId, id, [projectId+id]',
      cards: '++dbId, projectId, id, [projectId+id]',
      collectibles: '++dbId, projectId, id, [projectId+id]',
      jobs: '++dbId, projectId, id, [projectId+id]',
      backgrounds: '++dbId, projectId, id, [projectId+id]',
      achievements: '++dbId, projectId, id, [projectId+id]',
      endings: '++dbId, projectId, id, [projectId+id]',
      endingModifications: '++dbId, projectId, id, [projectId+id]',
      storyPatches: '++dbId, projectId, id, [projectId+id]',
      stories: '++dbId, projectId, id, [projectId+id]',

      characterStorySprites:
        '++id, projectId, characterDbId, [projectId+characterDbId+artStage+expression]',
      characterOverworldSprites:
        '++id, projectId, characterDbId, [projectId+characterDbId+artStage]',
      characterPortraits: '++id, projectId, characterDbId, [projectId+characterDbId+artStage]',
      characterMainMenuSprites: '++id, projectId, characterDbId, [projectId+characterDbId]',
      entityImages:
        '++id, projectId, entityId, entityDbId, entityType, [projectId+entityId+entityType]',
      backgroundImages: '++id, projectId, backgroundDbId, type, [projectId+backgroundDbId+type]',
      endingImages:
        '++id, projectId, endingId, endingDbId, type, gender, [projectId+endingId+type+gender]'
    })
  }
}

export const db = new ExoLoaderDB()

export class DatabaseService {
  static async createProject(
    project: Omit<ModProject, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const newProject: ModProject = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await db.projects.add(newProject)
  }

  static async getProject(id: string): Promise<FullModProject | undefined> {
    const project = await db.projects.get(id)
    if (!project) return undefined

    const [
      characters,
      cards,
      collectibles,
      jobs,
      storyPatches,
      stories,
      backgrounds,
      achievements,
      endings,
      endingModifications
    ] = await Promise.all([
      db.characters.where('projectId').equals(id).toArray(),
      db.cards.where('projectId').equals(id).toArray(),
      db.collectibles.where('projectId').equals(id).toArray(),
      db.jobs.where('projectId').equals(id).toArray(),
      db.storyPatches.where('projectId').equals(id).toArray(),
      db.stories.where('projectId').equals(id).toArray(),
      db.backgrounds.where('projectId').equals(id).toArray(),
      db.achievements.where('projectId').equals(id).toArray(),
      db.endings.where('projectId').equals(id).toArray(),
      db.endingModifications.where('projectId').equals(id).toArray()
    ])

    return {
      ...project,
      characters,
      cards,
      collectibles,
      jobs,
      storyPatches: storyPatches.sort((a, b) => a.storyId.localeCompare(b.storyId)),
      stories,
      backgrounds,
      achievements,
      endings,
      endingModifications
    }
  }

  static async getAllProjects(): Promise<ModProject[]> {
    return await db.projects.orderBy('updatedAt').reverse().toArray()
  }

  static async updateProject(id: string, updates: Partial<ModProject>): Promise<void> {
    await db.projects.update(id, { ...updates, updatedAt: new Date() })
  }

  static async deleteProject(id: string): Promise<void> {
    await db.transaction(
      'rw',
      [
        db.projects,
        db.characters,
        db.cards,
        db.collectibles,
        db.jobs,
        db.storyPatches,
        db.stories,
        db.backgrounds,
        db.achievements,
        db.endings,
        db.endingModifications,
        db.characterStorySprites,
        db.characterOverworldSprites,
        db.characterPortraits,
        db.characterMainMenuSprites,
        db.entityImages,
        db.backgroundImages,
        db.endingImages
      ],
      async () => {
        await db.projects.delete(id)
        await db.characters.where('projectId').equals(id).delete()
        await db.cards.where('projectId').equals(id).delete()
        await db.collectibles.where('projectId').equals(id).delete()
        await db.jobs.where('projectId').equals(id).delete()
        await db.backgrounds.where('projectId').equals(id).delete()
        await db.achievements.where('projectId').equals(id).delete()
        await db.endings.where('projectId').equals(id).delete()
        await db.endingModifications.where('projectId').equals(id).delete()
        await db.storyPatches.where('projectId').equals(id).delete()
        await db.stories.where('projectId').equals(id).delete()
        await db.characterStorySprites.where('projectId').equals(id).delete()
        await db.characterOverworldSprites.where('projectId').equals(id).delete()
        await db.characterPortraits.where('projectId').equals(id).delete()
        await db.characterMainMenuSprites.where('projectId').equals(id).delete()
        await db.entityImages.where('projectId').equals(id).delete()
        await db.backgroundImages.where('projectId').equals(id).delete()
        await db.endingImages.where('projectId').equals(id).delete()
      }
    )
  }

  static async addCharacter(projectId: string, character: Character): Promise<void> {
    await db.characters.add(character)
    await this.touchProject(projectId)
  }

  static async updateCharacter(projectId: string, dbId: string, updates: Character): Promise<void> {
    const original = await db.characters.where('dbId').equals(dbId).first()
    if (!original) {
      console.log('Character not found', projectId, dbId)
      return
    }
    await db.characters.update(original.dbId, updates)
    await this.touchProject(projectId)
  }

  static async deleteCharacter(projectId: string, dbId: string): Promise<void> {
    await db.transaction(
      'rw',
      [
        db.characters,
        db.characterStorySprites,
        db.characterOverworldSprites,
        db.characterPortraits,
        db.characterMainMenuSprites
      ],
      async () => {
        await db.characters.where('dbId').equals(dbId).delete()
        await db.characterStorySprites.where('characterDbId').equals(dbId).delete()
        await db.characterOverworldSprites.where('characterDbId').equals(dbId).delete()
        await db.characterPortraits.where('characterDbId').equals(dbId).delete()
        await db.characterMainMenuSprites.where('characterDbId').equals(dbId).delete()
      }
    )
    await this.touchProject(projectId)
  }

  static async getCharacter(projectId: string, characterId: string) {
    return await db.characters.where('[projectId+id]').equals([projectId, characterId]).first()
  }

  static async addCard(projectId: string, card: Card): Promise<void> {
    await db.cards.add(card)
    await this.touchProject(projectId)
  }

  static async updateCard(
    projectId: string,
    cardId: string,
    updates: Partial<Card>
  ): Promise<void> {
    await db.cards.where('dbId').equals(cardId).modify(updates)
    await this.touchProject(projectId)
  }

  static async deleteCard(projectId: string, dbId: string): Promise<void> {
    await db.transaction('rw', [db.cards, db.entityImages], async () => {
      await db.cards.where('dbId').equals(dbId).delete()
      await db.entityImages.where('entityDbId').equals(dbId).delete()
    })
    await this.touchProject(projectId)
  }

  static async getCard(projectId: string, cardId: string): Promise<Card | undefined> {
    return await db.cards.where('[projectId+id]').equals([projectId, cardId]).first()
  }

  static async getCharacterCards(projectId: string, characterId: string): Promise<Card[]> {
    return await db.cards
      .where('projectId')
      .equals(projectId)
      .and(
        (card) =>
          card.id === `${characterId}1` ||
          card.id === `${characterId}2` ||
          card.id === `${characterId}3`
      )
      .toArray()
  }

  static async getCharacterAchievement(
    projectId: string,
    characterId: string
  ): Promise<Achievement | undefined> {
    return await db.achievements
      .where('projectId')
      .equals(projectId)
      .and((achievement) => achievement.id === `chara_${characterId}`)
      .first()
  }

  static async createCharacterCards(
    projectId: string,
    character: Character,
    cardName: string,
    cardSuit: CardSuit
  ): Promise<void> {
    const cards: Card[] = []

    for (let i = 1; i <= 3; i++) {
      const name = `${character.nickname}'s ${cardName} ` + 'I'.repeat(i)
      const cardId = `${character.id}${i}`

      cards.push({
        id: cardId,
        projectId,
        dbId: crypto.randomUUID(),
        name,
        type: CardType.Memory,
        level: i,
        suit: cardSuit,
        value: i,
        howGet: HowGet.Unique,
        upgradeFrom: i === 1 ? undefined : `${character.id}${i - 1}`
      })
    }

    await db.cards.bulkAdd(cards)

    const characterPortraits = await this.getCharacterPortraits(character.dbId)
    if (characterPortraits.length > 0) {
      for (let i = 1; i <= 3; i++) {
        const cardId = `${character.id}${i}`
        const card = cards.find((c) => c.id === cardId)
        if (!card) continue

        let portraitStage = i
        if (character.helioOnly) {
          portraitStage = i <= 2 ? 2 : 3
        } else if (!character.ages) {
          portraitStage = 0
        }

        const portrait = characterPortraits.find((p) => p.artStage === portraitStage)
        if (portrait && portrait.imageBlob) {
          await this.addEntityImage(projectId, {
            id: `${cardId}_portrait`,
            entityId: cardId,
            entityDbId: card.dbId,
            entityType: 'card',
            imageBlob: portrait.imageBlob,
            projectId
          })
        }
      }
    }

    await this.touchProject(projectId)
  }

  static async createCharacterAchievement(
    projectId: string,
    character: Character,
    cardName: string
  ): Promise<void> {
    const id = crypto.randomUUID()

    await db.achievements.add({
      id: `chara_${character.id}`,
      dbId: id,
      projectId,
      name: `${character.nickname}'s ${cardName}`.trim(),
      description: `Unlock ${character.nickname} on the Main Menu`
    })

    const characterPortraits = await this.getCharacterPortraits(character.dbId)
    if (characterPortraits.length > 0) {
      const portrait = characterPortraits.sort((a, b) => b.artStage - a.artStage)[0]
      if (portrait && portrait.imageBlob) {
        await this.addEntityImage(projectId, {
          id: `chara_${character.id}_achievement`,
          entityId: `chara_${character.id}`,
          entityDbId: id,
          entityType: 'achievement',
          imageBlob: portrait.imageBlob,
          projectId
        })
      }
    }
  }

  static async addCharacterStorySprite(
    projectId: string,
    sprite: CharacterStorySprite
  ): Promise<void> {
    await db.characterStorySprites.add({ ...sprite, projectId })
    await this.touchProject(projectId)
  }

  static async getCharacterStorySprites(characterDbId: string): Promise<CharacterStorySprite[]> {
    return await db.characterStorySprites.where('characterDbId').equals(characterDbId).toArray()
  }

  static async deleteCharacterStorySprite(id: string): Promise<void> {
    const sprite = await db.characterStorySprites.get(id)
    if (sprite) {
      await db.characterStorySprites.delete(id)
      await this.touchProject(sprite.projectId)
    }
  }

  static async addCharacterOverworldSprite(
    projectId: string,
    sprite: CharacterOverworldSprite
  ): Promise<void> {
    await db.characterOverworldSprites.add({ ...sprite, projectId })
    await this.touchProject(projectId)
  }

  static async getCharacterOverworldSprites(
    characterDbId: string
  ): Promise<CharacterOverworldSprite[]> {
    return await db.characterOverworldSprites.where('characterDbId').equals(characterDbId).toArray()
  }

  static async deleteCharacterOverworldSprite(id: string): Promise<void> {
    const sprite = await db.characterOverworldSprites.get(id)
    if (sprite) {
      await db.characterOverworldSprites.delete(id)
      await this.touchProject(sprite.projectId)
    }
  }

  static async addCharacterPortrait(projectId: string, portrait: CharacterPortrait): Promise<void> {
    await db.characterPortraits.add({ ...portrait, projectId })
    await this.touchProject(projectId)
  }

  static async getCharacterPortraits(characterDbId: string): Promise<CharacterPortrait[]> {
    return await db.characterPortraits.where('characterDbId').equals(characterDbId).toArray()
  }

  static async deleteCharacterPortrait(id: string): Promise<void> {
    const portrait = await db.characterPortraits.get(id)
    if (portrait) {
      await db.characterPortraits.delete(id)
      await this.touchProject(portrait.projectId)
    }
  }

  static async addCharacterMainMenuSprite(
    projectId: string,
    sprite: CharacterMainMenuSprite
  ): Promise<void> {
    await db.characterMainMenuSprites.where('characterDbId').equals(sprite.characterDbId).delete()
    await db.characterMainMenuSprites.add({ ...sprite, projectId })
    await this.touchProject(projectId)
  }

  static async getCharacterMainMenuSprite(
    characterDbId: string
  ): Promise<CharacterMainMenuSprite | undefined> {
    return await db.characterMainMenuSprites.where('characterDbId').equals(characterDbId).first()
  }

  static async deleteCharacterMainMenuSprite(id: string): Promise<void> {
    const sprite = await db.characterMainMenuSprites.get(id)
    if (sprite) {
      await db.characterMainMenuSprites.delete(id)
      await this.touchProject(sprite.projectId)
    }
  }

  static async addEntityImage(projectId: string, image: EntityImage): Promise<void> {
    await db.entityImages.where('entityDbId').equals(image.entityDbId).delete()
    await db.entityImages.add(image)
    await this.touchProject(projectId)
  }

  static async getEntityImage(entityDbId: string): Promise<EntityImage | undefined> {
    return await db.entityImages.where('entityDbId').equals(entityDbId).first()
  }

  static async addBackgroundImage(projectId: string, image: BackgroundImage): Promise<void> {
    await db.backgroundImages
      .where('[projectId+backgroundDbId+type]')
      .equals([projectId, image.backgroundDbId, image.type])
      .delete()
    await db.backgroundImages.add({ ...image, projectId })
    await this.touchProject(projectId)
  }

  static async getBackgroundImages(
    projectId: string,
    backgroundDbId: string
  ): Promise<BackgroundImage[]> {
    return await db.backgroundImages
      .where('projectId')
      .equals(projectId)
      .and((img) => img.backgroundDbId === backgroundDbId)
      .toArray()
  }

  static async deleteBackgroundImage(id: string): Promise<void> {
    const image = await db.backgroundImages.get(id)
    if (image) {
      await db.backgroundImages.delete(id)
      await this.touchProject(image.projectId)
    }
  }

  static async addCollectible(projectId: string, collectible: Collectible): Promise<void> {
    await db.collectibles.add({ ...collectible, projectId })
    await this.touchProject(projectId)
  }

  static async deleteCollectible(projectId: string, dbId: string): Promise<void> {
    await db.transaction('rw', [db.collectibles, db.entityImages], async () => {
      await db.collectibles.where('dbId').equals(dbId).delete()
      await db.entityImages.where('entityDbId').equals(dbId).delete()
    })
    await this.touchProject(projectId)
  }

  static async getCollectible(
    projectId: string,
    collectibleId: string
  ): Promise<Collectible | undefined> {
    return await db.collectibles.where('[projectId+id]').equals([projectId, collectibleId]).first()
  }

  static async addJob(projectId: string, job: Job): Promise<void> {
    await db.jobs.add({ ...job, projectId })
    await this.touchProject(projectId)
  }

  static async addBackground(projectId: string, background: Background): Promise<void> {
    await db.backgrounds.add({ ...background, projectId })
    await this.touchProject(projectId)
  }

  static async getBackground(
    projectId: string,
    backgroundId: string
  ): Promise<Background | undefined> {
    return await db.backgrounds.where('[projectId+id]').equals([projectId, backgroundId]).first()
  }

  static async addEndingModification(
    projectId: string,
    endingModification: EndingModification
  ): Promise<void> {
    await db.endingModifications.add(endingModification)
    await this.touchProject(projectId)
  }

  static async updateEndingModification(
    projectId: string,
    dbId: string,
    updates: Partial<EndingModification>
  ): Promise<void> {
    await db.endingModifications.where('dbId').equals(dbId).modify(updates)
    await this.touchProject(projectId)
  }

  static async deleteEndingModification(projectId: string, dbId: string): Promise<void> {
    await db.endingModifications.where('dbId').equals(dbId).delete()
    await this.touchProject(projectId)
  }

  static async addAchievement(projectId: string, achievement: Achievement): Promise<void> {
    await db.achievements.add(achievement)
    await this.touchProject(projectId)
  }

  static async deleteAchievement(projectId: string, dbId: string): Promise<void> {
    await db.transaction('rw', [db.achievements, db.entityImages], async () => {
      await db.achievements.where('dbId').equals(dbId).delete()
      await db.entityImages.where('entityDbId').equals(dbId).delete()
    })
    await this.touchProject(projectId)
  }

  static async updateAchievement(
    projectId: string,
    dbId: string,
    updates: Partial<Achievement>
  ): Promise<void> {
    await db.achievements.where('dbId').equals(dbId).modify(updates)
    await this.touchProject(projectId)
  }

  static async getEnding(endingDbId: string): Promise<Ending | undefined> {
    return await db.endings.where('dbId').equals(endingDbId).first()
  }

  static async addEnding(projectId: string, ending: Ending): Promise<void> {
    await db.endings.add(ending)
    await this.touchProject(projectId)
  }

  static async updateEnding(
    projectId: string,
    dbId: string,
    updates: Partial<Ending>
  ): Promise<void> {
    await db.endings.where('dbId').equals(dbId).modify(updates)
    await this.touchProject(projectId)
  }

  static async deleteEnding(projectId: string, dbId: string): Promise<void> {
    await db.transaction('rw', [db.endings, db.endingImages], async () => {
      await db.endings.where('dbId').equals(dbId).delete()
      await db.endingImages.where('endingDbId').equals(dbId).delete()
    })
    await this.touchProject(projectId)
  }

  static async getEndingAchievement(
    projectId: string,
    endingId: string
  ): Promise<Achievement | undefined> {
    return await db.achievements
      .where('projectId')
      .equals(projectId)
      .and((achievement) => achievement.id === `ending_${endingId}`)
      .first()
  }

  static async createEndingAchievement(projectId: string, ending: Ending): Promise<void> {
    const hasEndingInName = ending.name.toLowerCase().includes('ending')
    await db.achievements.add({
      id: `ending_${ending.id}`,
      dbId: crypto.randomUUID(),
      projectId,
      name: ending.name,
      description: `Get the ${ending.name} ${hasEndingInName ? '' : 'Ending'}`.trim()
    })
  }

  private static async touchProject(projectId: string): Promise<void> {
    await db.projects.update(projectId, { updatedAt: new Date() })
  }

  static async exportProject(projectId: string): Promise<string> {
    const project = await this.getProject(projectId)
    if (!project) throw new Error('Project not found')

    return JSON.stringify(project, null, 2)
  }

  static async generateThumbnail(
    imageBlob: Blob,
    maxWidth: number = 200,
    maxHeight: number = 200
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        let { width, height } = img
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to generate thumbnail'))
          }
        }, 'image/png')
      }

      img.onerror = reject
      img.src = URL.createObjectURL(imageBlob)
    })
  }

  static async upsertCharacterStorySprite(
    projectId: string,
    sprite: CharacterStorySprite
  ): Promise<void> {
    const artStage = typeof sprite.artStage === 'number' ? sprite.artStage : 0
    const expression =
      typeof sprite.expression === 'string' && sprite.expression.length > 0
        ? sprite.expression
        : 'normal'
    const existing = await db.characterStorySprites
      .where('[projectId+characterDbId+artStage+expression]')
      .equals([projectId, sprite.characterDbId, artStage, expression])
      .first()
    if (existing) {
      await db.characterStorySprites.update(existing.id, sprite)
    } else {
      await db.characterStorySprites.add(sprite)
    }
    await this.touchProject(projectId)
  }

  static async upsertCharacterPortrait(
    projectId: string,
    portrait: CharacterPortrait
  ): Promise<void> {
    const artStage = typeof portrait.artStage === 'number' ? portrait.artStage : 0
    const existing = await db.characterPortraits
      .where('[projectId+characterDbId+artStage]')
      .equals([projectId, portrait.characterDbId, artStage])
      .first()
    if (existing) {
      await db.characterPortraits.update(existing.id, portrait)
    } else {
      await db.characterPortraits.add(portrait)
    }
    await this.touchProject(projectId)
  }

  static async upsertCharacterOverworldSprite(
    projectId: string,
    sprite: CharacterOverworldSprite
  ): Promise<void> {
    const artStage = typeof sprite.artStage === 'number' ? sprite.artStage : 0
    const existing = await db.characterOverworldSprites
      .where('[projectId+characterDbId+artStage]')
      .equals([projectId, sprite.characterDbId, artStage])
      .first()
    if (existing) {
      await db.characterOverworldSprites.update(existing.id, sprite)
    } else {
      await db.characterOverworldSprites.add(sprite)
    }
    await this.touchProject(projectId)
  }

  static async upsertCharacterMainMenuSprite(
    projectId: string,
    sprite: CharacterMainMenuSprite
  ): Promise<void> {
    const existing = await db.characterMainMenuSprites
      .where('[projectId+characterDbId]')
      .equals([projectId, sprite.characterDbId])
      .first()
    if (existing) {
      await db.characterMainMenuSprites.update(existing.id, sprite)
    } else {
      await db.characterMainMenuSprites.add(sprite)
    }
    await this.touchProject(projectId)
  }

  static async upsertBackgroundImage(projectId: string, image: BackgroundImage): Promise<void> {
    const existing = await db.backgroundImages
      .where('[projectId+backgroundDbId+type]')
      .equals([projectId, image.backgroundDbId, image.type])
      .first()
    if (existing) {
      await db.backgroundImages.update(existing.id, image)
    } else {
      await db.backgroundImages.add(image)
    }
    await this.touchProject(projectId)
  }

  static async upsertEndingImage(projectId: string, image: EndingImage): Promise<void> {
    const existing = await db.endingImages.where('id').equals(image.id).first()
    if (existing) {
      await db.endingImages.update(existing.id, image)
    } else {
      await db.endingImages.add(image)
    }
    await this.touchProject(projectId)
  }

  static async getEndingImages(projectId: string, endingDbId: string): Promise<EndingImage[]> {
    return await db.endingImages
      .where('projectId')
      .equals(projectId)
      .and((img) => img.endingDbId === endingDbId)
      .toArray()
  }

  static async addStoryPatch(projectId: string, patch: StoryPatch): Promise<void> {
    await db.storyPatches.add(patch)
    await this.touchProject(projectId)
  }

  static async addStoryPatches(projectId: string, patches: StoryPatch[]): Promise<void> {
    await db.storyPatches.bulkAdd(patches)
    await this.touchProject(projectId)
  }

  static async updateStoryPatch(
    projectId: string,
    dbId: string,
    updates: Partial<StoryPatch>
  ): Promise<void> {
    await db.storyPatches.where('dbId').equals(dbId).modify(updates)
    await this.touchProject(projectId)
  }

  static async deleteStoryPatch(projectId: string, dbId: string): Promise<void> {
    await db.storyPatches.where('dbId').equals(dbId).delete()
    await this.touchProject(projectId)
  }

  static async getStoryPatches(projectId: string): Promise<StoryPatch[]> {
    return await db.storyPatches.where('projectId').equals(projectId).toArray()
  }

  static async deleteStoryPatchesByFile(projectId: string, file: string): Promise<void> {
    await db.storyPatches
      .where('projectId')
      .equals(projectId)
      .and((patch) => {
        if (file === '') {
          return !patch.file || patch.file === ''
        }
        return patch.file === file
      })
      .delete()
    await this.touchProject(projectId)
  }

  static async addStory(projectId: string, story: Story): Promise<void> {
    await db.stories.add(story)
    await this.touchProject(projectId)
  }

  static async addStories(projectId: string, stories: Story[]): Promise<void> {
    await db.stories.bulkAdd(stories)
    await this.touchProject(projectId)
  }

  static async updateStory(
    projectId: string,
    dbId: string,
    updates: Partial<Story>
  ): Promise<void> {
    await db.stories.where('dbId').equals(dbId).modify(updates)
    await this.touchProject(projectId)
  }

  static async deleteStory(projectId: string, dbId: string): Promise<void> {
    await db.stories.where('dbId').equals(dbId).delete()
    await this.touchProject(projectId)
  }

  static async getStories(projectId: string): Promise<Story[]> {
    return await db.stories.where('projectId').equals(projectId).toArray()
  }

  static async deleteStoriesByFile(projectId: string, file: string): Promise<void> {
    await db.stories
      .where('projectId')
      .equals(projectId)
      .and((story) => {
        if (file === '') {
          return !story.file || story.file === ''
        }
        return story.file === file
      })
      .delete()
    await this.touchProject(projectId)
  }

  static async getStoriesByFile(projectId: string, file: string): Promise<Story[]> {
    return await db.stories
      .where('projectId')
      .equals(projectId)
      .and((story) => story.file === file)
      .toArray()
  }

  static async getStoriesByFileAndCategory(
    projectId: string,
    file: string,
    category: string
  ): Promise<Story[]> {
    return await db.stories
      .where('projectId')
      .equals(projectId)
      .and((story) => story.file === file && story.category === category)
      .toArray()
  }
}
