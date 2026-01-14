'use client'

import { useI18n } from '@/lib/i18n/context'

interface VideoMetadataFormProps {
  title: string
  creatorName: string
  aiTool: string
  prompt: string
  promptPrivate: boolean
  hasThirdPartyMaterials: boolean
  onTitleChange: (value: string) => void
  onCreatorNameChange: (value: string) => void
  onAiToolChange: (value: string) => void
  onPromptChange: (value: string) => void
  onPromptPrivateChange: (checked: boolean) => void
  onThirdPartyMaterialsChange: (checked: boolean) => void
}

export default function VideoMetadataForm({
  title,
  creatorName,
  aiTool,
  prompt,
  promptPrivate,
  hasThirdPartyMaterials,
  onTitleChange,
  onCreatorNameChange,
  onAiToolChange,
  onPromptChange,
  onPromptPrivateChange,
  onThirdPartyMaterialsChange,
}: VideoMetadataFormProps) {
  const { t } = useI18n()

  return (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          {t.certify.videoTitle} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
          placeholder={t.certify.placeholderTitle}
        />
      </div>

      {/* Creator Name */}
      <div>
        <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700">
          {t.certify.creatorName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="creatorName"
          required
          value={creatorName}
          onChange={(e) => onCreatorNameChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
          placeholder={t.certify.placeholderCreator}
        />
      </div>

      {/* AI Tool */}
      <div>
        <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700">
          {t.certify.aiTool} <span className="text-gray-400">{t.certify.aiToolOptional}</span>
        </label>
        <select
          id="aiTool"
          value={aiTool}
          onChange={(e) => onAiToolChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
        >
          <option value="">{t.certify.selectAITool}</option>
          <option value="runway">{t.certify.aiToolRunway}</option>
          <option value="pika">{t.certify.aiToolPika}</option>
          <option value="sora">{t.certify.aiToolSora}</option>
          <option value="other">{t.certify.aiToolOther}</option>
        </select>
      </div>

      {/* Prompt */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          {t.certify.prompt} <span className="text-gray-400">{t.certify.promptOptional}</span>
        </label>
        <textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
          placeholder={t.certify.placeholderPrompt}
        />
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="promptPrivate"
            checked={promptPrivate}
            onChange={(e) => onPromptPrivateChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="promptPrivate" className="ml-2 text-sm text-gray-600">
            {t.certify.keepPromptPrivate}
          </label>
        </div>
      </div>

      {/* Third Party Materials */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="hasThirdPartyMaterials"
            checked={hasThirdPartyMaterials}
            onChange={(e) => onThirdPartyMaterialsChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label 
            htmlFor="hasThirdPartyMaterials" 
            className="ml-3 text-sm text-gray-700 cursor-pointer"
            title={t.certify.thirdPartyMaterialsTooltip}
          >
            {t.certify.thirdPartyMaterials}
            {t.certify.thirdPartyMaterialsTooltip && (
              <span className="ml-2 text-xs text-gray-500">(ℹ️ {t.certify.thirdPartyMaterialsTooltip})</span>
            )}
          </label>
        </div>
        {hasThirdPartyMaterials && t.certify.thirdPartyMaterialsWarning && (
          <p className="mt-2 text-xs font-medium text-amber-800 bg-amber-100 rounded p-2 border border-amber-300">
            ⚠️ {t.certify.thirdPartyMaterialsWarning}
          </p>
        )}
      </div>
    </>
  )
}
