import React from 'react'

import Editor from '@/components/ui/Editor'

import { StoryPatch } from '../../../lib/exoloader'
import InputGroup from '../../ui/InputGroup'

interface ReplaceTabProps {
  formData: Partial<StoryPatch>
  updateFormData: (field: string, value: any) => void
}

const ReplaceTab: React.FC<ReplaceTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <InputGroup
            label="Start Key"
            value={(formData as any).startKey || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('startKey', e.target.value)
            }
            placeholder="e.g. ~set left = nomi_sad"
            helpText="Patch will replace starting from this line"
          />
        </div>
        <div className="col-span-1">
          <InputGroup
            label="Start Index"
            type="number"
            value={(formData as any).startIndex ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('startIndex', Number(e.target.value))
            }
            min={0}
            helpText="0 for first time the starting key is in this story, 1 for second, etc."
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <InputGroup
            label="End Key (leave empty for single line)"
            value={(formData as any).endKey || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('endKey', e.target.value)
            }
            placeholder="e.g. >continue"
            helpText="Patch will replace up to this line (including this line, leave empty if you only want to replace one line)"
          />
        </div>
        <div className="col-span-1">
          <InputGroup
            label="End Index"
            type="number"
            value={(formData as any).endIndex ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('endIndex', Number(e.target.value))
            }
            min={0}
            helpText="Same as start index, but for the end key"
          />
        </div>
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

export default ReplaceTab
