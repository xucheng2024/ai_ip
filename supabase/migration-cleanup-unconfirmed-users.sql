-- Cleanup unconfirmed users (users who haven't confirmed their email)
-- This script deletes all users where email_confirmed_at is NULL
-- Run this in Supabase SQL Editor

-- ============================================
-- PART 1: Show unconfirmed users before deletion
-- ============================================
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  'Will be deleted' as action
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at;

-- ============================================
-- PART 2: Delete unconfirmed users
-- ============================================

-- Get list of unconfirmed user IDs
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM auth.users WHERE email_confirmed_at IS NULL
  LOOP
    -- Delete from application tables
    DELETE FROM public.promotion_support_events 
    WHERE supporter_id = user_record.id OR promoter_id = user_record.id;
    
    DELETE FROM public.evidence_packages 
    WHERE certification_id IN (
      SELECT id FROM public.certifications WHERE video_id IN (
        SELECT id FROM public.videos WHERE user_id = user_record.id
      )
    );
    
    DELETE FROM public.event_logs 
    WHERE certification_id IN (
      SELECT id FROM public.certifications WHERE video_id IN (
        SELECT id FROM public.videos WHERE user_id = user_record.id
      )
    );
    
    DELETE FROM public.certifications 
    WHERE video_id IN (
      SELECT id FROM public.videos WHERE user_id = user_record.id
    );
    
    DELETE FROM public.creation_metadata 
    WHERE video_id IN (
      SELECT id FROM public.videos WHERE user_id = user_record.id
    );
    
    DELETE FROM public.videos WHERE user_id = user_record.id;
    DELETE FROM public.users WHERE id = user_record.id;
    
    -- Delete from auth tables
    DELETE FROM auth.sessions WHERE user_id = user_record.id;
    DELETE FROM auth.refresh_tokens WHERE user_id::uuid = user_record.id;
    DELETE FROM auth.users WHERE id = user_record.id;
  END LOOP;
END $$;

-- ============================================
-- PART 3: Verification
-- ============================================
SELECT 
  COUNT(*) as remaining_unconfirmed_users,
  'Unconfirmed users remaining' as note
FROM auth.users
WHERE email_confirmed_at IS NULL;

SELECT 
  COUNT(*) as total_users,
  'Total users (confirmed + unconfirmed)' as note
FROM auth.users;

SELECT 'Cleanup completed! Unconfirmed users deleted.' AS status;
