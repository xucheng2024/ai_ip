'use client'

import { useI18n } from '@/lib/i18n/context'
import { format } from 'date-fns'
import Link from 'next/link'

interface TransparencyContentProps {
  batches: any[]
  totalBatches: number
  totalCertifications: number
  dateRange: { earliest: string; latest: string } | null
}

export default function TransparencyContent({
  batches,
  totalBatches,
  totalCertifications,
  dateRange,
}: TransparencyContentProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {t.transparency.title}
              </h1>
              <p className="mt-2 text-base text-gray-600">
                {t.transparency.subtitle}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t.transparency.backToHome}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">{t.transparency.totalBatches}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalBatches}</p>
            <p className="mt-1 text-xs text-gray-500">
              {dateRange
                ? `${format(new Date(dateRange.earliest), 'MMM d, yyyy')} - ${format(new Date(dateRange.latest), 'MMM d, yyyy')}`
                : t.transparency.noBatches}
            </p>
            {totalBatches === 0 && t.transparency.coldStartMessage && (
              <p className="mt-2 text-xs text-blue-600 italic">
                {t.transparency.coldStartMessage}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">{t.transparency.totalCertifications}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalCertifications}</p>
            <p className="mt-1 text-xs text-gray-500">{t.transparency.anchoredToBlockchain}</p>
            {totalCertifications === 0 && t.transparency.coldStartNote && (
              <p className="mt-2 text-xs text-blue-600 italic">
                {t.transparency.coldStartNote}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">{t.transparency.network}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">Polygon</p>
            <p className="mt-1 text-xs text-gray-500">{t.transparency.proofOfStake}</p>
          </div>
        </div>

        {/* Batches Table */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t.transparency.recentBatches}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {t.transparency.ctDescription}
            </p>
          </div>
          {batches && batches.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.batchId}
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.dateTime}
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.certifications}
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.merkleRoot}
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.transaction}
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t.transparency.block}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {batch.batch_id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                        <div>{format(new Date(batch.created_at), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(batch.created_at), 'HH:mm:ss')} UTC
                        </div>
                        {batch.anchored_at && (
                          <div className="mt-1 text-xs text-blue-600">
                            {t.transparency.anchored} {format(new Date(batch.anchored_at), 'HH:mm:ss')}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-900">
                        {batch.certification_count}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="max-w-xs truncate font-mono text-xs text-gray-600">
                          {batch.merkle_root}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {batch.chain_tx_hash ? (
                          <a
                            href={`https://polygonscan.com/tx/${batch.chain_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {t.transparency.view}
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">{t.transparency.pending}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                        {batch.chain_block_number ? (
                          <a
                            href={`https://polygonscan.com/block/${batch.chain_block_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            {batch.chain_block_number.toLocaleString()}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900">{t.transparency.noBatches}</p>
              <p className="mt-1 text-sm text-gray-500">
                {t.transparency.noBatchesDesc}
              </p>
              {t.transparency.coldStartMessage && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    {t.transparency.coldStartMessage}
                  </p>
                  {t.transparency.coldStartNote && (
                    <p className="mt-1 text-xs text-blue-700 italic">
                      {t.transparency.coldStartNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-blue-900">{t.transparency.aboutTitle}</h3>
          <ul className="mt-2 space-y-1 text-xs text-blue-800">
            <li>• {t.transparency.aboutItem1}</li>
            <li>• {t.transparency.aboutItem2}</li>
            <li>• {t.transparency.aboutItem3}</li>
            <li>• {t.transparency.aboutItem4}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
