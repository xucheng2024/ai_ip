export type AccountType = 'creator' | 'studio' | 'enterprise'
export type SubscriptionTier = 'free' | 'basic' | 'pro'
export type CertificationStatus = 'valid' | 'revoked'

// Evidence Status Model - Evidence Maturity Levels
export type EvidenceStatus = 'certified' | 'timestamped' | 'anchored' | 'revoked'

export interface User {
  id: string
  email: string
  display_name: string | null
  account_type: AccountType
  subscription_tier: SubscriptionTier
  monthly_certifications_used: number
  monthly_certifications_limit: number
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  title: string
  original_filename: string
  file_hash: string
  frame_hash: string | null
  audio_hash: string | null
  duration: number | null
  file_size: number | null
  file_url: string | null
  created_at: string
}

export interface Certification {
  id: string
  video_id: string
  timestamp_utc: string
  evidence_hash: string // Hash of canonical evidence package (Merkle tree leaf)
  verification_url: string
  status: CertificationStatus
  tsa_timestamp_token: string | null
  merkle_batch_id: string | null
  merkle_proof: any | null
  promotion_enabled: boolean | null
  created_at: string
}

export interface CreationMetadata {
  id: string
  video_id: string
  ai_tool: string | null
  prompt_hash: string | null
  prompt_plaintext: string | null
  model_version: string | null
  has_third_party_materials: boolean
  created_at: string
}

export interface CertificationFormData {
  title: string
  creatorName: string
  aiTool?: string
  prompt?: string
  promptPrivate?: boolean
  hasThirdPartyMaterials?: boolean
}

// Promotion Support Types
export interface PromotionSupportEvent {
  id: string
  certificate_id: string
  total_amount: number
  creator_amount: number
  promoter_amount: number
  platform_fee: number
  promoter_id: string | null
  supporter_id: string | null
  verification_hash: string | null
  created_at: string
}

export interface SupportAllocation {
  total_amount: number
  creator_amount: number
  promoter_amount: number
  platform_fee: number
}

export interface SupportStats {
  total_supports: number
  total_amount: number
  creator_total: number
  promoter_total: number
  platform_total: number
}
