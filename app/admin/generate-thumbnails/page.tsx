'use client'

// Admin page to generate thumbnails for existing videos
// This page allows generating thumbnails for videos that don't have them yet
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateThumbnailFile } from '@/lib/utils/thumbnail'

export default function GenerateThumbnailsPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: [],
  })

  useEffect(() => {
    fetchVideosWithoutThumbnails()
  }, [])

  const fetchVideosWithoutThumbnails = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, file_url, thumbnail_url, user_id')
        .is('thumbnail_url', null)
        .not('file_url', 'is', null)
        .limit(100)

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateThumbnailForVideo = async (video: any) => {
    try {
      setCurrentVideo(video.id)
      const supabase = createClient()

      // Fetch video file from URL
      const response = await fetch(video.file_url)
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`)
      }

      const blob = await response.blob()
      const videoFile = new File([blob], `${video.id}.mp4`, { type: 'video/mp4' })

      // Generate thumbnail
      const thumbnailFile = await generateThumbnailFile(videoFile, {
        time: 1,
        width: 640,
        height: 360,
        quality: 0.8,
      })

      // Upload thumbnail
      const thumbnailFileName = `${video.user_id}/thumbnails/${Date.now()}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(thumbnailFileName, thumbnailFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('videos').getPublicUrl(thumbnailFileName)

      if (!publicUrl) {
        throw new Error('Failed to generate thumbnail URL')
      }

      // Update video record
      const { error: updateError } = await supabase
        .from('videos')
        .update({ thumbnail_url: publicUrl })
        .eq('id', video.id)

      if (updateError) {
        throw new Error(`Update failed: ${updateError.message}`)
      }

      setResults((prev) => ({
        ...prev,
        success: prev.success + 1,
      }))

      // Remove from list
      setVideos((prev) => prev.filter((v) => v.id !== video.id))
    } catch (error: any) {
      console.error(`Error processing video ${video.id}:`, error)
      setResults((prev) => ({
        ...prev,
        failed: prev.failed + 1,
        errors: [...prev.errors, `${video.title}: ${error.message}`],
      }))
    } finally {
      setCurrentVideo(null)
    }
  }

  const processAll = async () => {
    setProcessing(true)
    setResults({ success: 0, failed: 0, errors: [] })

    for (const video of videos) {
      await generateThumbnailForVideo(video)
      // Small delay to avoid overwhelming the browser
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setProcessing(false)
    // Refresh list
    await fetchVideosWithoutThumbnails()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Generate Thumbnails for Existing Videos</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {videos.length} videos without thumbnails
              </p>
              {results.success > 0 || results.failed > 0 ? (
                <p className="mt-2 text-sm">
                  <span className="text-green-600">✓ {results.success} succeeded</span>
                  {results.failed > 0 && (
                    <span className="ml-4 text-red-600">✗ {results.failed} failed</span>
                  )}
                </p>
              ) : null}
            </div>
            <button
              onClick={processAll}
              disabled={videos.length === 0 || processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Process All'}
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-sm text-gray-500">All videos have thumbnails!</p>
          ) : (
            <div className="space-y-2">
              {videos.slice(0, 20).map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <span className="text-sm font-medium">{video.title || video.id}</span>
                  <button
                    onClick={() => generateThumbnailForVideo(video)}
                    disabled={processing || currentVideo === video.id}
                    className="rounded bg-gray-100 px-3 py-1 text-xs disabled:opacity-50"
                  >
                    {currentVideo === video.id ? 'Processing...' : 'Generate'}
                  </button>
                </div>
              ))}
              {videos.length > 20 && (
                <p className="text-xs text-gray-500">
                  Showing first 20 of {videos.length} videos
                </p>
              )}
            </div>
          )}
        </div>

        {results.errors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">Errors:</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
              {results.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
