import CryptoJS from 'crypto-js'

export async function generateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
        const hash = CryptoJS.SHA256(wordArray).toString()
        resolve(hash)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function generateHashFromString(text: string): string {
  return CryptoJS.SHA256(text).toString()
}

export function generateCertificationId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `AIV-${timestamp}-${random}`.toUpperCase()
}
