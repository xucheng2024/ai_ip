import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { getEvidenceStatus } from '@/lib/utils/evidence'
import type { EvidenceStatus } from '@/lib/types'
import CertificateContent from '@/components/CertificateContent'

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if this is a demo certificate
  const isDemo = id.startsWith('demo-')
  
  let certification: any = null
  let video: any = null
  let metadata: any = null
  let isOwner = false
  let batchStatus: string | null = null
  let evidenceStatus: EvidenceStatus = 'certified'

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

    const demo = demoData[id as keyof typeof demoData] || demoData['demo-1']
    
    certification = {
      id: id,
      timestamp_utc: new Date(demo.date).toISOString(),
      verification_url: `/certificate/${id}`,
      status: 'valid',
      merkle_batch_id: null
    }

    video = {
      id: `video-${id}`,
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
    const { data: cert, error } = await supabase
      .from('certifications')
      .select(
        `
        *,
        videos (
          *,
          users (
            display_name,
            email
          ),
          creation_metadata (*)
        )
      `
      )
      .eq('id', id)
      .eq('status', 'valid')
      .single()

    if (error || !cert) {
      notFound()
    }

    certification = cert
    video = certification.videos as any
    metadata = video?.creation_metadata?.[0] || null
    isOwner = user && video?.user_id === user.id

    // Get batch status for evidence maturity
    if (certification.merkle_batch_id) {
      const { data: batch } = await supabase
        .from('merkle_batches')
        .select('status')
        .eq('id', certification.merkle_batch_id)
        .single()
      batchStatus = batch?.status || null
    }

    // Determine evidence status
    evidenceStatus = getEvidenceStatus(certification, batchStatus)
  }


  // Generate timeline events
  const videoCreatedAt = new Date(video?.created_at || certification.timestamp_utc)
  const certTimestamp = new Date(certification.timestamp_utc)
  const timeDiff = isDemo ? 0 : certTimestamp.getTime() - videoCreatedAt.getTime()
  
  // Timeline events will be translated in the client component
  const timelineEvents = isDemo ? [
    {
      time: format(certTimestamp, 'HH:mm:ss'),
      label: 'certificationCompleted',
      description: 'certificationCompletedDesc',
      status: 'completed' as const,
    }
  ] : [
    {
      time: format(videoCreatedAt, 'HH:mm:ss'),
      label: 'videoUploaded',
      description: 'videoUploadedDesc',
      status: 'completed' as const,
    },
    {
      time: format(new Date(videoCreatedAt.getTime() + timeDiff * 0.3), 'HH:mm:ss'),
      label: 'fingerprintGenerated',
      description: 'fingerprintGeneratedDesc',
      status: 'completed' as const,
    },
    {
      time: format(new Date(videoCreatedAt.getTime() + timeDiff * 0.6), 'HH:mm:ss'),
      label: 'timestampRecorded',
      description: 'timestampRecordedDesc',
      status: 'completed' as const,
    },
    {
      time: format(certTimestamp, 'HH:mm:ss'),
      label: 'certificationComplete',
      description: 'certificationCompleteDesc',
      status: 'completed' as const,
    },
  ]

  return (
    <CertificateContent
      certification={certification}
      video={video}
      metadata={metadata}
      isOwner={isOwner}
      isDemo={isDemo}
      evidenceStatus={evidenceStatus}
      timelineEvents={timelineEvents}
    />
  )
}
