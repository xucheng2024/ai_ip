'use client'

import { useI18n } from '@/lib/i18n/context'

interface CertificationBadgeProps {
  certificationId: string
  certifiedDate: string
  verificationUrl: string
  embeddable?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function CertificationBadge({
  certificationId,
  certifiedDate,
  verificationUrl,
  embeddable = false,
  size = 'medium',
}: CertificationBadgeProps) {
  const { t } = useI18n()
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  }

  return (
    <a
      href={verificationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-all hover:bg-blue-100 hover:shadow-sm ${sizeClasses[size]}`}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-semibold">{t.certificate.verifiedByAIVerify || 'Verified by AIVerify'}</span>
        <span className="text-xs opacity-75">{t.certificate.certifiedOn || 'Certified on'} {certifiedDate}</span>
      </div>
    </a>
  )
}
