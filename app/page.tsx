'use client'

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import VideoPlayer from "@/components/VideoPlayer";

// Lazy load heavy sections
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), {
  loading: () => <div className="mt-16 sm:mt-24 lg:mt-28 h-96" />
})

const PricingSection = dynamic(() => import('@/components/home/PricingSection'), {
  loading: () => <div className="mt-16 sm:mt-24 lg:mt-28 h-96" />
})

interface Video {
  id: string
  videoId?: string
  title: string
  creator: string
  certifiedDate: string
  fileUrl?: string | null
}

export default function Home() {
  const { t } = useI18n()
  const [randomVideo, setRandomVideo] = useState<Video | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(true)

  useEffect(() => {
    const fetchRandomVideo = async () => {
      try {
        setLoadingVideo(true)
        const response = await fetch('/api/videos')
        if (response.ok) {
          const data = await response.json()
          if (data.videos && data.videos.length > 0) {
            // Select a random video
            const randomIndex = Math.floor(Math.random() * data.videos.length)
            setRandomVideo(data.videos[randomIndex])
          }
        }
      } catch (error) {
        console.error('Error fetching random video:', error)
      } finally {
        setLoadingVideo(false)
      }
    }

    fetchRandomVideo()
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero Section */}
        <div className="text-center animate-fade-in py-6 sm:py-10 lg:py-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.15]">
            <span className="gradient-text block">
              {t.home.title}
            </span>
            {t.home.titleLine2 && (
              <span className="block mt-3 sm:mt-4 text-lg font-medium text-gray-500 sm:text-2xl lg:text-3xl xl:text-4xl">
                {t.home.titleLine2}
              </span>
            )}
          </h1>
          <div className="mt-8 sm:mt-12 lg:mt-14">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-4">
            <Link
              href="/certify"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-9 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
            >
              {t.home.certifyButton}
            </Link>
            <Link
              href="/verify"
              className="w-full sm:w-auto rounded-xl border-2 border-gray-300/80 bg-white px-9 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2"
            >
              {t.home.verifyButton}
            </Link>
          </div>
          </div>
          <p className="mt-8 sm:mt-10 lg:mt-12 text-sm text-gray-600 sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>
        </div>

        {/* Features Section - Lazy loaded */}
        <FeaturesSection />

        {/* Video Page Section */}
        <div className="mt-16 sm:mt-24 lg:mt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {t.home.videoPageTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed">
                    {t.home.videoPageDesc}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 sm:p-7">
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature1}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature2}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature3}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature4}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
                {loadingVideo ? (
                  <div className="mb-4 aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center border border-gray-200/50">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-sm text-gray-500 font-medium">Loading video...</p>
                    </div>
                  </div>
                ) : randomVideo ? (
                  <>
                    <div className="mb-4">
                      <VideoPlayer 
                        url={randomVideo.fileUrl || null}
                        videoId={randomVideo.videoId || randomVideo.id}
                        className="shadow-sm"
                        light={!randomVideo.fileUrl && !randomVideo.videoId}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          ✓ Verified on AIVerify
                        </span>
                      </div>
                      {randomVideo.id && (
                        <Link
                          href={`/certificate/${randomVideo.id}`}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {t.home.viewProofPage || 'View Proof Page'} →
                        </Link>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">{t.home.creatorLabel || 'Creator:'}</span>
                        <span>{randomVideo.creator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t.home.certifiedOnLabel || 'Certified on:'}</span>
                        <span>{randomVideo.certifiedDate}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="mb-1 text-xs font-medium text-gray-500">{t.home.statusLabel || 'Status:'}</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {t.home.timeStamped || 'Time-Stamped'}
                          </span>
                          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {t.home.blockchainAnchored || 'Blockchain Anchored'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <VideoPlayer 
                        url={null} 
                        className="shadow-sm"
                        light={true}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          ✓ Verified on AIVerify
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">{t.home.creatorLabel || 'Creator:'}</span>
                        <span>AI Creator</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t.home.certifiedOnLabel || 'Certified on:'}</span>
                        <span>2024-01-15</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="mb-1 text-xs font-medium text-gray-500">{t.home.statusLabel || 'Status:'}</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {t.home.timeStamped || 'Time-Stamped'}
                          </span>
                          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {t.home.blockchainAnchored || 'Blockchain Anchored'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section - Lazy loaded */}
        <PricingSection />

        {/* Legal Disclaimer */}
        <div className="mt-16 sm:mt-24 lg:mt-28 rounded-2xl border border-gray-200/80 bg-slate-50/80 p-5 sm:p-7 lg:p-8 backdrop-blur-sm">
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            <strong className="font-semibold text-gray-900">{t.home.legalDisclaimer}</strong>
          </p>
        </div>
      </main>
    </div>
  );
}