'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setPassword('')
      setDisplayName('')
      setError('')
      setSuccess('')
      setLoading(false)
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const timeoutId = setTimeout(() => {
      setError('Login timeout. Please check your network connection and try again.')
      setLoading(false)
    }, 30000)

    try {
      if (!email || !password) {
        clearTimeout(timeoutId)
        setError('Email and password are required')
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (loginError) {
        clearTimeout(timeoutId)
        throw loginError
      }

      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verify session exists
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (!sessionData.session) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retrySessionData } = await supabase.auth.getSession()
        if (!retrySessionData.session) {
          throw new Error('Session not established after login')
        }
      }
      
      // Ensure user exists in public.users
      if (data.user) {
        try {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email || email.trim(),
              display_name: data.user.user_metadata?.display_name || null,
              account_type: 'creator',
            }, {
              onConflict: 'id'
            })
        } catch (userErr) {
          console.warn('Error ensuring user exists:', userErr)
        }
      }

      clearTimeout(timeoutId)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Close modal and trigger success callback
      setLoading(false)
      onSuccess()
      onClose()
    } catch (err: any) {
      clearTimeout(timeoutId)
      setError(err.message || err.error_description || t.errors.loginFailed)
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName || null,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (!data.user) {
        throw new Error('Registration failed: No user data returned')
      }

      // Check if session exists (email confirmation might be required)
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData?.session) {
        // No session - email confirmation is required
        setLoading(false)
        setSuccess(t.auth.signupSuccess)
        setTimeout(() => {
          setEmail('')
          setPassword('')
          setDisplayName('')
        }, 3000)
        return
      }

      // Ensure user exists in public.users
      if (data.user) {
        try {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email || email.trim(),
              display_name: displayName || null,
              account_type: 'creator',
            }, {
              onConflict: 'id'
            })
        } catch (err) {
          console.error('Error ensuring user exists:', err)
        }
      }

      // Close modal and trigger success callback
      setLoading(false)
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || err.error_description || t.errors.signupFailed)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {mode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {mode === 'login' ? t.auth.loginSubtitle : t.auth.signupSubtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  {t.auth.displayName} <span className="text-gray-400">{t.auth.displayNameOptional}</span>
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
                  placeholder={t.auth.placeholderName}
                />
              </div>
            )}

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
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
                placeholder={mode === 'login' ? t.auth.placeholderPassword : t.auth.placeholderPasswordNew}
                minLength={mode === 'signup' ? 6 : undefined}
              />
              {mode === 'signup' && (
                <p className="mt-1 text-xs text-gray-500">{t.auth.passwordMinLength}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'login' ? t.auth.signingIn : t.auth.creatingAccount}
                </>
              ) : (
                mode === 'login' ? t.auth.signIn : t.auth.signUp
              )}
            </button>

            <div className="text-center text-sm">
              {mode === 'login' ? (
                <>
                  <span className="text-gray-600">{t.auth.dontHaveAccount} </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                      setSuccess('')
                    }}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {t.auth.signUp}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-600">{t.auth.alreadyHaveAccount} </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                      setSuccess('')
                    }}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {t.auth.signIn}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
