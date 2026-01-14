-- Update user's monthly certification limit by email
-- Replace 'your-email@example.com' with your actual email address
-- Replace 10 with your desired limit (e.g., 10, 20, 100, etc.)

UPDATE public.users
SET 
  monthly_certifications_limit = 10,
  monthly_certifications_used = 0  -- Reset used count if needed
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT 
  id,
  email,
  display_name,
  monthly_certifications_used,
  monthly_certifications_limit,
  subscription_tier
FROM public.users
WHERE email = 'your-email@example.com';
