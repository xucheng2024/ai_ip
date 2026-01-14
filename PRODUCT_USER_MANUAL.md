# AIVerify - User Manual
## Product Features & Usage Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [How to Certify a Video](#how-to-certify-a-video)
5. [Viewing Your Certificates](#viewing-your-certificates)
6. [Verifying Certifications](#verifying-certifications)
7. [Subscription Tiers](#subscription-tiers)
8. [Trust & Security Features](#trust--security-features)
9. [FAQ](#faq)

---

## Overview

**AIVerify** is a blockchain-backed platform that provides trusted timestamps and content fingerprinting for AI-generated video content. It helps creators prove authorship and creation time, serving as evidence infrastructure for copyright disputes and intellectual property protection.

**Key Value Proposition:** Prove when it was created. Prove who created it.

---

## Getting Started

### 1. Create an Account

- Visit the AIVerify website
- Click "Sign Up" to create a new account
- Enter your email address and create a password
- Verify your email address (if required)
- Complete your profile with a display name

### 2. Understand Your Subscription

By default, all new users start with the **Free** tier, which includes:
- 1 certification per month
- Access to all basic features
- Public verification capability
- PDF certificate downloads

You can upgrade to Basic or Pro plans anytime from your dashboard.

### 3. Navigate the Dashboard

The dashboard shows:
- Your current subscription tier
- Monthly certification usage (used/limit)
- Recent certifications list
- Quick access to certify new videos

---

## Core Features

### 1. Video Certification

Certify your AI-generated videos with cryptographic proof of:
- **Creation Time:** Timestamp when the video was certified
- **Content Fingerprint:** Unique hash of the video file
- **Author Identity:** Your account information
- **AI Tool Metadata:** Which AI tool was used (optional)

### 2. Multi-Layer Content Fingerprinting

AIVerify generates multiple layers of fingerprints:

- **File Hash:** SHA-256 hash of the entire video file
- **Frame Sequence Hash:** Temporal fingerprint of video frames
- **Audio Track Hash:** Separate hash of audio content

Any modification to the video (even 1 bit) will result in a completely different fingerprint, ensuring tamper detection.

### 3. Trusted Timestamps

Each certification includes:

- **Server Timestamp:** Immediate UTC timestamp when certification is created
- **TSA Timestamp:** RFC 3161 cryptographically signed timestamp from a trusted authority
- **Blockchain Anchor:** Daily Merkle tree batches anchored to Polygon blockchain

### 4. Verifiable Evidence Packages

Download complete evidence packages containing:
- Canonical JSON format for independent verification
- **Hash Manifest:** Complete index of all hashes (evidence_hash, merkle_root, tx_hash, included_files)
- Merkle proofs for blockchain verification
- Chain of custody event logs
- All timestamps and metadata
- Creator continuity chain information (if applicable)

The manifest provides a comprehensive index for third-party auditing and long-term verification.

### 5. PDF Certificates

Generate professional PDF certificates for:
- Legal documentation
- Portfolio presentation
- Archive records
- Sharing with stakeholders

### 6. Public Verification

Anyone can verify certifications without logging in:
- By certification ID
- By uploading the original video file

---

## How to Certify a Video

### Step-by-Step Guide

#### Step 1: Start Certification

1. Log in to your AIVerify account
2. Click "Certify New Video" from the dashboard or navigate to `/certify`
3. You'll see the certification form

#### Step 2: Upload Video File

- **Option A:** Drag and drop your video file into the upload area
- **Option B:** Click to browse and select your video file

**Supported Formats:**
- MP4, MOV, AVI, WebM, MKV, M4V
- Maximum file size: 500MB

**Important:** 
- Ensure the video file is the final version you want to certify
- Any subsequent edits will create a different fingerprint
- The file is processed client-side for hashing (privacy-preserving)

#### Step 3: Enter Video Information

**Required Fields:**
- **Video Title:** Name for your video (auto-filled from filename, editable)
- **Creator Name:** Your name or creator identity (required)

**Optional Fields:**
- **AI Tool:** Select from dropdown (Runway, Pika, Sora, Other)
- **Prompt:** Enter the prompt used to generate the video
  - **Privacy Option:** Check "Keep prompt private" to store only the hash
- **Third-Party Materials:** Check if video contains third-party materials

#### Step 4: Review Legal Agreement

**Critical:** You must read and agree to the legal disclaimer:
- You declare the content is your legal creation
- You understand this is evidence infrastructure, not copyright registration
- Platform does not judge legality of infringement

Check the box to confirm agreement.

#### Step 5: Submit Certification

1. Click "Certify Video" button
2. Wait for processing:
   - File upload to secure storage
   - Hash generation (file, frames, audio)
   - Metadata extraction
   - Timestamp assignment
   - Evidence package generation

**Processing Time:** Typically 30-60 seconds depending on file size

#### Step 6: View Certificate

After successful certification:
- You'll be redirected to the certificate page
- Your monthly usage count is incremented
- Certificate is immediately available for verification

**If you've reached your monthly limit:**
- You'll see an error message
- Upgrade your subscription to continue certifying videos
- Or wait until next month for the limit to reset

---

## Viewing Your Certificates

### Certificate Page Features

Each certificate includes:

#### 1. Certificate Information

- **Certification ID:** Unique identifier (format: AIV-{timestamp}-{random})
- **Certified At:** UTC timestamp when certification was created
- **Video Title:** Your entered title
- **Creator:** Your display name or email
- **AI Tool:** If specified during certification

#### 2. Content Fingerprint

- **File Hash:** Complete SHA-256 hash displayed in readable format
- **Frame Hash:** If extracted during processing
- **Audio Hash:** If extracted during processing

**Privacy Feature:** If you chose to keep prompts private, only the hash is shown (zero-knowledge storage).

#### 3. Creation Timeline

Visual timeline showing:
- Video Uploaded
- Fingerprint Generated
- Timestamp Recorded
- Certification Complete

#### 4. Evidence Status & Maturity

**Evidence Status Badge** displays the current maturity level of your evidence:

- 🟡 **Certified:** Server + Hash complete (initial state)
- 🟢 **Timestamped:** TSA timestamp received (RFC 3161 signed)
- 🔵 **Anchored:** Blockchain batch complete (fully mature)
- ⚫ **Revoked:** Certificate has been revoked

The status automatically updates as your certification progresses through the trust infrastructure layers.

#### 5. Trust Indicators

Badges showing active trust features:
- ✅ RFC 3161 TSA Timestamp (if available)
- ✅ Blockchain Anchored (after batch processing)
- ✅ Multi-Layer Fingerprinting (if frame/audio hashes available)
- ✅ Verifiable Evidence Package

#### 6. Creator Continuity Chain

If this is not your first certification, you'll see a **Creator Continuity** section showing:
- Link to your previous certification's evidence hash
- Position in your creative work chain
- Demonstrates continuous creative activity over time

This feature is valuable for MCNs, studios, and proving long-term creative trajectory.

#### 7. Usage Scenarios

**Use Evidence For...** section provides templates for:
- YouTube DMCA Takedown requests
- TikTok IP Reports
- Commercial partnership proof
- Internal IP archive

Each template includes:
- Specific fields to use
- Step-by-step instructions
- Platform-specific guidance

#### 5. Actions Available

**Download PDF Certificate:**
- Click "Download PDF Certificate"
- Professional format suitable for legal/documentation use

**Download Evidence Package:**
- Click "Download Evidence Package"
- Complete JSON file with all verification data
- Includes Merkle proofs and chain of custody

**View Verification Page:**
- Click "Verify Certificate"
- See the public verification view
- Share this link with others

**Embeddable Badge:**
- Copy the certification badge code
- Embed on websites, portfolios, or documentation
- Shows certification status and verification link

**Third-Party Verification Guide:**
- Detailed instructions for independent verification
- How to recalculate hashes
- How to verify Merkle proofs
- How to verify on blockchain
- How to verify TSA timestamps

This guide enables legal professionals and technical experts to verify evidence without relying on the platform.

#### 6. Certificate Revocation

**Owner Only:**
- Scroll to bottom of certificate page
- Click "Revoke Certificate" button
- Confirm revocation

**Important:** 
- Revocation is permanent
- Certificate status changes to "revoked"
- Revoked certificates are still visible but marked as revoked
- Use only if you discover issues with the certified content

---

## Verifying Certifications

### Public Verification (No Login Required)

Anyone can verify a certification using two methods:

#### Method 1: Verify by Certification ID

1. Visit `/verify` page
2. Enter the certification ID (e.g., `AIV-1234567890-abc123`)
3. Click "Verify"
4. View verification results:
   - ✅ **Verified:** Certificate exists and is valid
   - ❌ **Not Found:** Certificate doesn't exist or has been revoked

**Verification Results Show:**
- Certification ID
- Video Title
- Certified Date & Time
- AI Tool (if specified)
- Content Fingerprint (file hash)
- Link to full certificate

#### Method 2: Verify by Video File

1. Visit `/verify` page
2. Click "Choose File" and select the video file
3. Click "Verify"
4. System calculates file hash and searches for matching certification

**How It Works:**
- File is processed locally in your browser (privacy-preserving)
- SHA-256 hash is calculated
- Hash is compared against database
- If match found, shows certification details

**Important:**
- File must be identical to the original (byte-for-byte)
- Any modification will result in different hash
- No match = either not certified or file has been modified

---

## Subscription Tiers

### Free Tier

**Included:**
- 1 certification per month
- All basic features
- PDF certificate downloads
- Public verification
- Evidence package downloads

**Best For:** Individual creators testing the platform

**Upgrade When:** You need to certify multiple videos per month

### Basic Tier ($9.9/month)

**Included:**
- 10 certifications per month
- All Free tier features
- Priority processing
- Email support

**Best For:** Regular content creators, small studios

**Value:** Perfect for creators who produce multiple videos monthly

### Pro Tier ($19.9/month)

**Included:**
- Unlimited certifications
- All Basic tier features
- Priority support
- Advanced analytics (coming soon)

**Best For:** Content studios, professional filmmakers, high-volume creators

**Value:** Cost-effective for creators certifying 3+ videos per month

### Upgrading Your Subscription

1. Go to Dashboard
2. View current subscription tier
3. Click "Upgrade" (if available)
4. Select desired tier
5. Complete payment (implementation varies by setup)

**Note:** Usage resets monthly on your billing cycle.

---

## Trust & Security Features

### 1. Cryptographic Proof

**No Trust Required:**
- All proofs are cryptographically verifiable
- Independent third parties can verify without trusting the server
- Evidence packages contain all necessary verification data

**How It Works:**
- Evidence package hash → Merkle tree → Merkle root → Blockchain
- Only 32-byte Merkle root stored on-chain (cost-efficient)
- Individual certifications verified via Merkle proofs

### 2. Blockchain Anchoring

**Process:**
- Certifications are batched daily (up to 1,000 per batch)
- Merkle tree is built from evidence package hashes
- Merkle root is anchored to Polygon PoS blockchain
- Each certification receives Merkle proof for verification

**Benefits:**
- Immutable timestamp proof
- Public, verifiable ledger
- Cost-efficient (only root stored on-chain)
- No user blockchain knowledge required

**Timeline:**
- Certification created immediately
- Blockchain anchoring happens within 24 hours (daily batch)
- You'll see "Blockchain Anchored" badge after processing

### 3. Chain of Custody

**Event Logging:**
Every certification includes an append-only event log:

1. **upload_received:** File uploaded and received
2. **hash_computed:** File hash calculated
3. **frames_extracted:** Video frames processed (if available)
4. **audio_extracted:** Audio track processed (if available)
5. **timestamp_requested:** TSA timestamp requested
6. **timestamp_received:** TSA timestamp received
7. **anchored_on_chain:** Blockchain anchoring completed
8. **certificate_issued:** Certificate generated

**Each Event Includes:**
- Event type
- Timestamp (UTC)
- Event-specific data
- Hash-linked to previous event (tamper-evident)

### 4. Privacy Features

**Zero-Knowledge Prompt Storage:**
- Option to store prompts as hash-only
- Original prompt never stored in plaintext
- Privacy-preserving for sensitive prompts

**Local Processing:**
- Video hashing performed in browser
- File content not transmitted until after hash calculation
- Minimal data exposure during processing

**Access Control:**
- Only certificate owner can download evidence packages
- Public verification shows only non-sensitive data
- User data protected by Row-Level Security (RLS)

### 5. File Security

**Storage:**
- Files stored in secure, private storage buckets
- Accessible only by file owner
- Encrypted at rest and in transit

**Validation:**
- File type validation (video files only)
- File size limits (500MB maximum)
- Filename sanitization
- Extension whitelisting

---

## FAQ

### General Questions

**Q: What types of videos can I certify?**
A: Any video file (MP4, MOV, AVI, WebM, MKV, M4V) up to 500MB. Must be AI-generated content.

**Q: How long does certification take?**
A: Typically 30-60 seconds after file upload, depending on file size and processing requirements.

**Q: Can I certify the same video multiple times?**
A: Yes, but each upload will have a different hash if the file changes even slightly. Identical files will match existing certifications.

**Q: What happens if I edit my video after certification?**
A: The edited video will have a different hash and won't match the original certification. You'll need to certify the edited version separately.

### Verification Questions

**Q: Can others see my video content?**
A: No. Only you (the owner) can access the video file. Public verification only shows metadata and hashes, not the video itself.

**Q: How do I share my certification with others?**
A: Share the verification URL (e.g., `/verify?id=AIV-1234567890-abc123`) or the certificate page URL. Others can verify without logging in.

**Q: What if someone steals my video and certifies it?**
A: The first certification is the proof. If you certified it first, you have the earlier timestamp. This is valuable evidence in disputes.

### Technical Questions

**Q: Why does blockchain anchoring take time?**
A: Certifications are batched daily (once per day) to minimize blockchain costs. This keeps costs low (~$0.0001 per certification vs. individual transactions).

**Q: What if blockchain anchoring fails?**
A: Your certification is still valid with server timestamps and TSA tokens. Blockchain anchoring provides additional immutability but isn't required for basic verification.

**Q: How do Merkle proofs work?**
A: Merkle proofs allow verification that your certification is included in a batch without revealing other certifications. They prove inclusion in the Merkle root stored on-chain.

**Q: What is the Transparency Log?**
A: The Transparency Log (`/transparency`) is a public page showing all blockchain-anchored batches. It's similar to Certificate Transparency but for AI content evidence, allowing anyone to audit platform integrity and view all anchored Merkle roots.

**Q: What is Creator Continuity?**
A: Creator Continuity is a hash chain linking your certifications together. Each new certification references the previous one's evidence hash, creating a continuous chain that proves long-term creative activity. This is valuable for studios and MCNs.

### Legal Questions

**Q: Does this give me copyright?**
A: No. AIVerify provides evidence of creation time and authorship, but it's not copyright registration. It serves as evidence infrastructure for disputes.

**Q: Is this legally binding?**
A: The cryptographic proofs are verifiable evidence, but legal validity depends on jurisdiction and specific use cases. Consult legal professionals for advice.

**Q: What should I do in a copyright dispute?**
A: Use your evidence package and certificate as proof of creation time. The cryptographic proofs are independently verifiable and can be presented in legal proceedings.

### Account & Subscription Questions

**Q: What happens if I exceed my monthly limit?**
A: You'll see an error when trying to certify. Upgrade your subscription or wait until next month when limits reset.

**Q: Can I downgrade my subscription?**
A: Yes, but you'll keep access until the end of your current billing period. New limits apply at the next billing cycle.

**Q: Do unused certifications roll over?**
A: No. Monthly limits reset each month on your billing cycle. Use them or lose them.

**Q: Can I delete my account?**
A: Contact support. Account deletion is permanent and may affect access to existing certifications.

### Privacy Questions

**Q: Who can see my certifications?**
A: Only you can see your full certificate page and evidence packages. Others can verify certifications by ID or file hash, but they see only public information.

**Q: Is my video content private?**
A: Yes. Video files are stored in private buckets. Only you (the owner) have access. Public verification doesn't expose video content.

**Q: What data is stored about me?**
A: Account information (email, display name), video metadata (title, hashes), certification records, and optional AI tool/prompt information. See Privacy Policy for details.

---

## Support & Resources

### Getting Help

- **Dashboard:** View your certifications and usage
- **Documentation:** See `README.md` for technical details
- **Verification:** Public verification available at `/verify`

### Key Pages

- **Home:** Landing page with overview
- **Dashboard:** `/dashboard` - Your account and certifications
- **Certify:** `/certify` - Certify a new video
- **Verify:** `/verify` - Public verification
- **Certificate:** `/certificate/{id}` - View specific certificate
- **Transparency Log:** `/transparency` - Public log of all blockchain-anchored batches

### Contact

For support, feature requests, or issues, contact through the platform or support channels.

---

## Important Legal Disclaimer

**This service provides creation time and content consistency proof (Authorship Evidence). It does not constitute government copyright registration or legal judgment. This platform does not judge the legality of infringement. Users must declare that content is their legal creation.**

AIVerify is evidence infrastructure, not a legal service. Always consult legal professionals for copyright matters.

---

*Last Updated: Based on current MVP version*
*For technical documentation, see `README.md`*
