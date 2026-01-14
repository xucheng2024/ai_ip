// Video metadata extraction with multi-layer fingerprinting
import { generateHashFromString } from './hash'

export interface VideoMetadata {
  duration: number | null
  frameHash: string | null
  audioHash: string | null
  frameHashes: string[] // Key frame sequence hashes
  metadataHash: string | null
}

/**
 * Extract video metadata including frame and audio hashes
 * Uses browser APIs for client-side extraction
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  const frameHashes: string[] = []
  let duration: number | null = null
  let frameHash: string | null = null
  let audioHash: string | null = null
  let metadataHash: string | null = null

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = async () => {
      try {
        duration = Math.floor(video.duration)

        // Extract key frames (sample at intervals)
        const frameCount = Math.min(10, Math.floor(duration / 2)) // Up to 10 frames, every 2 seconds
        const frameInterval = duration / (frameCount + 1)

        for (let i = 1; i <= frameCount; i++) {
          const time = frameInterval * i
          await seekAndCaptureFrame(video, time, frameHashes)
        }

        // Generate frame sequence hash
        if (frameHashes.length > 0) {
          const frameSequence = frameHashes.join('')
          frameHash = await generateHashFromString(frameSequence)
        }

        // Extract audio fingerprint (simplified - hash audio track data)
        // In production, use Web Audio API for proper audio fingerprinting
        audioHash = await extractAudioFingerprint(video, file)

        // Generate metadata hash (duration, codec, resolution)
        const metadata = {
          duration,
          width: video.videoWidth,
          height: video.videoHeight,
          codec: video.canPlayType(file.type) || 'unknown',
        }
        metadataHash = await generateHashFromString(JSON.stringify(metadata))

        resolve({
          duration,
          frameHash,
          audioHash,
          frameHashes,
          metadataHash,
        })
      } catch (error) {
        reject(error)
      }
    }

    video.onerror = () => {
      // Fallback if video can't be loaded
      resolve({
        duration: null,
        frameHash: null,
        audioHash: null,
        frameHashes: [],
        metadataHash: null,
      })
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * Seek to a specific time and capture frame hash
 */
async function seekAndCaptureFrame(
  video: HTMLVideoElement,
  time: number,
  frameHashes: string[]
): Promise<void> {
  return new Promise((resolve) => {
    video.currentTime = time

    const onSeeked = async () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = canvas.toDataURL('image/jpeg', 0.8)
          const frameHash = await generateHashFromString(imageData)
          frameHashes.push(frameHash)
        }
      } catch (error) {
        console.warn('Frame extraction failed:', error)
      }

      video.removeEventListener('seeked', onSeeked)
      resolve()
    }

    video.addEventListener('seeked', onSeeked, { once: true })

    // Timeout fallback
    setTimeout(() => {
      video.removeEventListener('seeked', onSeeked)
      resolve()
    }, 2000)
  })
}

/**
 * Extract audio fingerprint
 * Simplified implementation - in production use Web Audio API for proper audio analysis
 */
async function extractAudioFingerprint(
  video: HTMLVideoElement,
  file: File
): Promise<string | null> {
  try {
    // For now, hash a portion of the file as audio fingerprint
    // In production, extract actual audio track and analyze
    const audioSlice = await file.slice(0, Math.min(1024 * 1024, file.size)) // First 1MB
    const arrayBuffer = await audioSlice.arrayBuffer()
    const hash = await generateHashFromString(
      new TextDecoder().decode(arrayBuffer.slice(0, 1024))
    )
    return hash
  } catch (error) {
    console.warn('Audio fingerprint extraction failed:', error)
    return null
  }
}

/**
 * Server-side video metadata extraction (for API routes)
 * Requires ffmpeg or similar tool
 */
export async function extractVideoMetadataServer(filePath: string): Promise<VideoMetadata> {
  // For server-side, you would use ffmpeg or similar
  // This is a placeholder - implement with actual video processing library
  return {
    duration: null,
    frameHash: null,
    audioHash: null,
    frameHashes: [],
    metadataHash: null,
  }
}
