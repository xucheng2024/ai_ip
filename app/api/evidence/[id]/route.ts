// API route to generate and download evidence packages
import { NextRequest, NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  generateCanonicalEvidencePackage,
  generateFullEvidencePackage,
  exportEvidencePackageAsJSON,
} from '@/lib/utils/evidence-package'
import { getEventLogs } from '@/lib/utils/event-log'
import { generateMerkleProofAsync } from '@/lib/utils/merkle'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get certification with all related data
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .select(
        `
        *,
        videos (
          *,
          creation_metadata (*)
        )
      `
      )
      .eq('id', id)
      .eq('status', 'valid')
      .single()

    if (certError || !certification) {
      notFound()
    }

    const video = certification.videos as any
    const metadata = video?.creation_metadata?.[0] || null

    // Get event logs
    const eventLogs = await getEventLogs(id)

    // Get Merkle proof if available
    let merkleProof = null
    if (certification.merkle_batch_id) {
      const { data: batch } = await supabase
        .from('merkle_batches')
        .select('*')
        .eq('id', certification.merkle_batch_id)
        .single()

      if (batch) {
        // Get all certifications in the batch to build proof
        const { data: batchCerts } = await supabase
          .from('certifications')
          .select('id, evidence_hash')
          .eq('merkle_batch_id', certification.merkle_batch_id)
          .not('evidence_hash', 'is', null)

        if (batchCerts) {
          const hashes = batchCerts
            .map((c) => c.evidence_hash)
            .filter((h): h is string => h !== null && h !== undefined)
          const certHash = certification.evidence_hash
          if (certHash) {
            merkleProof = await generateMerkleProofAsync(hashes, certHash)
          }
        }
      }
    }

    // Get blockchain anchor info
    let blockchainAnchor = null
    if (certification.merkle_batch_id) {
      const { data: batch } = await supabase
        .from('merkle_batches')
        .select('chain_tx_hash, chain_block_number, chain_network, merkle_root')
        .eq('id', certification.merkle_batch_id)
        .single()

      if (batch) {
        blockchainAnchor = {
          txHash: batch.chain_tx_hash,
          blockNumber: batch.chain_block_number,
          network: batch.chain_network,
          merkleRoot: batch.merkle_root,
        }
      }
    }

    // Generate canonical evidence package
    const canonicalEvidence = await generateCanonicalEvidencePackage(
      video,
      metadata,
      certification,
      video.user_id,
      'L0' // Can be enhanced based on user verification level
    )

    // Generate full evidence package with verification data
    const evidencePackage = await generateFullEvidencePackage(
      canonicalEvidence,
      id,
      certification.verification_url,
      merkleProof,
      blockchainAnchor,
      eventLogs
    )

    // Return as JSON download
    const jsonContent = exportEvidencePackageAsJSON(evidencePackage)

    return new NextResponse(jsonContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="evidence-${id}.json"`,
      },
    })
  } catch (error: any) {
    console.error('Evidence package generation error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate evidence package',
      },
      { status: 500 }
    )
  }
}
