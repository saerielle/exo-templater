import { cardAbilities } from "@/api/cardAbilities"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CardAbility } from "./exoloader"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getCardAbilityLabel = (text?: string, value?: number, suit?: string) => {
  if (!text) return ''
  if (suit == 'none') suit = 'none/all'
  return text
    .replace(/\[suit\]/g, suit ?? '[suit]')
    .replace(/\[x\]/g, value?.toString() ?? '[x]')
    .replace(/\[\+x\]/g, value ? `+${value}` : '[+x]')
    .replace(/\[\-x\]/g, value ? `-${value}` : '[-x]')
    .replace(/\+\-/g, '-')
    .replace(/\-\+/g, '+')
    .replace(/\\n/g, '; ')
}

const cardAbilitiesById = cardAbilities.reduce(
  (acc, ability) => {
    acc[ability.id.toLowerCase()] = ability
    return acc
  },
  {} as Record<string, (typeof cardAbilities)[number]>
)

export const abilityToLabel = (ability: CardAbility) => {
  const gameAbility = cardAbilitiesById[ability.id.toLowerCase()]
  if (!gameAbility) return ability.id
  return getCardAbilityLabel(gameAbility.text, ability.value, ability.suit)
}
