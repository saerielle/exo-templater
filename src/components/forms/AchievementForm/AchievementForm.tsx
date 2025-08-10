import { set } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { DatabaseService } from '../../../lib/database'
import { Achievement, validateCardId } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import ArtworkTab from './ArtworkTab'
import BasicTab from './BasicTab'
import RequirementsTab from './RequirementsTab'

interface AchievementFormProps {
  achievement?: Achievement
  onSave: (achievement: Achievement) => void
  onCancel: () => void
  projectId: string
}

const AchievementForm: React.FC<AchievementFormProps> = ({
  achievement,
  onSave,
  onCancel,
  projectId
}) => {
  const [formData, setFormData] = useState<Achievement>(() => {
    return (
      achievement || {
        id: '',
        name: '',
        description: '',
        hidden: false,
        loveAll: [],
        requiredCheevos: [],
        projectId,
        dbId: crypto.randomUUID()
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'requirements' | 'artwork'>('basic')

  const [achievementImage, setAchievementImage] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    if (!achievement || !projectId || !achievement.id) return

    let isMounted = true

    const loadAchievementImage = async () => {
      try {
        const image = await DatabaseService.getEntityImage(achievement.dbId)
        if (isMounted) {
          setAchievementImage(image?.imageBlob)
        }
      } catch (error) {
        console.error('Failed to load achievement image:', error)
      }
    }

    loadAchievementImage()

    return () => {
      isMounted = false
    }
  }, [achievement, projectId, achievement?.id])

  const validateForm = (): string[] => {
    const newErrors: string[] = []
    newErrors.push(...validateCardId(formData.id))
    if (!formData.name) newErrors.push('Achievement name is required')
    if (!formData.description) newErrors.push('Achievement description is required')

    return newErrors
  }

  const updateFormData = (path: string, value: unknown) => {
    setFormData((prev) => {
      const newData = { ...prev }
      return set(newData, path, value)
    })
  }

  const handleSave = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    await onSave(formData)
    if (formData.id && projectId && achievementImage) {
      await DatabaseService.addEntityImage(projectId, {
        id: `${formData.dbId}`,
        entityId: formData.id,
        entityDbId: formData.dbId,
        entityType: 'achievement',
        imageBlob: achievementImage,
        projectId
      })
    }
  }

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>
          {achievement ? 'Edit Achievement' : 'Create New Achievement'}
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
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'artwork', label: 'Illustration' }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'requirements' | 'artwork')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} updateFormData={updateFormData} />
          )}
          {activeTab === 'requirements' && (
            <RequirementsTab
              formData={formData}
              projectId={projectId}
              updateFormData={updateFormData}
            />
          )}
          {activeTab === 'artwork' && (
            <ArtworkTab
              formData={formData}
              projectId={projectId}
              achievementImage={achievementImage}
              setAchievementImage={setAchievementImage}
            />
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
            Save Achievement
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default AchievementForm
