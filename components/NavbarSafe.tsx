import Link from 'next/link'
import LogoutButton from './LogoutButton'

// Safe Navbar that doesn't depend on Supabase
// Used as fallback when Supabase fails
function NavbarSafe({ user }: { user: any }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AIVerify
            </span>
            <span className="hidden text-sm text-gray-500 sm:inline">AI Video Certification</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/verify" 
              className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 sm:block"
            >
              Verify
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 sm:block"
                >
                  Dashboard
                </Link>
                <Link
                  href="/certify"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Certify
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarSafe
