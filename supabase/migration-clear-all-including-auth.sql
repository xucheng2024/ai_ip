-- Migration: Clear ALL data including auth.users
-- ⚠️ WARNING: This will delete ALL users and ALL data!
-- This will require users to re-register.
-- Run this in Supabase SQL Editor
-- USE WITH EXTREME CAUTION!

-- ============================================
-- PART 1: Disable triggers temporarily
-- ============================================
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- ============================================
-- PART 2: Delete application data first
-- ============================================

-- Delete promotion support events
DELETE FROM public.promotion_support_events;

-- Delete evidence packages
DELETE FROM public.evidence_packages;

-- Delete event logs
DELETE FROM public.event_logs;

-- Delete certifications
DELETE FROM public.certifications;

-- Delete creation metadata
DELETE FROM public.creation_metadata;

-- Delete videos
DELETE FROM public.videos;

-- Delete users
DELETE FROM public.users;

-- Delete merkle batches
DELETE FROM public.merkle_batches;

-- ============================================
-- PART 3: Delete auth data (WARNING: This deletes all users!)
-- ============================================

-- Delete auth sessions
DELETE FROM auth.sessions;

-- Delete auth refresh tokens
DELETE FROM auth.refresh_tokens;

-- Delete auth users (THIS DELETES ALL USER ACCOUNTS!)
DELETE FROM auth.users;

-- ============================================
-- PART 4: Re-enable triggers
-- ============================================
ALTER TABLE auth.users ENABLE TRIGGER ALL;

-- ============================================
-- PART 5: Verification
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
  'auth.users',
  COUNT(*)
FROM auth.users;

SELECT '⚠️ ALL DATA CLEARED including auth.users! Users must re-register.' AS status;
