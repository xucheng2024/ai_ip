'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateFileHash, generateCertificationId, generateHashFromString } from '@/lib/utils/hash'
import Link from 'next/link'

export default function CertifyPage() {
  const router = useRouter()
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile)
        if (!title) {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        setError('Please select a video file')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select a video file')
      return
    }

    if (!legalAgreement) {
      setError('You must agree to the legal terms')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Please login first')
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
        throw new Error('Monthly certification limit reached. Please upgrade your plan.')
      }

      // Generate file hash
      const fileHash = await generateFileHash(file)

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('videos').getPublicUrl(fileName)

      // Create video record
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: title || file.name,
          original_filename: file.name,
          file_hash: fileHash,
          file_size: file.size,
          file_url: publicUrl,
        })
        .select()
        .single()

      if (videoError) throw videoError

      // Create creation metadata
      const promptHash = prompt ? generateHashFromString(prompt) : null
      const { error: metadataError } = await supabase.from('creation_metadata').insert({
        video_id: videoData.id,
        ai_tool: aiTool || null,
        prompt_hash: promptHash,
        prompt_plaintext: promptPrivate ? null : prompt || null,
        has_third_party_materials: hasThirdPartyMaterials,
      })

      if (metadataError) throw metadataError

      // Generate certification
      const certificationId = generateCertificationId()
      const verificationUrl = `${window.location.origin}/verify?id=${certificationId}`

      const { error: certError } = await supabase.from('certifications').insert({
        id: certificationId,
        video_id: videoData.id,
        timestamp_utc: new Date().toISOString(),
        verification_url: verificationUrl,
      })

      if (certError) throw certError

      // Update user usage
      await supabase
        .from('users')
        .update({
          monthly_certifications_used: (userProfile?.monthly_certifications_used || 0) + 1,
        })
        .eq('id', user.id)

      router.push(`/certificate/${certificationId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to certify video')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Certify Your Video</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload your AI video to get a trusted timestamp and certification
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Video File *</label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Video Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Creator Name */}
          <div>
            <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700">
              Creator Name / Account *
            </label>
            <input
              type="text"
              id="creatorName"
              required
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* AI Tool */}
          <div>
            <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700">
              AI Tool (Optional)
            </label>
            <select
              id="aiTool"
              value={aiTool}
              onChange={(e) => setAiTool(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select AI Tool</option>
              <option value="runway">Runway</option>
              <option value="pika">Pika</option>
              <option value="sora">Sora</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt (Optional)
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                Keep prompt private (store as hash only)
              </label>
            </div>
          </div>

          {/* Third Party Materials */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasThirdPartyMaterials"
              checked={hasThirdPartyMaterials}
              onChange={(e) => setHasThirdPartyMaterials(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasThirdPartyMaterials" className="ml-2 text-sm text-gray-600">
              This video contains third-party materials
            </label>
          </div>

          {/* Legal Agreement */}
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="legalAgreement"
                required
                checked={legalAgreement}
                onChange={(e) => setLegalAgreement(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="legalAgreement" className="ml-2 text-sm text-gray-700">
                I declare that this content is my legal creation. I understand that this platform
                provides creation time and content consistency proof, and does not constitute
                government copyright registration or legal judgment. The platform does not judge
                the legality of infringement. *
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Certify Video'}
            </button>
            <Link
              href="/dashboard"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
