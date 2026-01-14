import { EvidenceStatus } from '@/lib/types'

/**
 * Determine evidence status from certification data
 * This utility can be used in both server and client components
 */
export function getEvidenceStatus(
  certification: {
    status: string
    tsa_timestamp_token?: string | null
    merkle_batch_id?: string | null
  },
  batchStatus?: string | null
): EvidenceStatus {
  if (certification.status === 'revoked') {
    return 'revoked'
  }
  // Check if batch is anchored (status === 'anchored')
  if (certification.merkle_batch_id && batchStatus === 'anchored') {
    return 'anchored'
  }
  if (certification.tsa_timestamp_token) {
    return 'timestamped'
  }
  return 'certified'
}
