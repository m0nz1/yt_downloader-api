import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { extractVideoId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const itag = searchParams.get('itag');
    const title = searchParams.get('title') || 'download';

    if (!url || !itag) {
      return NextResponse.json(
        { error: 'URL and itag are required' },
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

    const numericItag = parseInt(itag);

    // Get video info to find the format
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
    });

    const format = info.formats.find((f) => f.itag === numericItag);

    if (!format) {
      return NextResponse.json(
        { error: 'Format not found' },
        { status: 404 }
      );
    }

    // Determine content type and extension
    const isAudio = !format.hasVideo && format.hasAudio;
    const ext = isAudio ? 'm4a' : (format.container || 'mp4');
    const contentType = isAudio 
      ? 'audio/mp4' 
      : `video/${format.container || 'mp4'}`;

    // Create download stream
    const stream = ytdl.downloadFromInfo(info, {
      format: format,
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
    });

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.${ext}"`);
    headers.set('Cache-Control', 'no-cache');

    // Return streaming response
    return new Response(stream as any, {
      headers,
      status: 200,
    });

  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to stream video. The format may not be available or the video is restricted.' },
      { status: 500 }
    );
  }
}
