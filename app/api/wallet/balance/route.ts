// API route to check service wallet balance
// Useful for monitoring and alerts
import { NextRequest, NextResponse } from 'next/server'
import { checkWalletBalance } from '@/lib/utils/blockchain'

export async function GET(request: NextRequest) {
  try {
    // Require authentication - wallet info is sensitive
    const authHeader = request.headers.get('authorization')
    const secret = process.env.CRON_SECRET

    if (!secret) {
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 })
    }

    if (authHeader !== `Bearer ${secret}`) {
      // Log unauthorized access attempts
      console.warn('[WALLET BALANCE] Unauthorized access attempt', {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const balance = await checkWalletBalance()

    // Calculate if balance is low (less than 0.01 MATIC)
    const balanceNum = parseFloat(balance.balance)
    const isLow = balanceNum < 0.01

    return NextResponse.json({
      ...balance,
      isLow,
      warning: isLow
        ? 'Balance is low. Please add MATIC to continue anchoring.'
        : null,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to check wallet balance',
      },
      { status: 500 }
    )
  }
}
