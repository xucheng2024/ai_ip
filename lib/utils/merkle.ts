// Merkle Tree utilities for batching certifications
import { generateHashFromString } from './hash'

export interface MerkleProof {
  leaf: string
  path: string[]
  indices: number[]
  root: string
}

/**
 * Build a Merkle tree from an array of hashes
 */
export function buildMerkleTree(hashes: string[]): { root: string; tree: string[][] } {
  if (hashes.length === 0) {
    throw new Error('Cannot build Merkle tree from empty array')
  }

  if (hashes.length === 1) {
    return { root: hashes[0], tree: [hashes] }
  }

  // Ensure even number of leaves by duplicating last if odd
  const leaves = [...hashes]
  if (leaves.length % 2 === 1) {
    leaves.push(leaves[leaves.length - 1])
  }

  const tree: string[][] = [leaves]

  let currentLevel = leaves
  while (currentLevel.length > 1) {
    const nextLevel: string[] = []
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i]
      const right = currentLevel[i + 1]
      // Hash concatenation (left + right)
      const combined = left < right ? `${left}${right}` : `${right}${left}`
      const parent = hashString(combined)
      nextLevel.push(parent)
    }
    tree.push(nextLevel)
    currentLevel = nextLevel
    // Pad if odd
    if (currentLevel.length > 1 && currentLevel.length % 2 === 1) {
      currentLevel.push(currentLevel[currentLevel.length - 1])
    }
  }

  return { root: currentLevel[0], tree }
}

/**
 * Generate Merkle proof for a specific leaf
 */
export function generateMerkleProof(
  hashes: string[],
  targetHash: string
): MerkleProof | null {
  const { root, tree } = buildMerkleTree(hashes)
  const leafIndex = hashes.findIndex((h) => h === targetHash)

  if (leafIndex === -1) {
    return null
  }

  const path: string[] = []
  const indices: number[] = []
  let currentIndex = leafIndex
  let currentLevel = 0

  while (currentLevel < tree.length - 1) {
    const isLeft = currentIndex % 2 === 0
    const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1

    if (siblingIndex < tree[currentLevel].length) {
      path.push(tree[currentLevel][siblingIndex])
      indices.push(siblingIndex)
    }

    currentIndex = Math.floor(currentIndex / 2)
    currentLevel++
  }

  return {
    leaf: targetHash,
    path,
    indices,
    root,
  }
}

/**
 * Verify Merkle proof
 */
export async function verifyMerkleProof(proof: MerkleProof): Promise<boolean> {
  let currentHash = proof.leaf

  for (let i = 0; i < proof.path.length; i++) {
    const sibling = proof.path[i]
    const isLeft = proof.indices[i] % 2 === 0

    const combined = isLeft
      ? `${currentHash}${sibling}`
      : `${sibling}${currentHash}`
    currentHash = hashString(combined)
  }

  return currentHash === proof.root
}

/**
 * Hash a string (using SHA-256) - synchronous version
 * Note: This is a simplified version. The async version using buildMerkleTreeAsync is preferred.
 */
function hashString(input: string): string {
  // This is a placeholder - always use buildMerkleTreeAsync for proper hashing
  // This function is kept for backwards compatibility but should not be used
  return input // Simplified - use async version instead
}

/**
 * Async version using proper SHA-256
 */
export async function buildMerkleTreeAsync(hashes: string[]): Promise<{
  root: string
  tree: string[][]
}> {
  if (hashes.length === 0) {
    throw new Error('Cannot build Merkle tree from empty array')
  }

  if (hashes.length === 1) {
    return { root: hashes[0], tree: [hashes] }
  }

  const leaves = [...hashes]
  if (leaves.length % 2 === 1) {
    leaves.push(leaves[leaves.length - 1])
  }

  const tree: string[][] = [leaves]

  let currentLevel = leaves
  while (currentLevel.length > 1) {
    const nextLevel: string[] = []
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i]
      const right = currentLevel[i + 1]
      const combined = left < right ? `${left}${right}` : `${right}${left}`
      const parent = await generateHashFromString(combined)
      nextLevel.push(parent)
    }
    tree.push(nextLevel)
    currentLevel = nextLevel
    if (currentLevel.length > 1 && currentLevel.length % 2 === 1) {
      currentLevel.push(currentLevel[currentLevel.length - 1])
    }
  }

  return { root: currentLevel[0], tree }
}

export async function generateMerkleProofAsync(
  hashes: string[],
  targetHash: string
): Promise<MerkleProof | null> {
  const { root, tree } = await buildMerkleTreeAsync(hashes)
  const leafIndex = hashes.findIndex((h) => h === targetHash)

  if (leafIndex === -1) {
    return null
  }

  const path: string[] = []
  const indices: number[] = []
  let currentIndex = leafIndex
  let currentLevel = 0

  while (currentLevel < tree.length - 1) {
    const isLeft = currentIndex % 2 === 0
    const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1

    if (siblingIndex < tree[currentLevel].length) {
      path.push(tree[currentLevel][siblingIndex])
      indices.push(siblingIndex)
    }

    currentIndex = Math.floor(currentIndex / 2)
    currentLevel++
  }

  return {
    leaf: targetHash,
    path,
    indices,
    root,
  }
}

/**
 * Generate Merkle proofs for all leaves in batch (optimized)
 * Builds tree once and generates all proofs from it
 */
export async function generateAllMerkleProofsAsync(
  hashes: string[]
): Promise<Map<string, MerkleProof>> {
  if (hashes.length === 0) {
    return new Map()
  }

  const { root, tree } = await buildMerkleTreeAsync(hashes)
  const proofs = new Map<string, MerkleProof>()

  // Generate proof for each hash
  for (let leafIndex = 0; leafIndex < hashes.length; leafIndex++) {
    const targetHash = hashes[leafIndex]
    const path: string[] = []
    const indices: number[] = []
    let currentIndex = leafIndex
    let currentLevel = 0

    while (currentLevel < tree.length - 1) {
      const isLeft = currentIndex % 2 === 0
      const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1

      if (siblingIndex < tree[currentLevel].length) {
        path.push(tree[currentLevel][siblingIndex])
        indices.push(siblingIndex)
      }

      currentIndex = Math.floor(currentIndex / 2)
      currentLevel++
    }

    proofs.set(targetHash, {
      leaf: targetHash,
      path,
      indices,
      root,
    })
  }

  return proofs
}
