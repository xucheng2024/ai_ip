'use client'

import { useI18n } from '@/lib/i18n/context'

export default function PricingSection() {
  const { t, language } = useI18n()

  return (
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
  )
}
