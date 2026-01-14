/**
 * Input validation utilities for API routes
 */

export function sanitizeString(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength)
}

export function validateCertificationId(id: string): boolean {
  // Format: AIV-{timestamp}-{random}
  const certIdRegex = /^AIV-\d+-[a-z0-9]+$/i
  return certIdRegex.test(id.trim())
}

export function validateHash(hash: string | null | undefined): boolean {
  if (!hash) return false
  const hashRegex = /^[a-f0-9]{64}$/i
  return hashRegex.test(hash)
}

export function validateFileSize(size: number, maxSizeBytes: number): boolean {
  return size > 0 && size <= maxSizeBytes
}

export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => mimeType.startsWith(type))
}

export function sanitizeFilename(filename: string, maxLength: number = 255): string {
  // Remove path separators and dangerous characters
  const sanitized = filename
    .replace(/[\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim()
    .slice(0, maxLength)
  return sanitized || 'file'
}

export function sanitizeFileExtension(ext: string): string {
  const allowedExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v']
  const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '')
  return allowedExtensions.includes(cleanExt) ? cleanExt : 'mp4'
}
