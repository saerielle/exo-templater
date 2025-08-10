import { mainMenuTemplates, mapPositionTemplates } from '@/api/generic'
import Alert from '@/components/ui/Alert'
import Autocomplete from '@/components/ui/Autocomplete'
import NumberInput from '@/components/ui/NumberInput'
import SelectGroup from '@/components/ui/SelectGroup'
import { Character } from '@/lib/exoloader'

import SeasonedMapPositions from './SeasonedMapPositions'

interface PositioningTabProps {
  formData: Character
  projectId: string
  updateStringField: (path: string, value: string) => void
  updateObjectField: (path: string, value: object) => void
  setFormData: (data: Character) => void
}

const mainMenuTemplateOptions = [
  {
    value: '',
    label: 'None'
  },
  ...mainMenuTemplates.map((template) => ({
    value: template.id,
    label: template.name
  }))
]

const PositioningTab: React.FC<PositioningTabProps> = ({
  formData,
  projectId,
  updateStringField,
  updateObjectField,
  setFormData
}) => {
  return (
    <div className="space-y-6">
      {formData.love && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Main Menu Positioning</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectGroup
                label="Template Character"
                options={mainMenuTemplateOptions}
                value={formData.mainMenu?.template ?? ''}
                onChange={(e) => {
                  const oldTemplate = mainMenuTemplates.find(
                    (t) => t.id === formData.mainMenu?.template
                  )
                  const newPos = mainMenuTemplates.find((t) => t.id === e.target.value)?.position
                  if (
                    newPos &&
                    (!formData.mainMenu?.position ||
                      (formData.mainMenu?.position[0] === 0 &&
                        formData.mainMenu?.position[1] === 0) ||
                      (formData.mainMenu?.position[0] === oldTemplate?.position[0] &&
                        formData.mainMenu?.position[1] === oldTemplate?.position[1]))
                  ) {
                    updateObjectField('mainMenu.position', newPos)
                  }

                  updateStringField('mainMenu.template', e.target.value)
                }}
                helpText="Determines the 'layer' of the character in the main menu; Requires adding a main menu sprite"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position (X, Y)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  step={0.01}
                  value={formData.mainMenu?.position[0] ?? ''}
                  onChange={(val) => {
                    const newPos: [number, number] = [
                      val === '' ? 0 : Number(val),
                      formData.mainMenu?.position[1] ?? 0
                    ]
                    updateObjectField('mainMenu.position', newPos)
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="X"
                />
                <NumberInput
                  step={0.01}
                  value={formData.mainMenu?.position[1] ?? ''}
                  onChange={(val) => {
                    const newPos: [number, number] = [
                      formData.mainMenu?.position[0] ?? 0,
                      val === '' ? 0 : Number(val)
                    ]
                    updateObjectField('mainMenu.position', newPos)
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  placeholder="Y"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.onMap && (
        <>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Map Positions</h4>
            <div className="space-y-6">
              <Alert type="info" className="border-b">
                <div className="text-sm">
                  Set the position of the character on the map for each season. The positions are
                  ordered as X, Y, Z.
                  <br />X is responsible for left/right, Y for height but usually gets snapped to
                  the ground level automatically, Z for up/down. You can use the presets to help you
                  find the desired position. For example, if you want your character to be next to
                  another character during a specific season, only changing X value by a few units
                  will do the job. Or if you want to use character's position from a different
                  season to place your character in - just use the preset.
                </div>
              </Alert>
              <SeasonedMapPositions
                formData={formData}
                field="preHelioMapSpots"
                positionPresets={mapPositionTemplates.preHelioMapSpots}
                label="Strato Period (Years 10-14)"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destroyed Colony (Quiet 15)
                </label>
                <div className="grid grid-cols-[100px_80px_80px_80px_1fr] gap-2 items-center mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="destroyedMapSpot"
                      type="checkbox"
                      checked={!!formData.destroyedMapSpot}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          const { destroyedMapSpot, ...rest } = formData as any
                          setFormData(rest)
                        } else {
                          updateObjectField('destroyedMapSpot', [0, 0, 0])
                        }
                      }}
                    />
                    <label
                      htmlFor="destroyedMapSpot"
                      className="text-sm cursor-pointer select-none"
                    >
                      Quiet 15
                    </label>
                  </div>
                  {['X', 'Y', 'Z'].map((axis, index) => (
                    <div className="flex items-center mr-2" key={axis}>
                      <NumberInput
                        key={axis}
                        step={0.1}
                        value={formData.destroyedMapSpot?.[index] ?? ''}
                        onChange={(val) => {
                          const newSpot = [...(formData.destroyedMapSpot || [0, 0, 0])]
                          newSpot[index] = val === '' ? 0 : Number(val)
                          updateObjectField('destroyedMapSpot', newSpot)
                        }}
                        className="w-full border border-gray-300 rounded px-2 h-10 text-sm"
                        placeholder={axis}
                        disabled={!formData.destroyedMapSpot}
                      />
                    </div>
                  ))}
                  <Autocomplete
                    options={mapPositionTemplates.destroyedMapSpot}
                    value={null}
                    onChange={(value) => {
                      if (value) {
                        updateObjectField('destroyedMapSpot', value.position)
                      }
                    }}
                    disabled={!formData.destroyedMapSpot}
                    clearOnSelect
                    placeholder="Position presets"
                  />
                </div>
              </div>

              <SeasonedMapPositions
                formData={formData}
                field="postHelioMapSpots"
                positionPresets={mapPositionTemplates.postHelioMapSpots}
                label="Helio Period (15-19)"
                isChecked={true}
                onUpdateObjectKey={updateObjectField}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PositioningTab
