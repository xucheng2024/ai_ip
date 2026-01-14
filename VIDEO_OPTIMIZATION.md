# Video Performance Optimization Guide

## Current Optimizations ✅

### 1. Signed URL Caching
- Cache signed URLs for 1 hour to reduce API calls
- Automatic cache cleanup (max 50 entries)
- Location: `components/VideoPlayer.tsx`

### 2. Video Preload Strategy
- `preload="metadata"` - Only loads video metadata, not full video
- Reduces initial bandwidth usage
- Videos load on user interaction (play button)

### 3. Video Props Memoization
- Uses `useMemo` to prevent unnecessary re-renders
- Optimizes React performance

## Additional Optimization Strategies

### 1. Poster Images (Thumbnails) 🎯 HIGH IMPACT
**Problem**: Videos show black screen before loading
**Solution**: Generate and display poster images

```typescript
// In VideoPlayer component
<video
  poster={posterUrl} // Add poster image
  {...videoProps}
/>
```

**Implementation**:
- Generate thumbnails when video is uploaded
- Store in Supabase Storage: `thumbnails/user_id/video_id.jpg`
- Add `thumbnail_url` column to `videos` table
- Extract frame at 1 second: `ffmpeg -i video.mp4 -ss 1 -vframes 1 thumbnail.jpg`

### 2. Video Compression 🎯 HIGH IMPACT
**Current**: Original video files
**Recommended**: 
- Max resolution: 1080p (1920x1080)
- Codec: H.264 for compatibility
- Bitrate: 2-5 Mbps for web playback
- Format: MP4 (best browser support)

```bash
# Server-side compression with ffmpeg
ffmpeg -i input.mp4 \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -vf scale=1920:-2 \
  -movflags +faststart \
  output.mp4
```

### 3. CDN Delivery 🎯 MEDIUM IMPACT
**Current**: Direct Supabase Storage
**Recommended**: Use Supabase CDN or Cloudflare

Benefits:
- Faster global delivery
- Automatic caching
- Reduced origin server load

**Supabase already has CDN**, just ensure:
- Use public URLs when possible
- Set proper Cache-Control headers

### 4. Adaptive Bitrate Streaming (HLS/DASH) 🎯 MEDIUM IMPACT
For longer videos (>2 minutes):

```typescript
// Convert to HLS format
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "segment_%03d.ts" \
  playlist.m3u8
```

Use video.js or hls.js for playback:
```bash
npm install video.js
npm install @videojs/http-streaming
```

### 5. Pagination/Infinite Scroll 🎯 LOW IMPACT
**Current**: Load all videos at once
**Recommended**: Load 12-20 videos per page

Benefits:
- Faster initial page load
- Reduced memory usage
- Better for large video libraries

Already implemented in `/app/videos/page.tsx` (line 29):
```typescript
const ITEMS_PER_PAGE = 12
```

### 6. Video Dimension Optimization 🎯 MEDIUM IMPACT
Serve different resolutions based on viewport:

```typescript
// Generate multiple sizes on upload
// - thumbnail: 320x180 (preview)
// - small: 640x360 (mobile)
// - medium: 1280x720 (desktop)
// - large: 1920x1080 (fullscreen)

// In VideoPlayer
const videoSrc = useMemo(() => {
  if (window.innerWidth < 768) return smallVideoUrl
  if (window.innerWidth < 1920) return mediumVideoUrl
  return largeVideoUrl
}, [smallVideoUrl, mediumVideoUrl, largeVideoUrl])
```

### 7. Browser Caching Headers 🎯 LOW IMPACT
Already implemented in `/app/api/videos/route.ts`:
```typescript
response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
```

Optimize signed URLs cache in `/app/api/video/[id]/route.ts`:
```typescript
// Current: 5 minutes
// Recommended: Match signed URL expiry
response.headers.set('Cache-Control', 'public, s-maxage=3000, stale-while-revalidate=600')
```

## Implementation Priority

### Phase 1 (Quick Wins)
1. ✅ Remove lazy loading complexity
2. ✅ URL caching (already done)
3. ✅ Metadata preload (already done)
4. 🔲 Add poster images/thumbnails

### Phase 2 (Quality Improvements)
5. 🔲 Video compression on upload
6. 🔲 Optimize cache headers
7. 🔲 Add loading skeletons

### Phase 3 (Advanced)
8. 🔲 Multiple resolution support
9. 🔲 Adaptive bitrate streaming (HLS)
10. 🔲 Video CDN optimization

## Monitoring Performance

### Key Metrics to Track:
- First video byte time (TTFB)
- Video load time
- Play start time
- Buffer/stall events
- Bandwidth usage

### Browser Performance API:
```typescript
// In VideoPlayer
useEffect(() => {
  const video = playerRef.current
  if (!video) return

  const handleLoadedData = () => {
    const loadTime = performance.now()
    console.log('Video loaded in:', loadTime, 'ms')
  }

  video.addEventListener('loadeddata', handleLoadedData)
  return () => video.removeEventListener('loadeddata', handleLoadedData)
}, [])
```

## Estimated Impact

| Optimization | Impact | Effort | Priority |
|--------------|--------|--------|----------|
| Poster images | High | Medium | 1 |
| Video compression | High | Medium | 2 |
| Cache optimization | Medium | Low | 3 |
| Multiple resolutions | Medium | High | 4 |
| HLS streaming | Medium | High | 5 |
| CDN setup | Low | Low | 6 |

## Current Performance

✅ Good practices already in place:
- Signed URL caching
- Metadata preload
- Component memoization
- Response caching
- Proper video attributes (playsInline, controls)

## Next Steps

**Immediate** (this week):
1. Generate poster images for existing videos
2. Add compression to video upload pipeline

**Short-term** (this month):
3. Implement multiple resolution support
4. Optimize cache headers

**Long-term** (future):
5. Consider HLS for videos >5 minutes
6. Set up dedicated video CDN
