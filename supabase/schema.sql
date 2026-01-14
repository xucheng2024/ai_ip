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
  hash_on_chain TEXT,
  verification_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_file_hash ON videos(file_hash);
CREATE INDEX IF NOT EXISTS idx_certifications_video_id ON certifications(video_id);
CREATE INDEX IF NOT EXISTS idx_certifications_id ON certifications(id);
CREATE INDEX IF NOT EXISTS idx_creation_metadata_video_id ON creation_metadata(video_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_metadata ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

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
