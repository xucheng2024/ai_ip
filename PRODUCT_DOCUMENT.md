# AIVerify - Product Feature Document
## AI Video Publishing & Trust Infrastructure Platform

---

## Executive Summary

**AIVerify** is a trusted publishing layer and evidence infrastructure platform for AI-generated video content. Every AI video published on AIVerify comes with independently verifiable creation evidence, providing a public, verifiable proof page that can be watched, verified, and cited.

**Core Value Proposition:** AIVerify is not just a certification tool—it's the infrastructure entry point for AI video publishing and trust verification. Each certified video gets its own verifiable proof page, transforming how AI content is published, shared, and trusted.

**Tagline:** *Publish AI Videos with Verifiable Proof*

---

## Market Opportunity

### Problem Statement
- AI video generation tools (Runway, Pika, Sora) are creating unprecedented volumes of content
- There's no trusted infrastructure for publishing AI videos with verifiable proof
- Copyright disputes and authorship claims require independently verifiable evidence
- Traditional copyright registration is slow, expensive, and not designed for AI content
- Creators need a publishing platform where each video has its own verifiable proof page

### Target Market
- **Primary:** AI video creators, content studios, independent filmmakers seeking trusted publishing infrastructure
- **Secondary:** Legal professionals, platforms requiring content verification, investors in AI content
- **Market Size:** Growing AI video generation market (projected $XXB by 2027)
- **Positioning:** Infrastructure entry point for AI video publishing, not just a certification tool

---

## Core Product Features

### 1. Multi-Layer Content Fingerprinting
- **File Hash:** SHA-256 hash of entire video file
- **Frame Sequence Hash:** Temporal fingerprinting of video frames
- **Audio Track Hash:** Separate audio content verification
- **Tamper Detection:** Any 1-bit change completely alters fingerprints

### 2. Trusted Timestamp Infrastructure
- **Dual Timestamps:**
  - Server-side UTC timestamp (immediate)
  - RFC 3161 TSA (Time Stamping Authority) tokens (cryptographically signed)
- **Blockchain Anchoring:** Daily Merkle tree batches anchored to Polygon PoS
- **Cost-Efficient:** ~$0.0001 per certification via batching (only Merkle root on-chain)

### 3. Verifiable Evidence Packages
- **Canonical JSON Format:** Downloadable evidence packages for independent verification
- **Merkle Proofs:** Inclusion proofs for blockchain verification
- **Chain of Custody:** Append-only event logs with hash-linked audit trail
- **Third-Party Verifiable:** No server trust required - cryptographic proofs

### 4. Verifiable Video Pages
- **Public Proof Pages:** Each certified video gets its own verifiable proof page
- **Video Playback:** Watch the certified video directly on the proof page
- **Evidence Display:** See creator, certification date, and all evidence badges
- **Shareable Links:** One link to share or cite the verified video
- **Independent Verification:** Anyone can verify evidence without trusting the platform
- **Infrastructure Positioning:** Moving from tool to publishing infrastructure

### 5. User Experience
- **Simple Upload Flow:** Drag-and-drop video certification and publishing
- **PDF Certificates:** Professional certificates for records and legal use
- **Public Verification:** Anyone can verify certifications via ID or file hash
- **Dashboard:** Usage tracking, certification history, subscription management
- **Evidence Status Display:** Clear evidence maturity indicators (Certified/Timestamped/Anchored/Revoked)
- **Usage Scenario Templates:** Pre-configured templates for YouTube DMCA, TikTok IP reports, etc.

### 6. AI Tool Integration
- **Metadata Capture:** Records AI tool used (Runway, Pika, Sora, etc.)
- **Prompt Preservation:** Optional prompt storage (hash-only or plaintext)
- **Creation Metadata:** Model versions, third-party material declarations

### 7. Evidence Status Model
Clear evidence maturity levels displayed to users and investors:
- 🟡 **Certified:** Server + Hash complete
- 🟢 **Timestamped:** TSA timestamp received
- 🔵 **Anchored:** Blockchain batch complete
- ⚫ **Revoked:** Certificate revoked

Critical UI feature that answers investor and legal team questions about evidence quality.

### 8. Third-Party Verification Guide
- **Independent Verification:** Detailed guide for verifying evidence packages without platform dependency
- **Hash Recalculation:** Instructions for recalculating evidence hashes
- **Merkle Proof Verification:** How to verify Merkle proofs
- **Blockchain Verification:** On-chain verification methods
- **TSA Timestamp Verification:** RFC 3161 verification procedures

Extremely valuable for legal teams and platforms, demonstrating serious infrastructure approach.

### 9. Evidence Usage Scenario Templates
Pre-configured templates for different use cases:
- **YouTube DMCA Takedown:** Required fields and step-by-step instructions
- **TikTok IP Report:** Platform-specific submission guidance
- **Commercial Partnership Proof:** Partner verification workflows
- **Internal IP Archive:** Enterprise asset management integration

