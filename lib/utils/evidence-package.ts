// Verifiable Evidence Package Generator
// Creates canonical, independently verifiable evidence packages

import { generateHashFromString } from './hash'

// Canonical Evidence Package Structure (for blockchain anchoring)
export interface CanonicalEvidencePackage {
  version: string
  video: {
    file_hash: string
    duration?: number
    resolution?: string
    frame_hashes?: Array<{ t: number; hash: string }>
    audio_hash?: string
  }
  creator: {
    user_id: string
    identity_level: 'L0' | 'L1' | 'L2' | 'L3'
  }
  timestamps: {
    server_time_utc: string
    tsa_token?: string
  }
  metadata?: {
    title: string
    ai_tool?: string
    prompt_hash?: string
    has_third_party_materials: boolean
  }
}

// Hash Manifest - Index of all hashes in the package
export interface HashManifest {
  evidence_hash: string
  merkle_root?: string
  tx_hash?: string
  block_time?: string
  included_files: Array<{
    name: string
    hash: string
    type: 'video' | 'frame' | 'audio' | 'metadata'
  }>
}

// Creator Continuity Chain
export interface CreatorContinuity {
  previous_evidence_hash?: string
  chain_position?: number
  creator_root?: string
}

// Full Evidence Package (includes verification data)
export interface EvidencePackage extends CanonicalEvidencePackage {
  certification_id: string
  verification_url: string
  manifest?: HashManifest
  creator_continuity?: CreatorContinuity
  blockchain?: {
    merkle_root?: string
    merkle_proof?: {
      leaf: string
      path: string[]
      indices: number[]
      root: string
    }
    chain_tx_hash?: string
    chain_block_number?: number
    chain_block_time_utc?: string
    chain_network?: string
  }
  chain_of_custody?: {
    events: Array<{
      event_type: string
      timestamp: string
      log_hash: string
      previous_log_hash?: string
    }>
  }
}

/**
 * Generate canonical evidence package (for hashing and blockchain)
 */
export async function generateCanonicalEvidencePackage(
  video: any,
  metadata: any,
  certification: any,
  userId: string,
  identityLevel: 'L0' | 'L1' | 'L2' | 'L3' = 'L0',
  frameHashes?: Array<{ t: number; hash: string }>
): Promise<CanonicalEvidencePackage> {
  // Extract resolution from video if available
  const resolution = video.resolution || undefined

  // Build frame hashes array if available
  const frameHashesArray: Array<{ t: number; hash: string }> = []
  if (frameHashes && frameHashes.length > 0) {
    frameHashesArray.push(...frameHashes)
  } else if (video.frame_hash) {
    // Fallback: use single frame hash at time 0
    frameHashesArray.push({ t: 0, hash: video.frame_hash })
  }

  const evidence: CanonicalEvidencePackage = {
    version: '1.0',
    video: {
      file_hash: video.file_hash,
      duration: video.duration || undefined,
      resolution: resolution,
      frame_hashes: frameHashesArray.length > 0 ? frameHashesArray : undefined,
      audio_hash: video.audio_hash || undefined,
    },
    creator: {
      user_id: userId,
      identity_level: identityLevel,
    },
    timestamps: {
      server_time_utc: certification.timestamp_utc,
      tsa_token: certification.tsa_timestamp_token || undefined,
    },
    metadata: {
      title: video.title,
      ai_tool: metadata?.ai_tool || undefined,
      prompt_hash: metadata?.prompt_hash || undefined,
      has_third_party_materials: metadata?.has_third_party_materials || false,
    },
  }

  return evidence
}

/**
 * Canonicalize JSON (sort keys recursively)
 * Ensures consistent hash calculation
 */
function canonicalizeJSON(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(canonicalizeJSON)
  }

  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    sorted[key] = canonicalizeJSON(obj[key])
  }
  return sorted
}

/**
 * Calculate evidence hash from canonical evidence package
 */
export async function calculateEvidenceHash(
  evidence: CanonicalEvidencePackage
): Promise<string> {
  // Canonicalize JSON (sort keys)
  const canonical = canonicalizeJSON(evidence)
  // Stringify without spaces (compact)
  const jsonString = JSON.stringify(canonical)
  // Calculate SHA-256 hash
  return await generateHashFromString(jsonString)
}

/**
 * Generate hash manifest for evidence package
 */
