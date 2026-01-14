'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { format } from 'date-fns'
import type { PromotionSupportEvent, SupportStats } from '@/lib/types'

interface SupportRecordsProps {
  certificateId: string
}

export default function SupportRecords({ certificateId }: SupportRecordsProps) {
  const { t } = useI18n()
  const [stats, setStats] = useState<SupportStats | null>(null)
  const [events, setEvents] = useState<PromotionSupportEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchSupportData()
  }, [certificateId])

  const fetchSupportData = async () => {
    try {
      const response = await fetch(`/api/support/${certificateId}`)
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
        setEvents(data.recent_events || [])
      }
    } catch (error) {
      console.error('Failed to fetch support data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">{t.common.loading}</p>
      </div>
    )
  }

  if (!stats || stats.total_supports === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">{t.promotionSupport.supportRecords}</h3>
        <p className="text-sm text-gray-600">{t.promotionSupport.noSupports}</p>
        <p className="mt-1 text-xs text-gray-500">{t.promotionSupport.noSupportsDesc}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{t.promotionSupport.supportRecords}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {expanded ? 'Hide' : 'Show Details'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">{t.promotionSupport.totalSupports}</p>
          <p className="text-lg font-semibold text-gray-900">{stats.total_supports}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t.promotionSupport.totalAmountRecords}</p>
          <p className="text-lg font-semibold text-gray-900">${stats.total_amount.toFixed(2)}</p>
        </div>
      </div>

      {expanded && events.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-medium text-gray-700">{t.promotionSupport.recentSupports}</h4>
          <div className="space-y-2">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="rounded border border-gray-200 bg-white p-3 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">${Number(event.total_amount).toFixed(2)}</span>
                  <span className="text-gray-500">
                    {format(new Date(event.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                {event.promoter_id && (
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {t.promotionSupport.hasPromotionReward}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
