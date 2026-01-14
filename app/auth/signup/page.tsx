'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

export default function SignupPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: displayName || null,
          account_type: 'creator',
        })

        if (profileError) throw profileError

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || t.errors.signupFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {t.auth.signupTitle}
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {t.auth.signupSubtitle}
          </p>
        </div>
        <form className="mt-8 space-y-7 rounded-2xl border border-gray-200/80 bg-white p-8 shadow-lg" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          <div className="space-y-5">
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 sm:text-sm"
                placeholder={t.auth.placeholderPasswordNew}
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">{t.auth.passwordMinLength}</p>
            </div>
          </div>

          <div>
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
                  {t.auth.creatingAccount}
                </>
              ) : (
                t.auth.signUp
              )}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t.auth.alreadyHaveAccount} </span>
            <Link href="/auth/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
              {t.auth.signIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
