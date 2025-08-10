import { uniq } from 'lodash-es'

import React, { useState } from 'react'

import Alert from '@/components/ui/Alert'
import Autocomplete from '@/components/ui/Autocomplete'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { Character } from '@/lib/exoloader'

interface CustomAgingTabProps {
  formData: Character
  projectId: string
  updateArrayField: (path: string, value: unknown[]) => void
}

const stageOptions = [
  { value: '1', label: 'Child (Stage 1)' },
  { value: '2', label: 'Teen (Stage 2)' },
  { value: '3', label: 'Adult (Stage 3)' },
  { value: '4', label: 'Custom Stage 4' },
  { value: '5', label: 'Custom Stage 5' },
  { value: '6', label: 'Custom Stage 6' },
  { value: '7', label: 'Custom Stage 7' },
  { value: '8', label: 'Custom Stage 8' },
  { value: '9', label: 'Custom Stage 9' }
]

const CustomAgingTab: React.FC<CustomAgingTabProps> = ({
  formData,
  projectId,
  updateArrayField
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addCustomAging = () => {
    updateArrayField('customAging', [
      ...(formData.customAging || []),
      {
        stage: '',
        startDate: '',
        requiredMemories: []
      }
    ])
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const items = [...(formData.customAging || [])]
    const [movedItem] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, movedItem)
    updateArrayField('customAging', items)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveItem(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div>
      <Alert type="info" className="border-b">
        <div className="text-sm">
          Custom aging allows you to change which art stage is used for a character based on in-game
          date and/or memory flags. This is useful for characters that have special transformations
          or aging events that don't follow the standard 1-2-3 progression. For example, a character
          that ages earlier or later than the main cast, or changes their appearance based on
          certain events.
          <br />
          <strong>Note:</strong> The order of rules matters - the mod will apply the latest valid
          rule. You can drag and drop rules to reorder them.
        </div>
      </Alert>

      <div className="mt-4">
        <button
          type="button"
          onClick={addCustomAging}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Custom Aging Rule
        </button>
      </div>

      <div className="mt-4">
        {formData.customAging?.map((aging, idx) => {
          return (
            <div
              key={idx}
              className={`mb-4 p-4 border rounded-lg relative transition-all duration-200 ${
                draggedIndex === idx
                  ? 'border-blue-400 bg-blue-50 opacity-50'
                  : 'border-gray-200 bg-white'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-move"
                    title="Drag to reorder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateArrayField(
                        'customAging',
                        (formData.customAging || []).filter((_, i) => i !== idx)
                      )
                    }
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Delete this custom aging rule"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Art Stage</label>
                  <SelectGroup
                    value={aging.stage}
                    onChange={(e) =>
                      updateArrayField(
                        'customAging',
                        (formData.customAging || []).map((a, i) =>
                          i === idx ? { ...a, stage: e.target.value } : a
                        )
                      )
                    }
                    options={stageOptions}
                  />
                </div>

                <div>
                  <InputGroup
                    label="Start Date (optional)"
                    value={aging.startDate}
                    onChange={(e) =>
                      updateArrayField(
                        'customAging',
                        (formData.customAging || []).map((a, i) =>
                          i === idx ? { ...a, startDate: e.target.value } : a
                        )
                      )
                    }
                    placeholder="10-quiet-1"
                    helpText="year-season-month format, e.g. 15-quiet-2 or 10-glow. Leave blank to apply to any."
                  />
                </div>

                <div>
                  <Autocomplete
                    label="Required Memory Flags"
                    multiselect
                    freeSolo
                    clearable
                    placeholder="!template_gardener"
                    options={[]}
                    value={(aging.requiredMemories ?? [])?.map((mem) => ({
                      id: mem,
                      name: mem
                    }))}
                    onChange={(value) =>
                      updateArrayField(
                        'customAging',
                        (formData.customAging || []).map((a, i) =>
                          i === idx
                            ? { ...a, requiredMemories: uniq((value ?? []).map((v) => v.id)) }
                            : a
                        )
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Without mem_ prefix, e.g. template_gardener or !flirt_dys
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomAgingTab
