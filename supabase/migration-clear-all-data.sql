-- Migration: Clear all application data (keeps auth.users intact)
-- This script deletes all data from application tables in the correct order
-- Run this in Supabase SQL Editor
-- WARNING: This will delete ALL application data!

-- ============================================
-- PART 1: Disable triggers temporarily
-- ============================================
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- ============================================
-- PART 2: Delete data in reverse dependency order
-- ============================================

-- Delete promotion support events (references certifications)
DELETE FROM public.promotion_support_events;

-- Delete evidence packages (references certifications)
DELETE FROM public.evidence_packages;

-- Delete event logs (references certifications)
DELETE FROM public.event_logs;

-- Delete certifications (references videos)
DELETE FROM public.certifications;

-- Delete creation metadata (references videos)
DELETE FROM public.creation_metadata;

-- Delete videos (references users)
DELETE FROM public.videos;

-- Delete users (references nothing, but keep auth.users)
DELETE FROM public.users;

-- Delete merkle batches (standalone)
DELETE FROM public.merkle_batches;

-- ============================================
-- PART 3: Reset sequences if any
-- ============================================
-- Note: UUIDs don't use sequences, but if you have any sequences, reset them here

-- ============================================
-- PART 4: Re-enable triggers
-- ============================================
ALTER TABLE auth.users ENABLE TRIGGER ALL;

-- ============================================
-- PART 5: Verification - check table counts
-- ============================================
SELECT 
  'users' as table_name,
  COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
  'videos',
  COUNT(*)
FROM public.videos
UNION ALL
SELECT 
  'certifications',
  COUNT(*)
FROM public.certifications
UNION ALL
SELECT 
  'event_logs',
  COUNT(*)
FROM public.event_logs
UNION ALL
SELECT 
  'evidence_packages',
  COUNT(*)
FROM public.evidence_packages
UNION ALL
SELECT 
  'promotion_support_events',
  COUNT(*)
FROM public.promotion_support_events
UNION ALL
SELECT 
  'merkle_batches',
  COUNT(*)
FROM public.merkle_batches
UNION ALL
SELECT 
  'creation_metadata',
  COUNT(*)
FROM public.creation_metadata;

-- Show auth.users count (should remain)
SELECT 
  COUNT(*) as auth_users_count,
  'auth.users records (NOT deleted)' as note
FROM auth.users;

SELECT 'Database cleared! All application data deleted. auth.users remains intact.' AS status;
