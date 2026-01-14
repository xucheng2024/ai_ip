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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand + Core Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {t.common.appName}
              </span>
            </Link>
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                href="/certify"
                className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
              >
                {t.common.certifyNav || t.common.certify}
              </Link>
              <Link 
                href="/verify" 
                className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
              >
                {t.common.verifyNav || t.common.verify}
              </Link>
              <Link 
                href="/videos" 
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {t.common.videos}
              </Link>
            </div>
          </div>

          {/* Right: Trust & Secondary */}
          <div className="flex items-center gap-4">
            <Link 
              href="/transparency" 
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
            >
              {t.common.transparency}
            </Link>
            <Link 
              href="/manual" 
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
            >
              {t.common.docs}
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
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
                  className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
                >
                  {t.common.login}
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:block"
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
              className="sm:hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          <div id={mobileMenuId} className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link
                href="/certify"
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.common.certifyNav || t.common.certify}
              </Link>
              <Link
                href="/verify"
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.common.verifyNav || t.common.verify}
              </Link>
              <Link
                href="/videos"
                className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.common.videos}
              </Link>
              <div className="border-t border-gray-200 pt-3">
                <Link
                  href="/transparency"
                  className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.common.transparency}
                </Link>
                <Link
                  href="/manual"
                  className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.common.docs}
                </Link>
              </div>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.dashboard}
                  </Link>
                  <div className="pt-3 border-t border-gray-200">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.login}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.common.signUp}
                  </Link>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
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
