'use client'

import { useI18n } from '@/lib/i18n/context'

interface VerificationGuideProps {
  certificationId: string
  className?: string
}

export default function VerificationGuide({ certificationId, className = '' }: VerificationGuideProps) {
  const { t } = useI18n()
  
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{t.verificationGuide.title}</h3>
      <p className="mb-6 text-sm text-gray-600">
        {t.verificationGuide.subtitle}
      </p>

      <div className="space-y-6">
        {/* Section 1: What's in the Package */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              1
            </span>
            {t.verificationGuide.section1Title}
          </h4>
          <div className="ml-8 space-y-2 text-sm text-gray-700">
            <p>• <strong>{t.verificationGuide.section1Item1.split(':')[0]}:</strong> {t.verificationGuide.section1Item1.split(':').slice(1).join(':')}</p>
            <p>• <strong>{t.verificationGuide.section1Item2.split(':')[0]}:</strong> {t.verificationGuide.section1Item2.split(':').slice(1).join(':')}</p>
            <p>• <strong>{t.verificationGuide.section1Item3.split(':')[0]}:</strong> {t.verificationGuide.section1Item3.split(':').slice(1).join(':')}</p>
            <p>• <strong>{t.verificationGuide.section1Item4.split(':')[0]}:</strong> {t.verificationGuide.section1Item4.split(':').slice(1).join(':')}</p>
            <p>• <strong>{t.verificationGuide.section1Item5.split(':')[0]}:</strong> {t.verificationGuide.section1Item5.split(':').slice(1).join(':')}</p>
          </div>
        </section>

        {/* Section 2: Hash Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              2
            </span>
            {t.verificationGuide.section2Title}
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">{t.verificationGuide.section2Step1}</p>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs">
              <pre>{`{
  "version": "1.0",
  "video": { "file_hash": "...", ... },
  "creator": { "user_id": "...", ... },
  "timestamps": { "server_time_utc": "...", ... },
  "metadata": { ... }
}`}</pre>
            </div>
            <p className="font-medium">{t.verificationGuide.section2Step2}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section2Step2Desc1}</li>
              <li>{t.verificationGuide.section2Step2Desc2}</li>
            </ul>
            <p className="font-medium">{t.verificationGuide.section2Step3}</p>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs">
              <code>hash = SHA256(JSON.stringify(canonical_evidence))</code>
            </div>
            <p className="text-xs text-gray-600">
              {t.verificationGuide.section2Note}
            </p>
          </div>
        </section>

        {/* Section 3: Merkle Proof Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              3
            </span>
            {t.verificationGuide.section3Title}
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">{t.verificationGuide.section3Desc}</p>
            <ol className="list-inside list-decimal space-y-2">
              <li>{t.verificationGuide.section3Step1}</li>
              <li>{t.verificationGuide.section3Step2}
                <ul className="ml-6 mt-1 list-inside list-disc">
                  <li>{t.verificationGuide.section3Step2a}</li>
                  <li>{t.verificationGuide.section3Step2b}</li>
                </ul>
              </li>
              <li>{t.verificationGuide.section3Step3}</li>
            </ol>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs">
              <pre>{`function verifyMerkleProof(leaf, path, indices, root) {
  let current = leaf
  for (let i = 0; i < path.length; i++) {
    const sibling = path[i]
    const isLeft = indices[i] % 2 === 0
    current = SHA256(isLeft ? current + sibling : sibling + current)
  }
  return current === root
}`}</pre>
            </div>
          </div>
        </section>

        {/* Section 4: Blockchain Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              4
            </span>
            {t.verificationGuide.section4Title}
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">{t.verificationGuide.section4Step1}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section4Step1Desc1}</li>
              <li>{t.verificationGuide.section4Step1Desc2}</li>
              <li>{t.verificationGuide.section4Step1Desc3}</li>
            </ul>
            <p className="font-medium">{t.verificationGuide.section4Step2}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section4Step2Desc1}</li>
              <li>{t.verificationGuide.section4Step2Desc2}</li>
            </ul>
            <p className="font-medium">{t.verificationGuide.section4Step3}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section4Step3Desc1}</li>
              <li>{t.verificationGuide.section4Step3Desc2}</li>
            </ul>
          </div>
        </section>

        {/* Section 5: TSA Timestamp Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              5
            </span>
            {t.verificationGuide.section5Title}
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p>{t.verificationGuide.section5Desc}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section5Item1}</li>
              <li>{t.verificationGuide.section5Item2}</li>
              <li>{t.verificationGuide.section5Item3}</li>
            </ul>
            <p className="text-xs text-gray-600">
              {t.verificationGuide.section5Note}
            </p>
          </div>
        </section>

        {/* Section 6: Chain of Custody */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              6
            </span>
            {t.verificationGuide.section6Title}
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p>{t.verificationGuide.section6Desc}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t.verificationGuide.section6Item1}</li>
              <li>{t.verificationGuide.section6Item2}</li>
              <li>{t.verificationGuide.section6Item3}</li>
            </ul>
          </div>
        </section>

        {/* Additional Resources */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">{t.verificationGuide.resourcesTitle}</p>
          <ul className="mt-2 space-y-1 text-xs text-blue-800">
            <li>• {t.verificationGuide.resourcesItem1}</li>
            <li>• {t.verificationGuide.resourcesItem2.replace('{certificationId}', certificationId)}</li>
            <li>• {t.verificationGuide.resourcesItem3}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
