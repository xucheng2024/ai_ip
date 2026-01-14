'use client'

interface EvidenceUsageScenariosProps {
  certification: {
    id: string
    verification_url: string
    timestamp_utc: string
    evidence_hash: string
  }
  video: {
    title: string
    file_hash: string
  }
  className?: string
}

export default function EvidenceUsageScenarios({
  certification,
  video,
  className = '',
}: EvidenceUsageScenariosProps) {
  const scenarios = [
    {
      id: 'youtube-dmca',
      title: 'YouTube DMCA Takedown',
      platform: 'YouTube',
      description:
        'Use this evidence to file a DMCA takedown request for copyright infringement on YouTube.',
      fields: [
        { label: 'Certification ID', value: certification.id },
        { label: 'Evidence Hash', value: certification.evidence_hash },
        { label: 'Creation Timestamp', value: new Date(certification.timestamp_utc).toISOString() },
        { label: 'Content Fingerprint', value: video.file_hash },
      ],
      instructions: [
        'Include the Certification ID in your DMCA complaint',
        'Reference the Evidence Hash as proof of prior creation',
        'Provide the Verification URL for YouTube to independently verify',
        'Attach the evidence package JSON if requested',
      ],
      link: 'https://support.google.com/youtube/answer/2807622',
    },
    {
      id: 'tiktok-ip',
      title: 'TikTok IP Report',
      platform: 'TikTok',
      description: 'Submit an IP infringement report to TikTok with your creation proof.',
      fields: [
        { label: 'Verification URL', value: certification.verification_url },
        { label: 'Certification ID', value: certification.id },
        { label: 'Evidence Hash', value: certification.evidence_hash },
      ],
      instructions: [
        'Use the Verification URL in your IP report submission',
        'Include the Certification ID as reference number',
        'Explain that the content hash proves prior creation date',
        'Mention that the evidence is independently verifiable',
      ],
      link: 'https://www.tiktok.com/legal/report-ip',
    },
    {
      id: 'commercial-proof',
      title: 'Commercial Partnership Proof',
      platform: 'Business',
      description: 'Demonstrate content ownership to potential commercial partners or clients.',
      fields: [
        { label: 'Certificate Page', value: `/certificate/${certification.id}` },
        { label: 'Verification URL', value: certification.verification_url },
        { label: 'Creation Date', value: new Date(certification.timestamp_utc).toLocaleDateString() },
      ],
      instructions: [
        'Share the Certificate page URL with partners',
        'Explain that the evidence is anchored on blockchain',
        'Highlight the tamper-proof nature of the proof',
        'Offer to provide the full evidence package if needed',
      ],
      link: null,
    },
    {
      id: 'internal-archive',
      title: 'Internal IP Archive',
      platform: 'Internal',
      description: 'Maintain a verifiable archive of your creative works for internal records.',
      fields: [
        { label: 'Evidence Hash', value: certification.evidence_hash },
        { label: 'File Hash', value: video.file_hash },
        { label: 'Certification ID', value: certification.id },
      ],
      instructions: [
        'Store the Certification ID with your content library',
        'Keep the evidence package JSON for long-term verification',
        'Use the hash to verify content integrity over time',
        'Reference the Verification URL in your asset management system',
      ],
      link: null,
    },
  ]

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Use Evidence For...</h3>
      <p className="mb-6 text-sm text-gray-600">
        Select a scenario to see how to use this evidence package:
      </p>

      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <details
            key={scenario.id}
            className="group rounded-lg border border-gray-200 bg-gray-50 transition-colors hover:border-gray-300"
          >
            <summary className="cursor-pointer p-4 text-sm font-semibold text-gray-900">
              <div className="flex items-center justify-between">
                <span>{scenario.title}</span>
                <svg
                  className="h-5 w-5 transform text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-1 text-xs font-normal text-gray-600">{scenario.description}</p>
            </summary>
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="space-y-4">
                {/* Fields to Use */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fields to Include
                  </p>
                  <div className="space-y-2">
                    {scenario.fields.map((field, idx) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-600">{field.label}</p>
                        <p className="mt-1 break-all font-mono text-sm text-gray-900">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Instructions
                  </p>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
                    {scenario.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                {/* Platform Link */}
                {scenario.link && (
                  <div>
                    <a
                      href={scenario.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      Visit {scenario.platform} Guidelines
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
