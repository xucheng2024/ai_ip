'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface VideoPlayerProps {
  url: string | null
  videoId?: string | null
  title?: string
  className?: string
  controls?: boolean
  light?: boolean
  playing?: boolean
  onPlay?: () => void
  onPause?: () => void
}

export default function VideoPlayer({
  url,
  videoId,
  title,
  className = '',
  controls = true,
  light = false,
  playing = false,
  onPlay,
  onPause,
}: VideoPlayerProps) {
  const { t } = useI18n()
  const [isPlaying, setIsPlaying] = useState(playing)
  const [hasError, setHasError] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(url)
  const [loading, setLoading] = useState(false)
  const playerRef = useRef<any>(null)

  // Fetch signed URL if videoId is provided and url is not available
  useEffect(() => {
    console.log('[VideoPlayer] useEffect triggered:', { url, videoId, urlType: typeof url, urlValue: url })
    if (videoId && !url) {
      console.log('[VideoPlayer] Fetching video URL for:', videoId)
      setLoading(true)
      fetch(`/api/video/${videoId}`)
        .then(res => res.json())
        .then(data => {
          console.log('[VideoPlayer] API response:', { hasUrl: !!data.url, type: data.type, error: data.error })
          if (data.url) {
            setVideoUrl(data.url)
          } else {
            console.error('[VideoPlayer] No URL in response:', data)
            setHasError(true)
          }
        })
        .catch((err) => {
          console.error('[VideoPlayer] Fetch error:', err)
          setHasError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.log('[VideoPlayer] Using provided URL:', { hasUrl: !!url, videoId, url, urlLength: url?.length })
      setVideoUrl(url)
    }
  }, [videoId, url])

  if (loading) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center border border-gray-200/50 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">Loading video...</p>
        </div>
      </div>
    )
  }

  console.log('[VideoPlayer] Render state:', { videoUrl, hasError, loading, videoUrlType: typeof videoUrl })
  
  if (!videoUrl) {
    console.log('[VideoPlayer] Rendering "not available" - videoUrl is:', videoUrl)
    return (
      <div className={`aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl flex items-center justify-center border border-gray-200/50 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2 opacity-60">▶</div>
          <p className="text-sm text-gray-500 font-medium">{t.certificate.videoNotAvailable || 'Video not available'}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-red-50 via-red-50/50 to-red-50 rounded-xl flex items-center justify-center border border-red-200/50 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-red-600">{t.certificate.videoLoadError || 'Failed to load video'}</p>
          <p className="text-xs text-red-500 mt-1">{t.certificate.videoLoadErrorDesc || 'Please try again later'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200/80 bg-black ${className}`}>
      <video
        ref={playerRef}
        className="w-full h-full aspect-video"
        controls={controls}
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
        src={videoUrl}
        onPlay={() => {
          setIsPlaying(true)
          onPlay?.()
        }}
        onPause={() => {
          setIsPlaying(false)
          onPause?.()
        }}
        onError={(e) => {
          const video = e.currentTarget as HTMLVideoElement
          const error = video.error
          console.error('[VideoPlayer] Native video error:', {
            code: error?.code,
            message: error?.message,
            MEDIA_ERR_ABORTED: error?.code === 1,
            MEDIA_ERR_NETWORK: error?.code === 2,
            MEDIA_ERR_DECODE: error?.code === 3,
            MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4,
            src: video.src,
            currentSrc: video.currentSrc
          })
          setHasError(true)
        }}
        onLoadedData={() => {
          console.log('[VideoPlayer] Video loaded successfully')
        }}
        style={{
          borderRadius: '0.75rem',
          display: 'block',
        }}
      >
        Your browser does not support the video tag.
      </video>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
          <p className="text-sm font-medium text-white">{title}</p>
        </div>
      )}
    </div>
  )
}
