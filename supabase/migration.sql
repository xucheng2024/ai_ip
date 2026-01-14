-- Migration script for trust infrastructure updates
-- Run this in Supabase SQL Editor if you have an existing database

-- Step 1: Add new tables (if they don't exist)
-- These will be created by schema.sql, but we add them here for safety

-- Event logs table
CREATE TABLE IF NOT EXISTS event_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'upload_received',
    'hash_computed',
    'frames_extracted',
    'audio_extracted',
    'timestamp_requested',
    'timestamp_received',
    'anchored_on_chain',
    'certificate_issued'
  )),
  event_data JSONB,
  previous_log_hash TEXT,
  log_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merkle batches table
CREATE TABLE IF NOT EXISTS merkle_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id TEXT UNIQUE NOT NULL,
  merkle_root TEXT NOT NULL,
  certification_count INTEGER NOT NULL,
  chain_tx_hash TEXT,
  chain_block_number BIGINT,
  chain_network TEXT DEFAULT 'polygon',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'anchored', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  anchored_at TIMESTAMPTZ
);

-- Evidence packages table
CREATE TABLE IF NOT EXISTS evidence_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  package_hash TEXT NOT NULL,
  package_url TEXT,
  package_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Migrate certifications table
-- Check if evidence_hash column exists
DO $$
BEGIN
  -- Add evidence_hash column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'evidence_hash'
  ) THEN
    -- If hash_on_chain exists, migrate data
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'certifications' AND column_name = 'hash_on_chain'
    ) THEN
      -- Migrate: copy hash_on_chain to evidence_hash
      ALTER TABLE certifications 
      ADD COLUMN evidence_hash TEXT;
      
      UPDATE certifications 
      SET evidence_hash = hash_on_chain 
      WHERE hash_on_chain IS NOT NULL;
      
      -- For records without hash_on_chain, generate from certification ID
      UPDATE certifications 
      SET evidence_hash = encode(digest(id, 'sha256'), 'hex')
      WHERE evidence_hash IS NULL;
      
      -- Make it NOT NULL after migration
      ALTER TABLE certifications 
      ALTER COLUMN evidence_hash SET NOT NULL;
    ELSE
      -- No hash_on_chain, just add evidence_hash
      ALTER TABLE certifications 
      ADD COLUMN evidence_hash TEXT NOT NULL DEFAULT encode(digest(id, 'sha256'), 'hex');
    END IF;
  END IF;
END $$;

-- Step 3: Add new columns to certifications if they don't exist
DO $$
BEGIN
  -- Add tsa_timestamp_token if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'tsa_timestamp_token'
  ) THEN
    ALTER TABLE certifications ADD COLUMN tsa_timestamp_token TEXT;
  END IF;

  -- Add merkle_batch_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'merkle_batch_id'
  ) THEN
    ALTER TABLE certifications ADD COLUMN merkle_batch_id UUID REFERENCES merkle_batches(id);
  END IF;

  -- Add merkle_proof if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'merkle_proof'
  ) THEN
    ALTER TABLE certifications ADD COLUMN merkle_proof JSONB;
  END IF;
END $$;

-- Step 4: Remove old columns (if they exist and are no longer needed)
DO $$
BEGIN
  -- Remove evidence_package_hash if it exists (replaced by evidence_hash)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'evidence_package_hash'
  ) THEN
    ALTER TABLE certifications DROP COLUMN evidence_package_hash;
  END IF;
  
  -- Note: We keep hash_on_chain for now if it exists (for backward compatibility)
  -- You can remove it later after confirming everything works:
  -- ALTER TABLE certifications DROP COLUMN hash_on_chain;
END $$;

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_event_logs_certification_id ON event_logs(certification_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_log_hash ON event_logs(log_hash);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_batch_id ON merkle_batches(batch_id);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_status ON merkle_batches(status);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_created_at ON merkle_batches(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_certification_id ON evidence_packages(certification_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_package_hash ON evidence_packages(package_hash);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON certifications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_merkle_batch_id ON certifications(merkle_batch_id);
CREATE INDEX IF NOT EXISTS idx_certifications_status_merkle_batch ON certifications(status, merkle_batch_id);
CREATE INDEX IF NOT EXISTS idx_certifications_created_at ON certifications(created_at);

-- Step 6: Enable RLS on new tables
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE merkle_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_packages ENABLE ROW LEVEL SECURITY;

-- Step 7: Add RLS policies for new tables (only if they don't exist)
-- Event logs policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'event_logs' 
    AND policyname = 'Users can read own event logs'
  ) THEN
    CREATE POLICY "Users can read own event logs" ON event_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          JOIN videos ON videos.id = certifications.video_id 
          WHERE certifications.id = event_logs.certification_id AND videos.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'event_logs' 
    AND policyname = 'Public can verify event logs'
  ) THEN
    CREATE POLICY "Public can verify event logs" ON event_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          WHERE certifications.id = event_logs.certification_id AND certifications.status = 'valid'
        )
      );
  END IF;
END $$;

-- Merkle batches policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'merkle_batches' 
    AND policyname = 'Authenticated can read merkle batches'
  ) THEN
    CREATE POLICY "Authenticated can read merkle batches" ON merkle_batches
      FOR SELECT USING (true);
  END IF;
END $$;

-- Evidence packages policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evidence_packages' 
    AND policyname = 'Users can read own evidence packages'
  ) THEN
    CREATE POLICY "Users can read own evidence packages" ON evidence_packages
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          JOIN videos ON videos.id = certifications.video_id 
          WHERE certifications.id = evidence_packages.certification_id AND videos.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evidence_packages' 
    AND policyname = 'Public can verify evidence packages'
  ) THEN
    CREATE POLICY "Public can verify evidence packages" ON evidence_packages
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          WHERE certifications.id = evidence_packages.certification_id AND certifications.status = 'valid'
        )
      );
  END IF;
END $$;

-- Migration complete!
SELECT 'Migration completed successfully!' AS status;
