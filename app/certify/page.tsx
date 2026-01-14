'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateFileHash } from '@/lib/utils/hash'
import { extractVideoMetadata } from '@/lib/utils/video'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export default function CertifyPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [aiTool, setAiTool] = useState('')
  const [prompt, setPrompt] = useState('')
  const [promptPrivate, setPromptPrivate] = useState(false)
  const [hasThirdPartyMaterials, setHasThirdPartyMaterials] = useState(false)
  const [legalAgreement, setLegalAgreement] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile)
        setError('')
        if (!title) {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        setError(t.certify.selectVideoFile)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0]
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile)
        setError('')
        if (!title) {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        setError(t.certify.selectVideoFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError(t.certify.selectVideoFile)
      return
    }

    if (!legalAgreement) {
      setError(t.certify.agreeToTerms)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error(t.certify.loginFirst)
      }

      // Check usage limits
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (
        userProfile &&
        userProfile.monthly_certifications_used >= userProfile.monthly_certifications_limit
      ) {
        throw new Error(t.certify.limitReached)
      }

      // Generate file hash
      const fileHash = await generateFileHash(file)

      // Extract video metadata (frames, audio)
      let frameHash: string | null = null
      let audioHash: string | null = null
      let duration: number | null = null

      try {
        const metadata = await extractVideoMetadata(file)
        frameHash = metadata.frameHash
        audioHash = metadata.audioHash
        duration = metadata.duration
      } catch (metadataError) {
        console.warn('Video metadata extraction failed:', metadataError)
        // Continue without frame/audio hashes
      }

      // Use enhanced certification API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title || file.name)
      formData.append('fileHash', fileHash)
      if (frameHash) formData.append('frameHash', frameHash)
      if (audioHash) formData.append('audioHash', audioHash)
      if (duration) formData.append('duration', duration.toString())
      if (aiTool) formData.append('aiTool', aiTool)
      if (prompt) formData.append('prompt', prompt)
      formData.append('promptPrivate', promptPrivate.toString())
      formData.append('hasThirdPartyMaterials', hasThirdPartyMaterials.toString())

      const response = await fetch('/api/certify', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Certification failed')
      }

      router.push(`/certificate/${result.certificationId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to certify video')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t.certify.title}</h1>
          <p className="mt-2 text-base text-gray-600">
            {t.certify.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.certify.videoFile} <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {file ? (
                      <span className="block">{t.certify.changeVideoFile}</span>
                    ) : (
                      <span className="block">{t.certify.uploadOrDragDrop}</span>
                    )}
                  </label>
                  <p className="mt-1 text-xs text-gray-500">{t.certify.fileFormats}</p>
                </div>
              </div>
              {file && (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      {t.certify.remove}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
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
              onChange={(e) => setCreatorName(e.target.value)}
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
              onChange={(e) => setAiTool(e.target.value)}
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
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
              placeholder={t.certify.placeholderPrompt}
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="promptPrivate"
                checked={promptPrivate}
                onChange={(e) => setPromptPrivate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="promptPrivate" className="ml-2 text-sm text-gray-600">
                {t.certify.keepPromptPrivate}
              </label>
            </div>
          </div>

          {/* Third Party Materials */}
          <div className="flex items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
            <input
              type="checkbox"
              id="hasThirdPartyMaterials"
              checked={hasThirdPartyMaterials}
              onChange={(e) => setHasThirdPartyMaterials(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasThirdPartyMaterials" className="ml-3 text-sm text-gray-700">
              {t.certify.thirdPartyMaterials}
            </label>
          </div>

          {/* Legal Agreement */}
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="legalAgreement"
                required
                checked={legalAgreement}
                onChange={(e) => setLegalAgreement(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="legalAgreement" className="ml-3 text-sm leading-relaxed text-gray-700">
                {t.certify.legalAgreement} <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t.common.cancel}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.certify.processing}
                </>
              ) : (
                t.certify.certifyVideo
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
