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

  // Calculate stats
  const totalBatches = batches?.length || 0
  const totalCertifications = batches?.reduce((sum: number, b: { certification_count?: number | null }) => sum + (b.certification_count || 0), 0) || 0
  const dateRange = batches && batches.length > 0
    ? {
        earliest: batches[batches.length - 1]?.created_at,
        latest: batches[0]?.created_at,
      }
    : null

  return (
    <TransparencyContent
      batches={batches || []}
      totalBatches={totalBatches}
      totalCertifications={totalCertifications}
      dateRange={dateRange}
    />
  )
}
