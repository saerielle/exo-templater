import { LocationId, SkillId } from "@/lib/exoloader"

export const locationOptions = Object.values(LocationId).map((id) => ({
  value: id,
  label: id.charAt(0).toUpperCase() + id.slice(1)
}))

const _skillOptions = Object.values(SkillId).map((id) => ({
  value: id,
  label: id.charAt(0).toUpperCase() + id.slice(1)
}))

export const skillOptions = [
  { value: '', label: 'None' },
  ..._skillOptions
]
