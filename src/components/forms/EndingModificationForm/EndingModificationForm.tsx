'use client'

import { Save } from 'lucide-react'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { EndingModification } from '@/lib/exoloader'

import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import BasicTab from './BasicTab'

interface EndingModificationFormProps {
  ending?: EndingModification
  onSave: (ending: EndingModification) => void
  onCancel: () => void
  projectId: string
}

const EndingModificationForm: React.FC<EndingModificationFormProps> = ({
  ending,
  onSave,
  onCancel,
  projectId
}) => {
  const [formData, setFormData] = useState<EndingModification>(() => {
    return (
      ending || {
        id: '',
        projectId,
        dbId: crypto.randomUUID(),
        modifications: {
          name: '',
          preamble: '',
          location: '',
          character: '',
          requiredJobs: { add: [], remove: [] },
          otherJobs: { add: [], remove: [] },
          requiredMemories: { add: [], remove: [] },
          skills: { add: [], remove: [] }
        }
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic'>('basic')

  const validateForm = (): string[] => {
    const newErrors: string[] = []

    if (!formData.id) newErrors.push('Ending ID is required')
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

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>
          {ending ? 'Edit Ending Modification' : 'Create New Ending Modification'}
        </ModalHeader>
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
          {[{ id: 'basic', label: 'Basic Info' }].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} setFormData={setFormData} />
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
            Save Ending Modification
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default EndingModificationForm
