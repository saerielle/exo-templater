'use client'

import { Editor as MonacoEditor } from '@monaco-editor/react'
import { Expand, Minimize2 } from 'lucide-react'
import * as monaco from 'monaco-editor'

import React, { useCallback, useState } from 'react'

const exoscriptLanguageConfig = {
  id: 'exoscript',
  extensions: ['.exo'],
  aliases: ['Exoscript', 'exoscript']
}

const exoscriptTokenProvider: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],

      [/^===\s+\w+.*===/, 'story-header'],

      [/^~disabled/, 'disabled'],

      [/~if\b/, 'conditional'],
      [/~ifd\b/, 'conditional'],
      [/~set\b/, 'setter'],
      [/~setif\b/, 'setter'],
      [/~callif\b/, 'setter'],
      [/~call\b/, 'function-call'],
      [/~call battle\b/, 'function-call'],

      [/^\s*\*+/, 'choice-marker'],
      [/^\s*=\s*\w+/, 'choice-id'],

      [/>+!?/, 'jump'],
      [/>>+/, 'jump'],

      [/^\s*-\s*$/, 'page-break'],

      [/\[if\b/, 'dynamic-text', '@dynamic'],
      [/\[else if\b/, 'dynamic-text'],
      [/\[else\b/, 'dynamic-text'],
      [/\[end\b/, 'dynamic-text'],
      [/\[\|\]/, 'dynamic-text'],

      [/\[=\w+\]/, 'variable-ref'],
      [/\[\w+\]/, 'placeholder'],

      [/[<>=!]+/, 'operator'],
      [/\+\+|--/, 'operator'],
      [/\|\||&&/, 'operator'],

      [/\b(var_|mem_|hog_|love_|skill_|story_|call_)\w+/, 'variable'],
      [
        /\b(age|season|month|location|job|chara|bg|left|right|midleft|midright|sprite)\b/,
        'property'
      ],

      [/\b(true|false)\b/, 'boolean'],
      [/\b\d+\b/, 'number'],
      [/"[^"]*"/, 'string'],
      // [/'[^']*'/, 'string'],

      [/\b(none|all|priority|random|first|once)\b/, 'keyword'],

      [/\b(pollen|quiet|dust|wet|glow)\b/, 'season'],
      [/\b(geoponics|command|creche|engineering)\b/, 'location']
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    dynamic: [
      [/\[endif\b/, 'dynamic-text', '@pop'],
      [/\[end\b/, 'dynamic-text', '@pop'],
      [/\]/, 'dynamic-text', '@pop'],
      [/[^\]]+/, 'dynamic-content']
    ]
  }
}

const exoscriptTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'story-header', foreground: 'FFD700', fontStyle: 'bold' },
    { token: 'disabled', foreground: '808080', fontStyle: 'italic' },
    { token: 'conditional', foreground: 'C586C0', fontStyle: 'bold' },
    { token: 'setter', foreground: '4EC9B0', fontStyle: 'bold' },
    { token: 'function-call', foreground: 'DCDCAA' },
    { token: 'choice-marker', foreground: 'F44747', fontStyle: 'bold' },
    { token: 'choice-id', foreground: '569CD6', fontStyle: 'bold' },
    { token: 'jump', foreground: 'FF6B6B', fontStyle: 'bold' },
    { token: 'page-break', foreground: '808080', fontStyle: 'bold' },
    { token: 'dynamic-text', foreground: 'CE9178' },
    { token: 'dynamic-content', foreground: 'D7BA7D' },
    { token: 'variable-ref', foreground: '9CDCFE' },
    { token: 'placeholder', foreground: 'B5CEA8' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'property', foreground: '4FC1FF' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'boolean', foreground: '569CD6' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'season', foreground: '4EC9B0' },
    { token: 'location', foreground: 'DCDCAA' }
  ],
  colors: {
    'editor.background': '#1e1e1e'
  }
}

interface EditorProps {
  value?: string
  onChange?: (value: string) => void
  height?: string | number
  width?: string | number
  className?: string
  expandable?: boolean
}

const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  height = 400,
  width = '100%',
  className = '',
  expandable = false
}) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value || '')
    },
    [onChange]
  )

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
      try {
        const languages = monacoInstance.languages.getLanguages()
        const isLanguageRegistered = languages.some((lang) => lang.id === 'exoscript')

        if (!isLanguageRegistered) {
          monacoInstance.languages.register(exoscriptLanguageConfig)

          monacoInstance.languages.setMonarchTokensProvider('exoscript', exoscriptTokenProvider)

          monacoInstance.languages.setLanguageConfiguration('exoscript', {
            comments: {
              lineComment: '//',
              blockComment: ['/*', '*/']
            },
            brackets: [
              ['[', ']'],
              ['(', ')']
            ],
            autoClosingPairs: [
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"' }
            ],
            surroundingPairs: [
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"' }
            ],
            folding: {
              markers: {
                start: new RegExp('^\\s*\\/\\*'),
                end: new RegExp('^\\s*\\*\\/')
              }
            }
          })
        }

        monacoInstance.editor.defineTheme('exoscript-dark', exoscriptTheme)

        monacoInstance.editor.setTheme('exoscript-dark')

        const model = editor.getModel()
        if (model) {
          monacoInstance.editor.setModelLanguage(model, 'exoscript')
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing Monaco editor:', error)
      }
    },
    []
  )

  const defaultOptions = {
    language: 'exoscript' as const,
    theme: 'exoscript-dark',
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    folding: true,
    tabSize: 4,
    insertSpaces: false
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!expandable) {
    return (
      <div className={className} style={{ width, height }}>
        <MonacoEditor
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={defaultOptions}
          height="100%"
          width="100%"
        />
      </div>
    )
  }

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Exoscript Editor</h3>
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Minimize2 size={16} />
              Collapse
            </button>
          </div>

          <div className="flex-1 p-4">
            <MonacoEditor
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                ...defaultOptions,
                minimap: { enabled: true },
                fontSize: 14,
                lineHeight: 20
              }}
              height="100%"
              width="100%"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative`} style={{ width, height }}>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-white bg-opacity-90 rounded border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          title="Expand editor to full screen"
        >
          <Expand size={12} />
          Expand
        </button>
      </div>

      <MonacoEditor
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        height="100%"
        width="100%"
      />
    </div>
  )
}

export default Editor
