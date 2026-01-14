'use client'

import { useI18n } from '@/lib/i18n/context'
import { format } from 'date-fns'

interface SummaryCardProps {
  creator: string
  certifiedDate: Date
  verificationStatus: string
  evidenceStatus: {
    label: string
    status: string
  }
}

export default function SummaryCard({ creator, certifiedDate, verificationStatus, evidenceStatus }: SummaryCardProps) {
  const { t } = useI18n()

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        {t.certificate.summary || 'Summary'}
      </h3>
      <div className="space-y-3">
        <div className="flex items-start justify-between border-b border-gray-200 pb-3">
          <span className="text-xs font-medium text-gray-500">
            {t.certificate.creator || 'Creator'}:
          </span>
          <span className="text-sm font-semibold text-gray-900 text-right">
            {creator}
          </span>
        </div>
        <div className="flex items-start justify-between border-b border-gray-200 pb-3">
          <span className="text-xs font-medium text-gray-500">
            {t.certificate.certifiedOn || 'Certified on'}:
          </span>
          <span className="text-sm font-semibold text-gray-900 text-right">
            {format(certifiedDate, 'MMM d, yyyy')} · {format(certifiedDate, 'HH:mm')} UTC
          </span>
        </div>
        <div className="flex items-start justify-between border-b border-gray-200 pb-3">
          <span className="text-xs font-medium text-gray-500">
            {t.certificate.verification || 'Verification'}:
          </span>
          <span className="text-sm font-semibold text-gray-900 text-right">
            {verificationStatus}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-gray-500">
            {t.certificate.status || 'Status'}:
          </span>
          <span className="text-sm font-semibold text-gray-900 text-right">
            {evidenceStatus.status}
          </span>
        </div>
      </div>
    </div>
  )
}
