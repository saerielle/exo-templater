import { Dispatch, SetStateAction, useMemo } from 'react'

import { gameJobs } from '@/api/jobs'
import Autocomplete, { AutocompleteOption } from '@/components/ui/Autocomplete'
import { useJobs } from '@/hooks/useDexie'
import { Ending } from '@/lib/exoloader'

import { skillOptions } from './util'

interface RequirementsTabProps {
  formData: Ending
  projectId: string
  setFormData: Dispatch<SetStateAction<Ending>>
}

const RequirementsTab: React.FC<RequirementsTabProps> = ({ formData, projectId, setFormData }) => {
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

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Ending Requirements:</strong> Optionally, specify jobs, memories, or skills that
          contribute to this ending.
        </p>
      </div>
      <div>
        <Autocomplete
          label="Required Jobs"
          multiselect
          freeSolo
          clearable
          options={jobsOptions}
          value={
            (formData.requiredJobs ?? [])
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
              requiredJobs: value.map((v) => v.id)
            })
          }
        />
      </div>
      <div>
        <Autocomplete
          label="Other Jobs"
          multiselect
          freeSolo
          clearable
          options={jobsOptions}
          value={
            (formData.otherJobs ?? [])
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
              otherJobs: value.map((v) => v.id)
            })
          }
        />
      </div>
      <div>
        <Autocomplete
          label="Required Memories"
          multiselect
          freeSolo
          options={[]}
          value={
            (formData.requiredMemories ?? [])
              .map((id) => ({ id, name: id }))
              .filter(Boolean) as AutocompleteOption[]
          }
          onChange={(value) =>
            setFormData({
              ...formData,
              requiredMemories: value.map((v) => v.id)
            })
          }
        />
      </div>
      <div>
        <Autocomplete
          label="Skills"
          multiselect
          freeSolo
          clearable
          options={skillOptions}
          value={
            (formData.skills ?? [])
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
              skills: value.map((v) => v.id)
            })
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          Typically only one skill is used in base game endings for calculations.
        </p>
      </div>
    </div>
  )
}

export default RequirementsTab
