-- Migration: Add missing INSERT policy for users table
-- This fixes the "new row violates row-level security policy" error during signup
-- Run this in Supabase SQL Editor

-- Check if policy already exists before creating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can insert own data'
  ) THEN
    CREATE POLICY "Users can insert own data" ON users
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

SELECT 'Migration completed: Users INSERT policy added!' AS status;
