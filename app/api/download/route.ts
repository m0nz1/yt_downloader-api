import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { extractVideoId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    try {
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
      });

      // Process ALL formats - deduplicate by quality label
      const videoMap = new Map();
      const audioMap = new Map();

      info.formats.forEach((f) => {
        const quality = f.qualityLabel || f.audioQuality || 'unknown';
        const size = f.contentLength ? `${(parseInt(f.contentLength) / 1024 / 1024).toFixed(1)} MB` : undefined;
        const bitrate = f.bitrate ? `${Math.round(f.bitrate / 1000)} kbps` : undefined;

        const formatData = {
          itag: f.itag,
          quality,
          type: f.hasVideo && f.hasAudio ? 'video' : f.hasAudio ? 'audio' : 'video',
          container: f.container || 'mp4',
          url: f.url,
          size,
          bitrate,
          hasAudio: f.hasAudio,
          hasVideo: f.hasVideo,
        };

        if (f.hasVideo && f.hasAudio) {
          // Combined video+audio - prefer mp4
          const existing = videoMap.get(quality);
          if (!existing || (f.container === 'mp4' && existing.container !== 'mp4')) {
            videoMap.set(quality, formatData);
          }
        } else if (f.hasAudio && !f.hasVideo) {
          // Audio only - prefer m4a/mp4
          const existing = audioMap.get(quality);
          if (!existing || (['m4a', 'mp4'].includes(f.container || '') && !['m4a', 'mp4'].includes(existing.container))) {
            audioMap.set(quality, formatData);
          }
        } else if (f.hasVideo && !f.hasAudio) {
          // Video only - store separately but we'll skip these for simplicity
          // (would need ffmpeg to merge with audio)
        }
      });

      // Convert maps to arrays and sort by quality
      const videoFormats = Array.from(videoMap.values()).sort((a, b) => {
        const qualityOrder = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K', '8K'];
        const aIdx = qualityOrder.findIndex(q => a.quality.includes(q));
        const bIdx = qualityOrder.findIndex(q => b.quality.includes(q));
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });

      const audioFormats = Array.from(audioMap.values()).sort((a, b) => {
        // Sort by bitrate if available
        const aRate = a.bitrate ? parseInt(a.bitrate) : 0;
        const bRate = b.bitrate ? parseInt(b.bitrate) : 0;
        return bRate - aRate;
      });

      return NextResponse.json({
        success: true,
        data: {
          id: videoId,
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails.pop()?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration: info.videoDetails.lengthSeconds,
          author: info.videoDetails.author.name,
          formats: {
            video: videoFormats,
            audio: audioFormats,
          },
        },
      });
    } catch (ytdlError) {
      console.error('ytdl error:', ytdlError);

      // Fallback with basic info
      return NextResponse.json({
        success: true,
        fallback: true,
        data: {
          id: videoId,
          title: 'YouTube Video',
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration: 0,
          author: 'Unknown',
          formats: {
            video: [
              { itag: 18, quality: '360p', type: 'video', container: 'mp4', url: '', size: '~15 MB' },
              { itag: 22, quality: '720p', type: 'video', container: 'mp4', url: '', size: '~50 MB' },
            ],
            audio: [
              { itag: 140, quality: '128kbps', type: 'audio', container: 'm4a', url: '', bitrate: '128 kbps', size: '~5 MB' },
            ],
          },
        },
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
