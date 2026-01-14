-- Update all users' monthly certification limit to a higher value
-- Use this if you want to increase limit for all users

UPDATE public.users
SET monthly_certifications_limit = 10  -- Change to your desired limit
WHERE monthly_certifications_limit < 10;

-- Or set a specific limit for free tier users
UPDATE public.users
SET monthly_certifications_limit = 10
WHERE subscription_tier = 'free';

-- View all users and their limits
SELECT 
  email,
  display_name,
  subscription_tier,
  monthly_certifications_used,
  monthly_certifications_limit
FROM public.users
ORDER BY created_at DESC;
