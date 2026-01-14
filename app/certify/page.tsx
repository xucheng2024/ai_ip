'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateFileHash } from '@/lib/utils/hash'
import { extractVideoMetadata } from '@/lib/utils/video'
import { isCompressionSupported, type CompressionOptions } from '@/lib/utils/video-compress'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import VideoUploadSection from '@/components/certify/VideoUploadSection'
import VideoMetadataForm from '@/components/certify/VideoMetadataForm'
import LegalAgreementSection from '@/components/certify/LegalAgreementSection'
import AuthModal from '@/components/AuthModal'

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
  const [compressing, setCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [enableCompression, setEnableCompression] = useState(true) // Default enabled
  const [compressionQuality, setCompressionQuality] = useState<CompressionOptions['quality']>('lossless') // Default lossless
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)
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

    // Check if user is logged in
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Show auth modal instead of throwing error
      setPendingSubmit(true)
      setShowAuthModal(true)
      return
    }

    // User is logged in, proceed with certification
    await proceedWithCertification()
  }

  const proceedWithCertification = async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error(t.certify.loginFirst)
      }

      // Check usage limits (user will be created by API if missing)
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      // If userProfile doesn't exist, API route will create it
      // Just check limit if profile exists
      if (
        userProfile &&
        userProfile.monthly_certifications_used >= userProfile.monthly_certifications_limit
      ) {
        throw new Error(t.certify.limitReached)
      }

      // Compress video if enabled and supported
      let videoFile = file
      if (enableCompression && isCompressionSupported() && file) {
        try {
          setCompressing(true)
          setCompressionProgress(0)
          
          // Dynamically import the compression module
          const videoCompressModule = await import('@/lib/utils/video-compress')
          const compress = videoCompressModule.compressVideo
          
          videoFile = await compress(file, {
            quality: compressionQuality,
            format: 'mp4',
            onProgress: (progress) => {
              setCompressionProgress(progress)
            },
          })
          
          setCompressionProgress(100)
          setCompressing(false)
        } catch (compressionError) {
          console.error('Video compression failed:', compressionError)
          setCompressing(false)
          setCompressionProgress(0)
          // Continue with original file if compression fails
          videoFile = file
        }
      }

      // Ensure we have a valid video file
      if (!videoFile) {
        throw new Error('No video file available for certification')
      }

      // Generate file hash (use compressed file if available)
      const fileHash = await generateFileHash(videoFile)

      // Extract video metadata (frames, audio) - use compressed file
      let frameHash: string | null = null
      let audioHash: string | null = null
      let duration: number | null = null

      try {
        const metadata = await extractVideoMetadata(videoFile)
        frameHash = metadata.frameHash
        audioHash = metadata.audioHash
        duration = metadata.duration
      } catch (metadataError) {
        console.warn('Video metadata extraction failed:', metadataError)
        // Continue without frame/audio hashes
      }

      // Use enhanced certification API
      const formData = new FormData()
      formData.append('file', videoFile)
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
      setError(err.message || t.errors.generic)
      setLoading(false)
    }
  }

  const handleAuthSuccess = async () => {
    // After successful login/signup, proceed with certification if pending
    if (pendingSubmit) {
      setPendingSubmit(false)
      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 500))
      await proceedWithCertification()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.certify.title}</h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {t.certify.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-7 lg:p-9 shadow-lg">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <VideoUploadSection
            file={file}
            isDragging={isDragging}
            enableCompression={enableCompression}
            compressionQuality={compressionQuality}
            compressing={compressing}
            compressionProgress={compressionProgress}
            onFileChange={handleFileChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveFile={() => setFile(null)}
            onToggleCompression={() => setEnableCompression(!enableCompression)}
            onCompressionQualityChange={setCompressionQuality}
          />

          {/* Video Metadata Form */}
          <VideoMetadataForm
            title={title}
            creatorName={creatorName}
            aiTool={aiTool}
            prompt={prompt}
            promptPrivate={promptPrivate}
            hasThirdPartyMaterials={hasThirdPartyMaterials}
            onTitleChange={setTitle}
            onCreatorNameChange={setCreatorName}
            onAiToolChange={setAiTool}
            onPromptChange={setPrompt}
            onPromptPrivateChange={setPromptPrivate}
            onThirdPartyMaterialsChange={setHasThirdPartyMaterials}
          />

          {/* Legal Agreement */}
          <LegalAgreementSection
            legalAgreement={legalAgreement}
            onLegalAgreementChange={setLegalAgreement}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t.common.cancel}
            </Link>
            <button
              type="submit"
              disabled={loading || compressing}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {(loading || compressing) ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {compressing ? t.certify.compressing : t.certify.processing}
                </>
              ) : (
                t.certify.certifyVideo
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          setPendingSubmit(false)
        }}
        onSuccess={handleAuthSuccess}
        initialMode="login"
      />
    </div>
  )
}
