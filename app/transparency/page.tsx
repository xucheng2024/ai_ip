import { createClient } from '@/lib/supabase/server'
import TransparencyContent from '@/components/TransparencyContent'

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

  // Generate demo data if no batches exist
  const hasRealBatches = batches && batches.length > 0
  let displayBatches = batches || []
  let isDemo = false

  if (!hasRealBatches) {
    isDemo = true
    // Generate demo batches
    const now = new Date()
    displayBatches = [
      {
        id: 'demo-1',
        batch_id: 'BATCH-2024-001',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        anchored_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        certification_count: 12,
        merkle_root: '0x' + 'a'.repeat(64),
        chain_tx_hash: '0x' + 'b'.repeat(64),
        chain_block_number: 12345678,
        status: 'anchored'
      },
      {
        id: 'demo-2',
        batch_id: 'BATCH-2024-002',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        anchored_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        certification_count: 8,
        merkle_root: '0x' + 'c'.repeat(64),
        chain_tx_hash: '0x' + 'd'.repeat(64),
        chain_block_number: 12345900,
        status: 'anchored'
      },
      {
        id: 'demo-3',
        batch_id: 'BATCH-2024-003',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        anchored_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        certification_count: 15,
        merkle_root: '0x' + 'e'.repeat(64),
        chain_tx_hash: '0x' + 'f'.repeat(64),
        chain_block_number: 12346100,
        status: 'anchored'
      }
    ]
  }

  // Calculate stats
  const totalBatches = displayBatches.length
  const totalCertifications = displayBatches.reduce((sum: number, b: { certification_count?: number | null }) => sum + (b.certification_count || 0), 0)
  const dateRange = displayBatches.length > 0
    ? {
        earliest: displayBatches[displayBatches.length - 1]?.created_at,
        latest: displayBatches[0]?.created_at,
      }
    : null

  return (
    <TransparencyContent
      batches={displayBatches}
      totalBatches={totalBatches}
      totalCertifications={totalCertifications}
      dateRange={dateRange}
      isDemo={isDemo}
    />
  )
}
