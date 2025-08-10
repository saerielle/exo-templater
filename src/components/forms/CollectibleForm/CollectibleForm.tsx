'use client'

import { set } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { DatabaseService } from '../../../lib/database'
import { Collectible, HowGet, validateCardId } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import AbilitiesTab from './AbilitiesTab'
import ArtworkTab from './ArtworkTab'
import BasicTab from './BasicTab'

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'abilities', label: 'Abilities' },
  { id: 'artwork', label: 'Artwork' }
]

interface CollectibleFormProps {
  collectible?: Collectible
  onSave: (collectible: Collectible) => void
  onCancel: () => void
  projectId: string
}

const CollectibleForm: React.FC<CollectibleFormProps> = ({
  collectible,
  onSave,
  onCancel,
  projectId
}) => {
  const [formData, setFormData] = useState<Collectible>(() => {
    return (
      collectible || {
        id: '',
        dbId: crypto.randomUUID(),
        name: '',
        plural: '',
        howGet: HowGet.None,
        like: ['sym'], // Sym likes everything by default
        dislike: [],
        artistName: '',
        artistSocialAt: '',
        artistLink: '',
        projectId,
        severity: 0
      }
    )
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'abilities' | 'artwork'>('basic')
  const [collectibleImage, setCollectibleImage] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    if (!collectible || !collectible.dbId) return
    ;(async () => {
      const image = await DatabaseService.getEntityImage(collectible.dbId)
      setCollectibleImage(image?.imageBlob)
    })()
  }, [collectible, collectible?.dbId])

  const validateForm = async (): Promise<string[]> => {
    const newErrors: string[] = []
    newErrors.push(...validateCardId(formData.id))
    if (!formData.name) newErrors.push('Name is required')
    if (!formData.plural) newErrors.push('Plural name is required')
    if (
      (formData.howGet.startsWith('shop') || formData.howGet === HowGet.TrainingBuy) &&
      (!formData.kudos || formData.kudos <= 0)
    ) {
      newErrors.push('Kudos cost is required for purchasable collectibles')
    }

    // check if card id already exists in project (they share ids with collectibles)
    const existingCard = await DatabaseService.getCard(projectId, formData.id)
    if (existingCard && existingCard.dbId !== collectible?.dbId)
      newErrors.push('Card ID already exists in project')

    // check if collectible id already exists in the project
    const existingCollectible = await DatabaseService.getCollectible(projectId, formData.id)
    if (existingCollectible && existingCollectible.dbId !== collectible?.dbId)
      newErrors.push('Collectible ID already exists in project')

    return newErrors
  }

  const handleSave = async () => {
    const validationErrors = await validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    await onSave(formData)
    if (formData.dbId && collectibleImage) {
      await DatabaseService.addEntityImage(projectId, {
        id: `${formData.dbId}`,
        entityId: formData.id,
        entityDbId: formData.dbId,
        entityType: 'collectible',
        imageBlob: collectibleImage,
        projectId
      })
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
          {collectible ? 'Edit Collectible' : 'Create New Collectible'}
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
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'abilities' | 'artwork')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab formData={formData} projectId={projectId} updateFormData={updateFormData} />
          )}
          {activeTab === 'abilities' && (
            <AbilitiesTab
              formData={formData}
              projectId={projectId}
              updateFormData={updateFormData}
            />
          )}
          {activeTab === 'artwork' && (
            <ArtworkTab
              formData={formData}
              projectId={projectId}
              updateFormData={updateFormData}
              image={collectibleImage}
              setImage={setCollectibleImage}
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
            Save Collectible
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default CollectibleForm
