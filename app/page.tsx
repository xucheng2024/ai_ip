import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AIVerify
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
            AI Video Originality Certification & Creation Proof Platform
          </p>
          <p className="mt-4 text-lg font-semibold text-gray-800 sm:text-xl">
            Prove when it was created. Prove who created it.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
            <Link
              href="/certify"
              className="w-full rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Certify Your Video
            </Link>
            <Link
              href="/verify"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
            >
              Verify Certificate <span aria-hidden="true" className="ml-2">→</span>
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
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">⏰</div>
              <h3 className="text-lg font-semibold text-gray-900">Time-Stamped Proof</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Get a trusted timestamp proving when your video was first certified, creating
                indisputable evidence of creation time.
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900">Content Fingerprint</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Unique hash-based fingerprint ensures content integrity and enables verification
                of any modifications.
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">✓</div>
              <h3 className="text-lg font-semibold text-gray-900">Public Verification</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Anyone can verify your certification using the certificate ID or file hash,
                building trust and transparency.
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">📄</div>
              <h3 className="text-lg font-semibold text-gray-900">PDF Certificate</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Download a professional PDF certificate for your records, client presentations,
                or legal documentation.
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900">AI Tool Tracking</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Record which AI tools you used (Runway, Pika, Sora, etc.) and preserve your
                creative process metadata.
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">⚖️</div>
              <h3 className="text-lg font-semibold text-gray-900">Legal Foundation</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
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
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$0</p>
                <p className="ml-2 text-sm text-gray-600">/month</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>1 certification per month</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>PDF certificate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Public verification</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-xl border-2 border-blue-600 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$9.9</p>
                <p className="ml-2 text-sm text-gray-600">/month</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>10 certifications per month</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>PDF certificate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Public verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$19.9</p>
                <p className="ml-2 text-sm text-gray-600">/month</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Unlimited certifications</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>PDF certificate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Public verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>API access (coming soon)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-24 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm leading-relaxed text-gray-600">
            <strong className="font-semibold text-gray-900">Legal Disclaimer:</strong> This service provides creation time and content
            consistency proof. It does not constitute government copyright registration or legal
            judgment. Users must declare that the content is their legal creation and understand
            that the platform does not judge the legality of infringement.
          </p>
        </div>
      </main>
    </div>
  );
}
