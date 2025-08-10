import { uniq } from 'lodash-es'

import { useMemo, useState } from 'react'

import { gameBackgrounds } from '@/api/backgrounds'
import Alert from '@/components/ui/Alert'
import Autocomplete from '@/components/ui/Autocomplete'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { useBackgrounds } from '@/hooks/useDexie'
import { Character } from '@/lib/exoloader'

interface DataOverrideTabProps {
  formData: Character
  projectId: string
  updateArrayField: (path: string, value: unknown[]) => void
}

const _dataOverrideOptions = [
  {
    id: 'NAME',
    name: 'Name'
  },
  {
    id: 'NICKNAME',
    name: 'Nickname'
  },
  {
    id: 'BASICS',
    name: 'Basic Description'
  },
  {
    id: 'MORE',
    name: 'Extended Description'
  },
  {
    id: 'PRONOUNS',
    name: 'Pronouns'
  },
  {
    id: 'DIALOGUECOLOR',
    name: 'Dialogue Color'
  },
  {
    id: 'ENHANCEMENT',
    name: 'Enhancement/Augment'
  },
  {
    id: 'DEFAULTBG',
    name: 'Default Background'
  }
]

const DataOverrideTab: React.FC<DataOverrideTabProps> = ({
  formData,
  projectId,
  updateArrayField
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const dataOverrideOptions = useMemo(() => {
    const options = [..._dataOverrideOptions]

    if (formData.love) {
      if (formData.fillBar1Left && formData.fillBar1Right) {
        options.push({
          id: 'FILLBAR1',
          name: `Fillbar ${formData.fillBar1Left}/${formData.fillBar1Right}`
        })
      }
      if (formData.fillBar2Left && formData.fillBar2Right) {
        options.push({
          id: 'FILLBAR2',
          name: `Fillbar ${formData.fillBar2Left}/${formData.fillBar2Right}`
        })
      }
      if (formData.fillBar3Left && formData.fillBar3Right) {
        options.push({
          id: 'FILLBAR3',
          name: `Fillbar ${formData.fillBar3Left}/${formData.fillBar3Right}`
        })
      }
    }

    return options
  }, [
    formData.fillBar1Left,
    formData.fillBar1Right,
    formData.fillBar2Left,
    formData.fillBar2Right,
    formData.fillBar3Left,
    formData.fillBar3Right
  ])

  const { backgrounds } = useBackgrounds(projectId)

  const backgroundOptions = useMemo(() => {
    return [
      ...backgrounds.map((bg) => ({
        value: bg.id,
        label: bg.id.charAt(0).toUpperCase() + bg.id.slice(1)
      })),
      ...gameBackgrounds.map((bg) => ({
        value: bg.id,
        label: bg.name.charAt(0).toUpperCase() + bg.name.slice(1)
      }))
    ]
  }, [backgrounds])

  const moveItem = (fromIndex: number, toIndex: number) => {
    const items = [...(formData.dataOverride || [])]
    const [movedItem] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, movedItem)
    updateArrayField('dataOverride', items)
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
          Some of the entries about the character can be optionally changed based on in game date
          and/or memory flags. For example, if character's pronouns change with age, or if some
          other transformation took place in the story. You can also use this feature if character's
          pronouns do not follow the default set the game has. Read more on{' '}
          <a
            href="https://github.com/Pandemonium14/ExoLoader/wiki/Adding-a-character#modifiable-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            the wiki
          </a>
          .
          <br />
          <strong>Note:</strong> The order of modifications matters - the mod will apply the latest
          valid modification. You can drag and drop modifications to reorder them.
        </div>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Autocomplete
            label="Add Data Override"
            options={dataOverrideOptions}
            value={null}
            onChange={(value) => {
              value &&
                updateArrayField('dataOverride', [
                  ...(formData.dataOverride || []),
                  {
                    field: value.id,
                    value: '',
                    startDate: '',
                    requiredMemories: []
                  }
                ])
            }}
            clearOnSelect
            placeholder="Select a field"
          />
        </div>
      </div>

      <div className="mt-4">
        {formData.dataOverride?.map((override, idx) => {
          const field = dataOverrideOptions.find((opt) => opt.id === override.field)

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
                  <div className="text-sm text-gray-600">
                    {field?.name ?? `${override.field} (unsupported)`}
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
                        'dataOverride',
                        (formData.dataOverride || []).filter((_, i) => i !== idx)
                      )
                    }
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Delete this override"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  {override.field === 'DEFAULTBG' ? (
                    <SelectGroup
                      value={override.value}
                      onChange={(e) =>
                        updateArrayField(
                          'dataOverride',
                          (formData.dataOverride || []).map((o, i) =>
                            i === idx ? { ...o, value: e.target.value } : o
                          )
                        )
                      }
                      options={backgroundOptions}
                    />
                  ) : override.field === 'DIALOGUECOLOR' ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={override.value ? `#${override.value}` : '#F3F2E0'}
                        onChange={(e) =>
                          updateArrayField(
                            'dataOverride',
                            (formData.dataOverride || []).map((o, i) =>
                              i === idx ? { ...o, value: e.target.value.slice(1) } : o
                            )
                          )
                        }
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={override.value}
                        onChange={(e) =>
                          updateArrayField(
                            'dataOverride',
                            (formData.dataOverride || []).map((o, i) =>
                              i === idx ? { ...o, value: e.target.value } : o
                            )
                          )
                        }
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                        placeholder="F3F2E0"
                        style={{
                          backgroundColor: '#4e7da1', //'#4b6b91',
                          color: override.value ? '#' + override.value : '#F3F2E0',
                          fontWeight: 'bold'
                        }}
                      />
                    </div>
                  ) : override.field === 'BASICS' || override.field === 'MORE' ? (
                    <textarea
                      value={override.value}
                      onChange={(e) =>
                        updateArrayField(
                          'dataOverride',
                          (formData.dataOverride || []).map((o, i) =>
                            i === idx ? { ...o, value: e.target.value } : o
                          )
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder={
                        override.field === 'BASICS'
                          ? 'A brief description that players see immediately...'
                          : 'A more detailed description that players see after interacting with the character.'
                      }
                    />
                  ) : (
                    <InputGroup
                      value={override.value}
                      onChange={(e) =>
                        updateArrayField(
                          'dataOverride',
                          (formData.dataOverride || []).map((o, i) =>
                            i === idx ? { ...o, value: e.target.value } : o
                          )
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  <InputGroup
                    label="Start Date (optional)"
                    value={override.startDate}
                    onChange={(e) =>
                      updateArrayField(
                        'dataOverride',
                        (formData.dataOverride || []).map((o, i) =>
                          i === idx ? { ...o, startDate: e.target.value } : o
                        )
                      )
                    }
                    placeholder="10-quiet-1"
                    helpText="year-season-month format, e.g. 15-quiet-2 or 10-glow. Leave blank to apply to any. "
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
                    value={(override.requiredMemories ?? [])?.map((mem) => ({
                      id: mem,
                      name: mem
                    }))}
                    onChange={(value) =>
                      updateArrayField(
                        'dataOverride',
                        (formData.dataOverride || []).map((o, i) =>
                          i === idx
                            ? { ...o, requiredMemories: uniq((value ?? []).map((v) => v.id)) }
                            : o
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

export default DataOverrideTab
