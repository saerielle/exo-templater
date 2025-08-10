import React from 'react'

import { StoryPatch, StoryPatchType } from '../../../lib/exoloader'
import CheckRadioGroup from '../../ui/CheckRadioGroup'
import InputGroup from '../../ui/InputGroup'

interface BasicTabProps {
  formData: Partial<StoryPatch>
  updateFormData: (field: string, value: any) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Patch Type *</label>
        <div className="space-y-3 flex flex-col gap-2">
          <div className="relative">
            <CheckRadioGroup
              type="radio"
              name="patchType"
              value={StoryPatchType.Insert}
              checked={formData.type === StoryPatchType.Insert}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('type', e.target.value as StoryPatchType)
              }
              label="Insert"
              helpText="Add new content at a specific location in the story"
              className="items-start"
            />
          </div>
          <div className="relative">
            <CheckRadioGroup
              type="radio"
              name="patchType"
              value={StoryPatchType.Replace}
              checked={formData.type === StoryPatchType.Replace}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('type', e.target.value as StoryPatchType)
              }
              label="Replace"
              helpText="Replace existing content between two specified points"
              className="items-start"
            />
          </div>
        </div>
      </div>

      <div>
        <InputGroup
          label="Story ID (base game story ID, e.g. nomiIntro)"
          value={formData.storyId || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('storyId', e.target.value)
          }
          placeholder="e.g. nomiIntro"
        />
      </div>

      <div>
        <InputGroup
          label="File (optional)"
          value={formData.file || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('file', e.target.value)
          }
          placeholder="e.g. nomi_stories"
          helpText="Optional: specify which file this will be exported to in the project"
        />
      </div>

      <div>
        <InputGroup
          label="Category (optional)"
          value={formData.category || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('category', e.target.value)
          }
          placeholder="e.g. Character Interactions"
          helpText="Optional: group patches by category for better organization"
        />
      </div>

      <div>
        <InputGroup
          label="Description (optional)"
          value={formData.description || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData('description', e.target.value)
          }
          placeholder="Short description of this patch"
          helpText="Will be displayed as a comment in the patch file"
        />
      </div>
    </div>
  )
}

export default BasicTab
