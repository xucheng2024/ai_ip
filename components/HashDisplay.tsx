'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface HashDisplayProps {
  hash: string
  className?: string
  collapsible?: boolean
  description?: string
}

export default function HashDisplay({ hash, className = '', collapsible = false, description }: HashDisplayProps) {
  const { t } = useI18n()
  const [showTooltip, setShowTooltip] = useState(false)
  const [isExpanded, setIsExpanded] = useState(!collapsible)
  const [copied, setCopied] = useState(false)

  // Segment hash into groups of 4 characters
  const segmentHash = (h: string) => {
    const segments: string[] = []
    for (let i = 0; i < h.length; i += 4) {
      segments.push(h.slice(i, i + 4))
    }
    return segments
  }

  // Generate heatmap colors based on character values
  const getHeatmapColor = (segment: string) => {
    const avg = segment.split('').reduce((sum, char) => {
      const val = parseInt(char, 16) || 0
      return sum + val
    }, 0) / segment.length

    // Map average value to color intensity
    const intensity = Math.floor((avg / 15) * 100)
    
    if (intensity < 30) return 'bg-blue-100 text-blue-800'
    if (intensity < 50) return 'bg-green-100 text-green-800'
    if (intensity < 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-orange-100 text-orange-800'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy hash:', err)
    }
  }

  const segments = segmentHash(hash)
  const displayDescription = description || t.certificate.contentFingerprintDesc || 'Cryptographic hash of the video content. Used to verify integrity and detect modifications.'

  return (
    <div className={`relative ${className}`}>
      {collapsible && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">{displayDescription}</p>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {t.certificate.hideFingerprint || 'Hide fingerprint'}
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {t.certificate.viewFingerprint}
              </>
            )}
          </button>
        </div>
      )}
      
      {isExpanded && (
        <div className="space-y-3">
          <div className="relative">
            <button
              type="button"
              className="flex flex-wrap items-center gap-2 bg-transparent p-0 text-left cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              onClick={() => setShowTooltip((v) => !v)}
              aria-label="Content fingerprint details"
            >
              {segments.map((segment, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-md px-2 py-1 font-mono text-sm font-semibold transition-all ${getHeatmapColor(segment)}`}
                >
                  {segment.toUpperCase()}
                </span>
              ))}
            </button>
            {showTooltip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-xl sm:left-0 sm:translate-x-0"
              >
                <p className="font-semibold text-gray-900">{t.certificate.contentFingerprint || 'Content Fingerprint'}</p>
                <p className="mt-1 text-gray-600">
                  {t.certificate.fingerprintTooltip || 'Any 1 bit change in the original file will completely alter this fingerprint, ensuring tamper detection.'}
                </p>
              </div>
            )}
          </div>
          {collapsible && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.certificate.copied || 'Copied!'}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t.certificate.copyFullHash || 'Copy full hash'}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
