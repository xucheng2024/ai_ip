import Link from 'next/link'
import LogoutButton from './LogoutButton'

// Safe Navbar that doesn't depend on Supabase
// Used as fallback when Supabase fails
function NavbarSafe({ user }: { user: any }) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">AIVerify</span>
            <span className="text-sm text-gray-500">AI Video Certification</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/verify" className="text-sm text-gray-700 hover:text-gray-900">
              Verify
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link
                  href="/certify"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Certify
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
