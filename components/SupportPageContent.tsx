'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { format } from 'date-fns'
import type { SupportAllocation } from '@/lib/types'

interface SupportPageContentProps {
  certification: any
  video: any
  metadata: any
  promoterId: string | null
  isDemo?: boolean
}

export default function SupportPageContent({
  certification,
  video,
  metadata,
  promoterId,
  isDemo = false,
}: SupportPageContentProps) {
  const { t } = useI18n()
  const [amount, setAmount] = useState<string>('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [allocation, setAllocation] = useState<SupportAllocation | null>(null)
  const [showAllocationDetails, setShowAllocationDetails] = useState(false)

  const calculateAllocation = (total: number): SupportAllocation => {
    return {
      total_amount: total,
      creator_amount: Math.round(total * 0.7 * 100) / 100,
      promoter_amount: Math.round(total * 0.2 * 100) / 100,
      platform_fee: Math.round(total * 0.1 * 100) / 100,
    }
  }

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value)
    setAmount(value.toString())
    setAllocation(calculateAllocation(value))
    // Don't auto-expand - let user click to see details
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(null)
      setAllocation(calculateAllocation(numValue))
      // Don't auto-expand - let user click to see details
    } else {
      setAllocation(null)
      setShowAllocationDetails(false)
    }
  }

  const handleSupport = async () => {
    if (isDemo) {
      // For demo, just show success without API call
      setSuccess(true)
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/support/${certification.id}`, {
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

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create support')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
            <div className="mb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.promotionSupport.supportSuccess}</h2>
            <p className="text-gray-600 mb-4">{t.promotionSupport.supportSuccessDesc}</p>
            <p className="text-sm text-gray-500 mb-6">{t.promotionSupport.supportRecordedMessage}</p>
            {promoterId && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">{t.promotionSupport.promotionRewardRecorded}</p>
                <p className="text-xs text-blue-600 mt-1">{t.promotionSupport.verifyInTransparencyLog}</p>
              </div>
            )}
            <Link
              href={`/certificate/${certification.id}`}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800"
            >
              {t.promotionSupport.viewCertificate}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Promoter Badge */}
        {promoterId && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center">
            <p className="text-sm font-medium text-blue-800">{t.promotionSupport.youArePromotingUpdated}</p>
          </div>
        )}

        {/* Top: Work + Evidence Badge */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-24 w-40 rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="text-3xl mb-1 opacity-60">▶</div>
                  <p className="text-xs text-gray-500">Video</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{video?.title}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 border border-green-300">
                  ✓ {t.home.hasVerifiableEvidence || 'Has Generated Verifiable Authorship Evidence'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{t.promotionSupport.creator}: {video?.users?.display_name || video?.users?.email || 'Anonymous'}</p>
                <p>{t.promotionSupport.certifiedOn}: {format(new Date(certification.timestamp_utc), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Module */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.promotionSupport.supportThisCreator}</h2>
          
          {/* Amount Selection */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[5, 10, 20, 50].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAmountSelect(value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    selectedAmount === value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={t.promotionSupport.customAmount}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Layer 1: Emotional Layer - Default visible */}
          <p className="text-sm text-gray-600 mb-4">
            {t.promotionSupport.supportDescriptionLight}
          </p>

          {/* Layer 2: Transparency Layer - Collapsible */}
          {allocation && (
            <div className="mb-6">
              <button
                onClick={() => setShowAllocationDetails(!showAllocationDetails)}
                className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <span>{t.promotionSupport.viewAllocationDetails}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showAllocationDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAllocationDetails && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-900">{t.promotionSupport.supportAmount}:</span>
                      <span className="font-bold text-gray-900">${allocation.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>{t.promotionSupport.creatorSupport}:</span>
                      <span className="font-medium">${allocation.creator_amount.toFixed(2)}</span>
                    </div>
                    {promoterId && (
                      <div className="flex justify-between text-gray-700">
                        <span>{t.promotionSupport.promotionRewardIfApplicable}:</span>
                        <span className="font-medium">${allocation.promoter_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>{t.promotionSupport.platformServiceFeeWithDesc}:</span>
                      <span className="font-medium">${allocation.platform_fee.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">{t.promotionSupport.allocationNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Main CTA */}
          <button
            onClick={handleSupport}
            disabled={loading || !allocation}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.common.loading : t.promotionSupport.confirmSupport}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* Promoter Info - Collapsible */}
        {promoterId && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 list-none">
                <span className="flex items-center justify-between">
                  {t.promotionSupport.promoterInfo}
                  <svg className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-sm text-gray-600">
                <p>{t.promotionSupport.promoterInfoDesc}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
