'use client'

interface VerificationGuideProps {
  certificationId: string
  className?: string
}

export default function VerificationGuide({ certificationId, className = '' }: VerificationGuideProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">How to Verify This Evidence</h3>
      <p className="mb-6 text-sm text-gray-600">
        This guide explains how to independently verify the evidence package without relying on our platform.
      </p>

      <div className="space-y-6">
        {/* Section 1: What's in the Package */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              1
            </span>
            What's in the Evidence Package
          </h4>
          <div className="ml-8 space-y-2 text-sm text-gray-700">
            <p>• <strong>Canonical Evidence:</strong> Video hash, frame hashes, creator ID, timestamps</p>
            <p>• <strong>Merkle Proof:</strong> Cryptographic proof linking this evidence to a batch root</p>
            <p>• <strong>Blockchain Anchor:</strong> Transaction hash, block number, network info</p>
            <p>• <strong>Chain of Custody:</strong> Event log showing the certification timeline</p>
            <p>• <strong>TSA Timestamp Token:</strong> RFC 3161 timestamp from trusted authority (if available)</p>
          </div>
        </section>

        {/* Section 2: Hash Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              2
            </span>
            How to Recalculate the Hash
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">Step 1: Extract the canonical evidence</p>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs">
              <pre>{`{
  "version": "1.0",
  "video": { "file_hash": "...", ... },
  "creator": { "user_id": "...", ... },
  "timestamps": { "server_time_utc": "...", ... },
  "metadata": { ... }
}`}</pre>
            </div>
            <p className="font-medium">Step 2: Canonicalize JSON</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Sort all object keys alphabetically (recursively)</li>
              <li>Remove any undefined/null fields that aren't in the canonical structure</li>
            </ul>
            <p className="font-medium">Step 3: Calculate SHA-256</p>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs">
              <code>hash = SHA256(JSON.stringify(canonical_evidence))</code>
            </div>
            <p className="text-xs text-gray-600">
              Verify this hash matches the <code>evidence_hash</code> in the package.
            </p>
          </div>
        </section>

        {/* Section 3: Merkle Proof Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              3
            </span>
            How to Verify Merkle Proof
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">Algorithm:</p>
            <ol className="list-inside list-decimal space-y-2">
              <li>Start with your evidence hash as the current hash</li>
              <li>For each sibling in the proof path:
                <ul className="ml-6 mt-1 list-inside list-disc">
                  <li>If index is even: hash = SHA256(current_hash + sibling)</li>
                  <li>If index is odd: hash = SHA256(sibling + current_hash)</li>
                </ul>
              </li>
              <li>The final hash should match the Merkle root</li>
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
            How to Verify on Blockchain
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p className="font-medium">Step 1: Find the transaction</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Use a blockchain explorer (e.g., PolygonScan)</li>
              <li>Navigate to: <code>https://polygonscan.com/tx/{'{tx_hash}'}</code></li>
              <li>Verify the transaction exists and is confirmed</li>
            </ul>
            <p className="font-medium">Step 2: Extract Merkle root from transaction</p>
            <ul className="list-inside list-disc space-y-1">
              <li>The Merkle root is stored in the transaction's <code>input data</code> field</li>
              <li>It's a 32-byte (64 hex character) value starting with <code>0x</code></li>
            </ul>
            <p className="font-medium">Step 3: Verify root matches</p>
            <ul className="list-inside list-disc space-y-1">
              <li>The root from the blockchain should match the root in your Merkle proof</li>
              <li>Block timestamp should be after the certification timestamp</li>
            </ul>
          </div>
        </section>

        {/* Section 5: TSA Timestamp Verification */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              5
            </span>
            How to Verify TSA Timestamp (RFC 3161)
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p>If the package includes a <code>tsa_token</code>, you can verify it using:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>OpenSSL: <code>openssl ts -verify -data evidence_hash -in tsa_token.der</code></li>
              <li>Verify the timestamp authority's certificate chain</li>
              <li>Verify the token was issued before the block timestamp</li>
            </ul>
            <p className="text-xs text-gray-600">
              Note: TSA verification requires the TSA's certificate. Contact us for certificate details.
            </p>
          </div>
        </section>

        {/* Section 6: Chain of Custody */}
        <section>
          <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              6
            </span>
            Verify Chain of Custody
          </h4>
          <div className="ml-8 space-y-3 text-sm text-gray-700">
            <p>Each event log has a <code>log_hash</code>. Verify the chain:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Event 1's hash should match Event 2's <code>previous_log_hash</code></li>
              <li>Each log_hash should be SHA256(event_data + previous_log_hash)</li>
              <li>All events should be in chronological order</li>
            </ul>
          </div>
        </section>

        {/* Additional Resources */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Additional Resources</p>
          <ul className="mt-2 space-y-1 text-xs text-blue-800">
            <li>• Download the full evidence package to get all verification data</li>
            <li>• Our verification endpoint: <code>/verify?id={certificationId}</code></li>
            <li>• For technical support, contact our engineering team</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
