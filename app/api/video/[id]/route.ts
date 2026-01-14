// API route to get signed video URL from Supabase Storage
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('file_url, user_id')
      .eq('id', id)
      .single()

    if (videoError || !video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // If file_url exists and is a Supabase Storage URL, generate signed URL
    if (video.file_url) {
      // Check if it's a Supabase Storage URL (public or signed)
      const publicUrlPattern = /\/storage\/v1\/object\/public\/videos\/(.+)$/
      const signedUrlPattern = /\/storage\/v1\/object\/sign\/videos\/(.+?)(\?|$)/
      
      const publicMatch = video.file_url.match(publicUrlPattern)
      const signedMatch = video.file_url.match(signedUrlPattern)
      
      if (publicMatch || signedMatch) {
        // Extract file path from URL
        const filePath = publicMatch ? publicMatch[1] : signedMatch![1]
        
        // Generate signed URL (valid for 1 hour)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('videos')
          .createSignedUrl(filePath, 3600) // 1 hour expiry

        if (signedUrlError) {
          // If signed URL fails, try public URL
          const response = NextResponse.json({
            url: video.file_url,
            type: 'public'
          })
          response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
          return response
        }

        const response = NextResponse.json({
          url: signedUrlData.signedUrl,
          type: 'signed',
          expiresIn: 3600
        })
        // Cache signed URLs for 5 minutes (they're valid for 1 hour)
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
        return response
      }

      // If not a Supabase Storage URL, return as-is
      const response = NextResponse.json({
        url: video.file_url,
        type: 'external'
      })
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      return response
    }

    return NextResponse.json(
      { error: 'Video URL not available' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Video URL generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate video URL' },
      { status: 500 }
    )
  }
}
