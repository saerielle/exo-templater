import { set } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { DatabaseService } from '../../../lib/database'
import { Background, BackgroundType } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import ArtworkTab from './ArtworkTab'
import BasicTab from './BasicTab'

interface BackgroundFormProps {
  background?: Background
  onSave: (background: Background) => void
  onCancel: () => void
  projectId: string
}

const BackgroundForm: React.FC<BackgroundFormProps> = ({
  background,
  onSave,
  onCancel,
  projectId
}) => {
  const [formData, setFormData] = useState<Background>(() => {
    return (
      background || {
        id: '',
        type: BackgroundType.Story,
        projectId,
        dbId: crypto.randomUUID()
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'images'>('basic')
  const [mainImage, setMainImage] = useState<Blob | undefined>(undefined)
  const [thumbnailImage, setThumbnailImage] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    if (!background || !projectId || !background.id) return

    let isMounted = true

    const loadBackgroundImages = async () => {
      try {
        const images = await DatabaseService.getBackgroundImages(projectId, background.dbId)
        if (isMounted) {
          setMainImage(images.find((img) => img.type === 'main')?.imageBlob)
          setThumbnailImage(images.find((img) => img.type === 'thumbnail')?.imageBlob)
        }
      } catch (error) {
        console.error('Failed to load background images:', error)
      }
    }

    loadBackgroundImages()

    return () => {
      isMounted = false
    }
  }, [background, projectId, background?.dbId])

  const validateForm = (): string[] => {
    const newErrors: string[] = []

    if (!formData.id) newErrors.push('Background ID is required')
    if (!/^[a-zA-Z0-9_]+$/.test(formData.id))
      newErrors.push('Background ID can only contain letters, numbers, and underscores')

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
      if (mainImage) {
        await DatabaseService.upsertBackgroundImage(projectId, {
          id: `${formData.dbId}_main`,
          backgroundDbId: formData.dbId,
          type: 'main',
          imageBlob: mainImage,
          projectId
        })
      }
      if (thumbnailImage) {
        await DatabaseService.upsertBackgroundImage(projectId, {
          id: `${formData.dbId}_thumbnail`,
          backgroundDbId: formData.dbId,
          type: 'thumbnail',
          imageBlob: thumbnailImage,
          projectId
        })
      }
    }
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
        <ModalHeader onClose={onCancel}>
          {background ? 'Edit Background' : 'Create New Background'}
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
            { id: 'images', label: 'Images' }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'images')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} updateFormData={updateFormData} />
          )}
          {activeTab === 'images' && (
            <ArtworkTab
              mainImage={mainImage}
              thumbnailImage={thumbnailImage}
              setMainImage={setMainImage}
              setThumbnailImage={setThumbnailImage}
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
            Save Background
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default BackgroundForm
