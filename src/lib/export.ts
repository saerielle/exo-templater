import JSZip from 'jszip'

import { ExoLoaderConverter } from './conversion'
import { DatabaseService } from './database'
import type {
  Achievement,
  Background,
  BackgroundImage,
  Card,
  Character,
  CharacterOverworldSprite,
  CharacterPortrait,
  CharacterStorySprite,
  Collectible,
  Ending,
  EndingImage,
  FullModProject,
  Gender,
  ModProject,
  Story,
  StoryPatch
} from './exoloader'
import { generateImage } from './generateSprite'

export class ModExporter {
  static async exportAsZip(project: FullModProject): Promise<Blob> {
    const zip = new JSZip()
    const rootFolder = zip.folder(project.folderName)

    if (!rootFolder) throw new Error('Failed to create root folder')

    if (project.characters.length > 0) {
      const charactersFolder = rootFolder.folder('Characters')
      if (!charactersFolder) throw new Error('Failed to create Characters folder')

      for (const character of project.characters) {
        const charFolder = charactersFolder.folder(character.id)
        if (!charFolder) continue

        const validationErrors = ExoLoaderConverter.validateCharacterForExport(character)
        if (validationErrors.length > 0) {
          console.warn(`Character ${character.id} has validation errors:`, validationErrors)
        }

        const exoLoaderCharacter = ExoLoaderConverter.convertCharacter(character)
        charFolder.file('data.json', JSON.stringify(exoLoaderCharacter, null, 2))

        const spritesFolder = charFolder.folder('Sprites')
        if (spritesFolder) {
          await this.addCharacterImages(spritesFolder, character)
        }
      }
    }

    if (project.cards.length > 0) {
      const cardsFolder = rootFolder.folder('Cards')
      if (!cardsFolder) throw new Error('Failed to create Cards folder')

      for (const card of project.cards) {
        const validationErrors = ExoLoaderConverter.validateCardForExport(card)
        if (validationErrors.length > 0) {
          console.warn(`Card ${card.id} has validation errors:`, validationErrors)
        }

        const exoLoaderCard = ExoLoaderConverter.convertCard(card)
        cardsFolder.file(`${card.id}.json`, JSON.stringify(exoLoaderCard, null, 2))

        await this.addEntityImage(cardsFolder, card)
      }
    }

    if (project.collectibles.length > 0) {
      const collectiblesFolder = rootFolder.folder('Collectibles')
      if (!collectiblesFolder) throw new Error('Failed to create Collectibles folder')

      for (const collectible of project.collectibles) {
        const validationErrors = ExoLoaderConverter.validateCollectibleForExport(collectible)
        if (validationErrors.length > 0) {
          console.warn(`Collectible ${collectible.id} has validation errors:`, validationErrors)
        }

        const exoLoaderCollectible = ExoLoaderConverter.convertCollectible(collectible)
        collectiblesFolder.file(
          `${collectible.id}.json`,
          JSON.stringify(exoLoaderCollectible, null, 2)
        )

        await this.addEntityImage(collectiblesFolder, collectible)
      }
    }

    if (project.jobs.length > 0) {
      const jobsFolder = rootFolder.folder('Jobs')
      if (!jobsFolder) throw new Error('Failed to create Jobs folder')

      for (const job of project.jobs) {
        const validationErrors = ExoLoaderConverter.validateJobForExport(job)
        if (validationErrors.length > 0) {
          console.warn(`Job ${job.id} has validation errors:`, validationErrors)
        }

        const exoLoaderJob = ExoLoaderConverter.convertJob(job)
        jobsFolder.file(`${job.id}.json`, JSON.stringify(exoLoaderJob, null, 2))
      }
    }

    if (project.storyPatches.length > 0) {
      const patchesFolder = rootFolder.folder('StoryPatches')
      if (!patchesFolder) throw new Error('Failed to create StoryPatches folder')
      const files = project.storyPatches.reduce(
        (acc, patch) => {
          const file = patch.file?.length
            ? patch.file
            : `${project.folderName.toLowerCase()}_patches`
          const category = patch.category?.length ? patch.category : 'Generic'
          if (!acc[file]) {
            acc[file] = {}
          }
          if (!acc[file][category]) {
            acc[file][category] = []
          }
          acc[file][category].push(patch)
          return acc
        },
        {} as Record<string, Record<string, StoryPatch[]>>
      )
      for (const file in files) {
        const patches = ExoLoaderConverter.storyPatchesToExoFile(files[file])
        patchesFolder.file(`${file}.exo`, patches)
      }
    }

    if (project.stories.length) {
      const storiesFolder = rootFolder.folder('Stories')
      if (!storiesFolder) throw new Error('Failed to create Stories folder')

      const files = project.stories.reduce(
        (acc, story) => {
          const file = story.file?.length
            ? story.file
            : `${project.folderName.toLowerCase()}_stories`
          const category = story.category?.length ? story.category : 'Generic'
          if (!acc[file]) {
            acc[file] = {}
          }
          if (!acc[file][category]) {
            acc[file][category] = []
          }
          acc[file][category].push(story)
          return acc
        },
        {} as Record<string, Record<string, Story[]>>
      )

      for (const file in files) {
        const content = ExoLoaderConverter.storiesToExoFile(files[file])
        storiesFolder.file(`${file}.exo`, content)
      }
    }

    if (project.backgrounds.length > 0) {
      const backgroundsFolder = rootFolder.folder('Backgrounds')
      if (!backgroundsFolder) throw new Error('Failed to create Backgrounds folder')

      for (const background of project.backgrounds) {
        await this.addBackgroundImages(backgroundsFolder, project.id, background)
      }
    }

    if (project.achievements && project.achievements.length > 0) {
      const achievementsFolder = rootFolder.folder('Achievements')
      if (!achievementsFolder) throw new Error('Failed to create Achievements folder')

      for (const achievement of project.achievements) {
        const validationErrors = ExoLoaderConverter.validateAchievementForExport(achievement)
        if (validationErrors.length > 0) {
          console.warn(`Achievement ${achievement.id} has validation errors:`, validationErrors)
        }
        const exoLoaderAchievement = ExoLoaderConverter.convertAchievement(achievement)
        achievementsFolder.file(
          `${achievement.id}.json`,
          JSON.stringify(exoLoaderAchievement, null, 2)
        )
        await this.addEntityImage(achievementsFolder, achievement)
      }
    }

    if (project.endings && project.endings.length > 0) {
      const endingsFolder = rootFolder.folder('Endings')
      if (!endingsFolder) throw new Error('Failed to create Endings folder')
      const backgroundsFolder = rootFolder.folder('Backgrounds')
      if (!backgroundsFolder) throw new Error('Failed to create Backgrounds folder')

      for (const ending of project.endings) {
        const validationErrors = ExoLoaderConverter.validateEndingForExport(ending)
        if (validationErrors.length > 0) {
          console.warn(`Ending ${ending.id} has validation errors:`, validationErrors)
        }

        const exoLoaderEnding = ExoLoaderConverter.convertEnding(ending)
        endingsFolder.file(`${ending.id}.json`, JSON.stringify(exoLoaderEnding, null, 2))
        await this.addEndingImages(backgroundsFolder, project.id, ending)
      }
    }

    if (project.endingModifications && project.endingModifications.length > 0) {
      const endingsFolder = rootFolder.folder('Endings')
      if (!endingsFolder) throw new Error('Failed to create Endings folder')
      for (const mod of project.endingModifications) {
        const validationErrors = ExoLoaderConverter.validateEndingModificationForExport(mod)
        if (validationErrors.length > 0) {
          console.warn(`EndingModification ${mod.id} has validation errors:`, validationErrors)
        }
        const exoLoaderMod = ExoLoaderConverter.convertEndingModification(mod)
        endingsFolder.file(`${mod.id}_mod.json`, JSON.stringify(exoLoaderMod, null, 2))
      }
    }

    rootFolder.file('README.md', this.generateReadme(project))

    return await zip.generateAsync({ type: 'blob' })
  }

