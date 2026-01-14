// API route to fetch public videos (with valid certifications) for the Creation Square
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch videos with valid certifications, sorted by newest first
    const { data: certifications, error } = await supabase
      .from('certifications')
      .select(
        `
        id,
        video_id,
        created_at,
        status,
        merkle_batch_id,
        tsa_timestamp_token,
        videos (
          id,
          title,
          original_filename,
          file_url,
          created_at,
          users (
            display_name,
            email
          ),
          creation_metadata (
            ai_tool
          )
        )
      `
      )
      .eq('status', 'valid')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const videos = (certifications || [])
      .filter((cert: any) => cert.videos) // Filter out any null videos
      .map((cert: any) => {
        const video = cert.videos
        const metadata = video.creation_metadata?.[0] || {}
        const user = video.users || {}

        return {
          id: cert.id, // Use certification ID for the certificate page
          videoId: video.id,
          title: video.title || video.original_filename,
          description: `Certified AI video with verifiable authorship evidence`,
          creator: user.display_name || user.email || 'Unknown Creator',
          certifiedDate: new Date(cert.created_at).toISOString().split('T')[0],
          aiTool: metadata.ai_tool || 'Unknown',
          category: cert.merkle_batch_id ? 'merkle' : cert.tsa_timestamp_token ? 'timestamp' : 'blockchain',
          fileUrl: video.file_url,
          createdAt: cert.created_at
        }
      })

    return NextResponse.json({ videos })
  } catch (error: any) {
    console.error('Videos API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
