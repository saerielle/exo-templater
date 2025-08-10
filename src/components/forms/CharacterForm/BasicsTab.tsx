import { useMemo } from 'react'

import { gameBackgrounds } from '@/api/backgrounds'
import { months } from '@/api/months'
import Autocomplete from '@/components/ui/Autocomplete'
import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { useBackgrounds } from '@/hooks/useDexie'
import { Character, Gender } from '@/lib/exoloader'

interface BasicsTabProps {
  formData: Character
  projectId: string
  updateStringField: (path: string, value: string) => void
  updateNumberField: (path: string, value: number) => void
  updateBooleanField: (path: string, value: boolean) => void
}

const BasicsTab: React.FC<BasicsTabProps> = ({
  formData,
  projectId,
  updateStringField,
  updateNumberField,
  updateBooleanField
}) => {
  const { backgrounds } = useBackgrounds(projectId)

  const backgroundOptions = useMemo(() => {
    return [
      ...backgrounds.map((bg) => ({
        id: bg.id,
        name: bg.id.charAt(0).toUpperCase() + bg.id.slice(1)
      })),
      ...gameBackgrounds.map((bg) => ({
        id: bg.id,
        name: bg.name.charAt(0).toUpperCase() + bg.name.slice(1)
      }))
    ]
  }, [backgrounds])

  const currentBackground = useMemo(() => {
    const opt = backgroundOptions.find((opt) => opt.id === formData.defaultBg)
    if (!opt && formData.defaultBg) {
      return {
        id: formData.defaultBg,
        name: formData.defaultBg.charAt(0).toUpperCase() + formData.defaultBg.slice(1)
      }
    }
    return opt ?? null
  }, [backgroundOptions, formData.defaultBg])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Character ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateStringField('id', e.target.value)
            }
            placeholder="template"
            helpText="Used internally and in stories (lowercase letters only)"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Full Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateStringField('name', e.target.value)
            }
            placeholder="Template Character"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Nickname"
            value={formData.nickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateStringField('nickname', e.target.value)
            }
            placeholder="Template"
            required
          />
        </div>

        <div>
          <SelectGroup
            label="Gender"
            value={formData.gender}
            onChange={(e) => updateStringField('gender', e.target.value as Gender)}
            options={Object.entries(Gender).map(([key, value]) => ({
              value,
              label: key === 'Male' ? 'Male ♂' : key === 'Female' ? 'Female ♀' : 'Non-Binary ⚧'
            }))}
          />
        </div>

        <div>
          <InputGroup
            label="Age at the Start of the Game (Strato's Landing)"
            type="number"
            min={-100}
            max={100}
            value={formData.age10}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateNumberField('age10', parseInt(e.target.value))
            }
            helpText='Use a big negative value like "-100" if your character is like Sym and should display "?" in the age field'
          />
        </div>

        <div>
          <SelectGroup
            label="Birthday"
            value={formData.birthday}
            onChange={(e) => updateStringField('birthday', e.target.value)}
            options={[
              { value: '', label: 'None' },
              ...months.map((month) => ({ value: month.id, label: month.name }))
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dialogue Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.dialogueColor ? `#${formData.dialogueColor}` : '#F3F2E0'}
              onChange={(e) => updateStringField('dialogueColor', e.target.value.slice(1))}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.dialogueColor}
              onChange={(e) => updateStringField('dialogueColor', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="F3F2E0"
              style={{
                backgroundColor: '#4e7da1', //'#4b6b91',
                color: formData.dialogueColor ? '#' + formData.dialogueColor : '#F3F2E0',
                fontWeight: 'bold'
              }}
            />
          </div>
        </div>

        <div>
          <Autocomplete
            label="Default Background"
            options={backgroundOptions}
            value={currentBackground}
            freeSolo
            onChange={(value) => updateStringField('defaultBg', value?.id ?? '')}
            clearable
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Description *</label>
        <textarea
          value={formData.basics}
          onChange={(e) => updateStringField('basics', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="A brief description that players see immediately..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Extended Description</label>
        <textarea
          value={formData.more}
          onChange={(e) => updateStringField('more', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Additional details unlocked through friendship..."
        />
      </div>

      <div>
        <InputGroup
          label="Enhancement/Augment"
          value={formData.enhancement}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateStringField('enhancement', e.target.value)
          }
          placeholder=""
        />
      </div>

      <div className="space-y-3 mt-2">
        <CheckRadioGroup
          type="checkbox"
          id="romanceable"
          label="Friend"
          checked={formData.love}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateBooleanField('love', e.target.checked)
          }
          helpText="Player can gain reputation and romance this character"
        />
        <CheckRadioGroup
          type="checkbox"
          id="onMap"
          label="Appears on Map"
          checked={formData.onMap}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateBooleanField('onMap', e.target.checked)
          }
          helpText="Has an interactable sprite on the colony map (requires map positioning)"
        />
        <CheckRadioGroup
          type="checkbox"
          id="ages"
          label="Ages Over Time"
          checked={formData.ages}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateBooleanField('ages', e.target.checked)
          }
          helpText="Character changes appearance as they grow up (sprites have 3 age stages)"
        />
        <CheckRadioGroup
          type="checkbox"
          id="helioOnly"
          label="Helio Only"
          checked={formData.helioOnly}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateBooleanField('helioOnly', e.target.checked)
          }
          helpText="Only appears after the Helio event (year 15+)"
        />
      </div>
    </div>
  )
}

export default BasicsTab
