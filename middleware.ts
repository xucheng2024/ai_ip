import { type NextRequest, NextResponse } from 'next/server'

// Simplified middleware - just pass through for now
// Authentication is handled at the page level
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
