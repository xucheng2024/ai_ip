'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import type { SupportAllocation } from '@/lib/types'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
  certificateId: string
  promoterId?: string | null
  onSupportSuccess?: () => void
}

export default function SupportModal({
  isOpen,
  onClose,
  certificateId,
  promoterId,
  onSupportSuccess,
}: SupportModalProps) {
  const { t } = useI18n()
  const [amount, setAmount] = useState<string>('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allocation, setAllocation] = useState<SupportAllocation | null>(null)

  if (!isOpen) return null

  const calculateAllocation = (total: number): SupportAllocation => {
    return {
      total_amount: total,
      creator_amount: Math.round(total * 0.7 * 100) / 100,
      promoter_amount: Math.round(total * 0.2 * 100) / 100,
      platform_fee: Math.round(total * 0.1 * 100) / 100,
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setAllocation(calculateAllocation(numValue))
    } else {
      setAllocation(null)
    }
  }

  const handleSupport = async () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/support/${certificateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          promoter_id: promoterId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create support')
      }

      if (onSupportSuccess) {
        onSupportSuccess()
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create support')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t.promotionSupport.supportThisWork}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <p className="leading-relaxed">{t.promotionSupport.supportDescription}</p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t.promotionSupport.totalAmount} ($)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="10.00"
          />
        </div>

        {allocation && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">{t.promotionSupport.supportAllocation}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.promotionSupport.totalAmount}:</span>
                <span className="font-medium text-gray-900">${allocation.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.promotionSupport.creatorSupport}:</span>
                <span className="font-medium text-gray-900">${allocation.creator_amount.toFixed(2)}</span>
              </div>
              {promoterId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.promotionSupport.promotionReward}:</span>
                  <span className="font-medium text-gray-900">${allocation.promoter_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t.promotionSupport.platformServiceFee}:</span>
                <span className="font-medium text-gray-900">${allocation.platform_fee.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">{t.promotionSupport.allocationNote}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSupport}
            disabled={loading || !allocation}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
          >
            {loading ? t.common.loading : t.promotionSupport.continueSupport}
          </button>
        </div>
      </div>
    </div>
  )
}
