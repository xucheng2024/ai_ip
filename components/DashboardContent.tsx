'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useI18n } from '@/lib/i18n/context'

interface DashboardContentProps {
  userProfile: any
  certifications: any[]
  used: number
  limit: number
  percentage: number
  isNearLimit: boolean
}

export default function DashboardContent({
  userProfile,
  certifications,
  used,
  limit,
  percentage,
  isNearLimit,
}: DashboardContentProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.dashboard.title}</h1>
          <p className="mt-3 text-sm text-gray-600">
            {t.dashboard.welcomeBack} <span className="font-semibold text-gray-900">{userProfile?.display_name || userProfile?.email}</span>
          </p>
        </div>

        {/* Usage Stats */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md">
            <p className="text-sm font-medium text-gray-600">{t.dashboard.subscriptionTier}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 capitalize">
              {userProfile?.subscription_tier || 'free'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {userProfile?.subscription_tier === 'free' && t.dashboard.tierFree}
              {userProfile?.subscription_tier === 'basic' && t.dashboard.tierBasic}
              {userProfile?.subscription_tier === 'pro' && t.dashboard.tierPro}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t.dashboard.thisMonth}</p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {used} / {limit === Infinity ? '∞' : limit}
                </p>
              </div>
              {limit !== Infinity && (
                <div className="flex h-16 w-16 items-center justify-center">
                  <svg className="h-16 w-16 -rotate-90 transform">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={isNearLimit ? '#ef4444' : '#e5e7eb'}
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={isNearLimit ? '#ef4444' : '#10b981'}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
              )}
            </div>
            {limit !== Infinity && (
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full transition-all duration-500 ${
                    isNearLimit ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-7 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
            <Link
              href="/certify"
              className="flex h-full items-center justify-center rounded-lg bg-white px-4 py-3.5 text-center text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:scale-[1.02]"
            >
              {t.dashboard.certifyNewVideo}
            </Link>
          </div>
        </div>

        {/* Recent Certifications */}
        <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-200/80 px-7 py-5">
            <h2 className="text-base font-semibold text-gray-900">{t.dashboard.recentCertifications}</h2>
          </div>
          <div className="divide-y divide-gray-200/80">
            {certifications && certifications.length > 0 ? (
              certifications.map((cert: any) => (
                <div key={cert.id} className="px-7 py-5 transition-all duration-200 hover:bg-gray-50/50">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {cert.videos?.title || cert.videos?.original_filename}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-mono text-xs">{cert.id}</span>
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {format(new Date(cert.created_at), 'PPp')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/certificate/${cert.id}`}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                      >
                        {t.dashboard.view}
                      </Link>
                      <Link
                        href={`/verify?id=${cert.id}`}
                        className="rounded-lg border border-gray-300/80 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2"
                      >
                        {t.dashboard.verify}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-base font-medium text-gray-900">{t.dashboard.noCertifications}</p>
                <p className="mt-1 text-sm text-gray-500">{t.dashboard.noCertificationsDesc}</p>
                <Link
                  href="/certify"
                  className="mt-6 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                >
                  {t.dashboard.certifyFirstVideo}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
