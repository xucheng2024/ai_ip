'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { generateFileHash } from '@/lib/utils/hash'
import HashDisplay from '@/components/HashDisplay'

interface VerificationResult {
  exists: boolean
  matches: boolean
  certification: any
  video: any
  metadata: any
}

function VerifyPageContent() {
  const searchParams = useSearchParams()
  const [certificationId, setCertificationId] = useState(searchParams.get('id') || '')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (certificationId) {
      handleVerifyById()
    }
  }, [certificationId])

  const handleVerifyById = async () => {
    if (!certificationId.trim()) {
      setError('Please enter a certification ID')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const supabase = createClient()
      const { data: certification, error: certError } = await supabase
        .from('certifications')
        .select(
          `
          *,
          videos (
            *,
            creation_metadata (*)
          )
        `
        )
        .eq('id', certificationId)
        .eq('status', 'valid')
        .single()

      if (certError || !certification) {
        setResult({
          exists: false,
          matches: false,
          certification: null,
          video: null,
          metadata: null,
        })
        return
      }

      setResult({
        exists: true,
        matches: true,
        certification,
        video: certification.videos,
        metadata: certification.videos?.creation_metadata?.[0] || null,
      })
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyByFile = async () => {
    if (!file) {
      setError('Please select a video file')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const fileHash = await generateFileHash(file)
      const supabase = createClient()

      const { data: videos, error: videoError } = await supabase
        .from('videos')
        .select(
          `
          *,
          certifications (*),
          creation_metadata (*)
        `
        )
        .eq('file_hash', fileHash)

      if (videoError || !videos || videos.length === 0) {
        setResult({
          exists: false,
          matches: false,
          certification: null,
          video: null,
          metadata: null,
        })
        return
      }

      const video = videos[0]
      const certification = video.certifications?.[0]

      setResult({
        exists: true,
        matches: true,
        certification,
        video,
        metadata: video.creation_metadata?.[0] || null,
      })
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Verify Authorship Evidence</h1>
          <p className="mt-2 text-sm text-gray-500">
            Public verification - No login required
          </p>
        </div>

        <div className="space-y-6">
          {/* Verify by ID */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Verify by Certification ID</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={certificationId}
                onChange={(e) => setCertificationId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyById()}
                placeholder="Enter Certification ID (e.g., AIV-1234567890-abc123)"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-sm"
              />
              <button
                onClick={handleVerifyById}
                disabled={loading || !certificationId.trim()}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Verify by File */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Verify by Video File</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 transition-colors hover:file:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <button
                onClick={handleVerifyByFile}
                disabled={loading || !file}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <svg className="mx-auto h-12 w-12 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-600">Verifying certification...</p>
            </div>
          )}

          {result && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-sm font-semibold text-gray-900">Verification Result</h2>
              {result.exists ? (
                <div className="space-y-6">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="ml-2 text-sm font-semibold text-green-800">
                        Authorship Evidence Verified
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Certification ID</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{result.certification?.id}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Video Title</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{result.video?.title}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Certified At</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {format(new Date(result.certification?.timestamp_utc), 'PPp')}
                      </p>
                    </div>
                    {result.metadata?.ai_tool && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">AI Tool</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900 capitalize">{result.metadata.ai_tool}</p>
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">Content Fingerprint</p>
                    <HashDisplay hash={result.video?.file_hash || ''} />
                  </div>
                  <div className="pt-2">
                    <a
                      href={`/certificate/${result.certification?.id}`}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Full Certificate
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-yellow-800">
                        No certification found
                      </p>
                      <p className="mt-1 text-sm text-yellow-700">
                        This video may not be certified, or the certification ID/file is incorrect.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-xs leading-relaxed text-gray-600">
              <strong className="font-semibold text-gray-900">Note:</strong> This platform provides creation time and content consistency proof (Authorship Evidence). 
              It does not constitute government copyright registration or legal judgment. 
              <strong className="font-semibold"> This platform does not judge the legality of infringement.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  )
}
