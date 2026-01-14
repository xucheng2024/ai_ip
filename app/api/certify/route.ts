// Enhanced certification API with trust infrastructure
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateHashFromString } from '@/lib/utils/hash'
import { requestTSATimestamp } from '@/lib/utils/tsa'
import { logEvent } from '@/lib/utils/event-log'
import {
  generateCanonicalEvidencePackage,
  calculateEvidenceHash,
} from '@/lib/utils/evidence-package'
import {
  sanitizeString,
  validateHash,
  validateFileSize,
  validateFileType,
  sanitizeFilename,
  sanitizeFileExtension,
} from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const aiTool = formData.get('aiTool') as string
    const prompt = formData.get('prompt') as string
    const promptPrivate = formData.get('promptPrivate') === 'true'
    const hasThirdPartyMaterials = formData.get('hasThirdPartyMaterials') === 'true'
    const fileHash = formData.get('fileHash') as string
    const frameHash = formData.get('frameHash') as string | null
    const audioHash = formData.get('audioHash') as string | null
    const duration = formData.get('duration') ? parseInt(formData.get('duration') as string) : null

    // Input validation
    if (!file || !title || !fileHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate file size (max 500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
    if (!validateFileSize(file.size, MAX_FILE_SIZE)) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!validateFileType(file.type, ['video/'])) {
      return NextResponse.json({ error: 'Invalid file type. Only video files are allowed.' }, { status: 400 })
    }

    // Validate title length and sanitize
    const sanitizedTitle = sanitizeString(title, 500)
    if (!sanitizedTitle) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    }

    // Validate prompt length
    if (prompt && prompt.length > 10000) {
      return NextResponse.json({ error: 'Prompt is too long (max 10000 characters)' }, { status: 400 })
    }

    // Validate hash format
    if (!validateHash(fileHash)) {
      return NextResponse.json({ error: 'Invalid file hash format' }, { status: 400 })
    }
    if (frameHash && !validateHash(frameHash)) {
      return NextResponse.json({ error: 'Invalid frame hash format' }, { status: 400 })
    }
    if (audioHash && !validateHash(audioHash)) {
      return NextResponse.json({ error: 'Invalid audio hash format' }, { status: 400 })
    }

    // Check usage limits
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (
      userProfile &&
      userProfile.monthly_certifications_used >= userProfile.monthly_certifications_limit
    ) {
      return NextResponse.json(
        { error: 'Monthly certification limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Upload file to Supabase Storage
    // Sanitize file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const allowedExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v']
    const safeExt = allowedExtensions.includes(fileExt) ? fileExt : 'mp4'
    const fileName = `${user.id}/${Date.now()}.${safeExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('videos').getPublicUrl(fileName)

    // Create video record with multi-layer hashes
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title: sanitizedTitle,
        original_filename: sanitizeFilename(file.name, 255),
        file_hash: fileHash,
        frame_hash: frameHash,
        audio_hash: audioHash,
        duration: duration,
        file_size: file.size,
        file_url: publicUrl,
      })
      .select()
      .single()

    if (videoError) throw videoError

    // Log: upload_received
    // (We'll log after certification is created)

    // Create creation metadata
    const promptHash = prompt ? await generateHashFromString(prompt) : null
    const { error: metadataError } = await supabase.from('creation_metadata').insert({
      video_id: videoData.id,
      ai_tool: aiTool || null,
      prompt_hash: promptHash,
      prompt_plaintext: promptPrivate ? null : (prompt || null),
      has_third_party_materials: hasThirdPartyMaterials,
    })

    if (metadataError) throw metadataError

    // Generate certification ID
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const certificationId = `AIV-${timestamp}-${random}`.toUpperCase()
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify?id=${certificationId}`

    // Generate canonical evidence package
    const canonicalEvidence = await generateCanonicalEvidencePackage(
      {
        ...videoData,
        file_hash: fileHash,
        frame_hash: frameHash,
        audio_hash: audioHash,
        duration: duration,
      },
      {
        ai_tool: aiTool || null,
        prompt_hash: prompt ? await generateHashFromString(prompt) : null,
        has_third_party_materials: hasThirdPartyMaterials,
      },
      {
        id: certificationId,
        timestamp_utc: new Date().toISOString(),
        tsa_timestamp_token: null, // Will be set after TSA request
      },
      user.id,
      'L0' // Default identity level (can be enhanced based on user verification)
    )

    // Calculate evidence hash (this is what goes into Merkle tree)
    const evidenceHash = await calculateEvidenceHash(canonicalEvidence)

    // Request TSA timestamp using evidence hash
    let tsaToken: string | null = null
    try {
      const tsaResult = await requestTSATimestamp(evidenceHash)
      tsaToken = tsaResult.token
    } catch (error) {
      console.warn('TSA timestamp request failed:', error)
      // Continue without TSA timestamp
    }

    // Update canonical evidence with TSA token
    if (tsaToken) {
      canonicalEvidence.timestamps.tsa_token = tsaToken
      // Recalculate hash if TSA token was added
      // (In practice, TSA token is part of evidence, so hash should include it)
    }

    // Final evidence hash (with TSA if available)
    const finalEvidenceHash = await calculateEvidenceHash(canonicalEvidence)

    // Create certification
    const { error: certError } = await supabase.from('certifications').insert({
      id: certificationId,
      video_id: videoData.id,
      timestamp_utc: new Date().toISOString(),
      evidence_hash: finalEvidenceHash, // This is the Merkle tree leaf
      verification_url: verificationUrl,
      tsa_timestamp_token: tsaToken,
    })

    if (certError) throw certError

    // Log events (chain of custody)
    try {
      await logEvent(certificationId, 'upload_received', {
        filename: file.name,
        fileSize: file.size,
      })

      await logEvent(certificationId, 'hash_computed', {
        fileHash,
        frameHash,
        audioHash,
        evidenceHash: finalEvidenceHash,
      })

      if (frameHash) {
        await logEvent(certificationId, 'frames_extracted', {
          frameHash,
        })
      }

      if (audioHash) {
        await logEvent(certificationId, 'audio_extracted', {
          audioHash,
        })
      }

      if (tsaToken) {
        await logEvent(certificationId, 'timestamp_received', {
          tsaToken: tsaToken.substring(0, 50) + '...', // Truncate for logging
        })
      }

      await logEvent(certificationId, 'certificate_issued', {
        certificationId,
        verificationUrl,
      })
    } catch (logError) {
      console.error('Event logging failed:', logError)
      // Don't fail certification if logging fails
    }

    // Update user usage
    await supabase
      .from('users')
      .update({
        monthly_certifications_used: (userProfile?.monthly_certifications_used || 0) + 1,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      certificationId,
      verificationUrl,
    })
  } catch (error: any) {
    console.error('Certification error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to certify video',
      },
      { status: 500 }
    )
  }
}
