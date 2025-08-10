'use client'

import { set } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { DatabaseService } from '../../../lib/database'
import { Card, validateCardId } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import AbilitiesTab from './AbilitiesTab'
import ArtworkTab from './ArtworkTab'
import BasicTab from './BasicTab'
import { defaultValue } from './utils'

interface CardFormProps {
  card?: Card
  onSave: (card: Card) => void
  onCancel: () => void
  projectId: string
}

const CardForm: React.FC<CardFormProps> = ({ card, onSave, onCancel, projectId }) => {
  const [formData, setFormData] = useState<Card>(() => {
    return card || defaultValue(projectId)
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'abilities' | 'artwork'>('basic')
  const [cardImage, setCardImage] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    if (!card || !card.dbId) return

    let isMounted = true

    const loadCardImage = async () => {
      try {
        const image = await DatabaseService.getEntityImage(card.dbId)
        if (isMounted) {
          setCardImage(image?.imageBlob)
        }
      } catch (error) {
        console.error('Failed to load card image:', error)
      }
    }

    loadCardImage()

    return () => {
      isMounted = false
    }
  }, [card, card?.dbId])

  const validateForm = async (): Promise<string[]> => {
    const newErrors: string[] = []
    newErrors.push(...validateCardId(formData.id))
    if (!formData.name) newErrors.push('Name is required')
    if (formData.level < 1 || formData.level > 4) newErrors.push('Level must be between 1 and 4')

    // check if card id already exists in project
    const existingCard = await DatabaseService.getCard(projectId, formData.id)
    if (existingCard && existingCard.dbId !== card?.dbId)
      newErrors.push('Card ID already exists in project')

    // check if collectible id already exists in the project (they share ids with cards)
    const existingCollectible = await DatabaseService.getCollectible(projectId, formData.id)
    if (existingCollectible && existingCollectible.dbId !== card?.dbId)
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
    if (formData.dbId && cardImage) {
      await DatabaseService.addEntityImage(projectId, {
        id: `${formData.id}`,
        entityId: formData.id,
        entityDbId: formData.dbId,
        entityType: 'card',
        imageBlob: cardImage,
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
        <ModalHeader onClose={onCancel}>{card ? 'Edit Card' : 'Create New Card'}</ModalHeader>
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
            { id: 'abilities', label: 'Abilities' },
            { id: 'artwork', label: 'Artwork' }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'abilities')}
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
              cardImage={cardImage}
              setCardImage={setCardImage}
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
            Save Card
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default CardForm
