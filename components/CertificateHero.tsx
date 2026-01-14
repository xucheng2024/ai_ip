'use client'

import { useI18n } from '@/lib/i18n/context'
import EvidenceStatusBadge from './EvidenceStatusBadge'
import type { EvidenceStatus } from '@/lib/types'

interface CertificateHeroProps {
  evidenceStatus: EvidenceStatus
}

export default function CertificateHero({ evidenceStatus }: CertificateHeroProps) {
  const { t } = useI18n()

  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-sm">
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {t.certificate.heroTitle || 'This AI Video Has Verified Authorship Evidence'}
      </h1>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        {t.certificate.heroSubtitle || 'Creation time and content fingerprint independently verifiable'}
      </p>
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold">
              {t.certificate.heroStatusTitle || 'Authorship Evidence Verified'}
            </span>
            <span className="text-xs opacity-90">
              {t.certificate.heroStatusDesc || "This video's creation time and content fingerprint have been recorded and can be independently verified."}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
