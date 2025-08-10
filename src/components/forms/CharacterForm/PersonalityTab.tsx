import { useMemo } from 'react'

import { gameCollectibles } from '@/api/collectibles'
import { ageStages } from '@/api/generic'
import { gameJobs } from '@/api/jobs'
import { Autocomplete } from '@/components/ui/Autocomplete'
import InputGroup from '@/components/ui/InputGroup'
import { useCollectibles, useJobs } from '@/hooks/useDexie'
import { Character } from '@/lib/exoloader'

type PersonalityTabProps = {
  formData: Character
  projectId: string
  updateArrayField: (path: string, value: unknown[]) => void
  updateStringField: (path: string, value: string) => void
  updateNumberField: (path: string, value: number) => void
}

const PersonalityTab: React.FC<PersonalityTabProps> = ({
  formData,
  projectId,
  updateArrayField,
  updateStringField,
  updateNumberField
}) => {
  const { collectibles } = useCollectibles(projectId)
  const { jobs } = useJobs(projectId)

  const collectiblesOptions = useMemo(() => {
    return [
      ...gameCollectibles,
      ...collectibles.map((c) => ({
        id: c.id,
        name: c.name
      }))
    ]
  }, [collectibles])

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
      <div className="space-y-4">
        <div>
          <Autocomplete
            label="Likes (Collectibles)"
            multiselect
            clearable
            freeSolo
            options={collectiblesOptions}
            value={(formData.likes ?? []).map((id) => {
              const opt = collectiblesOptions.find((opt) => opt.id === id)

              if (!opt) {
                return {
                  id,
                  name: id
                }
              }

              return opt
            })}
            onChange={(value) =>
              updateArrayField(
                'likes',
                value.map((v) => v.id)
              )
            }
          />
        </div>

        <div>
          <Autocomplete
            label="Dislikes (Collectibles)"
            multiselect
            clearable
            freeSolo
            options={collectiblesOptions}
            value={(formData.dislikes ?? []).map((id) => {
              const opt = collectiblesOptions.find((opt) => opt.id === id)

              if (!opt) {
                return {
                  id,
                  name: id
                }
              }

              return opt
            })}
            onChange={(value) =>
              updateArrayField(
                'dislikes',
                value.map((v) => v.id)
              )
            }
          />
        </div>

        <div className="mb-8">
          <Autocomplete
            label="Jobs (Friendship Boost)"
            multiselect
            clearable
            freeSolo
            options={jobsOptions}
            value={(formData.jobs ?? []).map((id) => {
              const opt = jobsOptions.find((opt) => opt.id === id)

              if (!opt) {
                return {
                  id,
                  name: id
                }
              }

              return opt
            })}
            onChange={(value) =>
              updateArrayField(
                'jobs',
                value.map((v) => v.id)
              )
            }
          />
        </div>

        {[1, 2, 3].map((num) => (
          <div key={num} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Personality Trait {num}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <InputGroup
                  label="Left Side (0)"
                  value={formData[`fillBar${num}Left` as keyof typeof formData] as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateStringField(`fillBar${num}Left`, e.target.value)
                  }
                  placeholder="Introverted"
                />
              </div>
              <div>
                <InputGroup
                  label="Right Side (10)"
                  value={formData[`fillBar${num}Right` as keyof typeof formData] as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateStringField(`fillBar${num}Right`, e.target.value)
                  }
                  placeholder="Extroverted"
                />
              </div>
            </div>
            <div className="space-y-2">
              {ageStages.map((stage) => {
                const stageKey = stage.key
                const propertyKey = `fillBar${num}${stageKey}` as keyof typeof formData

                return (
                  <div key={stage.key} className="flex items-center gap-4">
                    <div className="w-40">
                      <InputGroup
                        label={stage.label}
                        type="number"
                        min={0}
                        max={10}
                        value={formData[propertyKey] as number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateNumberField(propertyKey, parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((formData[propertyKey] as number) / 10) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalityTab
