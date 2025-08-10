import { useMemo } from 'react'

import { gameCharacters } from '@/api/characters'
import { gameCheevos } from '@/api/cheevos'
import Autocomplete, { AutocompleteOption } from '@/components/ui/Autocomplete'
import { useAchievements, useCharacters } from '@/hooks/useDexie'
import { Achievement } from '@/lib/exoloader'

interface RequirementsTabProps {
  formData: Achievement
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const RequirementsTab: React.FC<RequirementsTabProps> = ({
  formData,
  projectId,
  updateFormData
}) => {
  const { characters } = useCharacters(projectId)
  const { achievements } = useAchievements(projectId)

  const charactersOptions = useMemo(() => {
    return [
      ...characters.map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name })),
      ...gameCharacters
        .filter((c) => c.Love === 'TRUE')
        .map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name }))
    ]
  }, [characters])

  const achievementOptions = useMemo(() => {
    return [
      ...achievements.filter((a) => a.id !== formData.id).map((a) => ({ id: a.id, name: a.name })),
      ...gameCheevos.map((c) => ({ id: c.id, name: c.name }))
    ]
  }, [achievements])

  const isEnding = formData.id?.startsWith('ending_')
  const isCharacter = formData.id?.startsWith('chara_')

  if (isEnding || isCharacter) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Auto-Awarded Achievement:</strong>{' '}
            {isEnding
              ? 'This ending achievement will be automatically awarded when player gets the ending.'
              : isCharacter
                ? 'This character achievement will be automatically awarded when the player gets level 3 card for the character (should be given to player in 100 friendship event).'
                : ''}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Achievement Requirements:</strong> Optionally, specify if this achievement is
          granted automatically for maxing friendship with one or more characters (Love All) or for
          unlocking other achievements (Required Cheevos).
          <br />
          Other types of achievements you can grant by the story call{' '}
          <code>~call cheevo({formData.id ?? 'cheevoID'})</code>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Autocomplete
            label="Love All (Character IDs)"
            multiselect
            freeSolo
            options={charactersOptions}
            value={
              (formData.loveAll
                ?.map((id) => {
                  const opt = charactersOptions.find((c) => c.id === id)
                  if (!opt) {
                    return {
                      id,
                      name: id
                    }
                  }
                  return opt
                })
                .filter(Boolean) as AutocompleteOption[]) ?? []
            }
            onChange={(value) => updateFormData('loveAll', value ? value.map((v) => v.id) : [])}
            clearable
          />
        </div>
        <div>
          <Autocomplete
            label="Required Cheevos (Achievement IDs)"
            multiselect
            freeSolo
            options={achievementOptions}
            value={
              (formData.requiredCheevos
                ?.map((id) => {
                  const opt = achievementOptions.find((c) => c.id === id)
                  if (!opt) {
                    return {
                      id,
                      name: id
                    }
                  }
                  return opt
                })
                .filter(Boolean) as AutocompleteOption[]) ?? []
            }
            onChange={(value) =>
              updateFormData('requiredCheevos', value ? value.map((v) => v.id) : [])
            }
            clearable
          />
        </div>
      </div>
    </div>
  )
}

export default RequirementsTab
