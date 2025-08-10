import { Upload } from 'lucide-react'

import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { CardSuit, Character, Gender, SkillId } from '@/lib/exoloader'

interface JsonImportProps {
  setFormData: (data: Character) => void
  projectId: string
}

const convertJsonToCharacter = (jsonData: any, projectId: string): Character => {
  const data = jsonData.Data || {}

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

  const character: Character = {
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
    onMap: convertToBoolean(jsonData.OnMap),
    ages: convertToBoolean(jsonData.Ages),
    helioOnly: convertToBoolean(jsonData.HelioOnly),
    likes: convertToArray(jsonData.Likes),
    dislikes: convertToArray(jsonData.Dislikes),
    jobs: convertToArray(jsonData.Jobs),
    projectId,
    dbId: crypto.randomUUID(),
    skeleton: Array.isArray(jsonData.Skeleton) ? jsonData.Skeleton : [jsonData.Skeleton || 'tang'],
    preHelioMapSpots: convertToMapSpots(jsonData.PreHelioMapSpots),
    postHelioMapSpots: convertToMapSpots(jsonData.PostHelioMapSpots),
    destroyedMapSpot: convertToMapSpot(jsonData.DestroyedMapSpot),
    nearbyStratoMapSpots: convertToMapSpots(jsonData.NearbyStratoMapSpots),
    nearbyHelioMapSpots: convertToMapSpots(jsonData.NearbyHelioMapSpots),
    plainsMapSpots: convertToMapSpots(jsonData.PlainsMapSpots),
    valleyMapSpots: convertToMapSpots(jsonData.ValleyMapSpots),
    ridgeMapSpots: convertToMapSpots(jsonData.RidgeMapSpots),
    defaultOnMap: jsonData.DefaultOnMap ? convertToBoolean(jsonData.DefaultOnMap) : true,
    dataOverride: convertDataOverride(jsonData.DataOverride),
    customAging: convertCustomAging(jsonData.CustomAging),
    spriteSizesByAge: Array.isArray(jsonData.SpriteSizesByAge)
      ? jsonData.SpriteSizesByAge.map(convertToNumber)
      : jsonData.SpriteSize
        ? [
            convertToNumber(jsonData.SpriteSize),
            convertToNumber(jsonData.SpriteSize),
            convertToNumber(jsonData.SpriteSize)
          ]
        : undefined,
    overworldScaleByAge: Array.isArray(jsonData.OverworldScaleByAge)
      ? jsonData.OverworldScaleByAge.map(convertToNumber)
      : undefined,
    mainMenu: jsonData.MainMenu
      ? {
          template: jsonData.MainMenu.Template || '',
          position:
            Array.isArray(jsonData.MainMenu.Position) && jsonData.MainMenu.Position.length >= 2
              ? [
                  convertToNumber(jsonData.MainMenu.Position[0]),
                  convertToNumber(jsonData.MainMenu.Position[1])
                ]
              : [0, 0]
        }
      : undefined,
    templateCards: false,
    templateCardName: '',
    templateCardSuit: CardSuit.None,
    templateAchievement: false,
    templateStories: false,
    templateStorySkill: SkillId.Empathy
  }

  return character
}

const JsonImport: React.FC<JsonImportProps> = ({ setFormData, projectId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        const importedCharacter = convertJsonToCharacter(jsonData, projectId)
        setFormData(importedCharacter)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        alert('Invalid JSON file. Please check the format.')
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="modal-action-btn flex items-center"
        variant="outline"
      >
        <Upload size={16} className="mr-2" />
        Import JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleJsonImport}
        className="hidden"
      />
    </div>
  )
}

export default JsonImport
