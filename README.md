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
- **Video Compression:** @ffmpeg/ffmpeg (client-side, WebAssembly)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema:
   
   **If this is a NEW database:**
   - Run `supabase/schema.sql` (creates all tables from scratch)
   
   **If you have an EXISTING database:**
   - Run `supabase/migration.sql` first (migrates existing data)
   - Run `supabase/migration-promotion-support.sql` to add promotion support feature
   - Then run `supabase/schema.sql` to ensure everything is up to date
   
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
- **videos:** Video metadata and file hashes (including frame/audio hashes)
- **certifications:** Certification records with timestamps, TSA tokens, Merkle batch references
- **creation_metadata:** AI tool and prompt information
- **event_logs:** Chain of custody event logs (append-only)
- **merkle_batches:** Merkle tree batches for blockchain anchoring
- **evidence_packages:** Evidence package metadata
- **promotion_support_events:** Promotion support and reward records

See `supabase/schema.sql` for full schema.

## Features

### Core Features

- ✅ User authentication (Sign up, Login)
- ✅ Video upload and hash generation
- ✅ **Client-side video compression** (lossless/high-quality using ffmpeg.wasm)
- ✅ Certification generation with unique IDs
- ✅ PDF certificate download
- ✅ Public verification system (by ID or file hash)
- ✅ Usage limits based on subscription tier
- ✅ Legal disclaimers and user agreements

### Trust & Verification Infrastructure

- ✅ **Multi-Layer Fingerprinting**: File hash, frame sequence hash, audio track hash (using Web Audio API)
- ✅ **RFC 3161 TSA Timestamps**: Cryptographically signed timestamps from trusted authority
- ✅ **Blockchain Anchoring**: Merkle tree batching with Polygon PoS anchoring
- ✅ **Chain of Custody**: Append-only event logs with hash chains
- ✅ **Verifiable Evidence Packages**: Downloadable JSON packages for independent verification
- ✅ **Merkle Proofs**: Inclusion proofs for batch-verified certifications

### Promotion Support

- ✅ **Promotion-based Support**: Support creators and earn rewards through sharing
- ✅ **Transparent Allocation**: 70% creator, 20% promoter, 10% platform (clearly displayed)
- ✅ **Public Verification**: All support events are publicly verifiable
- ✅ **Promotion Links**: Generate shareable links with promoter tracking
- ✅ **Support Records**: View total supports, amounts, and recent events on certificate pages

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
  /videos        - AI Creation Square (certified video gallery)
  /support       - Support and promotion pages
  /verify        - Public verification
/lib
  /supabase      - Supabase client setup
  /utils         - Hash generation, utilities
  /types         - TypeScript types
/components      - React components
  /certify       - Certification form components
  /home          - Home page sections
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

3. **Set up service wallet for blockchain anchoring:**
   
   **Step 1: Create service wallet**
   ```bash
   # Generate a new wallet (keep private key secure!)
   npx ethers wallet create
   # Or use MetaMask to create a new account
   ```
   
   **Step 2: Fund wallet with MATIC**
   - Send 0.1-1 MATIC to the wallet address (enough for thousands of transactions)
   - Use Polygon faucet for testnet: https://faucet.polygon.technology
   
   **Step 3: Add environment variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://bakwnqsysewjlmsvtwma.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key)
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `POLYGON_NETWORK`: `polygon-mainnet` or `polygon-mumbai` (for blockchain anchoring)
   - `ANCHOR_PRIVATE_KEY`: **Service wallet private key** (starts with 0x)
   - `POLYGON_RPC_URL`: (optional) Custom RPC endpoint (defaults to public RPC)
   - `CRON_SECRET`: (optional) Secret for manual batch triggering
   
   **Security Notes:**
   - ⚠️ **Never commit private key to git**
   - ⚠️ **Use separate wallet for production** (not your personal wallet)
   - ⚠️ **Store private key only in Vercel environment variables**
   - ⚠️ **Limit wallet permissions** (only used for anchoring, no other transactions)

