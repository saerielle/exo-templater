export enum Gender {
  Male = 'M',
  Female = 'F',
  NonBinary = 'X'
}

export enum Season {
  Quiet = 'quiet',
  Pollen = 'pollen',
  Dust = 'dust',
  Wet = 'wet',
  Glow = 'glow'
}

export enum CardType {
  Memory = 'memory',
  Gear = 'gear'
}

export enum CardSuit {
  Physical = 'physical',
  Mental = 'mental',
  Social = 'social',
  Wild = 'wild',
  None = 'none'
}

export enum HowGet {
  None = 'none',
  Unique = 'unique',
  Training = 'training',
  TrainingBuy = 'trainingBuy',
  ShopDefault = 'shopDefault',
  ShopClothes = 'shopClothes',
  ShopWeapons = 'shopWeapons',
  ShopGadgets = 'shopGadgets'
}

export enum BackgroundType {
  Story = 'story',
  Ending = 'ending',
  Illustration = 'illustration'
}

export enum SkillId {
  Empathy = 'empathy',
  Persuasion = 'persuasion',
  Creativity = 'creativity',
  Bravery = 'bravery',

  Reasoning = 'reasoning',
  Organization = 'organization',
  Engineering = 'engineering',
  Biology = 'biology',

  Toughness = 'toughness',
  Perception = 'perception',
  Combat = 'combat',
  Animals = 'animals',

  Kudos = 'kudos',
  Stress = 'stress',
  Rebellion = 'rebellion'
}

export enum LocationId {
  Geoponics = 'geoponics',
  Quarters = 'quarters',
  Engineering = 'engineering',
  Garrison = 'garrison',
  Command = 'command',
  Expeditions = 'expeditions'
}

export interface CharacterStorySprite {
  id: string
  characterDbId: string
  characterId: string
  artStage: number
  expression: string
  imageBlob?: Blob
  projectId: string
}

export interface CharacterOverworldSprite {
  id: string
  characterDbId: string
  characterId: string
  artStage: number
  imageBlob?: Blob
  projectId: string
}

export interface CharacterPortrait {
  id: string
  characterDbId: string
  characterId: string
  artStage: number
  imageBlob?: Blob
  projectId: string
}

export interface CharacterMainMenuSprite {
  id: string
  characterDbId: string
  characterId: string
  imageBlob?: Blob
  projectId: string
}

export interface EndingImage {
  id: string
  endingDbId: string
  endingId: string
  type: 'special' | 'career'
  gender?: 'f' | 'm' | 'nb'
  imageBlob?: Blob
  projectId: string
}

export interface EntityImage {
  id: string
  entityId: string
  entityDbId: string
  entityType: 'card' | 'collectible' | 'achievement'
  imageBlob?: Blob
  projectId: string
}

export interface BackgroundImage {
  id: string
  backgroundDbId: string
  type: 'main' | 'thumbnail'
  imageBlob?: Blob
  projectId: string
}

export interface Character {
  id: string
  projectId: string
  dbId: string
  name: string
  nickname: string
  gender: Gender
  love: boolean
  age10: number
  birthday: string
  dialogueColor: string
  defaultBg: string
  basics: string
  more: string
  enhancement: string
  fillBar1Left: string
  fillBar1Right: string
  fillBar1Child: number
  fillBar1Teen: number
  fillBar1Adult: number
  fillBar2Left: string
  fillBar2Right: string
  fillBar2Child: number
  fillBar2Teen: number
  fillBar2Adult: number
  fillBar3Left: string
  fillBar3Right: string
  fillBar3Child: number
  fillBar3Teen: number
  fillBar3Adult: number
  dataOverride?: Array<{
    field: string
    value: string
    startDate?: string
    requiredMemories?: string[]
  }>
  customAging?: Array<{
    stage: string
    startDate: string
    requiredMemories: string[]
  }>
  likes?: string[]
  dislikes?: string[]
  ages: boolean
  onMap: boolean
  helioOnly: boolean
  spriteSize?: number
  spriteSizesByAge?: number[]
  overworldScaleByAge?: number[]
  skeleton?: string[]
  animationFrameRates?: number[]
  jobs?: string[]
  mainMenu?: {
    template: string
    position: [number, number]
  }
  preHelioMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  postHelioMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  destroyedMapSpot?: [number, number, number]
  nearbyStratoMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  nearbyHelioMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  plainsMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  valleyMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  ridgeMapSpots?: {
    [season in Season]?: [number, number, number]
  }
  defaultOnMap?: boolean
}

export interface CardAbility {
  id: string
  value: number
  suit: CardSuit
}

