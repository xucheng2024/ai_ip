'use client'

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t, language } = useI18n()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
            <span className="gradient-text block">
              {t.home.title}
            </span>
            {t.home.titleLine2 && (
              <span className="block mt-3 text-lg font-medium text-gray-500 sm:text-2xl lg:text-3xl">
                {t.home.titleLine2}
              </span>
            )}
          </h1>
          <div className="mt-8 sm:mt-12 lg:mt-14">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-4">
            <Link
              href="/certify"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 sm:w-auto"
            >
              {t.home.certifyButton}
            </Link>
            <Link
              href="/verify"
              className="w-full rounded-xl border border-gray-300/80 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 sm:w-auto"
            >
              {t.home.verifyButton}
            </Link>
          </div>
          </div>
          <p className="mt-8 text-sm text-gray-600 sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>
        </div>

        {/* Features Section - Restructured to 3 Core Values */}
        <div className="mt-16 sm:mt-24 lg:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t.home.featuresTitle}
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
              {t.home.featuresSubtitle}
            </p>
          </div>
          <div className="mt-8 sm:mt-12 lg:mt-14 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {t.home.coreValue1Title.replace('🔐 ', '')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {t.home.coreValue1Desc}
              </p>
              {t.home.coreValue1Risk && (
                <p className="mt-4 text-xs leading-relaxed text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-100">
                  {t.home.coreValue1Risk}
                </p>
              )}
              <div className="mt-6 space-y-2.5 text-sm text-gray-500">
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue1Feature1}</span>
                </p>
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue1Feature2}</span>
                </p>
                {t.home.coreValue1Feature3 && (
                  <p className="flex items-start">
                    <svg className="mr-2 mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t.home.coreValue1Feature3}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {t.home.coreValue2Title.replace('✓ ', '')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {t.home.coreValue2Desc}
              </p>
              {t.home.coreValue2Risk && (
                <p className="mt-4 text-xs leading-relaxed text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-100">
                  {t.home.coreValue2Risk}
                </p>
              )}
              <div className="mt-6 space-y-2.5 text-sm text-gray-500">
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue2Feature1}</span>
                </p>
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue2Feature2}</span>
                </p>
                {t.home.coreValue2Feature3 && (
                  <p className="flex items-start">
                    <svg className="mr-2 mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t.home.coreValue2Feature3}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {t.home.coreValue3Title.replace('🤖 ', '')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {t.home.coreValue3Desc}
              </p>
              {t.home.coreValue3Risk && (
                <p className="mt-4 text-xs leading-relaxed text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-100">
                  {t.home.coreValue3Risk}
                </p>
              )}
              <div className="mt-6 space-y-2.5 text-sm text-gray-500">
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue3Feature1}</span>
                </p>
                <p className="flex items-start">
                  <svg className="mr-2 mt-0.5 h-4 w-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.home.coreValue3Feature2}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Page Section */}
        <div className="mt-16 sm:mt-24 lg:mt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {t.home.videoPageTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed">
                    {t.home.videoPageDesc}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 sm:p-7">
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature1}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature2}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature3}</span>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-base font-medium text-gray-900">{t.home.videoPageFeature4}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200/50">
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-60">▶</div>
                    <p className="text-sm text-gray-500 font-medium">Video Player</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      ✓ Verified on AIVerify
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">{t.home.creatorLabel || 'Creator:'}</span>
                    <span>AI Creator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t.home.certifiedOnLabel || 'Certified on:'}</span>
                    <span>2024-01-15</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="mb-1 text-xs font-medium text-gray-500">{t.home.statusLabel || 'Status:'}</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {t.home.timeStamped || 'Time-Stamped'}
                      </span>
                      <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {t.home.blockchainAnchored || 'Blockchain Anchored'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-16 sm:mt-24 lg:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t.home.pricingTitle}
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              {t.home.pricingSubtitle}
            </p>
            {t.home.pricingNote && (
              <p className="mt-3 text-sm text-gray-500">
                {t.home.pricingNote}
              </p>
            )}
          </div>
          <div className="mt-8 sm:mt-12 lg:mt-14 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t.home.pricingFree}</h3>
              <div className="mt-4 sm:mt-5 flex items-baseline">
                <p className="text-3xl sm:text-4xl font-semibold text-gray-900">$0</p>
                <p className="ml-2 text-sm text-gray-500">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingFreeDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingFreeDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingFreeDesc3}</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {t.home.pricingPopular && language === 'en' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    {t.home.pricingPopular}
                  </span>
                </div>
              )}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {t.home.pricingPopular && language === 'zh'
                  ? t.home.pricingPopular
                  : t.home.pricingBasic}
              </h3>
              <div className="mt-5 sm:mt-6 flex items-baseline">
                <p className="text-3xl sm:text-4xl font-semibold text-gray-900">$9.9</p>
                <p className="ml-2 text-sm text-gray-500">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingBasicDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingBasicDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingBasicDesc3}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingBasicDesc4}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t.home.pricingPro}</h3>
              <div className="mt-5 sm:mt-6 flex items-baseline">
                <p className="text-3xl sm:text-4xl font-semibold text-gray-900">$19.9</p>
                <p className="ml-2 text-sm text-gray-500">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingProDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingProDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingProDesc3}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingProDesc4}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2.5 text-blue-600 mt-0.5">✓</span>
                  <span>{t.home.pricingProDesc5}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-16 sm:mt-24 lg:mt-28 rounded-2xl border border-gray-200/80 bg-slate-50/80 p-5 sm:p-7 lg:p-8 backdrop-blur-sm">
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            <strong className="font-semibold text-gray-900">{t.home.legalDisclaimer}</strong>
          </p>
        </div>
      </main>
    </div>
  );
}