'use client'

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function VideosPage() {
  const { t } = useI18n()
  
  // Demo videos - replace with actual demo certification IDs when available
  const demoVideos = [
    {
      id: 'demo-1',
      title: 'AI Landscape Generation',
      description: 'Example of a verified AI video proof page with full evidence package',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-15',
      aiTool: 'Runway'
    },
    {
      id: 'demo-2',
      title: 'Character Animation Sequence',
      description: 'Example of a verified AI video proof page with blockchain anchoring',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-16',
      aiTool: 'Pika'
    },
    {
      id: 'demo-3',
      title: 'Product Showcase Video',
      description: 'Example of a verified AI video proof page with timestamp proof',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-17',
      aiTool: 'Sora'
    },
    {
      id: 'demo-4',
      title: 'Abstract Motion Graphics',
      description: 'Example of a verified AI video proof page with Merkle proof',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-18',
      aiTool: 'Runway'
    },
    {
      id: 'demo-5',
      title: 'Narrative Short Film',
      description: 'Example of a verified AI video proof page with full transparency',
      creator: 'Demo Creator',
      certifiedDate: '2024-01-19',
      aiTool: 'Other'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t.common.videos}
          </h1>
          <p className="mt-6 text-base text-gray-600 leading-relaxed">
            {t.home.videosPageDesc || "Verified AI video gallery coming soon."}
          </p>
        </div>

        {/* Demo Videos Section */}
        {(t.home.videosPageDemoTitle || t.home.videosPageDemoDesc) && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t.home.videosPageDemoTitle || "AIVerify Sample Certifications"}
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                {t.home.videosPageDemoDesc || "Explore example certifications to see how proof pages work."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {demoVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden border border-gray-200/50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">▶</div>
                      <p className="text-xs text-gray-500">{t.home.videoPreview || 'Video Preview'}</p>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 border border-green-300">
                        {t.home.verifiedByAIVerify || '✓ Verified by AIVerify'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{video.description}</p>
                  <div className="space-y-1 mb-4 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>{t.home.creatorLabel || 'Creator:'}</span>
                      <span className="font-medium">{video.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.home.certifiedLabel || 'Certified:'}</span>
                      <span className="font-medium">{video.certifiedDate}</span>
                    </div>
                    {video.aiTool && (
                      <div className="flex justify-between">
                        <span>{t.home.aiToolLabel || 'AI Tool:'}</span>
                        <span className="font-medium capitalize">{video.aiTool}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/certificate/${video.id}`}
                    className="inline-flex items-center w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                  >
                    {t.home.viewProofPage}
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link
            href="/verify"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02]"
          >
            {t.common.verify} <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
