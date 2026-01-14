'use client'

import Link from 'next/link'
import HashDisplay from './HashDisplay'

interface CreatorContinuityChainProps {
  currentEvidenceHash: string
  previousEvidenceHash?: string | null
  chainPosition?: number
  className?: string
}

export default function CreatorContinuityChain({
  currentEvidenceHash,
  previousEvidenceHash,
  chainPosition,
  className = '',
}: CreatorContinuityChainProps) {
  if (!previousEvidenceHash) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-50 p-4 ${className}`}>
        <p className="text-sm font-semibold text-gray-900">Creator Continuity</p>
        <p className="mt-1 text-xs text-gray-600">
          This is the first certification in your creator continuity chain.
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-purple-200 bg-purple-50 p-4 ${className}`}>
      <div className="mb-3 flex items-center">
        <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <p className="text-sm font-semibold text-purple-900">Creator Continuity Chain</p>
      </div>
      <p className="mb-3 text-xs text-purple-700">
        This evidence is linked to your previous certification, forming a continuous chain of your creative work.
        {chainPosition && ` Position: #${chainPosition} in chain.`}
      </p>
      <div className="space-y-2">
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs font-medium text-purple-700 mb-1">Previous Evidence Hash</p>
          <HashDisplay hash={previousEvidenceHash} />
        </div>
        <div className="flex items-center justify-center text-purple-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs font-medium text-purple-700 mb-1">Current Evidence Hash</p>
          <HashDisplay hash={currentEvidenceHash} />
        </div>
      </div>
      <p className="mt-3 text-xs text-purple-600">
        This chain proves continuous creative activity over time and is valuable for MCNs and studios.
      </p>
    </div>
  )
}