5. **Deploy** - Vercel will automatically deploy

6. **Update Supabase Auth Redirects:**
   - After deployment, copy your Vercel URL (e.g., `https://ai-ip.vercel.app`)
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add to Redirect URLs: `https://your-app.vercel.app/api/auth/callback`
   - Update Site URL to your Vercel URL (or keep localhost for development)

The app will automatically use Supabase for backend services.

### Blockchain Anchoring Architecture

**Correct Model**: Evidence Package Hash → Merkle Tree → Merkle Root → Polygon

**NOT**: Video/Hash directly on chain

**Service Wallet Model**: Platform uses its own wallet to pay gas fees. Users don't need wallets.

#### Process Flow:

1. **Video Upload** → Generate canonical evidence package (JSON)
2. **Evidence Hash** → SHA-256(canonical JSON) = Merkle tree leaf
3. **Batch Processing** → Multiple evidence hashes → Merkle Tree → Merkle Root
4. **Blockchain Anchor** → Only Merkle Root (32 bytes) written to Polygon PoS
5. **Verification** → Third parties can independently verify using:
   - Evidence package JSON
   - Merkle proof
   - Blockchain transaction hash

#### Batch Processing:

- **Frequency**: Daily (once per day at midnight UTC)
- **Batch Size**: Up to 1000 certifications per batch
- **Cost**: ~$0.0001 per batch (only 32-byte Merkle root per batch)
- **Method**: Transaction calldata (self-send with root in data field)
- **Rate Limiting**: Maximum 1 batch per hour (security measure)
- **Service Wallet**: Platform wallet pays all gas fees (users don't need wallets)

#### Security Measures:

- ✅ **Rate Limiting**: Max 1 batch per hour
- ✅ **Audit Logging**: All transactions logged with batch ID, root, tx hash
- ✅ **Private Key Isolation**: Only stored in environment variables
- ✅ **Balance Checks**: Verifies wallet has sufficient MATIC before anchoring
- ✅ **Error Handling**: Failed batches marked and logged

**Manual Operations:**

To manually trigger batch anchoring:
```bash
curl -X POST https://your-app.vercel.app/api/batch/anchor \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

To check service wallet balance:
```bash
curl https://your-app.vercel.app/api/wallet/balance \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### Evidence Package Structure:

```json
{
  "version": "1.0",
  "video": {
    "file_hash": "SHA256(...)",
    "duration": 12.34,
    "frame_hashes": [{"t": 0, "hash": "..."}],
    "audio_hash": "..."
  },
  "creator": {
    "user_id": "usr_123",
    "identity_level": "L0"
  },
  "timestamps": {
    "server_time_utc": "2026-01-14T10:21:33Z",
    "tsa_token": "..."
  }
}
```

**Key Points**:
- JSON is canonicalized (sorted keys) for consistent hashing
- Only evidence hash (not full JSON) goes into Merkle tree
- Only Merkle root (not individual hashes) goes on blockchain

### Trust Infrastructure Details

1. **Time Trust**: Dual timestamps (server + RFC 3161 TSA)
2. **Content Trust**: Multi-layer fingerprints (file, frames, audio, metadata)
3. **Process Trust**: Chain of custody with hash-linked event logs
4. **Blockchain Trust**: Merkle root anchoring to Polygon PoS (cost-efficient batching)
5. **Verification Trust**: Downloadable evidence packages for independent verification

### Third-Party Verification

Third parties can verify without trusting the server:

1. Download evidence package JSON
2. Calculate evidence hash locally
3. Verify Merkle proof → root
4. Check blockchain transaction (Polygon explorer)
5. Verify block time ≥ claimed time

No server trust required!

## Legal Disclaimer

This service provides creation time and content consistency proof. It does not constitute government copyright registration or legal judgment. Users must declare that content is their legal creation and understand that the platform does not judge the legality of infringement.

## License

Private - All rights reserved
