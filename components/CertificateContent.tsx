'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useI18n } from '@/lib/i18n/context'
import CertificatePDFWrapper from './CertificatePDFWrapper'
import HashDisplay from './HashDisplay'
import CreationTimeline from './CreationTimeline'
import CertificationBadge from './CertificationBadge'
import RevokeCertificateButton from './RevokeCertificateButton'
import ComplaintEvidencePackage from './ComplaintEvidencePackage'
import EvidenceStatusBadge, { getEvidenceStatus } from './EvidenceStatusBadge'
import VerificationGuide from './VerificationGuide'
import EvidenceUsageScenarios from './EvidenceUsageScenarios'
import CreatorContinuityChain from './CreatorContinuityChain'
import CertificateHero from './CertificateHero'
import SummaryCard from './SummaryCard'
import VerificationAction from './VerificationAction'

interface CertificateContentProps {
  certification: any
  video: any
  metadata: any
  isOwner: boolean
  isDemo: boolean
  evidenceStatus: string
  timelineEvents: any[]
}

export default function CertificateContent({
  certification,
  video,
  metadata,
  isOwner,
  isDemo,
  evidenceStatus,
  timelineEvents,
}: CertificateContentProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={isDemo ? "/videos" : "/dashboard"}
            className="inline-flex items-center text-sm font-medium text-blue-600 transition-all duration-200 hover:text-blue-700"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isDemo ? t.certificate.backToVideos : t.certificate.backToDashboard}
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-lg sm:p-10 animate-fade-in">
          <CertificateHero evidenceStatus={evidenceStatus} />

          <div className="space-y-7 border-t border-gray-200 pt-7">
            {/* Summary Card */}
            <SummaryCard
              creator={video?.users?.display_name || video?.users?.email || t.certificate.anonymous}
              certifiedDate={new Date(certification.timestamp_utc)}
              verificationStatus={t.certificate.publiclyVerifiable}
              evidenceStatus={{
                label: evidenceStatus,
                status: evidenceStatus === 'anchored' ? t.certificate.timeStampedBlockchainAnchored : 
                       evidenceStatus === 'timestamped' ? t.certificate.timeStamped : t.certificate.timeStamped
              }}
            />

            {/* Creation Timeline - Reduced prominence */}
            <CreationTimeline events={timelineEvents.map(event => {
              const getTranslation = (key: string): string => {
                const certKeys = t.certificate as Record<string, string>
                return certKeys[key] || key
              }
              return {
                ...event,
                label: getTranslation(event.label),
                description: getTranslation(event.description),
              }
            })} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.certificate.certId}</p>
                <p className="mt-2 font-mono text-base font-semibold text-gray-900 break-all">
                  {certification.id}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.certificate.certifiedAt}</p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {format(new Date(certification.timestamp_utc), 'PPp')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.certificate.videoTitle}</p>
                <p className="mt-2 text-base font-semibold text-gray-900">{video?.title}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.certificate.creator}</p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {video?.users?.display_name || video?.users?.email || t.certificate.anonymous}
                </p>
              </div>
              {metadata?.ai_tool && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{t.certificate.aiTool}</p>
                  <p className="mt-2 text-base font-semibold text-gray-900 capitalize">{metadata.ai_tool}</p>
                </div>
              )}
            </div>

            {/* Content Fingerprint - Collapsible */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">{t.certificate.contentFingerprint}</p>
              <HashDisplay hash={video?.file_hash || ''} collapsible={true} />
            </div>

            {metadata?.prompt_hash && !metadata?.prompt_plaintext && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-700 mb-2">{t.certificate.promptFingerprint}</p>
                <HashDisplay hash={metadata.prompt_hash} />
                <p className="mt-2 text-xs text-blue-600">
                  {t.certificate.promptFingerprintDesc}
                </p>
              </div>
            )}

            {/* Embeddable Badge */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">{t.certificate.embeddableBadge}</p>
              <CertificationBadge
                certificationId={certification.id}
                certifiedDate={format(new Date(certification.timestamp_utc), 'yyyy-MM-dd')}
                verificationUrl={certification.verification_url}
                embeddable={true}
              />
              <p className="mt-3 text-xs text-gray-600">
                {t.certificate.badgeDesc}
              </p>
            </div>

            {/* Demo Notice */}
            {isDemo && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>{t.certificate.demoCertificate}</strong> {t.certificate.demoCertificateDesc}
                  <Link href="/certify" className="ml-1 text-amber-900 underline hover:text-amber-700">
                    {t.certificate.createYourOwn}
                  </Link>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {isOwner && !isDemo && (
                <div className="flex-1">
                  <a
                    href={`/api/evidence/${certification.id}`}
                    download
                    className="flex w-full items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-6 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {t.certificate.downloadEvidence}
                  </a>
                  <p className="mt-1 text-xs text-gray-500 text-center">
                    {t.certificate.downloadEvidenceDesc}
                  </p>
                </div>
              )}
              <div className="flex-1">
                <Link
                  href={`/verify?id=${certification.id}`}
                  className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {t.certificate.verifyCertificate}
                </Link>
                <p className="mt-1 text-xs text-gray-500 text-center">
                  {t.certificate.verifyCertificateDesc}
                </p>
              </div>
              <div className="flex-1">
                <CertificatePDFWrapper
                  certification={certification}
                  video={video}
                  metadata={metadata}
                />
              </div>
            </div>

            {/* Trust Features */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900">{t.certificate.trustFeatures}</h3>
              
              {certification.tsa_timestamp_token && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-semibold text-green-800">{t.certificate.tsaTimestamp}</p>
                  </div>
                  <p className="text-xs text-green-700">{t.certificate.tsaTimestampDesc}</p>
                </div>
              )}

              {certification.merkle_batch_id && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-xs font-semibold text-blue-800">{t.certificate.blockchainAnchored}</p>
                  </div>
                  <p className="text-xs text-blue-700">{t.certificate.blockchainAnchoredDesc}</p>
                </div>
              )}

              {video?.frame_hash && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-semibold text-purple-800">{t.certificate.multiLayerFingerprinting}</p>
                  </div>
                  <p className="text-xs text-purple-700">{t.certificate.multiLayerFingerprintingDesc}</p>
                </div>
              )}

              {certification.evidence_hash && (
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs font-semibold text-gray-800">{t.certificate.verifiableEvidence}</p>
                  </div>
                  <p className="text-xs text-gray-700">{t.certificate.verifiableEvidenceDesc}</p>
                </div>
              )}
            </div>

            {/* Verification Action */}
            <VerificationAction verificationUrl={certification.verification_url} />

            {/* Verification Guide */}
            {!isDemo && <VerificationGuide certificationId={certification.id} />}

            {/* Creator Continuity */}
            {!isDemo && certification.evidence_hash && (
              <CreatorContinuityChain
                currentEvidenceHash={certification.evidence_hash}
                previousEvidenceHash={certification.previous_evidence_hash}
              />
            )}

            {/* Usage Scenarios */}
            {!isDemo && (
              <EvidenceUsageScenarios
                certification={certification}
                video={video}
              />
            )}

            {/* Complaint Evidence Package */}
            {isOwner && !isDemo && (
              <ComplaintEvidencePackage
                certification={certification}
                video={video}
                metadata={metadata}
              />
            )}

            {/* Revoke Certificate (only for owner) */}
            {isOwner && !isDemo && (
              <div className="border-t border-gray-200 pt-6">
                <RevokeCertificateButton certificationId={certification.id} />
              </div>
            )}

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs leading-relaxed text-yellow-800">
                {t.certificate.legalDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
