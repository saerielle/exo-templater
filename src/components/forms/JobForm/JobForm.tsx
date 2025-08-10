'use client'

import { set } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Job, LocationId, validateId } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import BasicTab from './BasicTab'
import RewardsTab from './RewardsTab'

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'rewards', label: 'Skills & Rewards' }
]

interface JobFormProps {
  job?: Job
  onSave: (job: Job) => void
  onCancel: () => void
  projectId: string
}

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel, projectId }) => {
  const [formData, setFormData] = useState<Job>(() => {
    return (
      job || {
        id: '',
        name: '',
        location: LocationId.Engineering,
        battleHeaderText: '',
        isRelax: false,
        kudos: 0,
        stress: 0,
        characters: [],
        projectId,
        dbId: crypto.randomUUID(),
        severity: 0
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'rewards'>('basic')

  const validateForm = (): string[] => {
    const newErrors: string[] = []
    newErrors.push(...validateId(formData.id))
    if (!formData.name) newErrors.push('Name is required')
    if (formData.primarySkill && (!formData.primaryValue || formData.primaryValue === 0)) {
      newErrors.push('Primary skill value is required when primary skill is set')
    }
    if (formData.secondSkill && (!formData.secondValue || formData.secondValue === 0)) {
      newErrors.push('Secondary skill value is required when secondary skill is set')
    }
    if (
      formData.ultimateBonusSkill &&
      (!formData.ultimateBonusValue || formData.ultimateBonusValue === 0)
    ) {
      newErrors.push('Ultimate bonus value is required when ultimate bonus skill is set')
    }

    return newErrors
  }

  const handleSave = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    await onSave(formData)
  }

  const updateFormData = (path: string, value: unknown) => {
    setFormData((prev) => {
      const newData = { ...prev }
      return set(newData, path, value)
    })
  }

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>{job ? 'Edit Job' : 'Create New Job'}</ModalHeader>
        {errors.length > 0 && (
          <Alert type="error" className="border-b">
            <div className="text-sm">
              <strong>Please fix the following errors:</strong>
              <ul className="list-disc list-inside mt-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Alert>
        )}
        <TabBar>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'rewards')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} updateFormData={updateFormData} />
          )}
          {activeTab === 'rewards' && (
            <RewardsTab formData={formData} projectId={projectId} updateFormData={updateFormData} />
          )}
        </div>
        <ModalFooter>
          <Button onClick={onCancel} className="modal-action-btn">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="modal-action-btn modal-action-btn--primary flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Job
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default JobForm
