// API route for batch processing and anchoring Merkle roots to blockchain
// Security: Rate limited, audit logged, service wallet only
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildMerkleTreeAsync } from '@/lib/utils/merkle'
import { anchorMerkleRoot } from '@/lib/utils/blockchain'
import { logEvent } from '@/lib/utils/event-log'

// Rate limiting: Max 1 batch per hour
const RATE_LIMIT_HOURS = 1

export async function POST(request: NextRequest) {
  try {
    // Verify request is from Vercel cron or has authorization
    // Security: Require CRON_SECRET for all requests (user-agent can be spoofed)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[BATCH ANCHOR] CRON_SECRET not configured')
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 })
    }

    // Require valid secret - user-agent check is informational only
    const hasValidSecret = authHeader === `Bearer ${cronSecret}`
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron')

    if (!hasValidSecret) {
      // Log suspicious access attempts
      console.warn('[BATCH ANCHOR] Unauthorized access attempt', {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Log authorized access
    if (isVercelCron) {
      console.log('[BATCH ANCHOR] Authorized request from Vercel cron')
    }

    const supabase = await createClient()

    // Rate limiting: Check last batch time
    const { data: lastBatch } = await supabase
      .from('merkle_batches')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastBatch) {
      const lastBatchTime = new Date(lastBatch.created_at).getTime()
      const now = Date.now()
      const hoursSinceLastBatch = (now - lastBatchTime) / (1000 * 60 * 60)

      if (hoursSinceLastBatch < RATE_LIMIT_HOURS) {
        return NextResponse.json({
          success: false,
          error: `Rate limit: Please wait ${Math.ceil(RATE_LIMIT_HOURS - hoursSinceLastBatch)} hours before next batch`,
          nextAllowedTime: new Date(lastBatchTime + RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString(),
        }, { status: 429 })
      }
    }

    // Get pending certifications (not yet in a batch)
    const { data: pendingCerts, error: certError } = await supabase
      .from('certifications')
      .select('id, evidence_hash, created_at')
      .is('merkle_batch_id', null)
      .eq('status', 'valid')
      .not('evidence_hash', 'is', null)
      .order('created_at', { ascending: true })
      .limit(1000) // Process up to 1000 at a time (daily batch)

    if (certError) {
      throw new Error(`Failed to fetch certifications: ${certError.message}`)
    }

    if (!pendingCerts || pendingCerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending certifications to process',
        batchId: null,
      })
    }

    // Extract evidence hashes (these are the Merkle tree leaves)
    const evidenceHashes = pendingCerts
      .map((cert: any) => cert.evidence_hash)
      .filter((hash: any): hash is string => hash !== null && hash !== undefined)

    if (evidenceHashes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No valid evidence hashes to process',
        batchId: null,
      })
    }

    // Build Merkle tree from evidence hashes
    const { root } = await buildMerkleTreeAsync(evidenceHashes)

    // Create batch record (daily batch ID format: YYYY-MM-DD)
    const batchId = `BATCH-${new Date().toISOString().split('T')[0]}`
    const { data: batch, error: batchError } = await supabase
      .from('merkle_batches')
      .insert({
        batch_id: batchId,
        merkle_root: root,
        certification_count: pendingCerts.length,
        status: 'pending',
      })
      .select()
      .single()

    if (batchError) {
      throw new Error(`Failed to create batch: ${batchError.message}`)
    }

    // Anchor to blockchain (using service wallet)
    let anchor
    try {
      anchor = await anchorMerkleRoot(root, batchId)
    } catch (anchorError: any) {
      // Update batch status to failed
      await supabase
        .from('merkle_batches')
        .update({ status: 'failed' })
        .eq('id', batch.id)

      throw new Error(`Blockchain anchoring failed: ${anchorError.message}`)
    }

    // Update batch with blockchain info
    const { error: updateError } = await supabase
      .from('merkle_batches')
      .update({
        chain_tx_hash: anchor.txHash,
        chain_block_number: anchor.blockNumber,
        chain_network: anchor.network,
        status: 'anchored',
        anchored_at: anchor.timestamp,
      })
      .eq('id', batch.id)

    if (updateError) {
      throw new Error(`Failed to update batch: ${updateError.message}`)
    }

    // Generate all Merkle proofs at once (optimized: builds tree once)
    const { generateAllMerkleProofsAsync } = await import('@/lib/utils/merkle')
    const proofsMap = await generateAllMerkleProofsAsync(evidenceHashes)
    
    // Update certifications with batch reference and Merkle proofs in parallel
    const updatePromises = pendingCerts
      .filter((cert: any) => cert.evidence_hash && proofsMap.has(cert.evidence_hash))
      .map(async (cert: any) => {
        const proof = proofsMap.get(cert.evidence_hash!)
        if (!proof) return { success: false, certId: cert.id }

        const { error } = await supabase
          .from('certifications')
          .update({
            merkle_batch_id: batch.id,
            merkle_proof: proof,
          })
          .eq('id', cert.id)

        if (error) {
          console.error(`Failed to update certification ${cert.id}:`, error)
          return { success: false, certId: cert.id }
        }
        return { success: true, certId: cert.id }
      })

    const updateResults = await Promise.all(updatePromises)
    const updateErrors = updateResults.filter((r) => !r.success).length

    if (updateErrors > 0) {
      console.warn(`Failed to update ${updateErrors} certifications`)
    }

    // Log events for each certification in parallel
    const logPromises = pendingCerts.map(async (cert: any) => {
      try {
        await logEvent(cert.id, 'anchored_on_chain', {
          batchId: batch.id,
          merkleRoot: root,
          txHash: anchor.txHash,
          blockNumber: anchor.blockNumber,
          walletAddress: anchor.walletAddress,
        })
      } catch (error) {
        console.error(`Failed to log event for ${cert.id}:`, error)
      }
    })
    await Promise.all(logPromises)

    // Audit log
    console.log('[BATCH ANCHOR]', {
      batchId: batch.id,
      evidenceCount: pendingCerts.length,
      merkleRoot: root.substring(0, 16) + '...',
      txHash: anchor.txHash,
      blockNumber: anchor.blockNumber,
      network: anchor.network,
      walletAddress: anchor.walletAddress,
      timestamp: anchor.timestamp,
    })

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      merkleRoot: root,
      evidenceCount: pendingCerts.length,
      blockchainAnchor: anchor,
    })
  } catch (error: any) {
    console.error('[BATCH ANCHOR ERROR]', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process batch',
      },
      { status: 500 }
    )
  }
}
