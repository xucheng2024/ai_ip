import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import CertificatePDFWrapper from '@/components/CertificatePDFWrapper'
import Link from 'next/link'

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
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
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Certification Certificate</h1>
            <p className="mt-2 text-base text-gray-600">
              AI Video Originality Certification
            </p>
          </div>

          <div className="space-y-6 border-t border-gray-200 pt-6">
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
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">File Hash</p>
                <p className="mt-2 break-all font-mono text-xs text-gray-600">
                  {video?.file_hash}
                </p>
              </div>
            </div>

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

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs leading-relaxed text-yellow-800">
                <strong className="font-semibold">Legal Disclaimer:</strong> This service provides creation time and content
                consistency proof. It does not constitute government copyright registration or legal
                judgment. This platform does not judge the legality of infringement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
