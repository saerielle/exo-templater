import { LocationId, SkillId } from "@/lib/exoloader";

const _locationOptions = Object.values(LocationId).map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1)
}))

export const locationOptions = [
  { value: '', label: 'None' },
  ..._locationOptions.map((location) => ({ value: location.id, label: location.name }))
]

export const skillOptions = Object.values(SkillId).map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1)
}))
