import { gameCharacters } from '@/api/characters'
import { DatabaseService } from '@/lib/database'
import { CardSuit, Character, Gender, SkillId, validateHexColor, validateId } from '@/lib/exoloader'

const baseGameCharacterIds = new Set(gameCharacters.map((c) => c.id))

export const validateForm = async (formData: Character): Promise<string[]> => {
  const newErrors: string[] = []
  newErrors.push(...validateId(formData.id))
  if (!formData.name) newErrors.push('Name is required')
  if (!formData.nickname) newErrors.push('Nickname is required')
  if (!formData.basics) newErrors.push('Basic description is required')
  if (formData.dialogueColor && !validateHexColor(formData.dialogueColor))
    newErrors.push('Dialogue color must be a valid hex color')

  if (baseGameCharacterIds.has(formData.id))
    newErrors.push('Character ID already exists in base game')

  const existingCharacter = await DatabaseService.getCharacter(formData.projectId, formData.id)
  if (existingCharacter && existingCharacter.dbId !== formData?.dbId)
    newErrors.push('Character ID already exists in project')

  return newErrors
}

export const defaultFormData = (projectId: string): Character => {
  return {
    id: '',
    name: '',
    nickname: '',
    gender: Gender.NonBinary,
    love: true,
    age10: 10,
    birthday: '',
    dialogueColor: 'F3F2E0',
    defaultBg: 'colony',
    basics: '',
    more: '',
    enhancement: '',
    fillBar1Left: '',
    fillBar1Right: '',
    fillBar1Child: 5,
    fillBar1Teen: 5,
    fillBar1Adult: 5,
    fillBar2Left: '',
    fillBar2Right: '',
    fillBar2Child: 5,
    fillBar2Teen: 5,
    fillBar2Adult: 5,
    fillBar3Left: '',
    fillBar3Right: '',
    fillBar3Child: 5,
    fillBar3Teen: 5,
    fillBar3Adult: 5,
    onMap: true,
    defaultOnMap: true,
    ages: true,
    helioOnly: false,
    likes: [],
    dislikes: [],
    jobs: [],
    customAging: [],
    spriteSize: 18,
    spriteSizesByAge: [18, 18, 18],
    overworldScaleByAge: [4.0, 4.0, 4.0],
    projectId,
    dbId: crypto.randomUUID(),
    skeleton: ['tang', 'dys', 'anemone', 'sym'],
    preHelioMapSpots: {
      quiet: [0, 0, 0],
      pollen: [0, 0, 0],
      dust: [0, 0, 0],
      wet: [0, 0, 0],
      glow: [0, 0, 0]
    },
    destroyedMapSpot: [0, 0, 0],
    postHelioMapSpots: {
      quiet: [0, 0, 0],
      pollen: [0, 0, 0],
      dust: [0, 0, 0],
      wet: [0, 0, 0],
      glow: [0, 0, 0]
    }
  }
}
