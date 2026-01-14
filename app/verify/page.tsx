'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { generateFileHash } from '@/lib/utils/hash'
import HashDisplay from '@/components/HashDisplay'
import EvidenceStatusBadge from '@/components/EvidenceStatusBadge'
import { getEvidenceStatus } from '@/lib/utils/evidence'
import { useI18n } from '@/lib/i18n/context'

interface VerificationResult {
  exists: boolean
  matches: boolean
  certification: any
  video: any
  metadata: any
  batchStatus?: string | null
}

function VerifyPageContent() {
  const { t } = useI18n()
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
      setError(t.verify.pleaseEnterCertId)
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

      // Get batch status if available
      let batchStatus: string | null = null
      if (certification.merkle_batch_id) {
        const { data: batch } = await supabase
          .from('merkle_batches')
          .select('status')
          .eq('id', certification.merkle_batch_id)
          .single()
        batchStatus = batch?.status || null
      }

      setResult({
        exists: true,
        matches: certification.status === 'valid',
        certification,
        video: certification.videos,
        metadata: certification.videos?.creation_metadata?.[0] || null,
        batchStatus,
      })
    } catch (err: any) {
      setError(err.message || t.errors.generic)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyByFile = async () => {
    if (!file) {
      setError(t.verify.pleaseSelectFile)
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
      setError(err.message || t.errors.generic)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-12 text-center animate-fade-in">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-200/80 bg-white shadow-sm">
            <svg className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.verify.title}</h1>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {t.verify.subtitle}
          </p>
          {t.verify.whoUsesThis && (
            <p className="mt-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-block">
              {t.verify.whoUsesThis}
            </p>
          )}
        </div>

        <div className="space-y-6 sm:space-y-7">
          {/* Verify by ID */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-gray-900">{t.verify.verifyByIdTitle || t.verify.verifyById}</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={certificationId}
                onChange={(e) => setCertificationId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyById()}
                placeholder={t.verify.enterCertId}
                className="flex-1 rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
              />
              <button
                onClick={handleVerifyById}
                disabled={loading || !certificationId.trim()}
                className="flex-shrink-0 self-start rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.verify.verify}
              </button>
            </div>
          </div>

          {/* Verify by File */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-gray-900">{t.verify.verifyByFileTitle || t.verify.verifyByFile}</h2>
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
                    {t.verify.selectedFile} {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <button
                onClick={handleVerifyByFile}
                disabled={loading || !file}
                className="flex-shrink-0 self-start rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.verify.verify}
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
              <p className="mt-4 text-sm font-medium text-gray-600">{t.verify.verifyingCertification}</p>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-sm animate-fade-in">
              <h2 className="mb-7 text-sm font-semibold text-gray-900">{t.verify.verificationResult}</h2>
              {result.exists ? (
                <div className="space-y-7">
                  <div className="rounded-xl border border-green-200/80 bg-green-50/80 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="ml-2 text-sm font-semibold text-green-800">
                          {t.verify.authorshipEvidenceVerified}
                        </p>
                      </div>
                      {result.certification && (
                        <EvidenceStatusBadge 
                          status={getEvidenceStatus(result.certification, result.batchStatus)} 
                        />
                      )}
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm text-green-800">
                      <p className="font-medium">✅ {t.verify.verificationSuccess}</p>
                      {result.certification?.timestamp_utc && (
                        <p>{t.verify.verificationSuccessCreated} {format(new Date(result.certification.timestamp_utc), 'PPp')}</p>
                      )}
                      {result.batchStatus === 'anchored' && t.verify.verificationSuccessAnchored && (
                        <p className="text-xs text-green-700">{t.verify.verificationSuccessAnchored}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.verify.certId}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{result.certification?.id}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.verify.videoTitle}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{result.video?.title}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.verify.certificationRecordTime || t.verify.certifiedAt}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {format(new Date(result.certification?.timestamp_utc), 'PPp')}
                      </p>
                    </div>
                    {result.metadata?.ai_tool && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.verify.aiTool}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900 capitalize">{result.metadata.ai_tool}</p>
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">{t.verify.contentFingerprint}</p>
                    {t.verify.contentFingerprintDesc && (
                      <p className="text-xs text-gray-600 mb-3">{t.verify.contentFingerprintDesc}</p>
                    )}
                    <HashDisplay hash={result.video?.file_hash || ''} />
                  </div>
                  <div className="pt-2">
                    <a
                      href={`/certificate/${result.certification?.id}`}
                      className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                    >
                      {t.verify.viewFullCertificate}
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
                        {t.verify.notFound}
                      </p>
                      <p className="mt-1 text-sm text-yellow-700">
                        {t.verify.notFoundDesc}
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
              {t.verify.legalNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}
