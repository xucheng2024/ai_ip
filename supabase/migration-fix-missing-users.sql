-- Migration: Fix missing users in public.users table
-- This script creates user records in public.users for any auth.users that don't have one
-- Run this in Supabase SQL Editor

-- Create missing user records from auth.users
INSERT INTO public.users (id, email, display_name, account_type)
SELECT 
  au.id,
  COALESCE(au.email, ''),
  COALESCE(au.raw_user_meta_data->>'display_name', NULL) as display_name,
  'creator' as account_type
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Show summary
SELECT 
  COUNT(*) as fixed_users,
  'Users created in public.users' as message
FROM public.users pu
WHERE EXISTS (
  SELECT 1 FROM auth.users au WHERE au.id = pu.id
);

-- Show any remaining mismatches (should be 0 after running this)
SELECT 
  COUNT(*) as remaining_missing,
  'auth.users without public.users record' as message
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

SELECT 'Migration completed! Check the counts above.' AS status;
