'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RevokeCertificateButtonProps {
  certificationId: string
  onRevoked?: () => void
}

export default function RevokeCertificateButton({
  certificationId,
  onRevoked,
}: RevokeCertificateButtonProps) {
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
        throw new Error(data.error || 'Failed to revoke certificate')
      }

      if (onRevoked) {
        onRevoked()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      alert(error.message || 'Failed to revoke certificate')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-sm font-semibold text-red-900">
          Are you sure you want to revoke this certificate?
        </p>
        <p className="mb-4 text-xs text-red-700">
          This action cannot be undone. The certificate will be marked as revoked and will no longer be publicly verifiable.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Revoking...' : 'Confirm Revoke'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
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
      Revoke Certificate
    </button>
  )
}