export async function generateHashManifest(
  canonicalEvidence: CanonicalEvidencePackage,
  evidenceHash: string,
  merkleRoot?: string,
  blockchainAnchor?: any
): Promise<HashManifest> {
  const includedFiles: HashManifest['included_files'] = []

  // Add video hash
  if (canonicalEvidence.video.file_hash) {
    includedFiles.push({
      name: 'video_file',
      hash: canonicalEvidence.video.file_hash,
      type: 'video',
    })
  }

  // Add frame hashes
  if (canonicalEvidence.video.frame_hashes) {
    canonicalEvidence.video.frame_hashes.forEach((fh, idx) => {
      includedFiles.push({
        name: `frame_${fh.t}s`,
        hash: fh.hash,
        type: 'frame',
      })
    })
  }

  // Add audio hash
  if (canonicalEvidence.video.audio_hash) {
    includedFiles.push({
      name: 'audio_track',
      hash: canonicalEvidence.video.audio_hash,
      type: 'audio',
    })
  }

  // Add metadata hash if prompt hash exists
  if (canonicalEvidence.metadata?.prompt_hash) {
    includedFiles.push({
      name: 'prompt_hash',
      hash: canonicalEvidence.metadata.prompt_hash,
      type: 'metadata',
    })
  }

  return {
    evidence_hash: evidenceHash,
    merkle_root: merkleRoot || blockchainAnchor?.merkleRoot,
    tx_hash: blockchainAnchor?.txHash,
    block_time: blockchainAnchor?.timestamp,
    included_files: includedFiles,
  }
}

/**
 * Generate full evidence package (for download/verification)
 */
export async function generateFullEvidencePackage(
  canonicalEvidence: CanonicalEvidencePackage,
  certificationId: string,
  verificationUrl: string,
  evidenceHash: string,
  merkleProof?: any,
  blockchainAnchor?: any,
  eventLogs?: any[],
  previousEvidenceHash?: string | null,
  creatorContinuityChain?: number
): Promise<EvidencePackage> {
  const merkleRoot = merkleProof?.root || blockchainAnchor?.merkleRoot

  // Generate manifest
  const manifest = await generateHashManifest(
    canonicalEvidence,
    evidenceHash,
    merkleRoot,
    blockchainAnchor
  )

  // Generate creator continuity info
  const creatorContinuity: CreatorContinuity | undefined = previousEvidenceHash
    ? {
        previous_evidence_hash: previousEvidenceHash,
        chain_position: creatorContinuityChain,
      }
    : undefined

  const fullPackage: EvidencePackage = {
    ...canonicalEvidence,
    certification_id: certificationId,
    verification_url: verificationUrl,
    manifest,
    creator_continuity: creatorContinuity,
    blockchain: merkleProof || blockchainAnchor
      ? {
          merkle_root: merkleRoot,
          merkle_proof: merkleProof
            ? {
                leaf: merkleProof.leaf,
                path: merkleProof.path,
                indices: merkleProof.indices,
                root: merkleProof.root,
              }
            : undefined,
          chain_tx_hash: blockchainAnchor?.txHash,
          chain_block_number: blockchainAnchor?.blockNumber,
          chain_block_time_utc: blockchainAnchor?.timestamp,
          chain_network: blockchainAnchor?.network || 'polygon',
        }
      : undefined,
    chain_of_custody: eventLogs && eventLogs.length > 0
      ? {
          events: eventLogs.map((log) => ({
            event_type: log.event_type,
            timestamp: log.created_at,
            log_hash: log.log_hash,
            previous_log_hash: log.previous_log_hash || undefined,
          })),
        }
      : undefined,
  }

  return fullPackage
}

/**
 * Export evidence package as canonical JSON
 */
export function exportEvidencePackageAsJSON(packageData: EvidencePackage): string {
  return JSON.stringify(packageData, null, 2)
}

/**
 * Verify evidence package integrity
 */
export async function verifyEvidencePackage(
  packageData: EvidencePackage
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  // Extract canonical evidence (without blockchain/verification fields)
  const canonicalEvidence: CanonicalEvidencePackage = {
    version: packageData.version,
    video: packageData.video,
    creator: packageData.creator,
    timestamps: packageData.timestamps,
    metadata: packageData.metadata,
  }

  // Verify evidence hash matches
  const expectedHash = await calculateEvidenceHash(canonicalEvidence)

  // Check if hash is in Merkle proof
  if (packageData.blockchain?.merkle_proof) {
    if (packageData.blockchain.merkle_proof.leaf !== expectedHash) {
      errors.push('Evidence hash does not match Merkle proof leaf')
    }
  }

  // Verify chain of custody if present
  if (packageData.chain_of_custody?.events) {
    for (let i = 0; i < packageData.chain_of_custody.events.length; i++) {
      const event = packageData.chain_of_custody.events[i]

      if (i > 0) {
        const previousEvent = packageData.chain_of_custody.events[i - 1]
        if (event.previous_log_hash !== previousEvent.log_hash) {
          errors.push(`Chain of custody broken at event ${i}`)
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
