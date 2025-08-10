import React from 'react'

import { Character, Season } from '@/lib/exoloader'

import { Autocomplete } from '../../ui/Autocomplete'
import NumberInput from '../../ui/NumberInput'

type MapPositionTemplate = {
  id: string
  name: string
  position: [number, number, number]
}

interface SeasonedMapPositionsProps {
  formData: Character
  field:
    | 'preHelioMapSpots'
    | 'postHelioMapSpots'
    | 'nearbyStratoMapSpots'
    | 'nearbyHelioMapSpots'
    | 'plainsMapSpots'
    | 'valleyMapSpots'
    | 'ridgeMapSpots'
  positionPresets: MapPositionTemplate[]
  label: string
  isChecked: boolean
  onUpdateObjectKey: (key: string, value: object) => void
  seasons?: Season[]
}

const SeasonedMapPositions: React.FC<SeasonedMapPositionsProps> = ({
  formData,
  field,
  positionPresets,
  label,
  isChecked,
  onUpdateObjectKey,
  seasons = ['quiet', 'pollen', 'dust', 'wet', 'glow']
}) => {
  const currentMapSpots = formData[field] || {}

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {seasons.map((season) => {
        const isSeasonChecked = !!currentMapSpots[season]
        return (
          <div
            className="grid grid-cols-[100px_80px_80px_80px_1fr] gap-2 items-center mb-2"
            key={season}
          >
            <div className="flex items-center gap-2">
              <input
                id={`${field}_${season}`}
                type="checkbox"
                checked={isSeasonChecked}
                onChange={(e) => {
                  if (!e.target.checked) {
                    const updated = { ...currentMapSpots }
                    delete updated[season]
                    onUpdateObjectKey(field, updated)
                  } else {
                    onUpdateObjectKey(field, {
                      ...currentMapSpots,
                      [season]: [0, 0, 0]
                    })
                  }
                }}
              />
              <label
                htmlFor={`${field}_${season}`}
                className="capitalize text-sm cursor-pointer select-none"
              >
                {season}
              </label>
            </div>
            {['X', 'Y', 'Z'].map((axis, index) => (
              <div key={axis} className="flex items-center mr-2">
                <NumberInput
                  step={0.1}
                  value={currentMapSpots[season]?.[index] ?? ''}
                  onChange={(val) => {
                    const newSpot = [...(currentMapSpots[season] || [0, 0, 0])]
                    newSpot[index] = val === '' ? 0 : Number(val)
                    onUpdateObjectKey(field, {
                      ...currentMapSpots,
                      [season]: newSpot
                    })
                  }}
                  className="w-full border border-gray-300 rounded px-2 h-10 text-sm"
                  placeholder={axis}
                  disabled={!isSeasonChecked}
                />
              </div>
            ))}
            {positionPresets.length ? (
              <Autocomplete
                options={positionPresets}
                value={null}
                onChange={(value) => {
                  if (value) {
                    onUpdateObjectKey(field, {
                      ...currentMapSpots,
                      [season]: value.position
                    })
                  }
                }}
                disabled={!isSeasonChecked}
                clearOnSelect
                placeholder="Position presets"
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default SeasonedMapPositions
