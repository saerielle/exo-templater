import NumberInput from '@/components/ui/NumberInput'
import SelectGroup from '@/components/ui/SelectGroup'
import { Job, SkillId } from '@/lib/exoloader'

import { skillOptions } from './util'

interface RewardsTabProps {
  formData: Job
  projectId: string
  updateFormData: (path: string, value: unknown) => void
}

const RewardsTab: React.FC<RewardsTabProps> = ({ formData, projectId, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Job Rewards:</strong> Configure the skills, kudos, and stress effects this job
          provides. Values can be positive (gain) or negative (loss). For rebellion - negative is
          loyalty gain, positive is rebellion gain.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Primary Skill Reward</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectGroup
                label="Primary Skill"
                value={formData.primarySkill || ''}
                onChange={(e) =>
                  updateFormData('primarySkill', (e.target.value as SkillId) || undefined)
                }
                options={skillOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Value</label>
              <NumberInput
                step={1}
                value={formData.primaryValue ?? ''}
                onChange={(val) =>
                  updateFormData('primaryValue', val === '' ? undefined : Number(val))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.primarySkill}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Secondary Skill Reward</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectGroup
                label="Secondary Skill"
                value={formData.secondSkill || ''}
                onChange={(e) =>
                  updateFormData('secondSkill', (e.target.value as SkillId) || undefined)
                }
                options={skillOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Value
              </label>
              <NumberInput
                step={1}
                value={formData.secondValue ?? ''}
                onChange={(val) =>
                  updateFormData('secondValue', val === '' ? undefined : Number(val))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.secondSkill}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kudos Change</label>
            <NumberInput
              step={1}
              value={formData.kudos ?? ''}
              onChange={(val) => updateFormData('kudos', val === '' ? 0 : Number(val))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stress Change</label>
            <NumberInput
              step={1}
              value={formData.stress ?? ''}
              onChange={(val) => updateFormData('stress', val === '' ? 0 : Number(val))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Ultimate Event Bonus</h4>
          <p className="text-sm text-gray-600 mb-4">
            Bonus reward after completing the ultimate event for this job
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectGroup
                label="Ultimate Bonus Skill"
                value={formData.ultimateBonusSkill || ''}
                onChange={(e) =>
                  updateFormData('ultimateBonusSkill', (e.target.value as SkillId) || undefined)
                }
                options={skillOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ultimate Bonus Value
              </label>
              <NumberInput
                step={1}
                value={formData.ultimateBonusValue ?? ''}
                onChange={(val) =>
                  updateFormData('ultimateBonusValue', val === '' ? undefined : Number(val))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.ultimateBonusSkill}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsTab
