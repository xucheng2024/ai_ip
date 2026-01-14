-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  account_type TEXT NOT NULL DEFAULT 'creator' CHECK (account_type IN ('creator', 'studio', 'enterprise')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro')),
  monthly_certifications_used INTEGER DEFAULT 0,
  monthly_certifications_limit INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  frame_hash TEXT,
  audio_hash TEXT,
  duration INTEGER,
  file_size BIGINT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  evidence_hash TEXT NOT NULL, -- Hash of canonical evidence package (for Merkle tree)
  verification_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
  tsa_timestamp_token TEXT,
  merkle_batch_id UUID REFERENCES merkle_batches(id),
  merkle_proof JSONB,
  promotion_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creation metadata table
CREATE TABLE IF NOT EXISTS creation_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  ai_tool TEXT,
  prompt_hash TEXT,
  prompt_plaintext TEXT,
  model_version TEXT,
  has_third_party_materials BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event logs table (Chain of Custody)
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

-- Evidence packages table (metadata)
CREATE TABLE IF NOT EXISTS evidence_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  package_hash TEXT NOT NULL,
  package_url TEXT,
  package_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promotion support events table
CREATE TABLE IF NOT EXISTS promotion_support_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  creator_amount DECIMAL(10, 2) NOT NULL,
  promoter_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  promoter_id UUID REFERENCES users(id),
  supporter_id UUID REFERENCES users(id),
  verification_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_file_hash ON videos(file_hash);
CREATE INDEX IF NOT EXISTS idx_certifications_video_id ON certifications(video_id);
CREATE INDEX IF NOT EXISTS idx_certifications_id ON certifications(id);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON certifications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_merkle_batch_id ON certifications(merkle_batch_id);
CREATE INDEX IF NOT EXISTS idx_certifications_status_merkle_batch ON certifications(status, merkle_batch_id);
CREATE INDEX IF NOT EXISTS idx_certifications_created_at ON certifications(created_at);
CREATE INDEX IF NOT EXISTS idx_creation_metadata_video_id ON creation_metadata(video_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_certification_id ON event_logs(certification_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_log_hash ON event_logs(log_hash);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_batch_id ON merkle_batches(batch_id);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_status ON merkle_batches(status);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_created_at ON merkle_batches(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_certification_id ON evidence_packages(certification_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_package_hash ON evidence_packages(package_hash);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_certificate_id ON promotion_support_events(certificate_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_promoter_id ON promotion_support_events(promoter_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_supporter_id ON promotion_support_events(supporter_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_created_at ON promotion_support_events(created_at);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_verification_hash ON promotion_support_events(verification_hash);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE merkle_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_support_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Users can insert own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own videos" ON videos
  FOR SELECT USING (auth.uid() = user_id);

-- Certifications policies
CREATE POLICY "Users can insert own certifications" ON certifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos WHERE videos.id = certifications.video_id AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own certifications" ON certifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM videos WHERE videos.id = certifications.video_id AND videos.user_id = auth.uid()
    )
  );

-- Public read access for verification (by certification ID)
CREATE POLICY "Public can verify certifications" ON certifications
  FOR SELECT USING (status = 'valid');

-- Creation metadata policies
CREATE POLICY "Users can insert own metadata" ON creation_metadata
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos WHERE videos.id = creation_metadata.video_id AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own metadata" ON creation_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM videos WHERE videos.id = creation_metadata.video_id AND videos.user_id = auth.uid()
    )
  );

-- Event logs policies
CREATE POLICY "Users can read own event logs" ON event_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      JOIN videos ON videos.id = certifications.video_id 
      WHERE certifications.id = event_logs.certification_id AND videos.user_id = auth.uid()
    )
  );

-- Public read access for event logs (for verification)
CREATE POLICY "Public can verify event logs" ON event_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      WHERE certifications.id = event_logs.certification_id AND certifications.status = 'valid'
    )
  );

-- Merkle batches policies (read-only for authenticated users, full access for service role)
CREATE POLICY "Authenticated can read merkle batches" ON merkle_batches
  FOR SELECT USING (true);

-- Evidence packages policies
CREATE POLICY "Users can read own evidence packages" ON evidence_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      JOIN videos ON videos.id = certifications.video_id 
      WHERE certifications.id = evidence_packages.certification_id AND videos.user_id = auth.uid()
    )
  );

-- Public read access for evidence packages (for verification)
CREATE POLICY "Public can verify evidence packages" ON evidence_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      WHERE certifications.id = evidence_packages.certification_id AND certifications.status = 'valid'
    )
  );

-- Promotion support events policies
CREATE POLICY "Public can read support events for valid certifications" ON promotion_support_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      WHERE certifications.id = promotion_support_events.certificate_id 
      AND certifications.status = 'valid'
    )
  );

CREATE POLICY "Users can read own support events" ON promotion_support_events
  FOR SELECT USING (
    promoter_id = auth.uid() OR supporter_id = auth.uid()
  );

CREATE POLICY "Creators can read own certification support events" ON promotion_support_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications 
      JOIN videos ON videos.id = certifications.video_id 
      WHERE certifications.id = promotion_support_events.certificate_id 
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create support events" ON promotion_support_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
