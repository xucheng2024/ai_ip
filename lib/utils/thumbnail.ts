// Client-side thumbnail generation utility
// Generates thumbnail from video file using canvas API

export interface ThumbnailOptions {
  time?: number // Time in seconds to capture (default: 1)
  width?: number // Thumbnail width (default: 640)
  height?: number // Thumbnail height (default: 360)
  quality?: number // JPEG quality 0-1 (default: 0.8)
}

/**
 * Generate thumbnail from video file
 * Returns base64 data URL or Blob
 */
export async function generateThumbnail(
  file: File,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    time = 1, // Capture at 1 second
    width = 640,
    height = 360,
    quality = 0.8,
  } = options

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const timeout = setTimeout(() => {
      video.src = ''
      URL.revokeObjectURL(video.src)
      reject(new Error('Thumbnail generation timeout'))
    }, 10000) // 10 second timeout

    video.onloadedmetadata = () => {
      clearTimeout(timeout)
      try {
        // Seek to specified time
        video.currentTime = Math.min(time, video.duration || 1)
      } catch (error) {
        console.warn('Failed to seek video:', error)
        video.currentTime = 0
      }
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Canvas context not available')
        }

        // Calculate aspect ratio and dimensions
        const videoWidth = video.videoWidth || width
        const videoHeight = video.videoHeight || height
        const aspectRatio = videoWidth / videoHeight
        const targetAspectRatio = width / height

        let drawWidth = width
        let drawHeight = height
        let offsetX = 0
        let offsetY = 0

        if (aspectRatio > targetAspectRatio) {
          // Video is wider, fit to height
          drawHeight = height
          drawWidth = height * aspectRatio
          offsetX = (width - drawWidth) / 2
        } else {
          // Video is taller, fit to width
          drawWidth = width
          drawHeight = width / aspectRatio
          offsetY = (height - drawHeight) / 2
        }

        canvas.width = width
        canvas.height = height

        // Fill background (black)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, width, height)

        // Draw video frame
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight)

        // Convert to JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        
        // Cleanup
        URL.revokeObjectURL(video.src)
        resolve(dataUrl)
      } catch (error) {
        URL.revokeObjectURL(video.src)
        reject(error)
      }
    }

    video.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(video.src)
      reject(new Error('Failed to load video for thumbnail generation'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * Convert base64 data URL to Blob
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * Generate thumbnail and return as File object
 */
export async function generateThumbnailFile(
  file: File,
  options: ThumbnailOptions = {}
): Promise<File> {
  const dataUrl = await generateThumbnail(file, options)
  const blob = dataURLtoBlob(dataUrl)
  const thumbnailFile = new File([blob], `thumbnail-${Date.now()}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
  return thumbnailFile
}
