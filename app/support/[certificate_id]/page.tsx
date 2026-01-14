import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SupportPageContent from '@/components/SupportPageContent'

export default async function SupportPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ certificate_id: string }>
  searchParams: Promise<{ promoter?: string }>
}) {
  const { certificate_id } = await params
  const { promoter } = await searchParams
  const supabase = await createClient()

  // Check if this is a demo certificate
  const isDemo = certificate_id.startsWith('demo-')
  
  let certification: any = null
  let video: any = null
  let metadata: any = null

  if (isDemo) {
    // Create demo data
    const demoData = {
      'demo-1': {
        title: 'AI Landscape Generation',
        creator: 'Demo Creator',
        date: '2024-01-15',
        aiTool: 'Runway'
      },
      'demo-2': {
        title: 'Character Animation Sequence',
        creator: 'Demo Creator',
        date: '2024-01-16',
        aiTool: 'Pika'
      },
      'demo-3': {
        title: 'Product Showcase Video',
        creator: 'Demo Creator',
        date: '2024-01-17',
        aiTool: 'Sora'
      },
      'demo-4': {
        title: 'Abstract Motion Graphics',
        creator: 'Demo Creator',
        date: '2024-01-18',
        aiTool: 'Runway'
      },
      'demo-5': {
        title: 'Narrative Short Film',
        creator: 'Demo Creator',
        date: '2024-01-19',
        aiTool: 'Other'
      }
    }

    const demo = demoData[certificate_id as keyof typeof demoData] || demoData['demo-1']
    
    certification = {
      id: certificate_id,
      timestamp_utc: new Date(demo.date).toISOString(),
      verification_url: `/certificate/${certificate_id}`,
      status: 'valid',
      promotion_enabled: true
    }

    video = {
      id: `video-${certificate_id}`,
      title: demo.title,
      file_hash: '0x' + '0'.repeat(64),
      created_at: new Date(demo.date).toISOString(),
      user_id: 'demo-user',
      users: {
        display_name: demo.creator,
        email: 'demo@example.com'
      }
    }

    metadata = {
      ai_tool: demo.aiTool
    }
  } else {
    // Check if certification exists and is valid
    const { data: cert, error: certError } = await supabase
      .from('certifications')
      .select(`
        *,
        videos (
          *,
          users (
            display_name,
            email
          ),
          creation_metadata (*)
        )
      `)
      .eq('id', certificate_id)
      .eq('status', 'valid')
      .single()

    if (certError || !cert) {
      notFound()
    }

    certification = cert
    video = certification.videos as any
    metadata = video?.creation_metadata?.[0] || null
  }

  // Check if promotion is enabled
  if (certification.promotion_enabled === false) {
    // Still show page but without promotion features
  }

  return (
    <SupportPageContent
      certification={certification}
      video={video}
      metadata={metadata}
      promoterId={promoter || null}
      isDemo={isDemo}
    />
  )
}
