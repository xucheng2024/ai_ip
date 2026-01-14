import { createClient } from '@/lib/supabase/server'
import NavbarSafe from './NavbarSafe'

export default async function Navbar() {
  let user = null
  
  // Only try to get user if environment variables are set
  const hasEnvVars = 
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
  
  if (hasEnvVars) {
    try {
      const supabase = await createClient()
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Navbar auth error:', authError.message)
      } else {
        user = authUser
      }
    } catch (error: any) {
      // Silently fail - don't break the page
      // Log in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Navbar Supabase client error:', {
          message: error?.message,
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        })
      }
    }
  }

  return <NavbarSafe user={user} />
}