Key differentiator: Moving from "tool" to "infrastructure."

### 10. Hash Manifest in Evidence Packages
- **Complete Index:** manifest.json in evidence package root
- **Hash Inventory:** evidence_hash, merkle_root, tx_hash, block_time
- **File Index:** included_files with all related hashes
- **Audit-Ready:** Facilitates third-party auditing and long-term archival

### 11. Creator Continuity Proof
- **Hash Chain Linking:** New evidence links to previous evidence hash
- **Continuity Proof:** Demonstrates long-term creative trajectory from same creator
- **Off-Chain Storage:** Stored in evidence packages only (zero cost)
- **MCN/Studio Appeal:** Highly attractive to multi-channel networks and studios

Second moat feature.

### 12. Public Records Page
- **Public Auditability:** Daily batch counts, Merkle roots, chain transactions
- **Time Range:** Complete historical records
- **Certificate Transparency Style:** But for AI content evidence
- **Investor-Friendly:** Demonstrates platform integrity and auditability

### 13. Promotion Support (Promotion-based Support)
- **Support Mechanism:** Support creators and earn rewards through sharing
- **Transparent Allocation:** 70% creator, 20% promoter, 10% platform (all ratios clearly displayed before support)
- **Public Verification:** All support events are publicly verifiable with verification hashes
- **Promotion Links:** Generate shareable links with promoter tracking via URL parameters
- **Support Records:** Display total supports, amounts, and recent events on certificate pages
- **Creator Control:** Creators can enable/disable promotion support (default: enabled)
- **Legal Boundaries:** Clearly defined as support behavior records, not revenue sharing or investment returns
- **Single-Layer Only:** Strictly single-layer promotion (no multi-level structures)

---

## Technical Innovation

### Blockchain Architecture
**Model:** Evidence Package Hash → Merkle Tree → Merkle Root → Polygon PoS

**Key Innovations:**
- **Batch Processing:** Up to 1,000 certifications per daily batch
- **Cost Optimization:** Only 32-byte Merkle root on-chain (not individual hashes)
- **Service Wallet Model:** Platform pays gas fees - users don't need crypto wallets
- **Rate Limiting:** Security measures prevent abuse (max 1 batch/hour)

### Trust Infrastructure (5-Layer Model)
1. **Time Trust:** Dual timestamps (server + TSA)
2. **Content Trust:** Multi-layer fingerprints (file, frames, audio)
3. **Process Trust:** Chain of custody with hash-linked events
4. **Blockchain Trust:** Merkle root anchoring to Polygon PoS
5. **Verification Trust:** Downloadable evidence packages for independent verification

### Independent Verification
Third parties can verify without trusting the server:
1. Download evidence package JSON
2. Calculate evidence hash locally
3. Verify Merkle proof → root
4. Check blockchain transaction (Polygon explorer)
5. Verify block time ≥ claimed time

---

## Competitive Advantages

### 1. **Cryptographic Proof**
Unlike timestamp services that require trust in a central authority, AIVerify provides independently verifiable cryptographic proofs anchored to public blockchain. Includes detailed third-party verification guides for verification without platform dependency.

### 2. **Complete Evidence Maturity System**
Clear Evidence Status Model (Certified → Timestamped → Anchored) provides transparency that investors and legal teams demand. Not just a concept - actual maturity indicators.

### 3. **Cost-Effective Blockchain Usage**

Daily batching reduces blockchain costs to ~$0.0001 per certification (vs. $0.XX for individual on-chain transactions).

### 4. **Complete Evidence Infrastructure**
Not just timestamps - includes content fingerprints, chain of custody, verifiable evidence packages, Hash Manifest indexing, and creator continuity proof.

### 5. **Practical Use Case Templates**
Pre-configured templates for YouTube DMCA, TikTok IP reports, and more. Moving from "tool" to "infrastructure" - significantly increases practical value.

### 6. **User-Friendly**
No crypto knowledge required. Users don't need wallets, tokens, or blockchain experience.

### 7. **Legal Compliance Ready**
Structured evidence packages designed for legal use cases, with clear disclaimers and compliance considerations. Third-party verification guides enable legal teams to verify independently.

### 8. **Transparency & Auditability**
Public records page showing all batches and transactions, similar to Certificate Transparency. Demonstrates platform integrity and auditability.

### 9. **Scalable Architecture**
- Built on Next.js 16 (serverless-ready)
- Supabase backend (auto-scaling)
- Vercel deployment (global CDN)
- Handles high-volume certification processing

---

## Business Model

### Pricing Tiers
- **Free:** 1 video published with proof/month (freemium acquisition)
- **Basic ($9.9/month):** 10 videos published with proof/month (target: individual creators)
- **Pro ($19.9/month):** Unlimited videos published with proof (target: studios/professionals)
- **Note:** Plans are based on how many videos you publish with proof

