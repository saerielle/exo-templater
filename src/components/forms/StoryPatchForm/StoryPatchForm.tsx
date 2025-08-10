'use client'

import { Save } from 'lucide-react'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

import { StoryPatch, StoryPatchType } from '../../../lib/exoloader'
import ModalFooter from '../../ui/ModalFooter'
import ModalHeader from '../../ui/ModalHeader'
import ModalOverlay from '../../ui/ModalOverlay'
import ModalPanel from '../../ui/ModalPanel'
import { TabBar, TabButton } from '../../ui/TabBar'
import BasicTab from './BasicTab'
import InsertTab from './InsertTab'
import ReplaceTab from './ReplaceTab'

interface StoryPatchFormProps {
  storyPatch?: StoryPatch
  onSave: (patch: StoryPatch) => void
  onCancel: () => void
  projectId: string
  initialFile?: string
  initialCategory?: string
}

const defaultPatch: Partial<StoryPatch> = {
  type: StoryPatchType.Insert,
  body: '',
  description: ''
}

const StoryPatchForm: React.FC<StoryPatchFormProps> = ({
  storyPatch,
  onSave,
  onCancel,
  projectId,
  initialFile,
  initialCategory
}) => {
  const [form, setForm] = useState<Partial<StoryPatch>>(
    storyPatch || {
      ...defaultPatch,
      dbId: crypto.randomUUID(),
      file: initialFile,
      category: initialCategory
    }
  )

  const [activeTab, setActiveTab] = useState<'basic' | 'insert' | 'replace'>('basic')

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!form.type || !form.storyId || !form.body) return

    const id = form.id || `${form.storyId}-${form.type}-${Date.now()}`
    const dbId = form.dbId || id
    let patch: StoryPatch
    if (form.type === StoryPatchType.Insert) {
      patch = {
        ...(form as any),
        id,
        dbId,
        projectId,
        type: StoryPatchType.Insert,
        locationKey: (form as any).locationKey || '',
        locationIndex: (form as any).locationIndex ?? 0
      }
    } else {
      patch = {
        ...(form as any),
        id,
        dbId,
        projectId,
        type: StoryPatchType.Replace,
        startKey: (form as any).startKey || '',
        endKey: (form as any).endKey || '',
        startIndex: (form as any).startIndex ?? 0,
        endIndex: (form as any).endIndex ?? 0
      }
    }
    onSave(patch)
  }

  const getVisibleTabs = () => {
    const tabs = [{ id: 'basic', label: 'Basic Info' }]

    if (form.type === StoryPatchType.Insert) {
      tabs.push({ id: 'insert', label: 'Insert Settings' })
    } else if (form.type === StoryPatchType.Replace) {
      tabs.push({ id: 'replace', label: 'Replace Settings' })
    }

    return tabs
  }

  const visibleTabs = getVisibleTabs()

  React.useEffect(() => {
    if (form.type === StoryPatchType.Insert && activeTab === 'replace') {
      setActiveTab('insert')
    } else if (form.type === StoryPatchType.Replace && activeTab === 'insert') {
      setActiveTab('replace')
    }
  }, [form.type, activeTab])

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader onClose={onCancel}>
          {storyPatch ? 'Edit Story Patch' : 'Add Story Patch'}
        </ModalHeader>
        <TabBar>
          {visibleTabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as 'basic' | 'insert' | 'replace')}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && <BasicTab formData={form} updateFormData={handleChange} />}
          {activeTab === 'insert' && form.type === StoryPatchType.Insert && (
            <InsertTab formData={form} updateFormData={handleChange} />
          )}
          {activeTab === 'replace' && form.type === StoryPatchType.Replace && (
            <ReplaceTab formData={form} updateFormData={handleChange} />
          )}
        </div>
        <ModalFooter>
          <Button onClick={onCancel} className="modal-action-btn">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.type || !form.storyId || !form.body}
            className="modal-action-btn modal-action-btn--primary flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Patch
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  )
}

export default StoryPatchForm
