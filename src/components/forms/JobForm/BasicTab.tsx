import { useMemo } from 'react'

import { gameCharacters } from '@/api/characters'
import Autocomplete, { AutocompleteOption } from '@/components/ui/Autocomplete'
import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { useCharacters } from '@/hooks/useDexie'
import { Job, LocationId } from '@/lib/exoloader'

import { locationOptions } from './util'

interface BasicTabProps {
  formData: Job
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, updateFormData }) => {
  const { characters } = useCharacters(projectId)

  const charactersOptions = useMemo(() => {
    return [
      ...characters.map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name })),
      ...gameCharacters
        .filter((c) => c.Love === 'TRUE' && c.id !== 'sym')
        .map((c) => ({ id: c.id, name: c.nickname.length > 0 ? c.nickname : c.name }))
    ]
  }, [characters])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Job ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('id', e.target.value)
            }
            placeholder="researchAssistant"
            helpText="Used internally (letters only)"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Job Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('name', e.target.value)
            }
            placeholder="Research Assistant"
            required
          />
        </div>

        <div className="md:col-span-2">
          <SelectGroup
            label="Location"
            value={formData.location}
            onChange={(e) => updateFormData('location', e.target.value as LocationId)}
            options={locationOptions}
            required
          />
        </div>
      </div>

      <div>
        <InputGroup
          label="Battle Header Text"
          value={formData.battleHeaderText || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('battleHeaderText', e.target.value)
          }
          placeholder="You work on research tasks..."
        />
      </div>

      <div className="flex items-center mt-4">
        <CheckRadioGroup
          type="checkbox"
          id="isRelax"
          label="This is a relaxing activity"
          checked={formData.isRelax || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('isRelax', e.target.checked)
          }
          helpText="Relaxing activities clear all of the stress"
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Characters Involved</h4>
        <p className="text-sm text-gray-600 mb-2">
          Characters who work this job will gain +1 reputation with the player
        </p>

        <div className="flex gap-2 mb-2">
          <Autocomplete
            multiselect
            options={charactersOptions}
            freeSolo
            value={
              (formData.characters
                ?.map((id) => {
                  const opt = charactersOptions.find((c) => c.id === id)

                  if (!opt) {
                    return { id, name: id }
                  }

                  return opt
                })
                .filter(Boolean) as AutocompleteOption[]) ?? []
            }
            onChange={(value) => updateFormData('characters', value ? value.map((v) => v.id) : [])}
            clearable
          />
        </div>
      </div>
    </div>
  )
}

export default BasicTab
