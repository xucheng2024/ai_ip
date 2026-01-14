'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { generateFileHash } from '@/lib/utils/hash'

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify Certification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Verify a video certification by ID or upload a video file
          </p>
        </div>

        <div className="space-y-6">
          {/* Verify by ID */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Verify by Certification ID</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={certificationId}
                onChange={(e) => setCertificationId(e.target.value)}
                placeholder="Enter Certification ID (e.g., AIV-1234567890-abc123)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
              <button
                onClick={handleVerifyById}
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Verify by File */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Verify by Video File</h2>
            <div className="flex space-x-2">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={handleVerifyByFile}
                disabled={loading || !file}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-gray-600">Verifying...</p>
            </div>
          )}

          {result && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Verification Result</h2>
              {result.exists ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-800">
                      ✓ Certification Found and Verified
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Certification ID:</span>{' '}
                      <span className="text-gray-900">{result.certification?.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Video Title:</span>{' '}
                      <span className="text-gray-900">{result.video?.title}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Certified At:</span>{' '}
                      <span className="text-gray-900">
                        {format(new Date(result.certification?.timestamp_utc), 'PPp')}
                      </span>
                    </div>
                    {result.metadata?.ai_tool && (
                      <div>
                        <span className="font-medium text-gray-700">AI Tool:</span>{' '}
                        <span className="text-gray-900 capitalize">{result.metadata.ai_tool}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">File Hash:</span>{' '}
                      <span className="font-mono text-xs text-gray-600">
                        {result.video?.file_hash?.substring(0, 32)}...
                      </span>
                    </div>
                    <div className="pt-4">
                      <a
                        href={`/certificate/${result.certification?.id}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        View Full Certificate →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-yellow-50 p-4">
                  <p className="text-sm font-semibold text-yellow-800">
                    ⚠ No certification found for this ID or file
                  </p>
                  <p className="mt-2 text-sm text-yellow-700">
                    This video may not be certified, or the certification ID/file is incorrect.
                  </p>
                </div>
              )}
            </div>
          )}
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
