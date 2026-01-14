import { readFile } from 'fs/promises'
import { join } from 'path'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Manual - AIVerify',
  description: 'Complete user guide for AIVerify - AI Video Originality Certification & Creation Proof Platform',
}

async function getManualContent() {
  try {
    const filePath = join(process.cwd(), 'PRODUCT_USER_MANUAL.md')
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('Error reading manual:', error)
    return '# User Manual\n\nContent not available.'
  }
}

export default async function ManualPage() {
  const content = await getManualContent()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg sm:p-10">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8 border-b border-gray-200 pb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                a: ({ href, children }) => {
                  if (!href) {
                    return <span className="text-blue-600 font-medium">{children}</span>
                  }
                  
                  const isExternal = href.startsWith('http')
                  const isInternal = href.startsWith('/')
                  
                  if (isInternal) {
                    return (
                      <Link 
                        href={href}
                        className="text-blue-600 font-medium hover:text-blue-700 underline"
                      >
                        {children}
                      </Link>
                    )
                  }
                  
                  return (
                    <a 
                      href={href} 
                      className="text-blue-600 font-medium hover:text-blue-700 underline"
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  )
                },
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                  ) : (
                    <code className={className}>{children}</code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">{children}</blockquote>
                ),
                hr: () => <hr className="border-gray-200 my-8" />,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr>{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
