'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

interface RevokeCertificateButtonProps {
  certificationId: string
  onRevoked?: () => void
}

export default function RevokeCertificateButton({
  certificationId,
  onRevoked,
}: RevokeCertificateButtonProps) {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleRevoke = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/certificate/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificationId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.certificate.revokeFailed)
      }

      if (onRevoked) {
        onRevoked()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      alert(error.message || t.certificate.revokeFailed)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-sm font-semibold text-red-900">
          {t.certificate.revokeConfirmTitle}
        </p>
        <p className="mb-4 text-xs text-red-700">
          {t.certificate.revokeConfirmDesc}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? t.certificate.revoking : t.certificate.confirmRevoke}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
    >
      {t.certificate.revokeCertificate}
    </button>
  )
}
