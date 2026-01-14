// Video metadata extraction with multi-layer fingerprinting
import { generateHashFromString } from './hash'

export interface VideoMetadata {
  duration: number | null
  frameHash: string | null
  audioHash: string | null
  frameHashes: string[] // Key frame sequence hashes
  metadataHash: string | null
}

// Cache for metadata extraction to avoid re-processing
const metadataCache = new Map<string, VideoMetadata>()

/**
 * Extract video metadata including frame and audio hashes
 * Uses browser APIs for client-side extraction
 * Optimized for performance: reduced frame count, parallel processing
 */
export async function extractVideoMetadata(file: File, useCache = true): Promise<VideoMetadata> {
  // Check cache first (using file hash as key)
  if (useCache) {
    const fileHash = await generateFileHashForCache(file)
    const cached = metadataCache.get(fileHash)
    if (cached) {
      console.log('[VideoMetadata] Using cached metadata')
      return cached
    }
  }

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

    // Timeout for metadata loading
    const timeout = setTimeout(() => {
      video.src = ''
      URL.revokeObjectURL(video.src)
      resolve({
        duration: null,
        frameHash: null,
        audioHash: null,
        frameHashes: [],
        metadataHash: null,
      })
    }, 10000) // 10 second timeout

    video.onloadedmetadata = async () => {
      clearTimeout(timeout)
      try {
        duration = Math.floor(video.duration)

        // Optimized: Reduce frame count for better performance
        // Extract fewer frames (max 5 instead of 10) with better distribution
        const frameCount = Math.min(5, Math.max(1, Math.floor(duration / 3))) // Max 5 frames, every 3 seconds
        const frameInterval = duration / (frameCount + 1)

        // Parallelize frame extraction for better performance
        const framePromises: Promise<void>[] = []
        for (let i = 1; i <= frameCount; i++) {
          const time = frameInterval * i
          framePromises.push(seekAndCaptureFrame(video, time, frameHashes))
        }
        
        // Wait for all frames in parallel (with timeout)
        await Promise.race([
          Promise.all(framePromises),
          new Promise(resolve => setTimeout(resolve, 5000)) // 5s timeout for all frames
        ])

        // Generate frame sequence hash
        if (frameHashes.length > 0) {
          const frameSequence = frameHashes.join('')
          frameHash = await generateHashFromString(frameSequence)
        }

        // Extract audio and metadata in parallel
        const [audioResult, metadataResult] = await Promise.allSettled([
          extractAudioFingerprint(video, file),
          Promise.resolve().then(() => {
            const metadata = {
              duration,
              width: video.videoWidth,
              height: video.videoHeight,
              codec: video.canPlayType(file.type) || 'unknown',
            }
            return generateHashFromString(JSON.stringify(metadata))
          })
        ])

        audioHash = audioResult.status === 'fulfilled' ? audioResult.value : null
        metadataHash = metadataResult.status === 'fulfilled' ? metadataResult.value : null

        const result: VideoMetadata = {
          duration,
          frameHash,
          audioHash,
          frameHashes,
          metadataHash,
        }

        // Cache the result
        if (useCache) {
          generateFileHashForCache(file).then(hash => {
            metadataCache.set(hash, result)
            // Limit cache size to prevent memory issues
            if (metadataCache.size > 10) {
              const firstKey = metadataCache.keys().next().value
              if (firstKey) {
                metadataCache.delete(firstKey)
              }
            }
          })
        }

        // Cleanup
        URL.revokeObjectURL(video.src)
        resolve(result)
      } catch (error) {
        clearTimeout(timeout)
        URL.revokeObjectURL(video.src)
        reject(error)
      }
    }

    video.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(video.src)
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
 * Generate a quick hash for cache key (using file size + name + first bytes)
 */
async function generateFileHashForCache(file: File): Promise<string> {
  // Use a lightweight hash for cache key
  const firstChunk = await file.slice(0, 1024).arrayBuffer()
  const chunkHash = Array.from(new Uint8Array(firstChunk))
    .slice(0, 16)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `${file.size}-${file.name}-${chunkHash}`
}

/**
 * Seek to a specific time and capture frame hash
 * Optimized: Uses smaller canvas for faster processing
 */
async function seekAndCaptureFrame(
  video: HTMLVideoElement,
  time: number,
  frameHashes: string[]
): Promise<void> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      video.removeEventListener('seeked', onSeeked)
      resolve()
    }, 1500) // Reduced timeout

    const onSeeked = async () => {
      clearTimeout(timeout)
      try {
        const canvas = document.createElement('canvas')
        // Optimize: Use smaller canvas for faster processing (max 320x180)
        const maxWidth = 320
        const maxHeight = 180
        const videoWidth = video.videoWidth || 640
        const videoHeight = video.videoHeight || 360
        const aspectRatio = videoWidth / videoHeight
        
        if (aspectRatio > 1) {
          canvas.width = Math.min(maxWidth, videoWidth)
          canvas.height = Math.round(canvas.width / aspectRatio)
        } else {
          canvas.height = Math.min(maxHeight, videoHeight)
          canvas.width = Math.round(canvas.height * aspectRatio)
        }
        
        const ctx = canvas.getContext('2d', { willReadFrequently: false })

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          // Use lower quality for faster processing
          const imageData = canvas.toDataURL('image/jpeg', 0.6)
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
    video.currentTime = time
  })
}

