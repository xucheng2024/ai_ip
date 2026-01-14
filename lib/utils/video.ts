// Video metadata extraction - simplified for MVP
// Full frame/audio hash extraction can be added later
export async function extractVideoMetadata(file: File): Promise<{
  duration: number | null
  frameHash: string | null
  audioHash: string | null
}> {
  // For MVP, we'll skip complex frame extraction
  // This can be enhanced later with proper video processing
  return {
    duration: null,
    frameHash: null,
    audioHash: null,
  }
}
