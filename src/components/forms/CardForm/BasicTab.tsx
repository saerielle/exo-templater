import InputGroup from '@/components/ui/InputGroup'
import NumberInput from '@/components/ui/NumberInput'
import SelectGroup from '@/components/ui/SelectGroup'
import { Card, CardSuit, CardType, HowGet } from '@/lib/exoloader'

import { cardSuitOptions, cardTypeOptions, howGetOptions, levelOptions } from './utils'

interface BasicTabProps {
  formData: Card
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputGroup
            label="Card ID"
            value={formData.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('id', e.target.value)
            }
            placeholder="preciousmemory"
            helpText="Used internally (letters, numbers, underscore only)"
            required
          />
        </div>

        <div>
          <InputGroup
            label="Card Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData('name', e.target.value)
            }
            placeholder="Precious Memory"
            required
          />
        </div>

        <div>
          <SelectGroup
            label="Card Type"
            value={formData.type}
            onChange={(e) => {
              updateFormData('type', e.target.value as CardType)
              if (e.target.value === CardType.Gear) {
                updateFormData('value', undefined)
                updateFormData('suit', CardSuit.None)
              } else {
                updateFormData('value', 1)
                updateFormData('suit', CardSuit.Mental)
              }
            }}
            options={cardTypeOptions}
            required
          />
        </div>

        <div>
          <SelectGroup
            label="Level"
            value={String(formData.level)}
            onChange={(e) => updateFormData('level', parseInt(e.target.value))}
            options={levelOptions}
            required
          />
        </div>

        <div>
          <SelectGroup
            label="Suit"
            value={formData.suit}
            onChange={(e) => updateFormData('suit', e.target.value as CardSuit)}
            options={cardSuitOptions}
            disabled={formData.type === CardType.Gear}
            helpText={
              formData.type === CardType.Gear ? 'Gear cards always use "None" suit' : undefined
            }
            required
          />
        </div>

        {formData.type === CardType.Memory && (
          <div>
            <NumberInput
              label="Base Value"
              value={formData.value ?? 1}
              onChange={(value) => updateFormData('value', value)}
              required
            />
          </div>
        )}

        <div>
          <SelectGroup
            label="How to Get"
            value={formData.howGet}
            onChange={(e) => updateFormData('howGet', e.target.value as HowGet)}
            options={howGetOptions}
          />
        </div>

        {(formData.howGet === HowGet.Training ||
          formData.howGet === HowGet.TrainingBuy ||
          formData.howGet.startsWith('shop')) && (
          <div>
            <InputGroup
              label="Kudos Cost"
              type="number"
              min={0}
              value={formData.kudos || 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('kudos', parseInt(e.target.value))
              }
              required
            />
          </div>
        )}
      </div>

      <div>
        <InputGroup
          label="Upgrades From"
          value={formData.upgradeFrom || ''}
          onChange={(e) => updateFormData('upgradeFrom', e.target.value)}
          placeholder="card_id (leave empty if this is a base card)"
          helpText="ID of the card this upgrades from (for progression chains)"
        />
      </div>
    </div>
  )
}

export default BasicTab
