import { Info } from 'lucide-react'

import { useCallback, useMemo } from 'react'

import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import InputGroup from '@/components/ui/InputGroup'
import { Background, BackgroundType } from '@/lib/exoloader'

import { backgroundTypes } from './util'

interface BasicTabProps {
  formData: Background
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, updateFormData }) => {
  const handleTypeChange = useCallback(
    (type: BackgroundType) => {
      updateFormData('type', type)
    },
    [updateFormData]
  )

  const selectedType = useMemo(
    () => backgroundTypes.find((type) => type.id === formData.type),
    [formData.type]
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Background ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('id', e.target.value)
            }
            placeholder="my_background"
            helpText="Used in scripts (letters, numbers, underscore only)"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Background Type *</label>
        <div className="space-y-3 flex flex-col gap-2">
          {backgroundTypes.map((type) => (
            <div key={type.id} className="relative">
              <CheckRadioGroup
                type="radio"
                name="backgroundType"
                value={type.id}
                checked={formData.type === type.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTypeChange(e.target.value as BackgroundType)
                }
                label={type.name}
                helpText={
                  (
                    <>
                      <span className="block text-sm text-gray-600 mb-1">{type.description}</span>
                      <span className="text-xs text-gray-500">{type.details}</span>
                    </>
                  ) as any
                }
                className="items-start"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            <Info className="inline mr-1" size={16} />
            Usage Instructions
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            <strong>How to use this background:</strong>
          </p>
          <code className="bg-blue-100 px-2 py-1 rounded text-sm text-blue-900">
            {selectedType?.usage}
          </code>
        </div>
      )}
    </div>
  )
}

export default BasicTab
