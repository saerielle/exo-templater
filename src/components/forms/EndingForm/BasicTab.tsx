import { Dispatch, SetStateAction } from 'react'

import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { Ending, LocationId } from '@/lib/exoloader'

import { locationOptions } from './util'

interface BasicTabProps {
  formData: Ending
  projectId: string
  setFormData: Dispatch<SetStateAction<Ending>>
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ending Type</label>
        <div className="flex gap-4">
          <div
            className={`flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${formData.isSpecial ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
          >
            <CheckRadioGroup
              type="radio"
              name="endingType"
              value="special"
              checked={formData.isSpecial}
              onChange={() => setFormData({ ...formData, isSpecial: true })}
              label="Special Ending"
              helpText="Used for unique or story-based endings. Requires one background image."
            />
          </div>
          <div
            className={`flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${!formData.isSpecial ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
          >
            <CheckRadioGroup
              type="radio"
              name="endingType"
              value="career"
              checked={!formData.isSpecial}
              onChange={() => setFormData({ ...formData, isSpecial: false })}
              label="Career Ending"
              helpText="Used for job/career endings. Requires three gendered images (female, male, non-binary)."
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Ending ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, id: e.target.value })
            }
            placeholder="masterEngineer"
            helpText="Used internally (letters, numbers, underscore only)"
            required
          />
        </div>
        <div>
          <InputGroup
            label="Ending Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value
              setFormData({
                ...formData,
                name: val
              })
            }}
            placeholder="Master Engineer"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preamble *</label>
        <textarea
          value={formData.preamble}
          onChange={(e) => setFormData({ ...formData, preamble: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="You reached your 20th birthday..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SelectGroup
            label="Location (optional)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value as LocationId })}
            options={locationOptions}
            helpText={'Bonus points if player has "Second in command" in this location'}
          />
        </div>
        <div>
          <InputGroup
            label="Character (optional)"
            value={formData.character || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, character: e.target.value })
            }
            placeholder="character_id"
            helpText={
              'Optionally skip regular ending for a character with !charaID (!vace is used for astronaut) .'
            }
          />
        </div>
      </div>
    </div>
  )
}

export default BasicTab
