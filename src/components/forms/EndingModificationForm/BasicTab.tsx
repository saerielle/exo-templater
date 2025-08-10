import { Plus, X } from 'lucide-react'

import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'

import { gameJobs } from '@/api/jobs'
import Autocomplete, { AutocompleteOption } from '@/components/ui/Autocomplete'
import InputGroup from '@/components/ui/InputGroup'
import SelectGroup from '@/components/ui/SelectGroup'
import { useJobs } from '@/hooks/useDexie'
import { EndingModification, LocationId } from '@/lib/exoloader'

import { endingOptions, endingReference, locationOptions, skillOptions } from './util'

interface BasicTabProps {
  formData: EndingModification
  projectId: string
  setFormData: Dispatch<SetStateAction<EndingModification>>
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, projectId, setFormData }) => {
  const mods = formData.modifications || {}

  const { jobs } = useJobs(projectId)

  const jobsOptions = useMemo(() => {
    return [
      ...jobs.map((j) => ({
        id: j.id,
        name: j.name
      })),
      ...gameJobs
    ]
  }, [jobs])

  const currentEnding = useMemo(() => {
    if (formData.id?.length) {
      return {
        id: formData.id,
        name: formData.id
      }
    }

    return null
  }, [formData.id])

  const placeholder = useMemo(() => {
    if (formData.id?.length) {
      return endingReference[formData.id]
    }
    return null
  }, [formData.id])

  const getReferenceOptions = useCallback(
    (field: keyof (typeof endingReference)['']) => {
      const ref = endingReference[formData.id] || {}
      const refArr = Array.isArray(ref[field]) ? (ref[field] as string[]) : []
      return refArr.map((item: string) => ({
        id: item,
        name: item
      }))
    },
    [formData.id]
  )

  const arrayToOptions = useCallback((arr: string[], referenceOptions: AutocompleteOption[]) => {
    return arr.map((item) => {
      const matchingRef = referenceOptions.find(
        (ref) => ref.id.toLowerCase() === item.toLowerCase()
      )

      return {
        id: matchingRef ? matchingRef.id : item,
        name: matchingRef ? matchingRef.name : item
      }
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Autocomplete
            label="Ending ID *"
            value={currentEnding}
            onChange={(value) => value?.id && setFormData({ ...formData, id: value.id })}
            options={endingOptions}
            placeholder="Select existing ending to modify"
            clearable
          />
          <p className="text-xs text-gray-500 mt-1">Existing ending to modify</p>
        </div>
        <div>
          <InputGroup
            label="Ending Name (optional)"
            value={formData.modifications?.name ?? placeholder?.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value
              setFormData({
                ...formData,
                modifications: { ...formData.modifications, name: val }
              })
            }}
            placeholder={placeholder?.name}
            disabled={!formData.id}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preamble (optional)</label>
        <textarea
          value={formData.modifications?.preamble ?? 'You reached your 20th birthday...'}
          onChange={(e) =>
            setFormData({
              ...formData,
              modifications: { ...formData.modifications, preamble: e.target.value }
            })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="You reached your 20th birthday..."
          disabled={!formData.id}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SelectGroup
            label="Location (optional)"
            value={
              formData.modifications?.location?.length
                ? formData.modifications.location
                : placeholder?.location || ''
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                modifications: { ...formData.modifications, location: e.target.value as LocationId }
              })
            }
            options={locationOptions}
            helpText={'Bonus points if player has "Second in command" in this location'}
            disabled={!formData.id}
          />
        </div>
        <div>
          <InputGroup
            label="Character (optional)"
            value={formData.modifications?.character ?? placeholder?.character}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                modifications: { ...formData.modifications, character: e.target.value }
              })
            }
            placeholder={placeholder?.character}
            helpText={
              'Will skip showing character ending if this value is set as !charaID, for example !vace.'
            }
            disabled={!formData.id}
          />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Remove values</label>

            {formData.id ? (
              <>
                <div className="mb-4">
                  <Autocomplete
                    label="Required Jobs"
                    multiselect
                    clearable
                    freeSolo
                    options={getReferenceOptions('requiredJobs')}
                    value={arrayToOptions(
                      mods.requiredJobs?.remove || [],
                      getReferenceOptions('requiredJobs')
                    )}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        modifications: {
                          ...mods,
                          requiredJobs: { ...mods.requiredJobs, remove: value.map((v) => v.id) }
                        }
                      })
                    }
                    disabled={!formData.id}
                    helpText="This field displays ids directly (not actual names of jobs)"
                  />
                </div>

                <div className="mb-4">
                  <Autocomplete
                    label="Other Jobs"
                    multiselect
                    clearable
                    freeSolo
                    options={getReferenceOptions('otherJobs')}
                    value={arrayToOptions(
                      mods.otherJobs?.remove || [],
                      getReferenceOptions('otherJobs')
                    )}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        modifications: {
                          ...mods,
                          otherJobs: { ...mods.otherJobs, remove: value.map((v) => v.id) }
                        }
                      })
                    }
                    disabled={!formData.id}
                    helpText="This field displays ids directly (not actual names of jobs)"
                  />
                </div>

                <div className="mb-4">
                  <Autocomplete
                    label="Required Memories"
                    multiselect
                    clearable
                    freeSolo
                    options={getReferenceOptions('requiredMemories')}
                    value={arrayToOptions(
                      mods.requiredMemories?.remove || [],
                      getReferenceOptions('requiredMemories')
                    )}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        modifications: {
                          ...mods,
                          requiredMemories: {
                            ...mods.requiredMemories,
                            remove: value.map((v) => v.id)
                          }
                        }
                      })
                    }
                    disabled={!formData.id}
                    helpText="No options = ending doesn't require any memories"
                  />
                </div>

                <div className="mb-4">
                  <Autocomplete
                    label="Skills"
                    multiselect
                    clearable
                    freeSolo
                    options={getReferenceOptions('skills')}
                    value={arrayToOptions(mods.skills?.remove || [], getReferenceOptions('skills'))}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        modifications: {
                          ...mods,
                          skills: { ...mods.skills, remove: value.map((v) => v.id) }
                        }
                      })
                    }
                    disabled={!formData.id}
                    helpText="This field displays ids directly (not actual names of skills)"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Add values</label>
            <div className="mb-4">
              <Autocomplete
                label="Required Jobs"
                multiselect
                clearable
                freeSolo
                options={jobsOptions}
                value={
                  (formData.modifications?.requiredJobs?.add ?? [])
                    .map((id) => {
                      const opt = jobsOptions.find((opt) => opt.id === id)

                      if (!opt) {
                        return { id, name: id }
                      }

                      return opt
                    })
                    .filter(Boolean) as AutocompleteOption[]
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    modifications: {
                      ...mods,
                      requiredJobs: { ...mods.requiredJobs, add: value.map((v) => v.id) }
                    }
                  })
                }
                disabled={!formData.id}
                helpText="Select jobs from the list"
              />
            </div>
            <div className="mb-4">
              <Autocomplete
                label="Other Jobs"
                multiselect
                clearable
                freeSolo
                options={jobsOptions}
                value={
                  (formData.modifications?.otherJobs?.add ?? [])
                    .map((id) => {
                      const opt = jobsOptions.find((opt) => opt.id === id)

                      if (!opt) {
                        return { id, name: id }
                      }

                      return opt
                    })
                    .filter(Boolean) as AutocompleteOption[]
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    modifications: {
                      ...mods,
                      otherJobs: { ...mods.otherJobs, add: value.map((v) => v.id) }
                    }
                  })
                }
                disabled={!formData.id}
                helpText="Select jobs from the list"
              />
            </div>
            <div className="mb-4">
              <Autocomplete
                label="Required Memories"
                multiselect
                freeSolo
                options={[]}
                value={
                  (formData.modifications?.requiredMemories?.add ?? [])
                    .map((id) => ({ id, name: id }))
                    .filter(Boolean) as AutocompleteOption[]
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    modifications: {
                      ...mods,
                      requiredMemories: { ...mods.requiredMemories, add: value.map((v) => v.id) }
                    }
                  })
                }
                disabled={!formData.id}
                helpText="Without mem_ prefix"
              />
            </div>
            <div className="mb-4">
              <Autocomplete
                label="Skills"
                multiselect
                clearable
                freeSolo
                options={skillOptions}
                value={
                  (formData.modifications?.skills?.add ?? [])
                    .map((id) => {
                      const opt = skillOptions.find((opt) => opt.id === id)

                      if (!opt) {
                        return { id, name: id }
                      }

                      return opt
                    })
                    .filter(Boolean) as AutocompleteOption[]
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    modifications: {
                      ...mods,
                      skills: { ...mods.skills, add: value.map((v) => v.id) }
                    }
                  })
                }
                disabled={!formData.id}
                helpText="Typically only one skill is used in base game endings for calculations"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicTab
