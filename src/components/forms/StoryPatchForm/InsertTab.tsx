import React from 'react'

import Editor from '@/components/ui/Editor'

import { StoryPatch } from '../../../lib/exoloader'
import InputGroup from '../../ui/InputGroup'

interface InsertTabProps {
  formData: Partial<StoryPatch>
  updateFormData: (field: string, value: any) => void
}

const InsertTab: React.FC<InsertTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <InputGroup
          label="Location Key"
          value={(formData as any).locationKey || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('locationKey', e.target.value)
          }
          placeholder="e.g. >continue"
          helpText="Patch will be inserted before this line"
        />
      </div>
      <div>
        <InputGroup
          label="Location Index"
          type="number"
          value={(formData as any).locationIndex ?? 0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('locationIndex', Number(e.target.value))
          }
          min={0}
          helpText="0 for first time the location key is in this story, 1 for second, etc."
        />
      </div>
      <div>
        <Editor
          value={formData.body}
          onChange={(val) => updateFormData('body', val)}
          height={500}
          expandable={true}
        />
      </div>
    </div>
  )
}

export default InsertTab
