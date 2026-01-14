'use client'

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.15]">
            <span className="gradient-text block">
              {t.home.title}
            </span>
            {t.home.titleLine2 && (
              <span className="gradient-text block font-semibold mt-3">
                {t.home.titleLine2}
              </span>
            )}
          </h1>
          <div className="mt-12 sm:mt-14">
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
              {t.home.verifyButton} <span aria-hidden="true" className="ml-1.5">→</span>
            </Link>
          </div>
          </div>
          <p className="mt-12 text-base text-gray-600 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>
        </div>

        {/* Features Section - Restructured to 3 Core Values */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t.home.featuresTitle}
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
              {t.home.featuresSubtitle}
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-8">
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-5 text-2xl">{t.home.coreValue1Title.includes('🔐') ? '🔐' : ''}</div>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">
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
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue1Feature1}</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue1Feature2}</span>
                </p>
                {t.home.coreValue1Feature3 && (
                  <p className="flex items-start">
                    <span className="mr-2 text-blue-600 mt-0.5">•</span>
                    <span>{t.home.coreValue1Feature3}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-5 text-2xl">{t.home.coreValue2Title.includes('✓') ? '✓' : ''}</div>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">
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
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue2Feature1}</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue2Feature2}</span>
                </p>
                {t.home.coreValue2Feature3 && (
                  <p className="flex items-start">
                    <span className="mr-2 text-blue-600 mt-0.5">•</span>
                    <span>{t.home.coreValue2Feature3}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="group rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-5 text-2xl">{t.home.coreValue3Title.includes('🤖') ? '🤖' : ''}</div>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">
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
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue3Feature1}</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2 text-blue-600 mt-0.5">•</span>
                  <span>{t.home.coreValue3Feature2}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Page Section */}
        <div className="mt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {t.home.videoPageTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <p className="text-base text-gray-600 leading-relaxed">
                  {t.home.videoPageDesc}
                </p>
                <ul className="space-y-3.5 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">{t.home.videoPageFeature1}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">{t.home.videoPageFeature2}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">{t.home.videoPageFeature3}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">{t.home.videoPageFeature4}</span>
                  </li>
                </ul>
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
        <div className="mt-28">
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
          <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">{t.home.pricingFree}</h3>
              <div className="mt-5 flex items-baseline">
                <p className="text-4xl font-semibold text-gray-900">$0</p>
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
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {t.home.pricingPopular && !t.home.pricingPopular.includes('基础版') && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    {t.home.pricingPopular}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {t.home.pricingPopular && t.home.pricingPopular.includes('基础版') 
                  ? t.home.pricingPopular
                  : t.home.pricingBasic}
              </h3>
              <div className="mt-6 flex items-baseline">
                <p className="text-4xl font-semibold text-gray-900">$9.9</p>
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
            <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">{t.home.pricingPro}</h3>
              <div className="mt-6 flex items-baseline">
                <p className="text-4xl font-semibold text-gray-900">$19.9</p>
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
        <div className="mt-28 rounded-2xl border border-gray-200/80 bg-slate-50/80 p-7 sm:p-8 backdrop-blur-sm">
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            <strong className="font-semibold text-gray-900">{t.home.legalDisclaimer}</strong>
          </p>
        </div>
      </main>
    </div>
  );
}