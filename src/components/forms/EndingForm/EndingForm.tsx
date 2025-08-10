'use client'

import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Ending, EndingImage } from '@/lib/exoloader'

import { DatabaseService } from '../../../lib/database'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import ArtworkTab from './ArtworkTab'
import BasicTab from './BasicTab'
import RequirementsTab from './RequirementsTab'

interface EndingFormProps {
  ending?: Ending
  onSave: (ending: Ending) => void
  onCancel: () => void
  projectId: string
}

const EndingForm: React.FC<EndingFormProps> = ({ ending, onSave, onCancel, projectId }) => {
  const [formData, setFormData] = useState<Ending>(() => {
    return (
      ending || {
        id: '',
        name: '',
        preamble: '',
        location: '',
        character: '',
        requiredJobs: [],
        otherJobs: [],
        requiredMemories: [],
        skills: [],
        projectId,
        dbId: crypto.randomUUID(),
        severity: 0,
        isSpecial: false
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'requirements' | 'images'>('basic')
  const [specialEndingImage, setSpecialEndingImage] = useState<Blob | undefined>(undefined)
  const [endingImageF, setEndingImageF] = useState<Blob | undefined>(undefined)
  const [endingImageM, setEndingImageM] = useState<Blob | undefined>(undefined)
  const [endingImageNB, setEndingImageNB] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    if (!ending || !projectId || !ending.id) return

    let isMounted = true

    const loadEndingImages = async () => {
      try {
        const images: EndingImage[] = await DatabaseService.getEndingImages(projectId, ending.dbId)
        if (isMounted) {
          setSpecialEndingImage(images.find((img) => img.type === 'special')?.imageBlob)
          setEndingImageF(
            images.find((img) => img.type === 'career' && img.gender === 'f')?.imageBlob
          )
          setEndingImageM(
            images.find((img) => img.type === 'career' && img.gender === 'm')?.imageBlob
          )
          setEndingImageNB(
            images.find((img) => img.type === 'career' && img.gender === 'nb')?.imageBlob
          )
        }
      } catch (error) {
        console.error('Failed to load ending images:', error)
      }
    }

    loadEndingImages()

    return () => {
      isMounted = false
    }
  }, [ending, projectId, ending?.dbId])

  const validateForm = (): string[] => {
    const newErrors: string[] = []

    if (!formData.id) newErrors.push('Ending ID is required')
    if (!/^[a-zA-Z0-9_]+$/.test(formData.id))
      newErrors.push('Ending ID can only contain letters, numbers, and underscores')
    if (!formData.name) newErrors.push('Ending name is required')
    if (!formData.preamble) newErrors.push('Preamble is required')

    return newErrors
  }

  const handleSave = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    await onSave(formData)
    if (formData.id && projectId) {
      if (formData.isSpecial && specialEndingImage) {
        await DatabaseService.upsertEndingImage(projectId, {
          id: `special_${formData.dbId}`,
          endingDbId: formData.dbId,
          endingId: formData.id,
          type: 'special',
          imageBlob: specialEndingImage,
          projectId
        })
      }
      if (!formData.isSpecial) {
        if (endingImageF) {
          await DatabaseService.upsertEndingImage(projectId, {
            id: `${formData.dbId}_f`,
            endingDbId: formData.dbId,
            endingId: formData.id,
            type: 'career',
            gender: 'f',
            imageBlob: endingImageF,
            projectId
          })
        }
        if (endingImageM) {
          await DatabaseService.upsertEndingImage(projectId, {
            id: `${formData.dbId}_m`,
            endingDbId: formData.dbId,
            endingId: formData.id,
            type: 'career',
            gender: 'm',
            imageBlob: endingImageM,
            projectId
          })
        }
        if (endingImageNB) {
          await DatabaseService.upsertEndingImage(projectId, {
            id: `${formData.dbId}_nb`,
            endingDbId: formData.dbId,
            endingId: formData.id,
            type: 'career',
            gender: 'nb',
            imageBlob: endingImageNB,
            projectId
          })
        }
      }
    }
  }

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>{ending ? 'Edit Ending' : 'Create New Ending'}</ModalHeader>
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
            ...(!formData.isSpecial ? [{ id: 'requirements', label: 'Requirements' }] : []),
            { id: 'images', label: 'Illustration(s)' }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'requirements' | 'images')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} setFormData={setFormData} />
          )}
          {activeTab === 'requirements' && (
            <RequirementsTab formData={formData} projectId={projectId} setFormData={setFormData} />
          )}
          {activeTab === 'images' && (
            <ArtworkTab
              formData={formData}
              projectId={projectId}
              specialEndingImage={specialEndingImage}
              setSpecialEndingImage={setSpecialEndingImage}
              endingImageF={endingImageF}
              setEndingImageF={setEndingImageF}
              endingImageM={endingImageM}
              setEndingImageM={setEndingImageM}
              endingImageNB={endingImageNB}
              setEndingImageNB={setEndingImageNB}
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
            Save Ending
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default EndingForm
