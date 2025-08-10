'use client'

import { set as lodashSet, orderBy } from 'lodash-es'
import { Save } from 'lucide-react'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { DatabaseService } from '../../../lib/database'
import { Character } from '../../../lib/exoloader'
import Alert from '../../ui/Alert'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import AdvancedTab from './AdvancedTab'
import BasicsTab from './BasicsTab'
import SpritesTab from './CharacterSpritesTab'
import CustomAgingTab from './CustomAgingTab'
import DataOverrideTab from './DataOverrideTab'
import JsonImport from './JsonImport'
import PersonalityTab from './PersonalityTab'
import PositioningTab from './PositioningTab'
import { defaultFormData, validateForm } from './util'

interface CharacterFormProps {
  character?: Character
  onSave: (character: Character) => void
  onCancel: () => void
  projectId: string
}

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'personality', label: 'Personality' },
  { id: 'positioning', label: 'Positioning' },
  { id: 'sprites', label: 'Sprites' },
  { id: 'customAging', label: 'Custom Aging' },
  { id: 'dataOverride', label: 'Modifications' },
  { id: 'advanced', label: 'Advanced' }
]

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSave,
  onCancel,
  projectId
}) => {
  const [formData, setFormData] = useState<Character>(() => {
    return character || defaultFormData(projectId)
  })

  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<
    | 'basic'
    | 'personality'
    | 'positioning'
    | 'sprites'
    | 'customAging'
    | 'dataOverride'
    | 'advanced'
  >('basic')

  const [storySprites, setStorySprites] = useState<Record<string, Blob | undefined>>({})
  const [portraits, setPortraits] = useState<Record<string, Blob | undefined>>({})
  const [overworldSprites, setOverworldSprites] = useState<Record<string, Blob | undefined>>({})
  const [mainMenuSprite, setMainMenuSprite] = useState<Blob | undefined>(undefined)
  const [customAgeStages, setCustomAgeStages] = useState<number[]>([])

  const handleSave = async () => {
    const validationErrors = await validateForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    await onSave(formData)

    if (formData.dbId && projectId) {
      const existingStorySprites = await DatabaseService.getCharacterStorySprites(formData.dbId)
      const currentStorySpriteKeys = new Set(Object.keys(storySprites))

      for (const sprite of existingStorySprites) {
        const key = `${sprite.artStage ?? 0}_${sprite.expression}`
        if (!currentStorySpriteKeys.has(key)) {
          await DatabaseService.deleteCharacterStorySprite(sprite.id)
        }
      }

      for (const key in storySprites) {
        const [stage, expression] = key.split('_')
        await DatabaseService.upsertCharacterStorySprite(projectId, {
          id: crypto.randomUUID(),
          characterDbId: formData.dbId,
          characterId: formData.id,
          artStage: Number(stage),
          expression,
          imageBlob: storySprites[key],
          projectId
        })
      }

      const existingPortraits = await DatabaseService.getCharacterPortraits(formData.dbId)
      const currentPortraitKeys = new Set(Object.keys(portraits))

      for (const portrait of existingPortraits) {
        const key = `${portrait.artStage ?? 0}`
        if (!currentPortraitKeys.has(key)) {
          await DatabaseService.deleteCharacterPortrait(portrait.id)
        }
      }

      for (const key in portraits) {
        await DatabaseService.upsertCharacterPortrait(projectId, {
          id: crypto.randomUUID(),
          characterDbId: formData.dbId,
          characterId: formData.id,
          artStage: Number(key),
          imageBlob: portraits[key],
          projectId
        })
      }

      const existingOverworldSprites = await DatabaseService.getCharacterOverworldSprites(
        formData.dbId
      )
      const currentOverworldKeys = new Set(Object.keys(overworldSprites))

      for (const sprite of existingOverworldSprites) {
        const key = `${sprite.artStage ?? 0}`
        if (!currentOverworldKeys.has(key)) {
          await DatabaseService.deleteCharacterOverworldSprite(sprite.id)
        }
      }

      for (const key in overworldSprites) {
        await DatabaseService.upsertCharacterOverworldSprite(projectId, {
          id: crypto.randomUUID(),
          characterDbId: formData.dbId,
          characterId: formData.id,
          artStage: Number(key),
          imageBlob: overworldSprites[key],
          projectId
        })
      }

      if (mainMenuSprite) {
        await DatabaseService.upsertCharacterMainMenuSprite(projectId, {
          id: crypto.randomUUID(),
          characterDbId: formData.dbId,
          characterId: formData.id,
          imageBlob: mainMenuSprite,
          projectId
        })
      } else {
        const existingMainMenu = await DatabaseService.getCharacterMainMenuSprite(formData.dbId)
        if (existingMainMenu) {
          await DatabaseService.deleteCharacterMainMenuSprite(existingMainMenu.id)
        }
      }
    }
  }

  const updateStringField = (path: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev }
      lodashSet(newData, path, value)
      return newData
    })
  }
  const updateBooleanField = (path: string, value: boolean) => {
    setFormData((prev) => {
      const newData = { ...prev }
      lodashSet(newData, path, value)
      return newData
    })
  }
  const updateNumberField = (path: string, value: number) => {
    setFormData((prev) => {
      const newData = { ...prev }
      lodashSet(newData, path, value)
      return newData
    })
  }
  const updateArrayField = (path: string, value: unknown[]) => {
    setFormData((prev) => {
      const newData = { ...prev }
      lodashSet(newData, path, value)
      return newData
    })
  }
  const updateObjectField = (path: string, value: object) => {
    setFormData((prev) => {
      const newData = { ...prev }
      lodashSet(newData, path, value)
      return newData
    })
  }

  useEffect(() => {
    if (!character || !character.dbId) return

    let isMounted = true

    const loadCharacterImages = async () => {
      try {
        const storySpritesArr = await DatabaseService.getCharacterStorySprites(character.dbId)
        if (isMounted) {
          const storySpritesObj: Record<string, Blob | undefined> = {}
          for (const sprite of storySpritesArr) {
            const key = `${sprite.artStage ?? 0}_${sprite.expression}`
            storySpritesObj[key] = sprite.imageBlob
          }
          setStorySprites(storySpritesObj)
        }

        const portraitsArr = await DatabaseService.getCharacterPortraits(character.dbId)
        if (isMounted) {
          const portraitsObj: Record<string, Blob | undefined> = {}
          const portraitStages = []
          for (const portrait of portraitsArr) {
            const key = `${portrait.artStage ?? 0}`
            portraitsObj[key] = portrait.imageBlob
            portraitStages.push(portrait.artStage ?? 0)
          }
          portraitStages.sort((a, b) => a - b)
          setCustomAgeStages(portraitStages.filter((stage) => stage > 3))
          setPortraits(portraitsObj)
        }

        const overworldArr = await DatabaseService.getCharacterOverworldSprites(character.dbId)
        if (isMounted) {
          const overworldObj: Record<string, Blob | undefined> = {}
          for (const sprite of overworldArr) {
            const key = `${sprite.artStage ?? 0}`
            overworldObj[key] = sprite.imageBlob
          }
          setOverworldSprites(overworldObj)
        }

        const mainMenu = await DatabaseService.getCharacterMainMenuSprite(character.dbId)
        if (isMounted) {
          setMainMenuSprite(mainMenu?.imageBlob)
        }
      } catch (error) {
        console.error('Failed to load character images:', error)
      }
    }

    loadCharacterImages()

    return () => {
      isMounted = false
    }
  }, [character, character?.dbId])

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>
          {character ? 'Edit Character' : 'Create New Character'}
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
          {tabs.map((tab) =>
            (tab.id == 'personality' && !formData.love) ||
            (tab.id == 'advanced' && !formData.onMap) ||
            (tab.id == 'customAging' && !formData.ages) ? null : (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'basic'
                      | 'personality'
                      | 'positioning'
                      | 'sprites'
                      | 'dataOverride'
                      | 'advanced'
                  )
                }
              >
                {tab.label}
              </TabButton>
            )
          )}
        </TabBar>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicsTab
              formData={formData}
              projectId={projectId}
              updateStringField={updateStringField}
              updateNumberField={updateNumberField}
              updateBooleanField={updateBooleanField}
            />
          )}
          {activeTab === 'personality' && (
            <PersonalityTab
              formData={formData}
              projectId={projectId}
              updateArrayField={updateArrayField}
              updateStringField={updateStringField}
              updateNumberField={updateNumberField}
            />
          )}
          {activeTab === 'positioning' && (
            <PositioningTab
              formData={formData}
              projectId={projectId}
              updateStringField={updateStringField}
              updateObjectField={updateObjectField}
              setFormData={setFormData}
            />
          )}
          {activeTab === 'customAging' && (
            <CustomAgingTab
              formData={formData}
              projectId={projectId}
              updateArrayField={updateArrayField}
            />
          )}
          {activeTab === 'dataOverride' && (
            <DataOverrideTab
              formData={formData}
              projectId={projectId}
              updateArrayField={updateArrayField}
            />
          )}
          {activeTab === 'advanced' && (
            <AdvancedTab
              formData={formData}
              projectId={projectId}
              customAgeStages={customAgeStages}
              updateArrayField={updateArrayField}
              updateBooleanField={updateBooleanField}
              updateNumberField={updateNumberField}
              updateObjectField={updateObjectField}
            />
          )}
          {activeTab === 'sprites' && (
            <SpritesTab
              formData={formData}
              storySprites={storySprites}
              setStorySprites={setStorySprites}
              portraits={portraits}
              setPortraits={setPortraits}
              overworldSprites={overworldSprites}
              setOverworldSprites={setOverworldSprites}
              mainMenuSprite={mainMenuSprite}
              setMainMenuSprite={setMainMenuSprite}
              customAgeStages={customAgeStages}
              setCustomAgeStages={setCustomAgeStages}
            />
          )}
        </div>

        <ModalFooter>
          <div className="flex gap-4 w-full justify-between">
            <JsonImport projectId={projectId} setFormData={setFormData} />
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Button onClick={onCancel} className="modal-action-btn">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="modal-action-btn modal-action-btn--primary flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Character
                </Button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default CharacterForm
