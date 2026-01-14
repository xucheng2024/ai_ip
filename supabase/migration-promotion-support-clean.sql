-- Migration script for Promotion Support feature
-- Run this in Supabase SQL Editor

-- Step 1: Add promotion_enabled column to certifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'promotion_enabled'
  ) THEN
    ALTER TABLE certifications 
    ADD COLUMN promotion_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Step 2: Create promotion_support_events table
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

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_certificate_id ON promotion_support_events(certificate_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_promoter_id ON promotion_support_events(promoter_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_supporter_id ON promotion_support_events(supporter_id);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_created_at ON promotion_support_events(created_at);
CREATE INDEX IF NOT EXISTS idx_promotion_support_events_verification_hash ON promotion_support_events(verification_hash);

-- Step 4: Enable RLS
ALTER TABLE promotion_support_events ENABLE ROW LEVEL SECURITY;

-- Step 5: Add RLS policies (with IF NOT EXISTS check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'promotion_support_events' 
    AND policyname = 'Public can read support events for valid certifications'
  ) THEN
    CREATE POLICY "Public can read support events for valid certifications" ON promotion_support_events
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          WHERE certifications.id = promotion_support_events.certificate_id 
          AND certifications.status = 'valid'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'promotion_support_events' 
    AND policyname = 'Users can read own support events'
  ) THEN
    CREATE POLICY "Users can read own support events" ON promotion_support_events
      FOR SELECT USING (
        promoter_id = auth.uid() OR supporter_id = auth.uid()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'promotion_support_events' 
    AND policyname = 'Creators can read own certification support events'
  ) THEN
    CREATE POLICY "Creators can read own certification support events" ON promotion_support_events
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM certifications 
          JOIN videos ON videos.id = certifications.video_id 
          WHERE certifications.id = promotion_support_events.certificate_id 
          AND videos.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'promotion_support_events' 
    AND policyname = 'Authenticated users can create support events'
  ) THEN
    CREATE POLICY "Authenticated users can create support events" ON promotion_support_events
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

SELECT 'Promotion Support migration completed successfully!' AS status;
