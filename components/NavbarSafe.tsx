'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import LanguageSwitcher from './LanguageSwitcher'
import { useI18n } from '@/lib/i18n/context'

// Safe Navbar that doesn't depend on Supabase
// Used as fallback when Supabase fails
function NavbarSafe({ user }: { user: any }) {
  const { t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuId = 'mobile-nav'
  
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand + Core Actions */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-all duration-200 hover:opacity-80"
            >
              <span className="text-xl font-bold tracking-tight gradient-text">
                {t.common.appName}
              </span>
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <Link 
                href="/videos" 
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              >
                {t.common.videos}
              </Link>
            </div>
          </div>

          {/* Right: Trust & Secondary */}
          <div className="flex items-center gap-2">
            <Link 
              href="/transparency" 
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 sm:block"
            >
              {t.common.transparency}
            </Link>
            <Link 
              href="/manual" 
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 sm:block"
            >
              {t.common.docs}
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 sm:block"
                >
                  {t.common.dashboard}
                </Link>
                <div className="hidden sm:block">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 sm:block"
                >
                  {t.common.login}
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 sm:block"
                >
                  {t.common.signUp}
                </Link>
              </>
            )}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-controls={mobileMenuId}
              aria-expanded={mobileMenuOpen}
              className="sm:hidden rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id={mobileMenuId} className="sm:hidden border-t border-gray-200/80 bg-white/95 backdrop-blur-sm animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/videos"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.common.videos}
              </Link>
              <div className="border-t border-gray-200/80 pt-2 mt-2">
                <Link
                  href="/transparency"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.common.transparency}
                </Link>
                <Link
                  href="/manual"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.common.docs}
                </Link>
              </div>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.dashboard}
                  </Link>
                  <div className="pt-2 mt-2 border-t border-gray-200/80">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-gray-200/80 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.login}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white text-center shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.signUp}
                  </Link>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200/80">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarSafe
