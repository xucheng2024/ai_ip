import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/DashboardContent'
import { ensureUserExists } from '@/lib/utils/user'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    console.error('Dashboard error: Supabase client not initialized. Check environment variables.')
    redirect('/auth/login')
  }

  // Try to get user, with fallback to session check
  let user = null
  let authError = null
  
  const userResult = await supabase.auth.getUser()
  user = userResult.data.user
  authError = userResult.error

  // If getUser fails, try getSession as fallback (handles timing issues)
  if (!user && authError?.message?.includes('session')) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      const retryResult = await supabase.auth.getUser()
      user = retryResult.data.user
      authError = retryResult.error
    }
  }

  if (authError || !user) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Dashboard auth error:', authError?.message || 'No user')
    }
    redirect('/auth/login')
  }

  // Ensure user exists in public.users table (fallback if trigger didn't fire)
  let userProfile
  try {
    userProfile = await ensureUserExists(supabase, {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    })
  } catch (err) {
    console.error('Failed to ensure user exists in dashboard:', err)
    // Try to fetch user profile anyway
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

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

  const used = userProfile?.monthly_certifications_used || 0
  const limit = userProfile?.monthly_certifications_limit || 1
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const isNearLimit = percentage >= 80

  return (
    <DashboardContent
      userProfile={userProfile}
      certifications={certifications || []}
      used={used}
      limit={limit}
      percentage={percentage}
      isNearLimit={isNearLimit}
    />
  )
}
