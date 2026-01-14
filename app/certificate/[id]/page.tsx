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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Certification Certificate</h1>
            <p className="mt-2 text-sm text-gray-600">
              AI Video Originality Certification
            </p>
          </div>

          <div className="space-y-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Certification ID</p>
                <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
                  {certification.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Certified At</p>
                <p className="mt-1 text-lg text-gray-900">
                  {format(new Date(certification.timestamp_utc), 'PPp')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Video Title</p>
                <p className="mt-1 text-lg text-gray-900">{video?.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Creator</p>
                <p className="mt-1 text-lg text-gray-900">
                  {video?.users?.display_name || video?.users?.email || 'Anonymous'}
                </p>
              </div>
              {metadata?.ai_tool && (
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Tool</p>
                  <p className="mt-1 text-lg text-gray-900 capitalize">{metadata.ai_tool}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">File Hash</p>
                <p className="mt-1 font-mono text-xs text-gray-600 break-all">
                  {video?.file_hash}
                </p>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Verification URL</p>
              <p className="mt-1 break-all text-sm text-gray-600">
                {certification.verification_url}
              </p>
            </div>

            <div className="flex space-x-4">
              <CertificatePDFWrapper
                certification={certification}
                video={video}
                metadata={metadata}
              />
              <Link
                href={`/verify?id=${certification.id}`}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Verify Certificate
              </Link>
            </div>

            <div className="rounded-md bg-yellow-50 p-4">
              <p className="text-xs text-yellow-800">
                <strong>Legal Disclaimer:</strong> This service provides creation time and content
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
