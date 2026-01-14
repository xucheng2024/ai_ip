'use client'

import dynamic from 'next/dynamic'

const CertificatePDF = dynamic(() => import('@/components/CertificatePDF'), {
  ssr: false,
})

interface CertificatePDFWrapperProps {
  certification: any
  video: any
  metadata: any
}

export default function CertificatePDFWrapper({
  certification,
  video,
  metadata,
}: CertificatePDFWrapperProps) {
  return <CertificatePDF certification={certification} video={video} metadata={metadata} />
}
