-- Migration: Add thumbnail_url to videos table
-- Run this migration to add thumbnail support

ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_thumbnail_url ON videos(thumbnail_url) WHERE thumbnail_url IS NOT NULL;
