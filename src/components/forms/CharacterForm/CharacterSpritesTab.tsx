import { orderBy } from 'lodash-es'

import React, { useCallback, useState } from 'react'

import { Character } from '../../../lib/exoloader'
import Autocomplete, { AutocompleteOption } from '../../ui/Autocomplete'
import ImageUpload from '../../ui/ImageUpload'
import InputGroup from '../../ui/InputGroup'

interface SpritesTabProps {
  formData: Character
  storySprites: Record<string, Blob | undefined>
  setStorySprites: React.Dispatch<React.SetStateAction<Record<string, Blob | undefined>>>
  portraits: Record<string, Blob | undefined>
  setPortraits: React.Dispatch<React.SetStateAction<Record<string, Blob | undefined>>>
  overworldSprites: Record<string, Blob | undefined>
  setOverworldSprites: React.Dispatch<React.SetStateAction<Record<string, Blob | undefined>>>
  mainMenuSprite: Blob | undefined
  setMainMenuSprite: React.Dispatch<React.SetStateAction<Blob | undefined>>
  customAgeStages: number[]
  setCustomAgeStages: React.Dispatch<React.SetStateAction<number[]>>
}

const expressionPresets = orderBy(
  [
    {
      id: 'happy',
      name: 'Happy'
    },
    {
      id: 'sad',
      name: 'Sad'
    },
    {
      id: 'angry',
      name: 'Angry'
    }
  ],
  'name'
)

