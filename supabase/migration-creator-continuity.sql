-- Migration: Add creator continuity proof
-- This allows linking certifications to form a hash chain per creator

-- Add previous_evidence_hash column to certifications table
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS previous_evidence_hash TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_certifications_previous_evidence_hash 
ON certifications(previous_evidence_hash);

-- Add comment
COMMENT ON COLUMN certifications.previous_evidence_hash IS 
'Hash of previous certification by the same creator, forming a continuity chain';
