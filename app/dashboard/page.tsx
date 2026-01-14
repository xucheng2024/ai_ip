import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  let user = null
  let supabase = null
  
  try {
    supabase = await createClient()
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Dashboard auth error:', authError.message)
      redirect('/auth/login')
    }
    
    user = authUser
  } catch (error: any) {
    console.error('Dashboard Supabase client error:', {
      message: error?.message,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
    redirect('/auth/login')
  }

  if (!user || !supabase) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get certifications
  const { data: certifications } = await supabase
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
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {userProfile?.display_name || user.email}
          </p>
        </div>

        {/* Usage Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Subscription</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 capitalize">
              {userProfile?.subscription_tier || 'free'}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {userProfile?.monthly_certifications_used || 0} /{' '}
              {userProfile?.monthly_certifications_limit || 1}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Link
              href="/certify"
              className="block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
            >
              Certify New Video
            </Link>
          </div>
        </div>

        {/* Recent Certifications */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Certifications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {certifications && certifications.length > 0 ? (
              certifications.map((cert: any) => (
                <div key={cert.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {cert.videos?.title || cert.videos?.original_filename}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Certification ID: {cert.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {format(new Date(cert.created_at), 'PPp')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/certificate/${cert.id}`}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        href={`/verify?id=${cert.id}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Verify
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500">No certifications yet</p>
                <Link
                  href="/certify"
                  className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
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
