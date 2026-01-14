# AIVerify

AI Video Originality Certification & Creation Proof Platform

**Slogan:** Prove when it was created. Prove who created it.

## Overview

AIVerify provides trusted timestamp and content fingerprinting services for AI video creators. It serves as evidence infrastructure for copyright disputes, not as a government copyright registration service.

## Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Deployment:** Vercel
- **PDF Generation:** @react-pdf/renderer
- **Hashing:** crypto-js (SHA-256)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Create a storage bucket named `videos`:
   - Go to Storage → Create Bucket
   - Name: `videos`
   - Public: No (private bucket)
   - Enable RLS: Yes

4. Set up Storage Policies:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload own videos"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'videos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Allow users to read their own videos
   CREATE POLICY "Users can read own videos"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'videos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: Supabase Dashboard → Settings → API

### 4. Configure Auth Redirects

In Supabase Dashboard → Authentication → URL Configuration:

**For Development (now):**
- Site URL: `http://localhost:3000`
- Redirect URLs: Add `http://localhost:3000/api/auth/callback`

**For Production (after Vercel deployment):**
- Site URL: `https://your-app.vercel.app` (your Vercel domain)
- Redirect URLs: Add `https://your-app.vercel.app/api/auth/callback`

**Note:** You can add multiple redirect URLs, so add both localhost and your Vercel URL.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

- **users:** User profiles and subscription info
- **videos:** Video metadata and file hashes
- **certifications:** Certification records with timestamps
- **creation_metadata:** AI tool and prompt information

See `supabase/schema.sql` for full schema.

## Features

### MVP Features

- ✅ User authentication (Sign up, Login)
- ✅ Video upload and hash generation
- ✅ Certification generation with unique IDs
- ✅ PDF certificate download
- ✅ Public verification system (by ID or file hash)
- ✅ Usage limits based on subscription tier
- ✅ Legal disclaimers and user agreements

### Pricing Tiers

- **Free:** 1 certification/month
- **Basic ($9.9/month):** 10 certifications/month
- **Pro ($19.9/month):** Unlimited certifications

## Project Structure

```
/app
  /auth          - Authentication pages
  /certify       - Video certification flow
  /certificate   - Certificate display and PDF
  /dashboard     - User dashboard
  /verify        - Public verification
/lib
  /supabase      - Supabase client setup
  /utils         - Hash generation, utilities
  /types         - TypeScript types
/components      - React components
/supabase        - Database schema
```

## Deployment

### Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: AIVerify MVP"
   git push -u origin main
   ```

2. **Import project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository `xucheng2024/ai_ip`

3. **Add environment variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://bakwnqsysewjlmsvtwma.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key)

4. **Deploy** - Vercel will automatically deploy

5. **Update Supabase Auth Redirects:**
   - After deployment, copy your Vercel URL (e.g., `https://ai-ip.vercel.app`)
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add to Redirect URLs: `https://your-app.vercel.app/api/auth/callback`
   - Update Site URL to your Vercel URL (or keep localhost for development)

The app will automatically use Supabase for backend services.

## Legal Disclaimer

This service provides creation time and content consistency proof. It does not constitute government copyright registration or legal judgment. Users must declare that content is their legal creation and understand that the platform does not judge the legality of infringement.

## License

Private - All rights reserved
