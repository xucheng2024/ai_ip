import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function TransparencyPage() {
  const supabase = await createClient()

  // Get all anchored batches, ordered by date
  const { data: batches, error } = await supabase
    .from('merkle_batches')
    .select('*')
    .eq('status', 'anchored')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching batches:', error)
  }

  // Calculate stats
  const totalBatches = batches?.length || 0
  const totalCertifications = batches?.reduce((sum, b) => sum + (b.certification_count || 0), 0) || 0
  const dateRange = batches && batches.length > 0
    ? {
        earliest: batches[batches.length - 1]?.created_at,
        latest: batches[0]?.created_at,
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Transparency Log
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Public record of all blockchain-anchored evidence batches
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Batches</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalBatches}</p>
            <p className="mt-1 text-xs text-gray-500">
              {dateRange
                ? `${format(new Date(dateRange.earliest!), 'MMM d, yyyy')} - ${format(new Date(dateRange.latest!), 'MMM d, yyyy')}`
                : 'No batches yet'}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Certifications</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalCertifications}</p>
            <p className="mt-1 text-xs text-gray-500">Anchored to blockchain</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Network</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">Polygon</p>
            <p className="mt-1 text-xs text-gray-500">Proof of Stake</p>
          </div>
        </div>

        {/* Batches Table */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Batches</h2>
            <p className="mt-1 text-sm text-gray-500">
              Certificate Transparency log - similar to Certificate Transparency but for AI content evidence
            </p>
          </div>
          {batches && batches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Certifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Merkle Root
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Block
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {batch.batch_id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        <div>{format(new Date(batch.created_at), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(batch.created_at), 'HH:mm:ss')} UTC
                        </div>
                        {batch.anchored_at && (
                          <div className="mt-1 text-xs text-blue-600">
                            Anchored: {format(new Date(batch.anchored_at), 'HH:mm:ss')}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {batch.certification_count}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate font-mono text-xs text-gray-600">
                          {batch.merkle_root}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {batch.chain_tx_hash ? (
                          <a
                            href={`https://polygonscan.com/tx/${batch.chain_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
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
                          <span className="text-sm text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
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
              <p className="text-base font-medium text-gray-900">No batches yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Batches will appear here once they are anchored to the blockchain
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-blue-900">About This Log</h3>
          <ul className="mt-2 space-y-1 text-xs text-blue-800">
            <li>• All batches are anchored to Polygon blockchain for public verification</li>
            <li>• Merkle roots enable efficient batch verification of individual certificates</li>
            <li>• Each transaction is publicly auditable on PolygonScan</li>
            <li>• This transparency log demonstrates platform integrity and accountability</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
