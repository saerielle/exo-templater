import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import InputGroup from '@/components/ui/InputGroup'
import { Achievement } from '@/lib/exoloader'

interface BasicTabProps {
  formData: Achievement
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Achievement ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('id', e.target.value)
            }
            placeholder="my_achievement"
            helpText="Used internally (letters, numbers, underscore only)"
            required
          />
        </div>
        <div>
          <InputGroup
            label="Achievement Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('name', e.target.value)
            }
            placeholder="Master Explorer"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe the achievement..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Shown when clicking on unlocked achievement in the Gallery
        </p>
      </div>
      <div className="flex items-center">
        <CheckRadioGroup
          type="checkbox"
          id="hidden"
          label="Hidden Achievement"
          checked={formData.hidden || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('hidden', e.target.checked)
          }
          helpText="Hidden achievements don't show their name or description until unlocked"
        />
      </div>
    </div>
  )
}

export default BasicTab
