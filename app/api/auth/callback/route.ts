import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureUserExists } from '@/lib/utils/user'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Auth callback error:', error.message)
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
      }

      // Ensure user exists in public.users table (fallback if trigger didn't fire)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        try {
          await ensureUserExists(supabase, {
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata,
          })
        } catch (err) {
          console.error('Failed to ensure user exists in callback:', err)
          // Continue anyway - dashboard will handle it
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`)
}
