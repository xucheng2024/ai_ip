'use client'

import { format } from 'date-fns'
import { useI18n } from '@/lib/i18n/context'

interface TimelineEvent {
  time: string
  label: string
  description: string
  status: 'completed' | 'pending'
}

interface CreationTimelineProps {
  events: TimelineEvent[]
  className?: string
}

export default function CreationTimeline({ events, className = '' }: CreationTimelineProps) {
  const { t } = useI18n()
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {t.certificate.certificationTimeline}
      </h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-3">
              <div
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  event.status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {event.status === 'completed' && (
                  <svg
                    className="h-3 w-3 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium text-gray-700">{event.label}</p>
                  <p className="text-xs font-mono text-gray-400">{event.time}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
