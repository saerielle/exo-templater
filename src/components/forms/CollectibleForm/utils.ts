import { HowGet } from "@/lib/exoloader";
import { cardAbilities as _cardAbilities } from '../../../api/cardAbilities'

export const howGetOptions = [
  { value: HowGet.None, label: 'Found/Given (Default)' },
  { value: HowGet.ShopDefault, label: 'Supply Depot (Default)' },
  { value: HowGet.ShopClothes, label: 'Supply Depot: Clothes (Creativity Perk)' },
  { value: HowGet.ShopWeapons, label: 'Supply Depot: Weapons (Combat Perk)' },
  { value: HowGet.ShopGadgets, label: 'Supply Depot: Gadgets (Engineering Perk)' }
]

export const cardAbilities = _cardAbilities.filter((a) => a.id.startsWith('collectible'))

export const cardAbilitiesById = cardAbilities.reduce(
  (acc, ability) => {
    acc[ability.id.toLowerCase()] = ability
    return acc
  },
  {} as Record<string, (typeof cardAbilities)[number]>
)

export const abilitySuitOptions = [
  { value: 'none', label: 'None / All' },
  { value: 'physical', label: 'Physical' },
  { value: 'mental', label: 'Mental' },
  { value: 'social', label: 'Social' },
  { value: 'wildcard', label: 'Wild' }
]
