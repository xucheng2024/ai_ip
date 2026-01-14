'use client'

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t.home.title}
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
            {t.home.subtitle}
          </p>
          <p className="mt-4 text-lg font-semibold text-gray-800 sm:text-xl">
            {t.home.slogan}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
            <Link
              href="/certify"
              className="w-full rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              {t.home.certifyButton}
            </Link>
            <Link
              href="/verify"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
            >
              {t.home.verifyButton} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t.home.featuresTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.home.featuresSubtitle}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">⏰</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature1Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature1Desc}
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature2Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature2Desc}
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">✓</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature3Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature3Desc}
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">📄</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature4Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature4Desc}
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature5Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature5Desc}
              </p>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 text-2xl">⚖️</div>
              <h3 className="text-lg font-semibold text-gray-900">{t.home.feature6Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t.home.feature6Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t.home.pricingTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.home.pricingSubtitle}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.pricingFree}</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$0</p>
                <p className="ml-2 text-sm text-gray-600">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingFreeDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingFreeDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingFreeDesc3}</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-xl border-2 border-blue-600 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {t.home.pricingPopular}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{t.home.pricingBasic}</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$9.9</p>
                <p className="ml-2 text-sm text-gray-600">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingBasicDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingBasicDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingBasicDesc3}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingBasicDesc4}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.pricingPro}</h3>
              <div className="mt-4 flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">$19.9</p>
                <p className="ml-2 text-sm text-gray-600">{t.home.pricingPerMonth}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingProDesc1}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingProDesc2}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingProDesc3}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingProDesc4}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{t.home.pricingProDesc5}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-24 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm leading-relaxed text-gray-600">
            <strong className="font-semibold text-gray-900">{t.home.legalDisclaimer}</strong>
          </p>
        </div>
      </main>
    </div>
  );
}