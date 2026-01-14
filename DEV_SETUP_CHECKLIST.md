# Development Environment Setup Checklist

## Common Issues Preventing Login in Development

### 1. ✅ Supabase Redirect URLs Configuration

**Problem:** Supabase requires explicit redirect URL configuration for authentication.

**Solution:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → URL Configuration**
4. Add these URLs:

   **Site URL:**
   ```
   http://localhost:3000
   ```

   **Redirect URLs (add both):**
   ```
   http://localhost:3000/api/auth/callback
   http://localhost:3000/**
   ```

### 2. ✅ Environment Variables

**Check `.env.local` file exists and has correct values:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To verify:**
- Open browser console (F12)
- Check if you see any errors about missing environment variables
- The login page should show error messages if env vars are missing

### 3. ✅ User Account Status

**Check if user exists and is confirmed:**
- User must exist in `auth.users` table
- Email must be confirmed (`email_confirmed_at` should not be NULL)
- If email is not confirmed, check email inbox for confirmation link

### 4. ✅ Network/CORS Issues

**Check browser console for:**
- CORS errors
- Network request failures
- 401/403 errors from Supabase

### 5. ✅ Development Server

**Make sure dev server is running:**
```bash
npm run dev
```

**Check:**
- Server is running on `http://localhost:3000`
- No port conflicts
- No build errors

## Quick Debug Steps

1. **Open browser console (F12)**
2. **Try to login**
3. **Check console for:**
   - "Login button clicked" message
   - "Supabase client created" message
   - "Attempting login for: [email]" message
   - Any error messages

4. **Check Network tab:**
   - Look for requests to Supabase
   - Check response status codes
   - Check for CORS errors

## Most Common Issue: Redirect URLs

**90% of login issues in development are due to missing redirect URL configuration in Supabase.**

Make sure `http://localhost:3000/api/auth/callback` is added to Supabase redirect URLs!
