'use client'

import { EvidenceStatus } from '@/lib/types'
import { useI18n } from '@/lib/i18n/context'

export interface EvidenceStatusBadgeProps {
  status: EvidenceStatus
  className?: string
}

export default function EvidenceStatusBadge({ status, className = '' }: EvidenceStatusBadgeProps) {
  const { t } = useI18n()
  
  const statusConfig = {
    certified: {
      label: t.evidenceStatus.certified,
      description: t.evidenceStatus.certifiedDesc,
      color: 'yellow',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    timestamped: {
      label: t.evidenceStatus.timestamped,
      description: t.evidenceStatus.timestampedDesc,
      color: 'green',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    anchored: {
      label: t.evidenceStatus.anchored,
      description: t.evidenceStatus.anchoredDesc,
      color: 'blue',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    revoked: {
      label: t.evidenceStatus.revoked,
      description: t.evidenceStatus.revokedDesc,
      color: 'black',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  }

  const config = statusConfig[status]
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    black: 'bg-gray-900 border-gray-900 text-white',
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 ${colorClasses[config.color]} ${className}`}>
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{config.label}</span>
        <span className="text-xs opacity-75">{config.description}</span>
      </div>
    </div>
  )
}
