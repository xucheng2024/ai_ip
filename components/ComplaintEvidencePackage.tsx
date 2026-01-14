'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface ComplaintEvidencePackageProps {
  certification: any
  video: any
  metadata: any
}

export default function ComplaintEvidencePackage({
  certification,
  video,
  metadata,
}: ComplaintEvidencePackageProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')

  const generateDMCA = () => {
    const content = `DMCA Takedown Notice

Date: ${format(new Date(), 'MMMM dd, yyyy')}

To: [Platform Name] Copyright Team

Subject: DMCA Takedown Request

I, the undersigned, hereby state that I am the authorized agent of the copyright owner of the following work:

Title: ${video?.title}
Certification ID: ${certification.id}
Certification Date: ${format(new Date(certification.timestamp_utc), 'MMMM dd, yyyy')}
Content Fingerprint: ${video?.file_hash}
Verification URL: ${certification.verification_url}

I have a good faith belief that the material identified below is being used in a manner that is not authorized by the copyright owner, its agent, or the law.

I declare, under penalty of perjury, that the information in this notification is accurate and that I am authorized to act on behalf of the copyright owner.

Signature: [Your Name]
Date: ${format(new Date(), 'MMMM dd, yyyy')}
`
    return content
  }

  const generateTikTok = () => {
    return {
      title: video?.title,
      certificationId: certification.id,
      certifiedDate: format(new Date(certification.timestamp_utc), 'yyyy-MM-dd'),
      hash: video?.file_hash,
      verificationUrl: certification.verification_url,
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Platform Complaint Evidence Package</h3>
      <p className="mb-4 text-xs text-gray-600">
        Generate pre-filled complaint templates for major platforms. This is not legal advice.
      </p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Select Platform
        </label>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Choose a platform...</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="x">X (Twitter)</option>
        </select>
      </div>

      {selectedPlatform === 'youtube' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-900">YouTube DMCA Template</p>
              <button
                onClick={() => copyToClipboard(generateDMCA())}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {generateDMCA()}
            </pre>
          </div>
        </div>
      )}

      {selectedPlatform === 'tiktok' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-900">TikTok IP Complaint Info</p>
              <button
                onClick={() => copyToClipboard(JSON.stringify(generateTikTok(), null, 2))}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Copy JSON
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Title:</strong> {video?.title}</p>
              <p><strong>Certification ID:</strong> {certification.id}</p>
              <p><strong>Certified Date:</strong> {format(new Date(certification.timestamp_utc), 'yyyy-MM-dd')}</p>
              <p><strong>Content Fingerprint:</strong> {video?.file_hash}</p>
              <p><strong>Verification URL:</strong> {certification.verification_url}</p>
            </div>
          </div>
        </div>
      )}

      {(selectedPlatform === 'instagram' || selectedPlatform === 'x') && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-600 mb-2">
            Use the following information when filling out the platform's IP complaint form:
          </p>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong>Work Title:</strong> {video?.title}</p>
            <p><strong>Certification ID:</strong> {certification.id}</p>
            <p><strong>Certification Date:</strong> {format(new Date(certification.timestamp_utc), 'MMMM dd, yyyy')}</p>
            <p><strong>Content Fingerprint:</strong> {video?.file_hash}</p>
            <p><strong>Verification URL:</strong> {certification.verification_url}</p>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
        <p className="text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This is not legal advice. Consult with a legal professional before submitting any complaint.
        </p>
      </div>
    </div>
  )
}
