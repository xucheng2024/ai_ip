import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateHashFromString } from '@/lib/utils/hash'
import type { SupportAllocation, SupportStats } from '@/lib/types'

// Default allocation ratios (can be made configurable)
const CREATOR_RATIO = 0.7
const PROMOTER_RATIO = 0.2
const PLATFORM_RATIO = 0.1

function calculateAllocation(totalAmount: number): SupportAllocation {
  return {
    total_amount: totalAmount,
    creator_amount: Math.round(totalAmount * CREATOR_RATIO * 100) / 100,
    promoter_amount: Math.round(totalAmount * PROMOTER_RATIO * 100) / 100,
    platform_fee: Math.round(totalAmount * PLATFORM_RATIO * 100) / 100,
  }
}

// GET: Get support stats and recent events
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificate_id: string }> }
) {
  try {
    const { certificate_id } = await params
    const supabase = await createClient()

    // Check if certification exists and is valid
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .select('id, status, promotion_enabled')
      .eq('id', certificate_id)
      .eq('status', 'valid')
      .single()

    if (certError || !certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    // Get support events
    const { data: events, error: eventsError } = await supabase
      .from('promotion_support_events')
      .select('*')
      .eq('certificate_id', certificate_id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (eventsError) {
      return NextResponse.json({ error: 'Failed to fetch support events' }, { status: 500 })
    }

    // Calculate stats
    const stats: SupportStats = {
      total_supports: events?.length || 0,
      total_amount: events?.reduce((sum: number, e: any) => sum + Number(e.total_amount), 0) || 0,
      creator_total: events?.reduce((sum: number, e: any) => sum + Number(e.creator_amount), 0) || 0,
      promoter_total: events?.reduce((sum: number, e: any) => sum + Number(e.promoter_amount), 0) || 0,
      platform_total: events?.reduce((sum: number, e: any) => sum + Number(e.platform_fee), 0) || 0,
    }

    return NextResponse.json({
      stats,
      recent_events: events || [],
      promotion_enabled: certification.promotion_enabled !== false,
    })
  } catch (error: any) {
    console.error('[Support API] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a support event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ certificate_id: string }> }
) {
  try {
    const { certificate_id } = await params
    const { amount, promoter_id } = await request.json()

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if certification exists and promotion is enabled
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .select('id, status, promotion_enabled')
      .eq('id', certificate_id)
      .eq('status', 'valid')
      .single()

    if (certError || !certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    if (certification.promotion_enabled === false) {
      return NextResponse.json({ error: 'Promotion support is disabled for this certification' }, { status: 403 })
    }

    // Calculate allocation
    const allocation = calculateAllocation(amount)

    // Generate verification hash
    const eventData = {
      certificate_id,
      total_amount: allocation.total_amount,
      creator_amount: allocation.creator_amount,
      promoter_amount: allocation.promoter_amount,
      platform_fee: allocation.platform_fee,
      promoter_id: promoter_id || null,
      supporter_id: user.id,
      timestamp: new Date().toISOString(),
    }

    const verification_hash = await generateHashFromString(JSON.stringify(eventData))

    // Insert support event
    const { data: event, error: insertError } = await supabase
      .from('promotion_support_events')
      .insert({
        certificate_id,
        total_amount: allocation.total_amount,
        creator_amount: allocation.creator_amount,
        promoter_amount: allocation.promoter_amount,
        platform_fee: allocation.platform_fee,
        promoter_id: promoter_id || null,
        supporter_id: user.id,
        verification_hash,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Support API] Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create support event' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      event,
      allocation,
    })
  } catch (error: any) {
    console.error('[Support API] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
