'use client'

import { useI18n } from '@/lib/i18n/context'

export default function FeaturesSection() {
  const { t, language } = useI18n()

  return (
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
  )
}
