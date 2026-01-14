import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import CertificatePDFWrapper from '@/components/CertificatePDFWrapper'
import HashDisplay from '@/components/HashDisplay'
import CreationTimeline from '@/components/CreationTimeline'
import CertificationBadge from '@/components/CertificationBadge'
import RevokeCertificateButton from '@/components/RevokeCertificateButton'
import ComplaintEvidencePackage from '@/components/ComplaintEvidencePackage'
import Link from 'next/link'

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: certification, error } = await supabase
    .from('certifications')
    .select(
      `
      *,
      videos (
        *,
        users (
          display_name,
          email
        ),
        creation_metadata (*)
      )
    `
    )
    .eq('id', id)
    .eq('status', 'valid')
    .single()

  if (error || !certification) {
    notFound()
  }

  const video = certification.videos as any
  const metadata = video?.creation_metadata?.[0] || null
  const isOwner = user && video?.user_id === user.id

  // Generate timeline events
  const videoCreatedAt = new Date(video?.created_at || certification.timestamp_utc)
  const certTimestamp = new Date(certification.timestamp_utc)
  const timeDiff = certTimestamp.getTime() - videoCreatedAt.getTime()
  
  const timelineEvents = [
    {
      time: format(videoCreatedAt, 'HH:mm:ss'),
      label: 'Video Uploaded',
      description: 'Video file received and processed',
      status: 'completed' as const,
    },
    {
      time: format(new Date(videoCreatedAt.getTime() + timeDiff * 0.3), 'HH:mm:ss'),
      label: 'Fingerprint Generated',
      description: 'Content hash calculated',
      status: 'completed' as const,
    },
    {
      time: format(new Date(videoCreatedAt.getTime() + timeDiff * 0.6), 'HH:mm:ss'),
      label: 'Timestamp Recorded',
      description: 'Trusted timestamp assigned',
      status: 'completed' as const,
    },
    {
      time: format(certTimestamp, 'HH:mm:ss'),
      label: 'Certification Complete',
      description: 'Certificate issued and verified',
      status: 'completed' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Authorship Evidence Certificate</h1>
            <p className="mt-2 text-base text-gray-600">
              Creation Proof & Content Fingerprint
            </p>
          </div>

          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Creation Timeline */}
            <CreationTimeline events={timelineEvents} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Certification ID</p>
                <p className="mt-2 font-mono text-base font-semibold text-gray-900 break-all">
                  {certification.id}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Certified At</p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {format(new Date(certification.timestamp_utc), 'PPp')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Video Title</p>
                <p className="mt-2 text-base font-semibold text-gray-900">{video?.title}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Creator</p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {video?.users?.display_name || video?.users?.email || 'Anonymous'}
                </p>
              </div>
              {metadata?.ai_tool && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">AI Tool</p>
                  <p className="mt-2 text-base font-semibold text-gray-900 capitalize">{metadata.ai_tool}</p>
                </div>
              )}
            </div>

            {/* Readable Hash Display */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">Content Fingerprint</p>
              <HashDisplay hash={video?.file_hash || ''} />
            </div>

            {metadata?.prompt_hash && !metadata?.prompt_plaintext && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-700 mb-2">Prompt Fingerprint (Zero-Knowledge)</p>
                <HashDisplay hash={metadata.prompt_hash} />
                <p className="mt-2 text-xs text-blue-600">
                  Prompt stored as hash only. Original content not accessible to maintain privacy.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Verification URL</p>
              <a
                href={certification.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {certification.verification_url}
              </a>
            </div>

            {/* Embeddable Badge */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">Embeddable Badge</p>
              <CertificationBadge
                certificationId={certification.id}
                certifiedDate={format(new Date(certification.timestamp_utc), 'yyyy-MM-dd')}
                verificationUrl={certification.verification_url}
                embeddable={true}
              />
              <p className="mt-3 text-xs text-gray-600">
                Copy this badge to embed on your website, Notion, or portfolio.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CertificatePDFWrapper
                certification={certification}
                video={video}
                metadata={metadata}
              />
              <Link
                href={`/verify?id=${certification.id}`}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Verify Certificate
              </Link>
            </div>

            {/* Complaint Evidence Package */}
            {isOwner && (
              <ComplaintEvidencePackage
                certification={certification}
                video={video}
                metadata={metadata}
              />
            )}

            {/* Revoke Certificate (only for owner) */}
            {isOwner && (
              <div className="border-t border-gray-200 pt-6">
                <RevokeCertificateButton certificationId={certification.id} />
              </div>
            )}

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs leading-relaxed text-yellow-800">
                <strong className="font-semibold">Legal Disclaimer:</strong> This service provides creation time and content
                consistency proof (Authorship Evidence). It does not constitute government copyright registration or legal
                judgment. <strong>This platform does not judge the legality of infringement.</strong> Users must declare that content is their legal creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
