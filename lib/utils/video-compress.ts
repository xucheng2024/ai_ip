// Client-side video compression using ffmpeg.wasm
// Lossless compression for Vercel + Supabase architecture
// Note: This module should only be imported dynamically on the client side
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import type { fetchFile as FetchFileType, toBlobURL as ToBlobURLType } from '@ffmpeg/util'

let ffmpegInstance: FFmpeg | null = null
let isLoaded = false

/**
 * Initialize FFmpeg instance (lazy loading)
 * This must be called only from client-side code
 */
async function getFFmpeg(): Promise<FFmpeg> {
  if (typeof window === 'undefined') {
    throw new Error('FFmpeg can only be used on the client side')
  }

  if (ffmpegInstance && isLoaded) {
    return ffmpegInstance
  }

  try {
    // Dynamically import FFmpeg modules
    const [{ FFmpeg: FFmpegClass }, { toBlobURL, fetchFile: _ }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util')
    ])

    const ffmpeg = new FFmpegClass()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

    try {
      // Try loading with blob URLs first
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript')
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      
      await ffmpeg.load({
        coreURL,
        wasmURL,
      })

      ffmpegInstance = ffmpeg
      isLoaded = true
      return ffmpeg
    } catch (error) {
      console.error('Failed to load FFmpeg:', error)
      // Reset state on error so we can retry
      ffmpegInstance = null
      isLoaded = false
      
      // Try alternative loading method (direct URLs)
      try {
        console.log('Retrying FFmpeg load with direct URLs...')
        const ffmpegRetry = new FFmpegClass()
        await ffmpegRetry.load({
          coreURL: `${baseURL}/ffmpeg-core.js`,
          wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        })
        ffmpegInstance = ffmpegRetry
        isLoaded = true
        return ffmpegRetry
      } catch (retryError) {
        console.error('FFmpeg retry also failed:', retryError)
        throw new Error('Failed to initialize video compression engine')
      }
    }
  } catch (importError) {
    console.error('Failed to import FFmpeg modules:', importError)
    throw new Error('Failed to load video compression modules')
  }
}

export interface CompressionOptions {
  quality?: 'lossless' | 'high' | 'medium' | 'low'
  maxWidth?: number
  maxHeight?: number
  maxBitrate?: string // e.g., '5M'
  format?: 'mp4' | 'webm'
  onProgress?: (progress: number) => void // Progress callback (0-100)
}

/**
 * Compress video file with lossless or high-quality compression
 * Uses H.264 codec for maximum compatibility
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    quality = 'lossless',
    maxWidth,
    maxHeight,
    maxBitrate,
    format = 'mp4',
    onProgress,
  } = options

  try {
    const ffmpeg = await getFFmpeg()
    const inputFileName = 'input.' + (file.name.split('.').pop() || 'mp4')
    const outputFileName = `output.${format}`

    // Import fetchFile dynamically
    const { fetchFile } = await import('@ffmpeg/util')

    // Write input file to FFmpeg virtual file system
    await ffmpeg.writeFile(inputFileName, await fetchFile(file))

    // Build FFmpeg command for lossless/high-quality compression
    const args: string[] = ['-i', inputFileName]

    // Video codec settings
    if (quality === 'lossless') {
      // Lossless H.264 encoding (larger file but no quality loss)
      args.push('-c:v', 'libx264')
      args.push('-preset', 'slow') // Better compression ratio
      args.push('-crf', '0') // Lossless mode (CRF 0)
      args.push('-c:a', 'copy') // Copy audio without re-encoding
    } else {
      // High-quality compression (visually lossless)
      args.push('-c:v', 'libx264')
      args.push('-preset', 'slow')
      
      // CRF values: 18-23 is visually lossless, lower = better quality
      const crfMap: Record<string, number> = {
        high: 18,
        medium: 23,
        low: 28,
      }
      args.push('-crf', crfMap[quality]?.toString() || '23')
      
      // Audio compression
      args.push('-c:a', 'aac')
      args.push('-b:a', '192k')
    }

    // Resolution constraints
    if (maxWidth || maxHeight) {
      const scaleFilter: string[] = []
      if (maxWidth && maxHeight) {
        scaleFilter.push(`scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`)
      } else if (maxWidth) {
        scaleFilter.push(`scale='min(${maxWidth},iw)':-1`)
      } else if (maxHeight) {
        scaleFilter.push(`scale=-1:'min(${maxHeight},ih)'`)
      }
      if (scaleFilter.length > 0) {
        args.push('-vf', scaleFilter.join(','))
      }
    }

    // Bitrate limit
    if (maxBitrate) {
      args.push('-maxrate', maxBitrate)
      args.push('-bufsize', maxBitrate)
    }

    // Output format
    args.push('-movflags', '+faststart') // Web optimization
    args.push('-y') // Overwrite output file
    args.push(outputFileName)

    // Set up progress tracking
    let progressHandler: (({ message }: { message: string }) => void) | null = null
    if (onProgress) {
      onProgress(10) // Initialization complete
      progressHandler = ({ message }: { message: string }) => {
        // Parse FFmpeg progress from log messages
        const timeMatch = message.match(/time=(\d+):(\d+):(\d+\.\d+)/)
        if (timeMatch) {
          // Rough progress estimation (10-80% during processing)
          onProgress(Math.min(80, 10 + Math.random() * 70))
        }
      }
      ffmpeg.on('log', progressHandler)
    }

    // Execute FFmpeg
    await ffmpeg.exec(args)
    
    // Clean up progress handler
    if (progressHandler && onProgress) {
      ffmpeg.off('log', progressHandler)
      onProgress(90) // Near completion
    }

    // Read output file
    const data = await ffmpeg.readFile(outputFileName)
    // Convert FileData to Blob-compatible format
    // FileData can be Uint8Array or string, handle both cases
    let uint8Array: Uint8Array
    if (data instanceof Uint8Array) {
      // Create a new Uint8Array by copying the data to ensure type compatibility
      uint8Array = Uint8Array.from(data)
    } else if (typeof data === 'string') {
      uint8Array = new TextEncoder().encode(data)
    } else {
      uint8Array = new Uint8Array(data as ArrayLike<number>)
    }
    const blob = new Blob([uint8Array as BlobPart], { type: `video/${format}` })
    
    if (onProgress) {
      onProgress(100) // Complete
    }
    
    // Clean up
    await ffmpeg.deleteFile(inputFileName)
    await ffmpeg.deleteFile(outputFileName)

    // Create File object with original name but new extension
    const originalName = file.name.replace(/\.[^/.]+$/, '')
    const compressedFile = new File([blob], `${originalName}.${format}`, {
      type: `video/${format}`,
      lastModified: Date.now(),
    })

    return compressedFile
  } catch (error) {
    console.error('Video compression failed:', error)
    throw new Error(`Video compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Check if video compression is supported in current environment
 */
export function isCompressionSupported(): boolean {
  return typeof window !== 'undefined' && 'WebAssembly' in window
}

/**
 * Get estimated compression ratio (rough estimate)
 */
export function getEstimatedSize(
  originalSize: number,
  quality: CompressionOptions['quality'] = 'lossless'
): number {
  const ratioMap: Record<string, number> = {
    lossless: 0.7, // ~30% reduction with lossless
    high: 0.5, // ~50% reduction
    medium: 0.3, // ~70% reduction
    low: 0.2, // ~80% reduction
  }

  return Math.floor(originalSize * (ratioMap[quality] || 0.7))
}
