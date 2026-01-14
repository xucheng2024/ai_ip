// API route to generate thumbnails for existing videos
// This endpoint processes videos that don't have thumbnails yet
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication (optional - can be public for admin use)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get videos without thumbnails
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id, file_url, user_id, thumbnail_url')
      .is('thumbnail_url', null)
      .not('file_url', 'is', null)
      .limit(100) // Process 100 at a time

    if (videosError) {
      console.error('Error fetching videos:', videosError)
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json({
        message: 'No videos need thumbnails',
        processed: 0,
      })
    }

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Note: This is a placeholder - actual thumbnail generation would require
    // server-side video processing (ffmpeg) or client-side processing
    // For now, we return the list of videos that need thumbnails
    // The actual generation should be done client-side or with a server-side ffmpeg service

    return NextResponse.json({
      message: `Found ${videos.length} videos without thumbnails`,
      videos: videos.map(v => ({
        id: v.id,
        file_url: v.file_url,
        needs_thumbnail: !v.thumbnail_url,
      })),
      note: 'Thumbnail generation requires client-side processing or server-side ffmpeg. Use the client-side thumbnail utility to generate thumbnails.',
    })
  } catch (error: any) {
    console.error('Generate thumbnails error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process thumbnails' },
      { status: 500 }
    )
  }
}

// GET endpoint to check thumbnail status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: stats, error } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true })

    const { data: withThumbnails, error: thumbError } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true })
      .not('thumbnail_url', 'is', null)

    const total = stats?.length || 0
    const withThumb = withThumbnails?.length || 0
    const withoutThumb = total - withThumb

    return NextResponse.json({
      total,
      with_thumbnails: withThumb,
      without_thumbnails: withoutThumb,
    })
  } catch (error: any) {
    console.error('Thumbnail stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get stats' },
      { status: 500 }
    )
  }
}
