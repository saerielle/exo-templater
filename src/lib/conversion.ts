import type {
  Character,
  Card,
  Collectible,
  Job,
  Achievement,
  Ending,
  EndingModification,
  StoryPatch,
  InsertStoryPatch,
  ReplaceStoryPatch,
  Story
} from './exoloader'

interface DataOveride {
  Field: string
  Value: string
  StartDate?: string
  RequiredMemories?: string[]
}

interface CustomAging {
  Stage: string
  StartDate: string
  RequiredMemories: string[]
}

export interface ExoLoaderCharacter {
  Data: {
    ID: string
    NAME: string
    NICKNAME: string
    GENDER: string
    LOVE: string
    AGE10: string
    BIRTHDAY: string
    DIALOGUECOLOR: string
    DEFAULTBG: string
    BASICS: string
    MORE: string
    ENHANCEMENT: string
    FILLBAR1LEFT: string
    FILLBAR1RIGHT: string
    FILLBAR1CHILD: string
    FILLBAR1TEEN: string
    FILLBAR1ADULT: string
    FILLBAR2LEFT: string
    FILLBAR2RIGHT: string
    FILLBAR2CHILD: string
    FILLBAR2TEEN: string
    FILLBAR2ADULT: string
    FILLBAR3LEFT: string
    FILLBAR3RIGHT: string
    FILLBAR3CHILD: string
    FILLBAR3TEEN: string
    FILLBAR3ADULT: string
  }
  DataOverride?: Array<DataOveride>
  Likes?: string[]
  Dislikes?: string[]
  Ages: string
  OnMap: string
  HelioOnly?: string
  SpriteSize?: string
  SpriteSizesByAge?: string[]
  OverworldScaleByAge?: string[]
  Skeleton?: string[]
  AnimationFrameRates?: string[]
  Jobs?: string[]
  MainMenu?: {
    Template: string
    Position: [string, string]
  }
  PreHelioMapSpot?: [string, string, string]
  PreHelioMapSpots?: {
    [season: string]: [string, string, string]
  }
  PostHelioMapSpot?: [string, string, string]
  PostHelioMapSpots?: {
    [season: string]: [string, string, string]
  }
  DestroyedMapSpot?: [string, string, string]
  NearbyStratoMapSpots?: {
    [season: string]: [string, string, string]
  }
  NearbyHelioMapSpots?: {
    [season: string]: [string, string, string]
  }
  PlainsMapSpots?: {
    [season: string]: [string, string, string]
  }
  ValleyMapSpots?: {
    [season: string]: [string, string, string]
  }
  RidgeMapSpots?: {
    [season: string]: [string, string, string]
  }
  DefaultOnMap?: string
  CustomAging?: CustomAging[]
}

export interface ExoLoaderCard {
  ID: string
  Name: string
  Type: string
  Level: string
  Suit: string
  Value: string
  Ability1?: {
    ID: string
    Value: string
    Suit: string
  }
  Ability2?: {
    ID: string
    Value: string
    Suit: string
  }
  Ability3?: {
    ID: string
    Value: string
    Suit: string
  }
  UpgradeFrom?: string
  HowGet: string
  Kudos?: string
  ArtistName?: string
  ArtistSocialAt?: string
  ArtistSocialLink?: string
}

export interface ExoLoaderCollectible {
  ID: string
  Name: string
  Plural: string
  HowGet: string
  Kudos?: string
  Like?: string
  Dislike?: string
  ArtistName?: string
  ArtistSocialAt?: string
  ArtistLink?: string
  Ability1?: {
    ID: string
    Value: string
    Suit: string
  }
  Ability2?: {
    ID: string
    Value: string
    Suit: string
  }
  Ability3?: {
    ID: string
    Value: string
    Suit: string
  }
}

export interface ExoLoaderJob {
  ID: string
  Name: string
  Location: string
  BattleHeaderText?: string
  IsRelax?: string
  PrimarySkill?: string
  PrimaryValue?: string
  SecondSkill?: string
  SecondValue?: string
  Kudos?: string
  Stress?: string
  Characters?: string[]
  UltimateBonusSkill?: string
  UltimateBonusValue?: string
}

