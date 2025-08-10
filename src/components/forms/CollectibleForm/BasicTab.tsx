import { useMemo } from 'react'

import { gameCharacters } from '@/api/characters'
import Autocomplete from '@/components/ui/Autocomplete'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { useCharacters } from '@/hooks/useDexie'
import { Collectible, HowGet } from '@/lib/exoloader'

import { howGetOptions } from './utils'

interface BasicTabProps {
  formData: Collectible
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, updateFormData }) => {
  const { characters } = useCharacters(projectId)

  const charactersOptions = useMemo(() => {
    return [
      ...characters.map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name })),
      ...gameCharacters
        .filter((c) => c.Love === 'TRUE')
        .map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name }))
    ]
  }, [characters])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Collectible ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('id', e.target.value)
            }
            placeholder="crystalShard"
            helpText="Used internally (letters, numbers, underscore only)"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Name (Singular)"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('name', e.target.value)
            }
            placeholder="Crystal Shard"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Name (Plural)"
            value={formData.plural}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('plural', e.target.value)
            }
            placeholder="Crystal Shards"
            required
          />
        </div>

        <div>
          <SelectGroup
            label="How to Get"
            value={formData.howGet}
            onChange={(e) => updateFormData('howGet', e.target.value as HowGet)}
            options={howGetOptions}
          />
        </div>
      </div>

      {formData.howGet.startsWith('shop') && (
        <div className="max-w-sm">
          <InputGroup
            label="Kudos Cost"
            type="number"
            min={1}
            value={formData.kudos || 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('kudos', parseInt(e.target.value))
            }
            required
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Character Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Autocomplete
                label="Characters Who Like This (ids)"
                multiselect
                options={charactersOptions}
                value={
                  formData.like?.map((id) => {
                    const opt = charactersOptions.find((c) => c.id === id)

                    if (!opt) {
                      return {
                        id,
                        name: id
                      }
                    }

                    return opt
                  }) ?? []
                }
                onChange={(value) => updateFormData('like', value ? value.map((v) => v.id) : [])}
                clearable
                freeSolo
              />
            </div>

            <div>
              <Autocomplete
                label="Characters Who Dislike This (ids)"
                multiselect
                options={charactersOptions}
                value={
                  formData.dislike?.map((id) => {
                    const opt = charactersOptions.find((c) => c.id === id)

                    if (!opt) {
                      return {
                        id,
                        name: id
                      }
                    }

                    return opt
                  }) ?? []
                }
                onChange={(value) => updateFormData('dislike', value ? value.map((v) => v.id) : [])}
                clearable
                freeSolo
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicTab
