import { readFile } from 'fs/promises'
import { join } from 'path'
import type { Metadata } from 'next'
import ManualContent from './ManualContent'

export const metadata: Metadata = {
  title: 'User Manual - AIVerify',
  description: 'Complete user guide for AIVerify - AI Video Originality Certification & Creation Proof Platform',
}

async function getManualContent(locale: string) {
  try {
    const fileName = locale === 'zh' ? 'PRODUCT_USER_MANUAL_CN.md' : 'PRODUCT_USER_MANUAL.md'
    const filePath = join(process.cwd(), fileName)
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    const err = error as any
    const isMissingFile = err?.code === 'ENOENT'
    if (!isMissingFile) {
      console.error('Error reading manual:', error)
    }
    // Fallback to English if Chinese version doesn't exist
    if (locale === 'zh') {
      try {
        const filePath = join(process.cwd(), 'PRODUCT_USER_MANUAL.md')
        const content = await readFile(filePath, 'utf-8')
        return content
      } catch (fallbackError) {
        return '# User Manual\n\nContent not available.'
      }
    }
    return '# User Manual\n\nContent not available.'
  }
}

export default async function ManualPage() {
  const enContent = await getManualContent('en')
  const zhContent = await getManualContent('zh')

  return <ManualContent enContent={enContent} zhContent={zhContent} />
}
