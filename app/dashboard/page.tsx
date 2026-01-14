import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Dashboard auth error:', authError?.message || 'No user')
    redirect('/auth/login')
  }

  // Get user profile and certifications in parallel
  const [userProfileResult, certificationsResult] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('certifications')
      .select(`
        *,
        videos (
          id,
          title,
          original_filename,
          created_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const { data: userProfile } = userProfileResult
  const { data: certifications } = certificationsResult

  const used = userProfile?.monthly_certifications_used || 0
  const limit = userProfile?.monthly_certifications_limit || 1
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const isNearLimit = percentage >= 80

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-base text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{userProfile?.display_name || user.email}</span>
          </p>
        </div>

        {/* Usage Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-gray-600">Subscription Tier</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 capitalize">
              {userProfile?.subscription_tier || 'free'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {userProfile?.subscription_tier === 'free' && '1 certification/month'}
              {userProfile?.subscription_tier === 'basic' && '10 certifications/month'}
              {userProfile?.subscription_tier === 'pro' && 'Unlimited certifications'}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
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
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-sm transition-shadow hover:shadow-md">
            <Link
              href="/certify"
              className="flex h-full items-center justify-center rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
            >
              Certify New Video
            </Link>
          </div>
        </div>

        {/* Recent Certifications */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Certifications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {certifications && certifications.length > 0 ? (
              certifications.map((cert: any) => (
                <div key={cert.id} className="px-6 py-4 transition-colors hover:bg-gray-50">
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
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View
                      </Link>
                      <Link
                        href={`/verify?id=${cert.id}`}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Verify
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
                <p className="text-base font-medium text-gray-900">No certifications yet</p>
                <p className="mt-1 text-sm text-gray-500">Get started by certifying your first video</p>
                <Link
                  href="/certify"
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Certify Your First Video
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