export interface Card {
  id: string
  projectId: string
  dbId: string
  name: string
  type: CardType
  level: number
  suit: CardSuit
  value?: number
  ability1?: CardAbility
  ability2?: CardAbility
  ability3?: CardAbility
  upgradeFrom?: string
  howGet: HowGet
  kudos?: number
  artistName?: string
  artistSocialAt?: string
  artistSocialLink?: string
}

export interface Collectible {
  id: string
  projectId: string
  dbId: string
  name: string
  plural: string
  howGet: HowGet
  kudos?: number
  like?: string[]
  dislike?: string[]
  artistName?: string
  artistSocialAt?: string
  artistLink?: string
  ability1?: CardAbility
  ability2?: CardAbility
  ability3?: CardAbility
}

export interface Job {
  id: string
  projectId: string
  dbId: string
  name: string
  location: LocationId
  battleHeaderText?: string
  isRelax?: boolean
  primarySkill?: SkillId
  primaryValue?: number
  secondSkill?: SkillId
  secondValue?: number
  kudos?: number
  stress?: number
  characters?: string[]
  ultimateBonusSkill?: SkillId
  ultimateBonusValue?: number
}

export interface Background {
  id: string
  projectId: string
  dbId: string
  type: BackgroundType
}

export interface Achievement {
  id: string
  projectId: string
  dbId: string
  name: string
  description: string
  hidden?: boolean
  loveAll?: string[]
  requiredCheevos?: string[]
  artistName?: string
  artistSocialAt?: string
  artistLink?: string
}

export interface Ending {
  id: string
  projectId: string
  dbId: string
  name: string
  preamble: string
  location?: string
  character?: string
  requiredJobs?: string[]
  otherJobs?: string[]
  requiredMemories?: string[]
  skills?: string[]
  isSpecial?: boolean
}

export interface EndingModification {
  id: string
  projectId: string
  dbId: string
  modifications?: {
    name?: string
    preamble?: string
    location?: string
    character?: string
    requiredJobs?: { add?: string[]; remove?: string[] }
    otherJobs?: { add?: string[]; remove?: string[] }
    requiredMemories?: { add?: string[]; remove?: string[] }
    skills?: { add?: string[]; remove?: string[] }
  }
}

export interface Story {
  id: string
  projectId: string
  dbId: string
  file?: string
  category?: string
  name: string
  content: string
  order?: number
}

export interface ModProject {
  id: string
  name: string
  description: string
  folderName: string
  createdAt: Date
  updatedAt: Date
}

export interface FullModProject extends ModProject {
  id: string
  name: string
  description: string
  folderName: string
  createdAt: Date
  updatedAt: Date
  characters: Character[]
  cards: Card[]
  collectibles: Collectible[]
  jobs: Job[]
  stories: Story[]
  storyPatches: StoryPatch[]
  backgrounds: Background[]
  achievements: Achievement[]
  endings: Ending[]
  endingModifications: EndingModification[]
}

export type CharacterFormData = Partial<Character>
export type CardFormData = Partial<Card>
export type CollectibleFormData = Partial<Collectible>
export type JobFormData = Partial<Job>

export const validateCardId = (id: string): string[] => {
  const errors: string[] = []

  if (!id) {
    errors.push('ID is required')
  } else if (!/^[a-zA-Z0-9_]+$/.test(id)) {
    errors.push('ID can only contain letters, numbers, and underscores')
  } else if (id.length < 3) {
    errors.push('ID should be at least 3 characters long')
  }

  return errors
}

export const validateId = (id: string): string[] => {
  const errors: string[] = []
  if (!id) {
    errors.push('ID is required')
  } else if (!/^[a-zA-Z]+$/.test(id)) {
    errors.push('ID can only contain letters')
  } else if (id.length < 3) {
    errors.push('ID should be at least 3 characters long')
  }

  return errors
}

export const validateHexColor = (color: string): boolean => {
  return /^[0-9A-Fa-f]{6}$/.test(color)
}

export enum StoryPatchType {
  Insert = 'insert',
  Replace = 'replace'
}

export interface StoryPatchBase {
  id: string
  projectId: string
  dbId: string
  file?: string
  category?: string
  type: StoryPatchType
  storyId: string
  body: string
  description?: string
  order?: number
}

export interface InsertStoryPatch extends StoryPatchBase {
  type: StoryPatchType.Insert
  locationKey: string
  locationIndex: number
}

export interface ReplaceStoryPatch extends StoryPatchBase {
  type: StoryPatchType.Replace
  startKey: string
  endKey: string
  startIndex: number
  endIndex: number
}

export type StoryPatch = InsertStoryPatch | ReplaceStoryPatch
