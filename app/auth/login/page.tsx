'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Create a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Login timeout after 30 seconds')
      setError('Login timeout. Please check your network connection and try again.')
      setLoading(false)
    }, 30000)

    try {
      // Validate inputs
      if (!email || !password) {
        clearTimeout(timeoutId)
        setError('Email and password are required')
        setLoading(false)
        return
      }

      console.log('Attempting login for:', email)
      
      const supabase = createClient()
      console.log('Supabase client created')
      
      console.log('Calling signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      console.log('signInWithPassword completed', { hasData: !!data, hasError: !!error })

      if (error) {
        console.error('Login error:', error)
        clearTimeout(timeoutId)
        throw error
      }

      console.log('Login successful, user:', data.user?.id)
      
      // Wait for session to be fully established and cookies to be written
      console.log('Waiting for session to be established...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verify session exists
      console.log('Verifying session...')
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('Session check:', { hasSession: !!sessionData.session })
      
      if (!sessionData.session) {
        console.warn('Session not found after login, retrying...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retrySessionData } = await supabase.auth.getSession()
        if (!retrySessionData.session) {
          throw new Error('Session not established after login')
        }
        console.log('Session found on retry')
      }
      
      // Ensure user exists in public.users before redirecting
      if (data.user) {
        try {
          console.log('Ensuring user exists in database...')
          const { error: userError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email || email.trim(),
              display_name: data.user.user_metadata?.display_name || null,
              account_type: 'creator',
            }, {
              onConflict: 'id'
            })
          
          if (userError) {
            console.warn('Failed to ensure user exists:', userError)
            // Continue anyway - dashboard will handle it
          } else {
            console.log('User ensured in database')
          }
        } catch (userErr) {
          console.warn('Error ensuring user exists:', userErr)
          // Continue anyway
        }
      }

      // Clear timeout before redirect
      clearTimeout(timeoutId)
      
      // Wait for cookies to be fully written
      console.log('Waiting for cookies to be written...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard - use window.location for full page reload
      // This ensures server-side rendering picks up the new session cookies
      console.log('Redirecting to dashboard...')
      window.location.href = '/dashboard'
    } catch (err: any) {
      clearTimeout(timeoutId)
      console.error('Login failed:', err)
      setError(err.message || err.error_description || t.errors.loginFailed)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {t.auth.loginTitle}
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {t.auth.loginSubtitle}
          </p>
        </div>
        <form className="mt-8 space-y-6 sm:space-y-7 rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-8 shadow-lg" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t.auth.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
                placeholder={t.auth.placeholderEmail}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
                placeholder={t.auth.placeholderPassword}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                console.log('Login button clicked', { loading, email: !!email, password: !!password })
                if (loading) {
                  e.preventDefault()
                  console.log('Button click prevented - already loading')
                }
              }}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.auth.signingIn}
                </>
              ) : (
                t.auth.signIn
              )}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t.auth.dontHaveAccount} </span>
            <Link href="/auth/signup" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
              {t.auth.signUp}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