/**
 * Extract audio fingerprint using Web Audio API
 * Extracts actual audio track data and generates fingerprint
 * Returns null if video has no audio (valid case)
 */
async function extractAudioFingerprint(
  video: HTMLVideoElement,
  file: File
): Promise<string | null> {
  let audioContext: AudioContext | null = null
  
  try {
    // Check if Web Audio API is available
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) {
      console.warn('Web Audio API not supported')
      return null
    }

    audioContext = new AudioContextClass()
    
    // Unmute video temporarily to access audio
    const wasMuted = video.muted
    video.muted = false
    
    // Wait for video to be ready
    if (video.readyState < 2) {
      await new Promise((resolve) => {
        video.addEventListener('loadeddata', () => resolve(null), { once: true })
        setTimeout(() => resolve(null), 3000)
      })
    }

    const duration = video.duration || 0
    if (duration === 0 || !isFinite(duration)) {
      video.muted = wasMuted
      audioContext.close()
      return null
    }

    // Try to create audio source (will fail if no audio track)
    let source: MediaElementAudioSourceNode
    try {
      source = audioContext.createMediaElementSource(video)
    } catch (error) {
      // Video likely has no audio track
      video.muted = wasMuted
      audioContext.close()
      return null
    }

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048
    const gainNode = audioContext.createGain()
    gainNode.gain.value = 0 // Mute output to avoid playing sound
    
    source.connect(analyser)
    analyser.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Optimized: Reduce audio samples for better performance (3 instead of 5)
    const sampleCount = 3
    const audioSamples: number[] = []
    const originalTime = video.currentTime

    // Sample audio at intervals with timeout
    for (let i = 0; i < sampleCount; i++) {
      const seekTime = (duration / (sampleCount + 1)) * (i + 1)
      
      try {
        video.currentTime = seekTime
        await Promise.race([
          new Promise((resolve) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked)
              resolve(null)
            }
            video.addEventListener('seeked', onSeeked, { once: true })
          }),
          new Promise(resolve => setTimeout(resolve, 800)) // Reduced timeout
        ])

        // Reduced delay for faster processing
        await new Promise(resolve => setTimeout(resolve, 50))

        // Get audio frequency data
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)
        
        // Calculate fingerprint from frequency spectrum
        // Use first 20% of frequencies (most significant) and average
        const significantFreqs = Math.floor(bufferLength * 0.2)
        const avg = dataArray.slice(0, significantFreqs).reduce((a, b) => a + b, 0) / significantFreqs
        audioSamples.push(Math.round(avg))
      } catch (error) {
        console.warn(`Audio sampling at ${seekTime}s failed:`, error)
      }
    }

    // Restore original state
    video.currentTime = originalTime
    video.muted = wasMuted
    audioContext.close()

    // If no valid samples, video likely has no audio
    if (audioSamples.length === 0) {
      return null
    }

    // Generate hash from audio samples
    const audioData = audioSamples.join(',')
    const hash = await generateHashFromString(audioData)
    return hash
  } catch (error) {
    // Cleanup on error
    if (audioContext) {
      try {
        audioContext.close()
      } catch {}
    }
    video.muted = true // Ensure muted
    
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
