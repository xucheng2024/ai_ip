'use client'

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function VideosPage() {
  const { t } = useI18n()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [promotionLink, setPromotionLink] = useState<{ [key: string]: string }>({})
  
  const demoVideos = [
    {
      id: 'demo-1',
      title: 'AI Landscape Generation',
      description: 'Example of a verified AI video proof page with full evidence package',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-15',
      aiTool: 'Runway',
      category: 'blockchain'
    },
    {
      id: 'demo-2',
      title: 'Character Animation Sequence',
      description: 'Example of a verified AI video proof page with blockchain anchoring',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-16',
      aiTool: 'Pika',
      category: 'blockchain'
    },
    {
      id: 'demo-3',
      title: 'Product Showcase Video',
      description: 'Example of a verified AI video proof page with timestamp proof',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-17',
      aiTool: 'Sora',
      category: 'timestamp'
    },
    {
      id: 'demo-4',
      title: 'Abstract Motion Graphics',
      description: 'Example of a verified AI video proof page with Merkle proof',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-18',
      aiTool: 'Runway',
      category: 'merkle'
    },
    {
      id: 'demo-5',
      title: 'Narrative Short Film',
      description: 'Example of a verified AI video proof page with full transparency',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-19',
      aiTool: 'Other',
      category: 'blockchain'
    }
  ]

  const filterVideos = (filter: string) => {
    if (filter === 'all') {
      return demoVideos
    } else if (filter === 'blockchain') {
      return demoVideos.filter(v => v.category === 'blockchain')
    } else if (filter === 'merkle') {
      return demoVideos.filter(v => v.category === 'merkle')
    } else if (filter === 'tools') {
      // Show all since they already have different AI tools
      return demoVideos
    }
    return demoVideos
  }

  const filteredVideos = filterVideos(selectedFilter)

  const handleGeneratePromotionLink = (videoId: string) => {
    // Generate promotion link pointing to support page
    const promoterId = `promoter_${Date.now()}`
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${baseUrl}/support/${videoId}?promoter=${promoterId}`
    setPromotionLink({ ...promotionLink, [videoId]: link })
    
    // Copy to clipboard
    navigator.clipboard.writeText(link)
    alert(t.promotionSupport.linkCopied)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t.promotionSupport.videosPageTitle || t.home.videosPageTitle || t.common.videos}
          </h1>
          <p className="mt-6 text-base text-gray-600 leading-relaxed">
            {t.promotionSupport.videosPageSubtitle || t.home.videosPageDesc || "These examples showcase AI videos with generated authorship evidence and their corresponding verification pages."}
          </p>
        </div>

        {/* Videos Section */}
        <div className="mt-12 sm:mt-20">
          <div className="text-center mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.home.all || "All"}
              </button>
              <button
                onClick={() => setSelectedFilter('blockchain')}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  selectedFilter === 'blockchain'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.home.blockchainAnchored || "Blockchain Anchored"}
              </button>
              <button
                onClick={() => setSelectedFilter('merkle')}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  selectedFilter === 'merkle'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.home.merkleProof || "Merkle Proof"}
              </button>
              <button
                onClick={() => setSelectedFilter('tools')}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  selectedFilter === 'tools'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t.home.differentAITools || "Different AI Tools"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="rounded-xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden border border-gray-200/50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">▶</div>
                    <p className="text-xs text-gray-500">{t.home.videoPreview || 'Video Preview'}</p>
                  </div>
                </div>
                
                {/* Evidence Status - Most Prominent */}
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 border border-green-300">
                    {t.home.hasVerifiableEvidence || '✓ Has Generated Verifiable Authorship Evidence'}
                  </span>
                </div>

                {/* Video Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-3">{video.title}</h3>
                
                {/* Certification Date */}
                <div className="mb-3 text-xs text-gray-600">
                  <span className="font-medium">{t.home.certifiedLabel || 'Certified:'}</span>{' '}
                  <span>{video.certifiedDate}</span>
                </div>

                {/* Creator and AI Tool - Less Prominent */}
                <div className="space-y-1 mb-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span>{t.home.creatorLabel || 'Creator:'}</span>
                    <span className="font-medium">{video.creator}</span>
                  </div>
                  {video.aiTool && (
                    <div className="flex justify-between">
                      <span>{t.home.aiToolLabel || 'AI Tool:'}</span>
                      <span className="font-medium capitalize">{video.aiTool}</span>
                    </div>
                  )}
                </div>

                {/* Support Section - Lightweight */}
                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-700">{t.promotionSupport.supportThisWork}</p>
                  <p className="mb-3 text-xs text-gray-500">{t.promotionSupport.supportCardSubtitle}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/support/${video.id}`}
                      className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800"
                    >
                      {t.promotionSupport.supportCreator}
                    </Link>
                    <button
                      onClick={() => handleGeneratePromotionLink(video.id)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t.promotionSupport.sharePromote}
                    </button>
                  </div>
                </div>

                {/* Micro-guide text */}
                <p className="text-xs text-gray-500 mb-3 text-center">
                  {t.home.viewEvidenceHint || 'View creation time, content fingerprint, and blockchain proof'}
                </p>

                {/* CTA Button */}
                <Link
                  href={`/certificate/${video.id}`}
                  className="inline-flex items-center w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                >
                  {t.home.viewFullEvidence || t.home.viewProofPage}
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/certify"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02]"
          >
            {t.home.certifyYourOwnVideo || 'Certify Your Own AI Video'} <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
