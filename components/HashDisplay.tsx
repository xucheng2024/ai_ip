'use client'

import { useState } from 'react'

interface HashDisplayProps {
  hash: string
  className?: string
}

export default function HashDisplay({ hash, className = '' }: HashDisplayProps) {
  const [showTooltip, setShowTooltip] = useState(false)

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

  const segments = segmentHash(hash)

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-wrap items-center gap-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {segments.map((segment, index) => (
          <span
            key={index}
            className={`inline-flex items-center rounded-md px-2 py-1 font-mono text-sm font-semibold transition-all ${getHeatmapColor(segment)}`}
          >
            {segment.toUpperCase()}
          </span>
        ))}
      </div>
      {showTooltip && (
        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg">
          <p className="font-semibold text-gray-900">Content Fingerprint</p>
          <p className="mt-1 text-gray-600">
            Any 1 bit change in the original file will completely alter this fingerprint, ensuring tamper detection.
          </p>
        </div>
      )}
    </div>
  )
}
