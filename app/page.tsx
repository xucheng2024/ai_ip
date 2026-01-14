import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AIVerify
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            AI Video Originality Certification & Creation Proof Platform
          </p>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Prove when it was created. Prove who created it.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/certify"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Certify Your Video
            </Link>
            <Link
              href="/verify"
              className="text-base font-semibold leading-6 text-gray-900 hover:text-gray-700"
            >
              Verify Certificate <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why AIVerify?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Trusted evidence infrastructure for AI video creators
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Time-Stamped Proof</h3>
              <p className="mt-2 text-sm text-gray-600">
                Get a trusted timestamp proving when your video was first certified, creating
                indisputable evidence of creation time.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Content Fingerprint</h3>
              <p className="mt-2 text-sm text-gray-600">
                Unique hash-based fingerprint ensures content integrity and enables verification
                of any modifications.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Public Verification</h3>
              <p className="mt-2 text-sm text-gray-600">
                Anyone can verify your certification using the certificate ID or file hash,
                building trust and transparency.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">PDF Certificate</h3>
              <p className="mt-2 text-sm text-gray-600">
                Download a professional PDF certificate for your records, client presentations,
                or legal documentation.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">AI Tool Tracking</h3>
              <p className="mt-2 text-sm text-gray-600">
                Record which AI tools you used (Runway, Pika, Sora, etc.) and preserve your
                creative process metadata.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Legal Foundation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Not a government copyright, but strong evidence infrastructure for copyright
                disputes and IP protection.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple Pricing
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">$0</p>
              <p className="mt-2 text-sm text-gray-600">per month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>1 certification per month</li>
                <li>PDF certificate</li>
                <li>Public verification</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-blue-600 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">$9.9</p>
              <p className="mt-2 text-sm text-gray-600">per month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>10 certifications per month</li>
                <li>PDF certificate</li>
                <li>Public verification</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">$19.9</p>
              <p className="mt-2 text-sm text-gray-600">per month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>Unlimited certifications</li>
                <li>PDF certificate</li>
                <li>Public verification</li>
                <li>Priority support</li>
                <li>API access (coming soon)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-24 rounded-lg bg-gray-50 p-6">
          <p className="text-sm text-gray-600">
            <strong>Legal Disclaimer:</strong> This service provides creation time and content
            consistency proof. It does not constitute government copyright registration or legal
            judgment. Users must declare that the content is their legal creation and understand
            that the platform does not judge the legality of infringement.
          </p>
        </div>
      </main>
    </div>
  );
}
