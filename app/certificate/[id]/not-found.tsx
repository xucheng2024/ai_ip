import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-600">Certificate not found</p>
        <p className="mt-2 text-sm text-gray-500">
          The certification ID you're looking for doesn't exist or has been revoked.
        </p>
        <div className="mt-6">
          <Link
            href="/verify"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Go to Verification
          </Link>
        </div>
      </div>
    </div>
  )
}
