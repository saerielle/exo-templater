import { Autocomplete } from '@/components/ui/Autocomplete'
import NumberInput from '@/components/ui/NumberInput'
import SelectGroup from '@/components/ui/SelectGroup'
import { Card, CardAbility, Collectible } from '@/lib/exoloader'
import { getCardAbilityLabel } from '@/lib/utils'

import { abilitySuitOptions, cardAbilities, cardAbilitiesById } from './utils'

const AbilityItem: React.FC<{
  num: number
  formData: Collectible
  updateFormData: (path: string, value: unknown) => void
}> = ({ num, formData, updateFormData }) => {
  const abilityId = (formData[`ability${num}` as keyof Collectible] as CardAbility)?.id
  const ability =
    cardAbilitiesById[abilityId?.toLowerCase() ?? ''] ??
    (abilityId ? { id: abilityId, name: abilityId } : null)
  const suit = (formData[`ability${num}` as keyof Collectible] as CardAbility)?.suit
  const value = (formData[`ability${num}` as keyof Collectible] as CardAbility)?.value

  return (
    <div key={num} className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Ability {num}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <Autocomplete
            label="Ability"
            options={cardAbilities}
            value={ability}
            freeSolo
            onChange={(e) => updateFormData(`ability${num}.id`, e?.id ?? '')}
            getOptionDescription={(ability) =>
              ability.text ? getCardAbilityLabel(ability.text, value || 0, suit) : null
            }
            searchFields={['name', 'text']}
            groupByField="category"
            clearable
          />
        </div>
        <div>
          <NumberInput
            label="Value"
            value={value}
            onChange={(e) => updateFormData(`ability${num}.value`, e)}
          />
        </div>

        <div>
          <SelectGroup
            label="Target Suit"
            value={suit || 'none'}
            onChange={(e) => updateFormData(`ability${num}.suit`, e.target.value)}
            options={abilitySuitOptions}
          />
        </div>
      </div>

      {abilityId && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <strong>Effect:</strong>{' '}
          {getCardAbilityLabel(
            cardAbilities.find((ability) => ability.id === abilityId)?.text,
            value || 0,
            suit
          ) || 'Unknown ability'}
        </div>
      )}
    </div>
  )
}

interface AbilitiesTabProps {
  formData: Collectible
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const AbilitiesTab: React.FC<AbilitiesTabProps> = ({ formData, projectId, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Card Abilities:</strong> Each card can have up to 3 abilities that modify gameplay
          (optional).
        </p>
      </div>

      {[1, 2, 3].map((num) => (
        <AbilityItem key={num} num={num} formData={formData} updateFormData={updateFormData} />
      ))}
    </div>
  )
}

export default AbilitiesTab