  private static async getCharacterStorySprites(
    character: Character
  ): Promise<CharacterStorySprite[]> {
    const storySprites = await DatabaseService.getCharacterStorySprites(character.dbId)
    const existingKeys = storySprites.map((sprite) => {
      const artStage = sprite.artStage ?? 0
      const expression = sprite.expression ?? 'normal'
      return `${artStage}-${expression}`
    })

    for (const idx in storySprites) {
      if (!storySprites[idx]?.imageBlob) {
        const image = await generateImage({
          width: 280,
          height: 500,
          shape: 'rectangle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${storySprites[idx].artStage} ${storySprites[idx].expression}`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        storySprites[idx].imageBlob = image
      }
    }

    const ageStages = character.ages ? [1, 2, 3] : [0]

    for (const ageStage of ageStages) {
      if (!existingKeys.includes(`${ageStage}-normal`)) {
        const image = await generateImage({
          width: 280,
          height: 500,
          shape: 'rectangle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${ageStage} normal`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        storySprites.push({
          id: `${character.id}-${ageStage}`,
          characterDbId: character.dbId,
          characterId: character.id,
          artStage: ageStage,
          expression: 'normal',
          imageBlob: image,
          projectId: character.projectId
        })
      }
    }

    return storySprites
  }

  private static async getCharacterOverworldSprites(
    character: Character
  ): Promise<CharacterOverworldSprite[]> {
    const overworldSprites = await DatabaseService.getCharacterOverworldSprites(character.dbId)
    const existingKeys = overworldSprites.map((sprite) => {
      const artStage = sprite.artStage ?? 0
      return `${artStage}`
    })

    for (const idx in overworldSprites) {
      if (!overworldSprites[idx]?.imageBlob) {
        const image = await generateImage({
          width: 280,
          height: 500,
          shape: 'rectangle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${overworldSprites[idx].artStage}`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        overworldSprites[idx].imageBlob = image
      }
    }

    const ageStages = character.ages ? [1, 2, 3] : [0]
    for (const ageStage of ageStages) {
      if (!existingKeys.includes(`${ageStage}`)) {
        const image = await generateImage({
          width: 280,
          height: 500,
          shape: 'rectangle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${ageStage}`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        overworldSprites.push({
          id: `${character.id}-${ageStage}`,
          characterDbId: character.dbId,
          characterId: character.id,
          artStage: ageStage,
          imageBlob: image,
          projectId: character.projectId
        })
      }
    }

    return overworldSprites
  }

  private static async getCharacterPortraits(character: Character): Promise<CharacterPortrait[]> {
    const portraits = await DatabaseService.getCharacterPortraits(character.dbId)
    const existingKeys = portraits.map((portrait) => {
      const artStage = portrait.artStage ?? 0
      return `${artStage}`
    })

    for (const idx in portraits) {
      if (!portraits[idx]?.imageBlob) {
        const image = await generateImage({
          width: 510,
          height: 510,
          shape: 'circle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${portraits[idx].artStage}`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        portraits[idx].imageBlob = image
      }
    }

    const ageStages = character.ages ? [1, 2, 3] : [0]
    for (const ageStage of ageStages) {
      if (!existingKeys.includes(`${ageStage}`)) {
        const image = await generateImage({
          width: 510,
          height: 510,
          shape: 'circle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}\n${ageStage}`,
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })

        portraits.push({
          id: `${character.id}-${ageStage}`,
          characterDbId: character.dbId,
          characterId: character.id,
          artStage: ageStage,
          imageBlob: image,
          projectId: character.projectId
        })
      }
    }

    return portraits
  }

  private static async addCharacterImages(
    spritesFolder: JSZip,
    character: Character
  ): Promise<void> {
    try {
      const storySprites = await ModExporter.getCharacterStorySprites(character)
      for (const sprite of storySprites) {
        const filename = ExoLoaderConverter.generateSpriteFilename(
          character.id,
          'story',
          sprite.artStage,
          sprite.expression
        )
        if (sprite.imageBlob) {
          spritesFolder.file(filename, sprite.imageBlob)
        }
      }

      const overworldSprites = await ModExporter.getCharacterOverworldSprites(character)
      for (const sprite of overworldSprites) {
        const filename = ExoLoaderConverter.generateSpriteFilename(
          character.id,
          'map',
          sprite.artStage
        )
        if (sprite.imageBlob) {
          spritesFolder.file(filename, sprite.imageBlob)
        }
      }

      const portraits = await ModExporter.getCharacterPortraits(character)
      for (const portrait of portraits) {
        const filename = ExoLoaderConverter.generateSpriteFilename(
          character.id,
          'portrait',
          portrait.artStage
        )
        if (portrait.imageBlob) {
          spritesFolder.file(filename, portrait.imageBlob)
        }
      }

      const mainMenuSprite = await DatabaseService.getCharacterMainMenuSprite(character.dbId)
      let imageBlob = mainMenuSprite?.imageBlob

      if (!imageBlob) {
        imageBlob = await generateImage({
          width: 50,
          height: 100,
          shape: 'rectangle',
          fillColor: '#' + character.dialogueColor,
          text: `${character.id}`,
          textColor: 'black',
          fontSize: 2,
          fontFamily: 'bold Arial'
        })
      }

      if (imageBlob) {
        const filename = ExoLoaderConverter.generateSpriteFilename(character.id, 'mainmenu')
        spritesFolder.file(filename, imageBlob)
      }
    } catch (error) {
      console.warn(`Failed to add images for character ${character.id}:`, error)
    }
  }

  private static isCard(entity: Card | Collectible | Achievement): entity is Card {
    return 'type' in entity
  }

  private static isCollectible(entity: Card | Collectible | Achievement): entity is Collectible {
    return 'plural' in entity
  }

  private static isAchievement(entity: Card | Collectible | Achievement): entity is Achievement {
    return 'description' in entity
  }

  private static async generateEntityImage(
    entity: Card | Collectible | Achievement
  ): Promise<Blob> {
    let fillColor = '#000000'
    let text = entity.name
    let strokeColor = '#0F0F0F'
    let fontSize = 160
    let textColor = '#FFFFFF'

    if (this.isCard(entity)) {
      if (entity.type === 'gear') {
        text = '☀'
        fillColor = '#9333ea'
        strokeColor = '#7e22ce'
      } else {
        switch (entity.suit) {
          case 'physical':
            text = '★'
            fillColor = '#dc2626'
            strokeColor = '#b91c1c'
            break
          case 'mental':
            text = '☁'
            fillColor = '#2563eb'
            strokeColor = '#1e40af'
            break
          case 'social':
            text = '★'
            fillColor = '#d97706'
            strokeColor = '#b45309'
            break
          case 'wild':
            text = '❤'
            fillColor = '#db2777'
            strokeColor = '#be1253'
            break
        }
      }
    } else if (this.isCollectible(entity)) {
      text = '★'
      fillColor = '#f59e0b'
      strokeColor = '#d97706'
    } else if (this.isAchievement(entity)) {
      text = '★'
      fillColor = '#2563eb'
      strokeColor = '#1e40af'
    }

    return generateImage({
      width: 510,
      height: 510,
      shape: 'circle',
      fillColor,
      strokeColor,
      text,
      textColor,
      fontSize,
      fontFamily: 'bold Arial'
    })
  }

  private static async addEntityImage(
    folder: JSZip,
    entity: Card | Collectible | Achievement
  ): Promise<void> {
    try {
      const image = await DatabaseService.getEntityImage(entity.dbId)
      let imageBlob = image?.imageBlob

      if (!imageBlob) {
        imageBlob = await this.generateEntityImage(entity)
      }

      if (imageBlob) {
        folder.file(`${entity.id}.png`, imageBlob)
      }
    } catch (error) {
      console.warn(`Failed to add image for ${entity.id}:`, error)
    }
  }

  private static async getBackgroundImages(background: Background): Promise<BackgroundImage[]> {
    const images = await DatabaseService.getBackgroundImages(background.projectId, background.dbId)
    const hasMain = images.some((img) => img.type === 'main')

    if (!hasMain) {
      const image = await generateImage({
        width: 4096,
        height: 2048,
        shape: 'rectangle',
        fillColor: '#ffffff',
        text: background.id
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('\n'),
        textColor: 'black',
        fontSize: 500,
        fontFamily: 'bold Arial'
      })

      images.push({
        id: `${background.id}_main`,
        backgroundDbId: background.dbId,
        type: 'main',
        imageBlob: image,
        projectId: background.projectId
      })
    }

    for (const bg of images) {
      if (bg.imageBlob) continue

      if (bg.type === 'thumbnail') {
        const image = await generateImage({
          width: 409,
          height: 204,
          shape: 'rectangle',
          fillColor: '#ffffff',
          text: background.id
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('\n'),
          textColor: 'black',
          fontSize: 50,
          fontFamily: 'bold Arial'
        })
        bg.imageBlob = image
      } else if (bg.type === 'main') {
        const image = await generateImage({
          width: 4096,
          height: 2048,
          shape: 'rectangle',
          fillColor: '#ffffff',
          text: background.id
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('\n'),
          textColor: 'black',
          fontSize: 500,
          fontFamily: 'bold Arial'
        })
        bg.imageBlob = image
      }
    }

    return images
  }

  private static async addBackgroundImages(
    folder: JSZip,
    projectId: string,
    background: Background
  ): Promise<void> {
    try {
      const images = await ModExporter.getBackgroundImages(background)
      for (const image of images) {
        if (!image.imageBlob) continue
        if (image.type === 'main') {
          folder.file(`${background.id}.png`, image.imageBlob)
        } else if (image.type === 'thumbnail') {
          folder.file(`${background.id}_thumbnail.png`, image.imageBlob)
        }
      }
    } catch (error) {
      console.warn(`Failed to add images for background ${background.id}:`, error)
    }
  }

  private static async getEndingImages(ending: Ending): Promise<EndingImage[]> {
    const images = await DatabaseService.getEndingImages(ending.projectId, ending.dbId)

    if (ending.isSpecial) {
      const hasSpecial = images.some((img) => img.type === 'special')

      if (!hasSpecial) {
        const image = await generateImage({
          width: 4096,
          height: 2048,
          shape: 'rectangle',
          fillColor: '#ffffff',
          text: ending.name,
          textColor: 'black',
          fontSize: 500,
          fontFamily: 'bold Arial'
        })

        images.push({
          id: `ending_special_${ending.id}`,
          endingDbId: ending.dbId,
          endingId: ending.id,
          type: 'special',
          imageBlob: image,
          projectId: ending.projectId
        })
      }
    } else {
      const requiredKeys: ('f' | 'm' | 'nb')[] = ['f', 'm', 'nb']
      const existingKeys = images.map((img) => img.gender).filter(Boolean) as ('f' | 'm' | 'nb')[]
      const missingKeys = requiredKeys.filter((key) => !existingKeys.includes(key)) as (
        | 'f'
        | 'm'
        | 'nb'
      )[]

      for (const idx in images) {
        if (images[idx].imageBlob) continue
        if (!images[idx].gender || !requiredKeys.includes(images[idx].gender)) continue

        const image = await generateImage({
          width: 4096,
          height: 2048,
          shape: 'rectangle',
          fillColor: '#ffffff',
          text: [ending.name, images[idx].gender].join('\n'),
          textColor: 'black',
          fontSize: 500,
          fontFamily: 'bold Arial'
        })

        images[idx].imageBlob = image
      }

      for (const key of missingKeys) {
        const image = await generateImage({
          width: 4096,
          height: 2048,
          shape: 'rectangle',
          fillColor: '#ffffff',
          text: [ending.name, key].join('\n'),
          textColor: 'black',
          fontSize: 500,
          fontFamily: 'bold Arial'
        })

        images.push({
          id: `ending_${ending.id}_${key}`,
          endingDbId: ending.dbId,
          endingId: ending.id,
          type: 'career',
          gender: key as 'f' | 'm' | 'nb',
          imageBlob: image,
          projectId: ending.projectId
        })
      }
    }

    return images
  }

  private static async addEndingImages(
    folder: JSZip,
    projectId: string,
    ending: Ending
  ): Promise<void> {
    try {
      const images = await ModExporter.getEndingImages(ending)
      if (ending.isSpecial) {
        const image = images.find((img) => img.type === 'special')
        if (image?.imageBlob) {
          folder.file(`ending_special_${ending.id}.png`, image.imageBlob)
        }
      } else {
        const genders: Array<'f' | 'm' | 'nb'> = ['f', 'm', 'nb']
        for (const gender of genders) {
          const image = images.find((img) => img.gender === gender)
          if (image?.imageBlob) {
            folder.file(`ending_${ending.id}_${gender}.png`, image.imageBlob)
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to add images for ending ${ending.id}:`, error)
    }
  }

  private static generateReadme(project: FullModProject): string {
    let readme = `# ${project.name}\n\n`
    readme += `${project.description}\n\n`

    readme += `## Installation\n\n`
    readme += `If you already have ExoLoader installed, skip steps 2-3.

1. Open your game folder (Steam: right-click game > Manage > Browse local files)
2. Download the latest version of [ExoLoader](https://github.com/Pandemonium14/ExoLoader/releases)
3. Extract the zip-file to your game directory (\`BepInEx\` folder should be directly inside the \`Exocolonist\` folder)
4. Extract \`${project.folderName}\` folder into \`CustomContent\` folder

Resulting file structure would look like:
\`\`\`
Exocolonist/
├── CustomContent/
│   └── ${project.folderName}/
\`\`\`\n\n`

    readme += `Troubleshooting:\n`
    readme += `- Check the ExoLoader error overlay (may need to enable it in the settings and restart the game)\n`
    readme += `- Check BepInEx\\LogOutput.log for error messages\n`
    readme += `- Check Player.log file in %localappdata%low\\Northway Games\\Exocolonist\n\n`

    readme += `For more information, visit [ExoLoader Wiki](https://github.com/Pandemonium14/ExoLoader/wiki)\n\n`

    readme += `## Credits\n\n`
    readme += `Your credits here (don't forget to credit artists for the art)\n`
    readme += `Game: [I Was a Teenage Exocolonist](https://store.steampowered.com/app/1148760/I_Was_a_Teenage_Exocolonist/) by Northway Games\n`
    readme += `ExoLoader: [Pandemonium14](https://github.com/Pandemonium14)\n`

    return readme
  }
}
