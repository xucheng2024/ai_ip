-- Safe migration script (only adds new tables/columns, doesn't recreate existing ones)
-- Run this if you get "already exists" errors

-- Step 1: Add new tables (only if they don't exist)
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

CREATE TABLE IF NOT EXISTS evidence_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  package_hash TEXT NOT NULL,
  package_url TEXT,
  package_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add evidence_hash column to certifications (if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'certifications' 
    AND column_name = 'evidence_hash'
  ) THEN
    -- Check if hash_on_chain exists to migrate data
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'certifications' 
      AND column_name = 'hash_on_chain'
    ) THEN
      -- Migrate: copy hash_on_chain to evidence_hash
      ALTER TABLE certifications ADD COLUMN evidence_hash TEXT;
      UPDATE certifications SET evidence_hash = hash_on_chain WHERE hash_on_chain IS NOT NULL;
      UPDATE certifications SET evidence_hash = encode(digest(id, 'sha256'), 'hex') WHERE evidence_hash IS NULL;
      ALTER TABLE certifications ALTER COLUMN evidence_hash SET NOT NULL;
    ELSE
      -- No hash_on_chain, add evidence_hash with default
      ALTER TABLE certifications ADD COLUMN evidence_hash TEXT NOT NULL DEFAULT encode(digest(id, 'sha256'), 'hex');
    END IF;
  END IF;
END $$;

-- Step 3: Add other new columns to certifications (if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'certifications' 
    AND column_name = 'tsa_timestamp_token'
  ) THEN
    ALTER TABLE certifications ADD COLUMN tsa_timestamp_token TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'certifications' 
    AND column_name = 'merkle_batch_id'
  ) THEN
    ALTER TABLE certifications ADD COLUMN merkle_batch_id UUID REFERENCES merkle_batches(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'certifications' 
    AND column_name = 'merkle_proof'
  ) THEN
    ALTER TABLE certifications ADD COLUMN merkle_proof JSONB;
  END IF;
END $$;

-- Step 4: Create indexes (if missing)
CREATE INDEX IF NOT EXISTS idx_event_logs_certification_id ON event_logs(certification_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_log_hash ON event_logs(log_hash);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_batch_id ON merkle_batches(batch_id);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_status ON merkle_batches(status);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_created_at ON merkle_batches(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_certification_id ON evidence_packages(certification_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_package_hash ON evidence_packages(package_hash);

-- Step 5: Enable RLS (safe - won't error if already enabled)
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE merkle_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_packages ENABLE ROW LEVEL SECURITY;

-- Step 6: Add RLS policies (only if they don't exist)
DO $$
BEGIN
  -- Event logs: Users can read own event logs
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

  -- Event logs: Public can verify event logs
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

  -- Merkle batches: Authenticated can read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'merkle_batches' 
    AND policyname = 'Authenticated can read merkle batches'
  ) THEN
    CREATE POLICY "Authenticated can read merkle batches" ON merkle_batches
      FOR SELECT USING (true);
  END IF;

  -- Evidence packages: Users can read own
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

  -- Evidence packages: Public can verify
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

SELECT 'Safe migration completed successfully!' AS status;
