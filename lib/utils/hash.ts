// Use Web Crypto API for better compatibility
export async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function generateHashFromString(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export function generateCertificationId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `AIV-${timestamp}-${random}`.toUpperCase()
}