### Revenue Projections
- **Assumptions:**
  - Free tier: 70% of users (acquisition)
  - Basic tier: 20% conversion (recurring revenue)
  - Pro tier: 10% conversion (high-value customers)

### Cost Structure
- **Infrastructure:** Supabase (usage-based), Vercel (serverless)
- **Blockchain:** ~$0.0001 per certification (daily batches)
- **TSA:** FreeTSA (free) or commercial TSA (~$0.XX per token)
- **Fixed:** Minimal - serverless architecture

### Unit Economics
- **Customer Acquisition Cost (CAC):** TBD (freemium model)
- **Lifetime Value (LTV):** Basic: $118.8/year, Pro: $238.8/year
- **Gross Margin:** High (low variable costs, serverless infrastructure)

---

## Product Highlights

### ✅ Technical Excellence
- **Modern Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Blockchain Integration:** Polygon PoS (low fees, fast transactions)
- **Cryptographic Security:** SHA-256 hashing, Merkle trees, TSA timestamps
- **Audit-Ready:** Complete chain of custody logging

### ✅ User Experience
- **Zero-Friction:** No crypto wallet needed
- **Professional Output:** PDF certificates, verifiable evidence packages
- **Transparent:** Public verification system builds trust
- **Mobile-Ready:** Responsive design, modern UI

### ✅ Scalability
- **Serverless Architecture:** Auto-scales with demand
- **Efficient Batching:** Handles 1,000+ certifications/day
- **Cost-Effective:** ~$0.0001 per certification at scale

### ✅ Compliance & Legal
- **Clear Disclaimers:** Not a copyright registration service
- **Evidence Packages:** Structured for legal use cases
- **Audit Trail:** Complete chain of custody for legal proceedings

---

## Roadmap & Future Enhancements

### Phase 1 (Current - MVP)
- ✅ Core certification flow
- ✅ Blockchain anchoring
- ✅ PDF certificate generation
- ✅ Public verification
- ✅ Subscription tiers
- ✅ Evidence Status Model
- ✅ Third-party verification guide
- ✅ Evidence usage scenario templates
- ✅ Hash Manifest indexing
- ✅ Creator continuity proof
- ✅ Public records page
- ✅ Promotion Support (Promotion-based Support)

### Phase 2 (Planned)
- API & publishing integrations for platforms
- Video gallery and discovery features
- Multi-chain support (additional blockchains)
- Enhanced identity verification (L1-L3 levels)
- Bulk certification tools
- Analytics dashboard

### Phase 3 (Future)
- Integration with video platforms
- Legal document generation
- Dispute resolution workflow
- Enterprise features (white-label, SSO)

---

## Key Metrics & KPIs

### User Metrics
- Monthly Active Users (MAU)
- Certification volume per user
- Free → Paid conversion rate
- Churn rate

### Technical Metrics
- Certification processing time
- Blockchain anchoring success rate
- Verification requests
- API uptime/reliability

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Gross margin

---

## Investment Highlights

### Why Invest in AIVerify?

1. **First-Mover Advantage:** Early in AI video publishing and trust infrastructure market
2. **Defensible Technology:** Cryptographic proof infrastructure is difficult to replicate
3. **Network Effects:** More videos published = more trusted platform = more citations
4. **Scalable Business Model:** High gross margins, serverless architecture
5. **Clear Market Need:** AI content explosion requires trusted publishing infrastructure
6. **Multiple Revenue Streams:** Subscriptions, API & publishing integrations, enterprise features
7. **Moat Features:**
   - Verifiable video pages transform each certification into a citable proof page
   - Evidence Status Model provides clarity for legal teams and investors (not just a concept)
   - Creator Continuity Proof forms second moat (appeals to MCNs/studios)
   - Third-party verification guides enhance platform trust
   - Public records demonstrates integrity and auditability
8. **Infrastructure Positioning:** Not just a certification tool—it's the infrastructure entry point for AI video publishing. Each video gets a public, verifiable proof page that can be watched, verified, and cited with one link.

### Market Timing
- AI video generation is accelerating (Runway, Pika, Sora gaining traction)
- Copyright disputes expected to increase
- Regulatory landscape evolving
- Early infrastructure positioning

---

## Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Blockchain:** Polygon PoS, Ethers.js
- **PDF Generation:** @react-pdf/renderer
- **Deployment:** Vercel (serverless)
- **Hashing:** SHA-256 (crypto-js)

---

## Contact & Resources

**Product Status:** MVP (Minimum Viable Product) - Live
**Deployment:** Vercel
**Repository:** Private

For technical documentation, see `README.md`

---

*This document is for investor presentation purposes. All technical specifications are accurate as of the latest product version.*
