import { useCallback, useMemo } from 'react'

import { mapPositionTemplates, mapSkeletonTypes } from '@/api/generic'
import Alert from '@/components/ui/Alert'
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete'
import CheckRadioGroup from '@/components/ui/CheckRadioGroup'
import NumberInput from '@/components/ui/NumberInput'
import { Character, Season } from '@/lib/exoloader'

import SeasonedMapPositions from './SeasonedMapPositions'

interface AdvancedTabProps {
  formData: Character
  projectId: string
  customAgeStages: number[]
  updateArrayField: (path: string, value: unknown[]) => void
  updateNumberField: (path: string, value: number) => void
  updateBooleanField: (path: string, value: boolean) => void
  updateObjectField: (path: string, value: object) => void
}

const noGlowSeason = [Season.Quiet, Season.Pollen, Season.Dust, Season.Wet]

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  formData,
  projectId,
  customAgeStages,
  updateArrayField,
  updateNumberField,
  updateBooleanField,
  updateObjectField
}) => {
  const stagesToDisplay = useMemo(() => {
    if (!formData.ages) {
      return [1, 2, 3] // for this form, yeah...
    }

    if (formData.helioOnly) {
      const baseStages = [2, 3]
      return [...baseStages, ...customAgeStages]
    }

    const baseStages = [1, 2, 3]
    return [...baseStages, ...customAgeStages]
  }, [formData.ages, formData.helioOnly, customAgeStages])

  const getStageLabel = useCallback(
    (stage: number) => {
      if (stage === 1) return 'Child / game years 1-3'
      if (stage === 2) return 'Teen / game years 4-6'
      if (stage === 3) return 'Adult / game years 7+'

      return `Stage ${stage}`
    },
    [formData.ages]
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.onMap && (
          <div>
            <Autocomplete
              label="Map Skeleton Template"
              multiselect
              clearable
              freeSolo
              options={mapSkeletonTypes.map((skel) => ({
                id: skel,
                name: skel.charAt(0).toUpperCase() + skel.slice(1)
              }))}
              value={
                (formData.skeleton ?? [])
                  .map((id) => {
                    const type = mapSkeletonTypes.find((opt) => opt === id)
                    if (!type) {
                      return {
                        id,
                        name: id
                      }
                    }
                    return {
                      id: type,
                      name: type.charAt(0).toUpperCase() + type.slice(1)
                    }
                  })
                  .filter(Boolean) as AutocompleteOption[]
              }
              onChange={(value) =>
                updateArrayField(
                  'skeleton',
                  value.map((v) => v.id)
                )
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to define the 'layer' the character is on when on map, recommended to use Anemone
              and Tang, or Dys and Tang. If your character appears on at least one of the expedition
              maps, you'd need to add Sym.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sprite Sizes</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.ages ? (
            stagesToDisplay.map((stage, idx) => (
              <div key={stage}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getStageLabel(stage)}
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  min={0}
                  max={50}
                  value={formData.spriteSizesByAge?.[idx] ?? ''}
                  onChange={(e) =>
                    updateNumberField(`spriteSizesByAge.${idx}`, parseInt(e.target.value))
                  }
                />
                {idx === 0 ? (
                  <p className="text-xs text-gray-500 mt-1">Size 20 ≈ Sym&apos;s height</p>
                ) : null}
              </div>
            ))
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sprite Size</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                min={0}
                max={50}
                value={formData.spriteSize ?? ''}
                onChange={(e) => updateNumberField('spriteSize', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Size 20 ≈ Sym&apos;s height</p>
            </div>
          )}
        </div>
      </div>

      {formData.onMap && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Map Sprite Scales</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stagesToDisplay.map((stage, idx) => (
              <div key={stage}>
                <NumberInput
                  step={0.01}
                  value={formData.overworldScaleByAge?.[idx] ?? ''}
                  onChange={(val) => val && updateNumberField(`overworldScaleByAge.${idx}`, val)}
                  label={getStageLabel(stage)}
                  helpText={idx === 0 ? 'Default value is 4.0' : undefined}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {!formData.ages
              ? "Just put the same value for all of them, it's a bit of a mess"
              : null}
          </p>
        </div>
      )}

      {formData.onMap && (
        <>
          <div>
            <div className="grid grid-cols-2 gap-4 items-center mb-4">
              <CheckRadioGroup
                type="checkbox"
                id="defaultOnMap"
                label="Appears on Map by Default"
                checked={formData.defaultOnMap}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateBooleanField('defaultOnMap', e.target.checked)
                }
                helpText={`Appears on Map without need to ~set mem_map_${formData.id ?? 'characterId'} = true`}
              />
            </div>

            <h4 className="font-medium text-gray-900 mb-4">Expedition Map Positions</h4>
            <div className="space-y-6">
              <Alert type="info" className="border-b">
                <div className="text-sm">
                  If your character appears on any of the expedition maps (swamp is not supported)
                </div>
              </Alert>

              <SeasonedMapPositions
                formData={formData}
                field="nearbyStratoMapSpots"
                positionPresets={mapPositionTemplates.nearbyStratoMapSpots}
                label="Nearby Strato"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
                seasons={noGlowSeason}
              />

              <SeasonedMapPositions
                formData={formData}
                field="nearbyHelioMapSpots"
                positionPresets={mapPositionTemplates.nearbyHelioMapSpots}
                label="Nearby Helio"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
              />

              <SeasonedMapPositions
                formData={formData}
                field="plainsMapSpots"
                positionPresets={mapPositionTemplates.plainsMapSpots}
                label="Plains"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
                seasons={noGlowSeason}
              />

              <SeasonedMapPositions
                formData={formData}
                field="valleyMapSpots"
                positionPresets={mapPositionTemplates.valleyMapSpots}
                label="Valley"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
                seasons={noGlowSeason}
              />

              <SeasonedMapPositions
                formData={formData}
                field="ridgeMapSpots"
                positionPresets={mapPositionTemplates.ridgeMapSpots}
                label="Ridge"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
                seasons={noGlowSeason}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdvancedTab
