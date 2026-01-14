'use client'

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Register font if needed
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    marginBottom: 15,
  },
  hash: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: '#333',
    wordBreak: 'break-all',
  },
  divider: {
    borderBottom: '1pt solid #eee',
    marginVertical: 15,
  },
  disclaimer: {
    fontSize: 8,
    color: '#999',
    marginTop: 30,
    fontStyle: 'italic',
  },
})

interface CertificatePDFProps {
  certification: any
  video: any
  metadata: any
}

function CertificateDocument({ certification, video, metadata }: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AIVerify</Text>
        <Text style={styles.subtitle}>AI Video Originality Certification</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Certification ID</Text>
          <Text style={styles.value}>{certification.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Video Title</Text>
          <Text style={styles.value}>{video?.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Creator</Text>
          <Text style={styles.value}>
            {video?.users?.display_name || video?.users?.email || 'Anonymous'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Certified At (UTC)</Text>
          <Text style={styles.value}>
            {format(new Date(certification.timestamp_utc), 'PPp')}
          </Text>
        </View>

        {metadata?.ai_tool && (
          <View style={styles.section}>
            <Text style={styles.label}>AI Tool</Text>
            <Text style={styles.value}>{metadata.ai_tool.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>File Hash (SHA-256)</Text>
          <Text style={styles.hash}>{video?.file_hash}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Verification URL</Text>
          <Text style={styles.value}>{certification.verification_url}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.disclaimer}>
          Legal Disclaimer: This service provides creation time and content consistency proof. It
          does not constitute government copyright registration or legal judgment. This platform
          does not judge the legality of infringement.
        </Text>
      </Page>
    </Document>
  )
}

export default function CertificatePDF({ certification, video, metadata }: CertificatePDFProps) {
  return (
    <PDFDownloadLink
      document={
        <CertificateDocument
          certification={certification}
          video={video}
          metadata={metadata}
        />
      }
      fileName={`certificate-${certification.id}.pdf`}
      className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
    >
      {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF Certificate')}
    </PDFDownloadLink>
  )
}
