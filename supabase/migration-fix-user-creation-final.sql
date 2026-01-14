-- Final fix for user creation RLS issue
-- This script ensures the trigger works correctly and provides fallback options
-- Run this in Supabase SQL Editor

-- ============================================
-- PART 1: Fix the trigger function
-- ============================================

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert user profile with the auth user's ID
  INSERT INTO public.users (id, email, display_name, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL),
    'creator'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, users.display_name);
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail auth user creation
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PART 2: Ensure RLS policy allows inserts (backup)
-- ============================================

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create INSERT policy that allows users to insert their own profile
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PART 3: Verification queries
-- ============================================

-- Check if trigger exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created' 
      AND tgrelid = 'auth.users'::regclass
    ) THEN '✓ Trigger exists'
    ELSE '✗ Trigger NOT found'
  END AS trigger_status;

-- Check if function exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user' 
      AND pronamespace = 'public'::regnamespace
    ) THEN '✓ Function exists'
    ELSE '✗ Function NOT found'
  END AS function_status;

-- Check if INSERT policy exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'users' 
      AND policyname = 'Users can insert own data'
    ) THEN '✓ INSERT policy exists'
    ELSE '✗ INSERT policy NOT found'
  END AS policy_status;

SELECT 'Setup completed! Check status above.' AS message;
