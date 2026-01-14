'use client'

import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'

interface VerificationActionProps {
  verificationUrl: string
}

export default function VerificationAction({ verificationUrl }: VerificationActionProps) {
  const { t } = useI18n()
  
  // Extract certificate ID from URL (handle both full URLs and paths)
  const certId = verificationUrl.includes('/') 
    ? verificationUrl.split('/').pop() || verificationUrl
    : verificationUrl

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        {t.certificate.verifyThisCertificate || 'Verify This Certificate'}
      </h3>
      <p className="text-xs text-gray-600 mb-3">
        {t.certificate.publicVerificationLink || 'Public verification link'}
      </p>
      <div className="mb-3">
        <code className="block break-all rounded bg-white px-3 py-2 text-sm font-mono text-gray-800 border border-blue-200">
          {verificationUrl}
        </code>
      </div>
      <Link
        href={`/verify?id=${certId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
      >
        {t.certificate.verifyIndependently || 'Verify independently'}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
