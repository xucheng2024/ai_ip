-- Delete a specific user by ID
-- Replace the UUID below with the user ID you want to delete

-- Delete from application tables first (if exists)
DELETE FROM public.promotion_support_events WHERE supporter_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa' OR promoter_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';
DELETE FROM public.evidence_packages WHERE certification_id IN (
  SELECT id FROM public.certifications WHERE video_id IN (
    SELECT id FROM public.videos WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa'
  )
);
DELETE FROM public.event_logs WHERE certification_id IN (
  SELECT id FROM public.certifications WHERE video_id IN (
    SELECT id FROM public.videos WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa'
  )
);
DELETE FROM public.certifications WHERE video_id IN (
  SELECT id FROM public.videos WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa'
);
DELETE FROM public.creation_metadata WHERE video_id IN (
  SELECT id FROM public.videos WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa'
);
DELETE FROM public.videos WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';
DELETE FROM public.users WHERE id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';

-- Delete from auth tables
DELETE FROM auth.sessions WHERE user_id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';
DELETE FROM auth.refresh_tokens WHERE user_id::uuid = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';
DELETE FROM auth.users WHERE id = 'acb1252c-7a3d-4ceb-aee7-577a6882bafa';

SELECT 'User deleted successfully' AS status;
