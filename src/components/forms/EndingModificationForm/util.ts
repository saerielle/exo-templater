import { LocationId, SkillId } from "@/lib/exoloader"

export const endingReference: Record<
  string,
  {
    name: string
    requiredJobs: string[]
    otherJobs: string[]
    requiredMemories: string[]
    skills: string[]
    character?: string
    location?: string
  }
> = {
  hunter: {
    name: 'Xeno Hunter',
    requiredJobs: ['hunt'],
    otherJobs: ['defenseTraining'],
    requiredMemories: ['!ending_special_peace'],
    skills: ['combat'],
    character: undefined,
    location: 'garrison'
  },
  athlete: {
    name: 'Sportsball Hero',
    requiredJobs: ['sportsball'],
    otherJobs: [],
    requiredMemories: [],
    skills: ['toughness'],
    character: undefined,
    location: 'garrison'
  },
  hero: {
    name: 'Military Hero',
    requiredJobs: ['guardDuty'],
    otherJobs: ['lookoutDuty'],
    requiredMemories: ['!ending_special_peace'],
    skills: ['combat'],
    character: undefined,
    location: 'garrison'
  },
  astronaut: {
    name: 'Astronaut',
    requiredJobs: ['studyPhysics'],
    otherJobs: ['artifacts'],
    requiredMemories: ['endAstronaut'],
    skills: ['bravery'],
    character: '!vace',
    location: 'expeditions'
  },
  explorer: {
    name: 'Explorer',
    requiredJobs: ['survey'],
    otherJobs: ['exploreNearby'],
    requiredMemories: [],
    skills: ['perception'],
    character: undefined,
    location: 'expeditions'
  },
  collector: {
    name: 'Collector',
    requiredJobs: ['artifacts'],
    otherJobs: ['forage'],
    requiredMemories: ['!ending_special_peace'],
    skills: ['organization'],
    character: undefined,
    location: 'expeditions'
  },
  parent: {
    name: 'Prolific Parent',
    requiredJobs: ['babysitting'],
    otherJobs: ['cooking'],
    requiredMemories: ['endParent'],
    skills: ['empathy'],
    character: undefined,
    location: 'quarters'
  },
  novelist: {
    name: 'Pulp Novelist',
    requiredJobs: ['studyWriting'],
    otherJobs: ['assistant'],
    requiredMemories: [],
    skills: ['creativity'],
    character: undefined,
    location: 'quarters'
  },
  entertainer: {
    name: 'Entertainer',
    requiredJobs: ['photophonor'],
    otherJobs: ['barista'],
    requiredMemories: ['endEntertainer'],
    skills: ['bravery'],
    character: undefined,
    location: 'quarters'
  },
  botanist: {
    name: 'Botanist',
    requiredJobs: ['analyzePlants'],
    otherJobs: ['studyBiology'],
    requiredMemories: [],
    skills: ['biology'],
    character: undefined,
    location: 'geoponics'
  },
  rancher: {
    name: 'Xeno Whisperer',
    requiredJobs: ['tendAnimals'],
    otherJobs: ['relaxPark'],
    requiredMemories: [],
    skills: ['animals'],
    character: undefined,
    location: 'geoponics'
  },
  farmer: {
    name: 'Farmer',
    requiredJobs: ['farm'],
    otherJobs: ['shovel'],
    requiredMemories: [],
    skills: ['biology'],
    character: undefined,
    location: 'geoponics'
  },
  lawyer: {
    name: 'Lawyer',
    requiredJobs: ['assistant'],
    otherJobs: ['studyWriting'],
    requiredMemories: [],
    skills: ['persuasion'],
    character: undefined,
    location: 'command'
  },
  architect: {
    name: 'Architect',
    requiredJobs: ['construction'],
    otherJobs: ['studyPhysics'],
    requiredMemories: [],
    skills: ['toughness'],
    character: undefined,
    location: 'command'
  },
  merchant: {
    name: 'Merchant',
    requiredJobs: ['depot'],
    otherJobs: ['delivery'],
    requiredMemories: ['marzCapitalism'],
    skills: ['organization'],
    character: undefined,
    location: 'command'
  },
  doctor: {
    name: 'Doctor',
    requiredJobs: ['nurse'],
    otherJobs: ['studyBiology'],
    requiredMemories: [],
    skills: ['empathy'],
    character: undefined,
    location: 'engineering'
  },
  roboticist: {
    name: 'Roboticist',
    requiredJobs: ['robotRepair'],
    otherJobs: ['studyPhysics'],
    requiredMemories: [],
    skills: ['engineering'],
    character: undefined,
    location: 'engineering'
  },
  professor: {
    name: 'Professor',
    requiredJobs: ['tutoring'],
    otherJobs: ['studyWriting'],
    requiredMemories: [],
    skills: ['reasoning'],
    character: undefined,
    location: 'engineering'
  },
  rebel: {
    name: 'Rebel',
    requiredJobs: [],
    otherJobs: [],
    requiredMemories: [],
    skills: ['rebellion'],
    character: undefined,
    location: undefined
  },
  hobbyist: {
    name: 'Hobbyist',
    requiredJobs: [],
    otherJobs: ['relaxLounge', 'relaxPark', 'relaxWalls'],
    requiredMemories: [],
    skills: [],
    character: undefined,
    location: undefined
  }
}

export const endingOptions = Object.keys(endingReference).map((key) => {
  return {
    id: key,
    name: key
  }
})

export const skillOptions = Object.values(SkillId).map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1)
}))

const _locationOptions = Object.values(LocationId).map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1)
}))

export const locationOptions = [
  { value: '', label: 'None' },
  ..._locationOptions.map((location) => ({ value: location.id, label: location.name }))
]
