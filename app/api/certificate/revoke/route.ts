import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateCertificationId } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const { certificationId } = await request.json()

    // Input validation and sanitization
    if (!certificationId || typeof certificationId !== 'string') {
      return NextResponse.json({ error: 'Certification ID required' }, { status: 400 })
    }

    // Validate certification ID format
    if (!validateCertificationId(certificationId)) {
      return NextResponse.json({ error: 'Invalid certification ID format' }, { status: 400 })
    }

    const sanitizedId = certificationId.trim()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns this certification
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .select(
        `
        *,
        videos (
          user_id
        )
      `
      )
      .eq('id', sanitizedId)
      .single()

    if (certError || !certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    const video = certification.videos as any
    if (video.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Revoke the certification
    const { error: updateError } = await supabase
      .from('certifications')
      .update({ status: 'revoked' })
      .eq('id', sanitizedId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to revoke certification' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Certification revoked successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
