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
      className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {({ loading }) => (
        loading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Certificate
          </>
        )
      )}
    </PDFDownloadLink>
  )
}
