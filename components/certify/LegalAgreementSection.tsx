'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface LegalAgreementSectionProps {
  legalAgreement: boolean
  onLegalAgreementChange: (checked: boolean) => void
}

export default function LegalAgreementSection({
  legalAgreement,
  onLegalAgreementChange,
}: LegalAgreementSectionProps) {
  const { t } = useI18n()
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false)

  return (
    <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start">
        <input
          type="checkbox"
          id="legalAgreement"
          required
          checked={legalAgreement}
          onChange={(e) => onLegalAgreementChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="legalAgreement" className="ml-3 text-sm leading-relaxed text-gray-700">
          {t.certify.legalAgreement} <span className="text-red-500">*</span>
        </label>
      </div>
      {t.certify.readFullDisclaimer && (
        <button
          type="button"
          onClick={() => setShowFullDisclaimer(!showFullDisclaimer)}
          className="mt-2 ml-7 text-xs text-blue-600 hover:text-blue-700 underline focus:outline-none"
        >
          {showFullDisclaimer ? (t.certify.hideFullDisclaimer || 'Hide') : t.certify.readFullDisclaimer}
        </button>
      )}
      {showFullDisclaimer && t.certify.legalAgreementFull && (
        <div className="mt-3 ml-7 rounded-lg border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-600">
          {t.certify.legalAgreementFull}
        </div>
      )}
    </div>
  )
}
