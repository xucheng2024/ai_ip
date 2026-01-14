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

        // Extract audio fingerprint using Web Audio API
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

    // Sample audio at fewer points for performance (5 samples)
    const sampleCount = 5
    const audioSamples: number[] = []
    const originalTime = video.currentTime

    // Sample audio at intervals
    for (let i = 0; i < sampleCount; i++) {
      const seekTime = (duration / (sampleCount + 1)) * (i + 1)
      
      try {
        video.currentTime = seekTime
        await new Promise((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked)
            resolve(null)
          }
          video.addEventListener('seeked', onSeeked, { once: true })
          setTimeout(() => resolve(null), 1000)
        })

        // Small delay to let audio buffer fill
        await new Promise(resolve => setTimeout(resolve, 100))

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
