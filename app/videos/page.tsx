'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import VideoPlayer from "@/components/VideoPlayer";

interface Video {
  id: string
  videoId?: string
  title: string
  description: string
  creator: string
  certifiedDate: string
  aiTool: string
  category: string
  fileUrl?: string | null
}

export default function VideosPage() {
  const { t } = useI18n()
  const [promotionLink, setPromotionLink] = useState<{ [key: string]: string }>({})
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  
  // Demo videos as fallback
  const demoVideos: Video[] = [
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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/videos')
        if (response.ok) {
          const data = await response.json()
          if (data.videos && data.videos.length > 0) {
            setVideos(data.videos)
          } else {
            // Fallback to demo videos if no real videos
            setVideos(demoVideos)
          }
        } else {
          // Fallback to demo videos on error
          setVideos(demoVideos)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        // Fallback to demo videos on error
        setVideos(demoVideos)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-sm text-gray-500">{t.common.loading || 'Loading videos...'}</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No videos yet</p>
              <p className="text-sm text-gray-500">Check back later for new content</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => {
              const videoId = video.fileUrl ? (video.videoId || video.id) : null
              
              return (
                <article
                  key={video.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-xl hover:ring-gray-300/60 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Video Player - Larger, More Prominent */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                    <VideoPlayer 
                      url={null}
                      videoId={videoId}
                      className="h-full w-full"
                      light={!videoId}
                    />
                    {/* Verified Badge - Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
                        <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-semibold text-gray-700">Verified</span>
                      </div>
                    </div>
                    {/* Action Buttons - Top Right */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      {/* Support Button */}
                      <Link
                        href={`/support/${video.id}`}
                        className="flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-sm transition-all hover:bg-white hover:shadow-md"
                        title={t.promotionSupport.supportCreator || '支持作者'}
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Link>
                      {/* Share Button */}
                      <button
                        onClick={() => handleGeneratePromotionLink(video.id)}
                        className="flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-sm transition-all hover:bg-white hover:shadow-md"
                        title={t.promotionSupport.sharePromote || '分享作品'}
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content - Compact, TED-style */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Title */}
                    <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>

                    {/* Meta Info - Simplified */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate font-medium">{video.creator}</span>
                      </span>
                      {video.aiTool && (
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="capitalize">{video.aiTool}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{video.certifiedDate}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto">
                      {/* View Evidence Button - Primary Action */}
                      <Link
                        href={`/certificate/${video.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md"
                      >
                        <span>{t.certificate.viewFullCertificate || t.home.viewFullEvidence || t.home.viewProofPage || '查看完整作者证明'}</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}
