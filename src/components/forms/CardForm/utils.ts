import { cardAbilities as _cardAbilities } from '../../../api/cardAbilities'
import { Card, CardSuit, CardType, HowGet } from '../../../lib/exoloader'

export const cardAbilities = _cardAbilities.filter((a) => !a.id.startsWith('collectible'))

export const cardAbilitiesById = cardAbilities.reduce(
  (acc, ability) => {
    acc[ability.id.toLowerCase()] = ability
    return acc
  },
  {} as Record<string, (typeof cardAbilities)[number]>
)

export const cardSuitOptions = [
  { value: CardSuit.Physical, label: '🔴 Physical' },
  { value: CardSuit.Mental, label: '🔵 Mental' },
  { value: CardSuit.Social, label: '🟡 Social' },
  { value: CardSuit.Wild, label: '💗 Wild' }
]

export const cardTypeOptions = [
  { value: CardType.Memory, label: 'Memory Card' },
  { value: CardType.Gear, label: 'Gear Card' }
]

export const levelOptions = [
  { value: '1', label: 'Level 1' },
  { value: '2', label: 'Level 2' },
  { value: '3', label: 'Level 3' },
  { value: '4', label: 'Level 4' }
]

export const howGetOptions = [
  { value: HowGet.None, label: 'Found/Given (Default)' },
  {
    value: HowGet.Unique,
    label: 'Unique (Story/Event; player can only have one; used for character reputation cards)'
  },
  { value: HowGet.Training, label: 'Training (Garrison Upgrade)' },
  { value: HowGet.TrainingBuy, label: 'Training Buy (Garrison Purchase)' },
  { value: HowGet.ShopDefault, label: 'Supply Depot (Default)' },
  { value: HowGet.ShopClothes, label: 'Supply Depot: Clothes (Creativity Perk)' },
  { value: HowGet.ShopWeapons, label: 'Supply Depot: Weapons (Combat Perk)' },
  { value: HowGet.ShopGadgets, label: 'Supply Depot: Gadgets (Engineering Perk)' }
]

export const defaultValue = (projectId: string): Card => {
  return {
    id: '',
    dbId: crypto.randomUUID(),
    name: '',
    type: CardType.Memory,
    level: 1,
    suit: CardSuit.Mental,
    value: 1,
    howGet: HowGet.None,
    artistName: '',
    artistSocialAt: '',
    artistSocialLink: '',
    projectId,
    ability1: {
      id: '',
      value: 0,
      suit: CardSuit.None
    },
    ability2: {
      id: '',
      value: 0,
      suit: CardSuit.None
    },
    ability3: {
      id: '',
      value: 0,
      suit: CardSuit.None
    }
  }
}