const SpritesTab: React.FC<SpritesTabProps> = ({
  formData,
  storySprites,
  setStorySprites,
  portraits,
  setPortraits,
  overworldSprites,
  setOverworldSprites,
  mainMenuSprite,
  setMainMenuSprite,
  customAgeStages,
  setCustomAgeStages
}) => {
  const [stageToDelete, setStageToDelete] = useState<number | null>(null)

  const getStagesToDisplay = () => {
    if (!formData.ages) {
      return [0]
    }

    if (formData.helioOnly) {
      const baseStages = [2, 3]
      return [...baseStages, ...customAgeStages]
    }

    const baseStages = [1, 2, 3]
    return [...baseStages, ...customAgeStages]
  }

  const getStageLabel = (stage: number) => {
    if (!formData.ages) {
      return 'Static'
    }

    if (stage === 1) return 'Child / game years 1-3'
    if (stage === 2) return 'Teen / game years 4-6'
    if (stage === 3) return 'Adult / game years 7+'

    return `Stage ${stage}`
  }

  const addCustomStage = () => {
    const stages = getStagesToDisplay()
    const maxStage = Math.max(...stages, 0)
    if (maxStage < 9) {
      const newStage = maxStage + 1
      setCustomAgeStages([...customAgeStages, newStage])

      setPortraits((prev) => ({
        ...prev,
        [newStage]: undefined
      }))

      setOverworldSprites((prev) => ({
        ...prev,
        [newStage]: undefined
      }))

      setStorySprites((prev) => ({
        ...prev,
        [`${newStage}_normal`]: undefined
      }))
    }
  }

  const removeCustomStage = (stage: number) => {
    setCustomAgeStages(customAgeStages.filter((s) => s !== stage))

    setPortraits((prev) => {
      const copy = { ...prev }
      delete copy[stage]
      return copy
    })

    setOverworldSprites((prev) => {
      const copy = { ...prev }
      delete copy[stage]
      return copy
    })

    setStorySprites((prev) => {
      const copy = { ...prev }
      Object.keys(copy).forEach((key) => {
        if (key.startsWith(`${stage}_`)) {
          delete copy[key]
        }
      })
      return copy
    })

    setStageToDelete(null)
  }

  const getExpressionsForStage = (stage: number | string) => {
    const prefix = `${stage}_`
    const keys = Object.keys(storySprites)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.replace(prefix, ''))
    const unique = Array.from(new Set(['normal', ...keys.filter((e) => e !== 'normal')]))
    return unique
  }

  const handleAddExpression = useCallback(
    (expression: string, stage: number | string) => {
      if (expression === 'normal') return
      if (getExpressionsForStage(stage).includes(expression)) return
      setStorySprites((prev) => ({
        ...prev,
        [`${stage}_${expression}`]: prev[`${stage}_${expression}`] || undefined
      }))
    },
    [storySprites, setStorySprites]
  )

  const handleRemoveExpression = (stage: number | string, expr: string) => {
    setStorySprites((prev) => {
      const copy = { ...prev }
      delete copy[`${stage}_${expr}`]
      return copy
    })
  }

  const handleRemovePortrait = (stage: number | string) => {
    setPortraits((prev) => {
      const copy = { ...prev }
      delete copy[stage]
      return copy
    })
  }

  const handleRemoveOverworldSprite = (stage: number | string) => {
    setOverworldSprites((prev) => {
      const copy = { ...prev }
      delete copy[stage]
      return copy
    })
  }

  const handleRemoveMainMenuSprite = () => {
    setMainMenuSprite(undefined)
  }

  const stagesToDisplay = getStagesToDisplay()
  const canAddMoreStages = formData.ages && stagesToDisplay.length < 9

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Sprite Management:</strong> Upload and manage all image assets for your character.
          Different art stages may be needed based on whether your character ages over time.
          {formData.ages && (
            <span className="block mt-1">
              You can add custom age stages (up to stage 9) by clicking the "Add Stage" button
              below.
            </span>
          )}
        </p>
      </div>

      {formData.ages && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Age Stages</h4>
            {canAddMoreStages && (
              <button
                type="button"
                onClick={addCustomStage}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Add Stage
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {stagesToDisplay.map((stage) => {
              const isCustomStage = stage > 3
              const canDelete = isCustomStage && stage === Math.max(...customAgeStages)
              return (
                <div
                  key={stage}
                  className={`flex items-center justify-between p-2 rounded border ${
                    isCustomStage ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">{getStageLabel(stage)}</span>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => setStageToDelete(stage)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                      title="Delete latest custom stage"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {stageToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Custom Stage</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{getStageLabel(stageToDelete)}"? This will also
              remove all associated sprites and portraits for this stage.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStageToDelete(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeCustomStage(stageToDelete)}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Portraits</h4>
          <p className="text-sm text-gray-600 mb-9">Shown in character info panels</p>
          {stagesToDisplay.map((stage) => {
            const stageLabel = getStageLabel(stage)
            return (
              <div key={stage} className="border rounded-lg p-4 relative">
                <ImageUpload
                  label={stageLabel}
                  value={portraits[stage]}
                  onChange={(blob) => setPortraits((prev) => ({ ...prev, [stage]: blob }))}
                  compact={true}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  onClick={() => handleRemovePortrait(stage)}
                  title="Remove portrait"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
        <div>
          {formData.onMap && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-4">Map Sprites</h4>
              <p className="text-sm text-gray-600 mb-4">
                Static images used on the colony map (ExoLoader supports animated map sprites, but
                it's not yet supported in here)
              </p>
              {stagesToDisplay.map((stage) => {
                const stageLabel = getStageLabel(stage)
                return (
                  <div key={stage} className="border rounded-lg p-4 relative">
                    <ImageUpload
                      label={stageLabel}
                      value={overworldSprites[stage]}
                      onChange={(blob) =>
                        setOverworldSprites((prev) => ({
                          ...prev,
                          [stage]: blob
                        }))
                      }
                      compact={true}
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      onClick={() => handleRemoveOverworldSprite(stage)}
                      title="Remove map sprite"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Story Sprites</h4>
          <p className="text-sm text-gray-600">Used during story scenes and dialogue</p>
          {stagesToDisplay.map((stage) => {
            const stageLabel = getStageLabel(stage)
            const expressions = getExpressionsForStage(stage)
            return (
              <div key={stage} className="border rounded-lg p-4 mb-4 relative">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-sm text-gray-700 mr-2">{stageLabel}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expressions.map((expr) => (
                    <div key={expr} className="relative">
                      <ImageUpload
                        label={expr.charAt(0).toUpperCase() + expr.slice(1)}
                        value={storySprites[`${stage}_${expr}`]}
                        onChange={(blob) =>
                          setStorySprites((prev) => ({ ...prev, [`${stage}_${expr}`]: blob }))
                        }
                        compact={true}
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        onClick={() => handleRemoveExpression(stage, expr)}
                        title="Remove expression"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Autocomplete
                    label="Add expression"
                    value={null}
                    options={expressionPresets}
                    onChange={(v: AutocompleteOption | null) => {
                      if (v?.id) {
                        handleAddExpression(v.id.toLowerCase(), stage)
                      }
                    }}
                    freeSolo
                    clearOnSelect
                    placeholder="Add expression (e.g. happy), the options are just suggestions"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {formData.love && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Main Menu Sprite</h4>
          <p className="text-sm text-gray-600 mb-4">
            Optional sprite for the main menu (only for befriendable characters)
          </p>
          <div className="relative">
            <ImageUpload
              value={mainMenuSprite}
              onChange={(blob) => setMainMenuSprite(blob)}
              compact={true}
            />
            {mainMenuSprite && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={handleRemoveMainMenuSprite}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SpritesTab