export interface ExoLoaderAchievement {
  ID: string
  Name: string
  Description: string
  Hidden?: string
  LoveAll?: string[]
  RequiredCheevos?: string[]
  ArtistName?: string
  ArtistSocialAt?: string
  ArtistLink?: string
}

export interface ExoLoaderEnding {
  ID: string
  Name: string
  Preamble: string
  Location?: string
  Character?: string
  RequiredJobs?: string[]
  OtherJobs?: string[]
  RequiredMemories?: string[]
  Skills?: string[]
}

export interface ExoLoaderEndingModification {
  ID: string
  Modifications: {
    Name?: string
    Preamble?: string
    Location?: string
    Character?: string
    RequiredJobs?: { Add?: string[]; Remove?: string[] }
    OtherJobs?: { Add?: string[]; Remove?: string[] }
    RequiredMemories?: { Add?: string[]; Remove?: string[] }
    Skills?: { Add?: string[]; Remove?: string[] }
  }
}

export class ExoLoaderConverter {
  static convertCharacter(character: Character): ExoLoaderCharacter {
    const result: ExoLoaderCharacter = {
      Data: {
        ID: character.id,
        NAME: character.name,
        NICKNAME: character.nickname,
        GENDER: character.gender.toString(),
        LOVE: character.love ? 'TRUE' : 'FALSE',
        AGE10: character.age10.toString(),
        BIRTHDAY: character.birthday,
        DIALOGUECOLOR: character.dialogueColor,
        DEFAULTBG: character.defaultBg,
        BASICS: character.basics,
        MORE: character.more,
        ENHANCEMENT: character.enhancement,
        FILLBAR1LEFT: character.fillBar1Left,
        FILLBAR1RIGHT: character.fillBar1Right,
        FILLBAR1CHILD: character.fillBar1Child.toString(),
        FILLBAR1TEEN: character.fillBar1Teen.toString(),
        FILLBAR1ADULT: character.fillBar1Adult.toString(),
        FILLBAR2LEFT: character.fillBar2Left,
        FILLBAR2RIGHT: character.fillBar2Right,
        FILLBAR2CHILD: character.fillBar2Child.toString(),
        FILLBAR2TEEN: character.fillBar2Teen.toString(),
        FILLBAR2ADULT: character.fillBar2Adult.toString(),
        FILLBAR3LEFT: character.fillBar3Left,
        FILLBAR3RIGHT: character.fillBar3Right,
        FILLBAR3CHILD: character.fillBar3Child.toString(),
        FILLBAR3TEEN: character.fillBar3Teen.toString(),
        FILLBAR3ADULT: character.fillBar3Adult.toString()
      },
      Ages: character.ages ? 'TRUE' : 'FALSE',
      OnMap: character.onMap ? 'TRUE' : 'FALSE',
      Likes: character.likes ?? [],
      Dislikes: character.dislikes ?? [],
      Jobs: character.jobs ?? []
    }

    if (character.dataOverride) {
      result.DataOverride = character.dataOverride.map((override) => {
        const o: DataOveride = {
          Field: override.field,
          Value: override.value
        }
        if (override.startDate?.length) {
          o.StartDate = override.startDate
        }
        if (override.requiredMemories?.length) {
          o.RequiredMemories = override.requiredMemories
        }
        return o
      })
    }

    if (character.customAging) {
      result.CustomAging = character.customAging.map((aging) => {
        const a: CustomAging = {
          Stage: aging.stage,
          StartDate: aging.startDate,
          RequiredMemories: aging.requiredMemories
        }
        return a
      })
    }

    if (character.helioOnly !== undefined) {
      result.HelioOnly = character.helioOnly ? 'TRUE' : 'FALSE'
    }

    if (character.spriteSize !== undefined) {
      result.SpriteSize = character.spriteSize.toString()
    }

    if (character.spriteSizesByAge) {
      result.SpriteSizesByAge = character.spriteSizesByAge.map((s) => s.toString())
    }

    if (character.overworldScaleByAge) {
      result.OverworldScaleByAge = character.overworldScaleByAge.map((s) => s.toString())
    }

    if (character.skeleton) {
      result.Skeleton = character.skeleton
    }

    if (character.animationFrameRates) {
      result.AnimationFrameRates = character.animationFrameRates.map((r) => r.toString())
    }

    if (character.mainMenu?.template?.length) {
      result.MainMenu = {
        Template: character.mainMenu.template,
        Position: [
          (character.mainMenu.position?.[0] ?? 0).toString(),
          (character.mainMenu.position?.[1] ?? 0).toString()
        ]
      }
    }

    if (character.destroyedMapSpot) {
      result.DestroyedMapSpot = character.destroyedMapSpot.map((v) => v.toString()) as [
        string,
        string,
        string
      ]
    }

    if (character.preHelioMapSpots) {
      result.PreHelioMapSpots = Object.entries(character.preHelioMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.postHelioMapSpots) {
      result.PostHelioMapSpots = Object.entries(character.postHelioMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.nearbyStratoMapSpots) {
      result.NearbyStratoMapSpots = Object.entries(character.nearbyStratoMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.nearbyHelioMapSpots) {
      result.NearbyHelioMapSpots = Object.entries(character.nearbyHelioMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.plainsMapSpots) {
      result.PlainsMapSpots = Object.entries(character.plainsMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.valleyMapSpots) {
      result.ValleyMapSpots = Object.entries(character.valleyMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.ridgeMapSpots) {
      result.RidgeMapSpots = Object.entries(character.ridgeMapSpots).reduce(
        (acc, [season, coords]) => {
          acc[season] = coords.map((v) => v.toString()) as [string, string, string]
          return acc
        },
        {} as { [season: string]: [string, string, string] }
      )
    }

    if (character.defaultOnMap !== undefined) {
      result.DefaultOnMap = character.defaultOnMap ? 'TRUE' : 'FALSE'
    }

    return result
  }

  static convertCard(card: Card): ExoLoaderCard {
    const result: ExoLoaderCard = {
      ID: card.id,
      Name: card.name,
      Type: card.type.toString(),
      Level: card.level.toString(),
      Suit: card.suit.toString(),
      Value: card.value?.toString() || '',
      HowGet: card.howGet.toString()
    }

    if (card.ability1?.id) {
      result.Ability1 = {
        ID: card.ability1.id,
        Value: card.ability1.value?.toString() ?? '',
        Suit: card.ability1.suit?.toString() ?? ''
      }
    } else {
      result.Ability1 = { ID: '', Value: '', Suit: '' }
    }

    if (card.ability2?.id) {
      result.Ability2 = {
        ID: card.ability2.id,
        Value: card.ability2.value?.toString() ?? '',
        Suit: card.ability2.suit?.toString() ?? ''
      }
    } else {
      result.Ability2 = { ID: '', Value: '', Suit: '' }
    }

    if (card.ability3?.id) {
      result.Ability3 = {
        ID: card.ability3.id,
        Value: card.ability3.value?.toString() ?? '',
        Suit: card.ability3.suit?.toString() ?? ''
      }
    } else {
      result.Ability3 = { ID: '', Value: '', Suit: '' }
    }

    if (card.upgradeFrom) {
      result.UpgradeFrom = card.upgradeFrom
    }

    if (card.kudos !== undefined) {
      result.Kudos = card.kudos.toString()
    }

    if (card.artistName) {
      result.ArtistName = card.artistName
    }

    if (card.artistSocialAt) {
      result.ArtistSocialAt = card.artistSocialAt
    }

    if (card.artistSocialLink) {
      result.ArtistSocialLink = card.artistSocialLink
    }

    return result
  }

  static convertCollectible(collectible: Collectible): ExoLoaderCollectible {
    const result: ExoLoaderCollectible = {
      ID: collectible.id,
      Name: collectible.name,
      Plural: collectible.plural,
      HowGet: collectible.howGet.toString()
    }

    if (collectible.kudos !== undefined) {
      result.Kudos = collectible.kudos.toString()
    }

    if (collectible.like && collectible.like.length > 0) {
      result.Like = collectible.like.join(', ')
    }

    if (collectible.dislike && collectible.dislike.length > 0) {
      result.Dislike = collectible.dislike.join(', ')
    }

    if (collectible.artistName) {
      result.ArtistName = collectible.artistName
    }

    if (collectible.artistSocialAt) {
      result.ArtistSocialAt = collectible.artistSocialAt
    }

    if (collectible.artistLink) {
      result.ArtistLink = collectible.artistLink
    }

    if (collectible.ability1) {
      result.Ability1 = {
        ID: collectible.ability1.id,
        Value: collectible.ability1.value.toString(),
        Suit: collectible.ability1.suit.toString()
      }
    } else {
      result.Ability1 = { ID: '', Value: '', Suit: '' }
    }

    if (collectible.ability2) {
      result.Ability2 = {
        ID: collectible.ability2.id,
        Value: collectible.ability2.value.toString(),
        Suit: collectible.ability2.suit.toString()
      }
    } else {
      result.Ability2 = { ID: '', Value: '', Suit: '' }
    }

    if (collectible.ability3) {
      result.Ability3 = {
        ID: collectible.ability3.id,
        Value: collectible.ability3.value.toString(),
        Suit: collectible.ability3.suit.toString()
      }
    } else {
      result.Ability3 = { ID: '', Value: '', Suit: '' }
    }

    return result
  }

  static convertJob(job: Job): ExoLoaderJob {
    const result: ExoLoaderJob = {
      ID: job.id,
      Name: job.name,
      Location: job.location.toString()
    }

    if (job.battleHeaderText) {
      result.BattleHeaderText = job.battleHeaderText
    }

    if (job.isRelax !== undefined) {
      result.IsRelax = job.isRelax ? 'TRUE' : 'FALSE'
    }

    if (job.primarySkill) {
      result.PrimarySkill = job.primarySkill.toString()
    }

    if (job.primaryValue !== undefined) {
      result.PrimaryValue = job.primaryValue.toString()
    }

    if (job.secondSkill) {
      result.SecondSkill = job.secondSkill.toString()
    }

    if (job.secondValue !== undefined) {
      result.SecondValue = job.secondValue.toString()
    }

    if (job.kudos !== undefined) {
      result.Kudos = job.kudos.toString()
    }

    if (job.stress !== undefined) {
      result.Stress = job.stress.toString()
    }

    if (job.characters) {
      result.Characters = job.characters
    }

    if (job.ultimateBonusSkill) {
      result.UltimateBonusSkill = job.ultimateBonusSkill.toString()
    }

    if (job.ultimateBonusValue !== undefined) {
      result.UltimateBonusValue = job.ultimateBonusValue.toString()
    }

    return result
  }

  static convertAchievement(achievement: Achievement): ExoLoaderAchievement {
    return {
      ID: achievement.id,
      Name: achievement.name,
      Description: achievement.description,
      Hidden:
        achievement.hidden !== undefined ? (achievement.hidden ? 'TRUE' : 'FALSE') : undefined,
      LoveAll: achievement.loveAll,
      RequiredCheevos: achievement.requiredCheevos,
      ArtistName: achievement.artistName,
      ArtistSocialAt: achievement.artistSocialAt,
      ArtistLink: achievement.artistLink
    }
  }

  static convertEnding(ending: Ending): ExoLoaderEnding {
    return {
      ID: ending.isSpecial ? `special_${ending.id}` : ending.id,
      Name: ending.name,
      Preamble: ending.preamble,
      Location: ending.location,
      Character: ending.character,
      RequiredJobs: ending.requiredJobs,
      OtherJobs: ending.otherJobs,
      RequiredMemories: ending.requiredMemories,
      Skills: ending.skills
    }
  }

  static convertEndingModification(mod: EndingModification): ExoLoaderEndingModification {
    function mapAddRemove(obj?: { add?: string[]; remove?: string[] }) {
      if (!obj) return undefined
      const result: { Add?: string[]; Remove?: string[] } = {}
      if (obj.add) result.Add = obj.add
      if (obj.remove) result.Remove = obj.remove
      return result
    }

    const modifications: ExoLoaderEndingModification['Modifications'] = {}

    if (mod.modifications) {
      if (mod.modifications.name) modifications.Name = mod.modifications.name
      if (mod.modifications.preamble) modifications.Preamble = mod.modifications.preamble
      if (mod.modifications.location) modifications.Location = mod.modifications.location
      if (mod.modifications.character) modifications.Character = mod.modifications.character
      if (mod.modifications.requiredJobs)
        modifications.RequiredJobs = mapAddRemove(mod.modifications.requiredJobs)
      if (mod.modifications.otherJobs)
        modifications.OtherJobs = mapAddRemove(mod.modifications.otherJobs)
      if (mod.modifications.requiredMemories)
        modifications.RequiredMemories = mapAddRemove(mod.modifications.requiredMemories)
      if (mod.modifications.skills) modifications.Skills = mapAddRemove(mod.modifications.skills)
    }

    return {
      ID: mod.id,
      Modifications: modifications
    }
  }

  static generateSpriteFilename(
    characterId: string,
    type: 'story' | 'map' | 'portrait' | 'mainmenu',
    artStage?: number,
    expression?: string
  ): string {
    switch (type) {
      case 'story':
        if (artStage) {
          return `${characterId}${artStage}_${expression ?? 'normal'}.png`
        }
        return `${characterId}_${expression ?? 'normal'}.png`

      case 'map':
        if (artStage) {
          return `${characterId}_model_${artStage}.png`
        }
        return `${characterId}_model.png`

      case 'portrait':
        if (artStage) {
          return `portrait_${characterId}${artStage}.png`
        }
        return `portrait_${characterId}.png`

      case 'mainmenu':
        return `chara_${characterId}.png`

      default:
        throw new Error(`Unknown sprite type: ${type}`)
    }
  }

  static generateJobImageFilename(
    jobId: string,
    type: 'special' | 'gendered',
    gender?: 'f' | 'm' | 'nb'
  ): string {
    if (type === 'special') {
      return `special_${jobId}.png`
    } else if (type === 'gendered' && gender) {
      return `${jobId}_${gender}.png`
    }
    throw new Error('Invalid job image configuration')
  }

  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()
  }

  static formatHexColor(color: string): string {
    color = color.replace('#', '')

    if (color.length === 3) {
      color = color
        .split('')
        .map((c) => c + c)
        .join('')
    }

    return color.toUpperCase()
  }

  static validateCharacterForExport(character: Character): string[] {
    const errors: string[] = []

    if (!character.id) errors.push('Character ID is required')
    if (!character.name) errors.push('Character name is required')
    if (!character.nickname) errors.push('Character nickname is required')
    if (!character.basics) errors.push('Character basics description is required')
    if (!character.enhancement) errors.push('Character enhancement is required')
    if (!character.defaultBg) errors.push('Character default background is required')

    if (character.dialogueColor && !/^[0-9A-Fa-f]{6}$/.test(character.dialogueColor)) {
      errors.push('Dialogue color must be a valid 6-digit hex color')
    }

    if (
      character.birthday !== 'glow' &&
      !/^(quiet|pollen|dust|wet)-\d+$/.test(character.birthday)
    ) {
      errors.push('Birthday must be in format "season-number" or "glow"')
    }

    return errors
  }

  static validateCardForExport(card: Card): string[] {
    const errors: string[] = []

    if (!card.id) errors.push('Card ID is required')
    if (!card.name) errors.push('Card name is required')
    if (card.level < 1 || card.level > 4) errors.push('Card level must be between 1 and 4')

    return errors
  }

  static validateCollectibleForExport(collectible: Collectible): string[] {
    const errors: string[] = []

    if (!collectible.id) errors.push('Collectible ID is required')
    if (!collectible.name) errors.push('Collectible name is required')
    if (!collectible.plural) errors.push('Collectible plural name is required')

    return errors
  }

  static validateJobForExport(job: Job): string[] {
    const errors: string[] = []

    if (!job.id) errors.push('Job ID is required')
    if (!job.name) errors.push('Job name is required')

    return errors
  }

  static validateAchievementForExport(achievement: Achievement): string[] {
    const errors: string[] = []
    if (!achievement.id) errors.push('Achievement ID is required')
    if (!achievement.name) errors.push('Achievement name is required')
    if (!achievement.description) errors.push('Achievement description is required')
    return errors
  }

  static validateEndingForExport(ending: Ending): string[] {
    const errors: string[] = []
    if (!ending.id) errors.push('Ending ID is required')
    if (!ending.name) errors.push('Ending name is required')
    if (!ending.preamble) errors.push('Ending preamble is required')
    return errors
  }

  static validateEndingModificationForExport(mod: EndingModification): string[] {
    const errors: string[] = []
    if (!mod.id) errors.push('EndingModification ID is required')
    if (mod.modifications && Object.keys(mod.modifications).length === 0) {
      errors.push('EndingModification modifications must have at least one field')
    }
    return errors
  }

  static validateStoryPatchForExport(patch: StoryPatch): string[] {
    const errors: string[] = []
    if (!patch.id) errors.push('StoryPatch ID is required')
    if (!patch.type) errors.push('StoryPatch type is required')
    if (!patch.storyId) errors.push('StoryPatch storyId is required')
    if (!patch.body) errors.push('StoryPatch body is required')
    if (patch.type === 'insert') {
      if (!(patch as InsertStoryPatch).locationKey)
        errors.push('InsertStoryPatch locationKey is required')
      if ((patch as InsertStoryPatch).locationIndex === undefined)
        errors.push('InsertStoryPatch locationIndex is required')
    } else if (patch.type === 'replace') {
      if (!(patch as ReplaceStoryPatch).startKey)
        errors.push('ReplaceStoryPatch startKey is required')
      if (!(patch as ReplaceStoryPatch).endKey) errors.push('ReplaceStoryPatch endKey is required')
      if ((patch as ReplaceStoryPatch).startIndex === undefined)
        errors.push('ReplaceStoryPatch startIndex is required')
      if ((patch as ReplaceStoryPatch).endIndex === undefined)
        errors.push('ReplaceStoryPatch endIndex is required')
    }
    return errors
  }

  static storyPatchesToExoFile(patches: Record<string, StoryPatch[]>): string {
    const lines: string[] = []
    for (const category in patches) {
      lines.push(`/******************************************************************************** }*/`)
      lines.push(`/** ${category} ***********************************************************/`)
      lines.push(`/******************************************************************************** {*/`)
      lines.push('')

      const sortedPatches = [...patches[category]].sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        return orderA - orderB
      })

      for (const patch of sortedPatches) {
        if (patch.description) {
          lines.push(`// ${patch.description}`)
        }

        if (patch.type === 'insert') {
          const insert = patch as InsertStoryPatch
          lines.push(`@insert|${escapePipe(insert.storyId)}|${escapePipe(insert.locationKey)}|${insert.locationIndex}`)
        } else if (patch.type === 'replace') {
          const replace = patch as ReplaceStoryPatch
          lines.push(`@replace|${escapePipe(replace.storyId)}|${escapePipe(replace.startKey)}|${escapePipe(replace.endKey)}|${replace.startIndex}|${replace.endIndex}`)
        }

        lines.push('{')
        lines.push(patch.body)
        lines.push('}')
        lines.push('')
      }
      lines.push('')
      lines.push('')
    }
    return lines.join('\n')
  }

  static storiesToExoFile(stories: Record<string, Story[]>): string {
    const lines: string[] = []
    for (const category in stories) {
      lines.push(`/******************************************************************************** }*/`)
      lines.push(`/** ${category} ***********************************************************/`)
      lines.push(`/******************************************************************************** {*/`)
      lines.push('')

      const sortedStories = [...stories[category]].sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        return orderA - orderB
      })
      for (const story of sortedStories) {
        lines.push(`=== ${story.name} ==============================================`)
        lines.push(story.content)
        lines.push('')
        lines.push('')
      }
      lines.push('')
    }
    return lines.join('\n')
  }
}

function escapePipe(str: string): string {
  return str.replace(/\|/g, '\\|')
}
