'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import { useHistory } from '@/hooks/useHistory';
import { Toast } from './Toast';
import { VideoFormat } from '@/types';
import { extractVideoId, generateId } from '@/lib/utils';
import {
  Link2,
  Download,
  Music,
  Video,
  Loader2,
  Copy,
  Check,
  Clock,
  User,
  FileAudio,
  FileVideo,
  Trash2,
  History,
  ExternalLink,
  AlertTriangle,
  Server,
  Wifi,
  HardDrive,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  formats: VideoFormat[];
}

export function Downloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'download' | 'history'>('download');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string>('');

  const { toasts, addToast, removeToast } = useToast();
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleFetch = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      addToast('Link YouTube tidak valid!', 'error');
      return;
    }

    setLoading(true);
    setVideoInfo(null);
    setDownloadProgress('');

    try {
      const res = await fetch(`${API_URL}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!data.status) {
        throw new Error(data.message || 'Gagal mengambil informasi video');
      }

      const info: VideoInfo = {
        id: data.data.id,
        title: data.data.title,
        thumbnail: data.data.thumbnail,
        duration: data.data.duration,
        author: data.data.author,
        formats: [
          ...(data.data.formats.video || []),
          ...(data.data.formats.audio || []),
        ],
      };

      setVideoInfo(info);
      const vCount = data.data.formats.video?.length || 0;
      const aCount = data.data.formats.audio?.length || 0;
      addToast(`Ditemukan ${vCount} video & ${aCount} audio format!`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Terjadi kesalahan. Pastikan backend Railway aktif.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: VideoFormat, type: 'mp4' | 'mp3') => {
    if (!videoInfo) return;

    setDownloadingId(format.itag);
    setDownloadProgress('Mengunduh di server...');

    try {
      const endpoint = type === 'mp4' ? `${API_URL}/mp4` : `${API_URL}/mp3`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          quality: type === 'mp4' ? format.quality : undefined,
          title: videoInfo.title 
        }),
      });

      const data = await res.json();

      if (!data.status) {
        throw new Error(data.message || 'Download gagal');
      }

      // Add to history
      addToHistory({
        id: generateId(),
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        url: videoInfo.id,
        format: type,
        quality: format.quality,
      });

      setDownloadProgress('File siap! Mengunduh...');

      // Trigger file download
      const downloadLink = document.createElement('a');
      downloadLink.href = data.download_url;
      downloadLink.download = `${videoInfo.title}.${type === 'mp3' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      addToast(`${type.toUpperCase()} berhasil diunduh!`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Download gagal. Coba lagi.', 'error');
    } finally {
      setDownloadingId(null);
      setDownloadProgress('');
    }
  };

  const handleExternalDownload = (type: 'mp4' | 'mp3') => {
    if (!videoInfo) return;

    addToHistory({
      id: generateId(),
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      url: videoInfo.id,
      format: type,
      quality: type === 'mp4' ? '360p' : '128kbps',
    });

    const externalUrl = `https://yt1s.com/en?q=${encodeURIComponent(`https://youtube.com/watch?v=${videoInfo.id}`)}`;
    window.open(externalUrl, '_blank');
    addToast('Mengarahkan ke halaman download...', 'info');
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      addToast('Link disalin ke clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast('Gagal menyalin link.', 'error');
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return 'Unknown';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getVideoFormats = () => videoInfo?.formats.filter((f) => f.type === 'video') || [];
  const getAudioFormats = () => videoInfo?.formats.filter((f) => f.type === 'audio') || [];

  return (
    <div className="max-w-3xl mx-auto">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* API Status Banner */}
      <div className="neo-card p-4 mb-6 bg-neo-blue/10 dark:bg-neo-purple/10">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-neo-blue dark:text-neo-purple" />
          <div className="flex-1">
            <p className="text-sm font-bold text-neo-black dark:text-white">Backend: Railway + yt-dlp</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              API: {API_URL.replace('https://', '').replace('http://', '')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-neo-green" />
            <span className="text-xs font-bold text-neo-green">Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('download')}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg border-neo border-neo-black dark:border-white transition-all ${
            activeTab === 'download'
              ? 'bg-neo-blue text-white shadow-neo'
              : 'bg-white dark:bg-gray-800 text-neo-black dark:text-white shadow-neo hover:shadow-neo-hover'
          }`}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg border-neo border-neo-black dark:border-white transition-all ${
            activeTab === 'history'
              ? 'bg-neo-blue text-white shadow-neo'
              : 'bg-white dark:bg-gray-800 text-neo-black dark:text-white shadow-neo hover:shadow-neo-hover'
          }`}
        >
          <History className="w-4 h-4" />
          History ({history.length})
        </button>
      </div>

      {activeTab === 'download' ? (
        <>
          {/* Input Section */}
          <div className="neo-card p-6 md:p-8 mb-8">
            <label className="block text-sm font-bold text-neo-black dark:text-white mb-2">
              Paste YouTube Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                  className="neo-input pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                />
              </div>
              <button
                onClick={handleFetch}
                disabled={loading || !url.trim()}
                className="neo-button-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 spinner" />
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Fetch
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Support: youtube.com, youtu.be, youtube.com/shorts
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="neo-card p-12 text-center">
              <Loader2 className="w-12 h-12 text-neo-blue dark:text-neo-purple spinner mx-auto mb-4" />
              <p className="text-lg font-bold text-neo-black dark:text-white">Mengambil informasi video...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Menganalisis format via yt-dlp</p>
            </div>
          )}

          {/* Download Progress */}
          {downloadProgress && (
            <div className="neo-card p-6 mb-6 border-neo-blue dark:border-neo-purple bg-neo-blue/5 dark:bg-neo-purple/5">
              <div className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-neo-blue dark:text-neo-purple animate-pulse" />
                <div className="flex-1">
                  <p className="font-bold text-neo-black dark:text-white">{downloadProgress}</p>
                  <p className="text-xs text-gray-500">yt-dlp sedang memproses di server Railway...</p>
                </div>
                <Loader2 className="w-5 h-5 text-neo-blue dark:text-neo-purple spinner" />
              </div>
            </div>
          )}

          {/* Video Info */}
          {videoInfo && (
            <div className="space-y-6">
              {/* Video Card */}
              <div className="neo-card overflow-hidden">
                <div className="relative aspect-video bg-gray-900">
                  <Image
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
                    {formatDuration(videoInfo.duration)}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-neo-black dark:text-white mb-2 line-clamp-2">
                    {videoInfo.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {videoInfo.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(videoInfo.duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Format Selector */}
              <div className="neo-card p-6">
                <h3 className="text-lg font-bold text-neo-black dark:text-white mb-4">Pilih Format</h3>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setSelectedFormat('mp4')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-lg border-neo border-neo-black dark:border-white transition-all ${
                      selectedFormat === 'mp4'
                        ? 'bg-neo-blue text-white shadow-neo'
                        : 'bg-white dark:bg-gray-800 text-neo-black dark:text-white shadow-neo hover:shadow-neo-hover'
                    }`}
                  >
                    <FileVideo className="w-5 h-5" />
                    MP4 Video
                  </button>
                  <button
                    onClick={() => setSelectedFormat('mp3')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-lg border-neo border-neo-black dark:border-white transition-all ${
                      selectedFormat === 'mp3'
                        ? 'bg-neo-purple text-white shadow-neo'
                        : 'bg-white dark:bg-gray-800 text-neo-black dark:text-white shadow-neo hover:shadow-neo-hover'
                    }`}
                  >
                    <FileAudio className="w-5 h-5" />
                    MP3 Audio
                  </button>
                </div>

                {/* Format Options */}
                <div className="space-y-3">
                  {selectedFormat === 'mp4' ? (
                    getVideoFormats().length > 0 ? (
                      getVideoFormats().map((format) => (
                        <div
                          key={format.itag}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-neo-black dark:border-white"
                        >
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-neo-blue" />
                            <div>
                              <p className="font-bold text-sm text-neo-black dark:text-white">{format.quality}</p>
                              <p className="text-xs text-gray-500">
                                {format.ext} {format.size_mb && `• ${format.size_mb} MB`} {format.bitrate && `• ${format.bitrate}kbps`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(format.itag, `video-${format.itag}`)}
                              className="w-9 h-9 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-white dark:bg-gray-700 shadow-neo hover:shadow-neo-hover transition-all"
                              title="Copy format ID"
                            >
                              {copiedId === `video-${format.itag}` ? (
                                <Check className="w-4 h-4 text-neo-green" />
                              ) : (
                                <Copy className="w-4 h-4 text-neo-black dark:text-white" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDownload(format, 'mp4')}
                              disabled={downloadingId === format.itag}
                              className="neo-button-primary text-sm py-2 px-4 disabled:opacity-60"
                            >
                              {downloadingId === format.itag ? (
                                <Loader2 className="w-4 h-4 spinner" />
                              ) : (
                                <Download className="w-4 h-4 mr-1" />
                              )}
                              Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Format video tidak tersedia.</p>
                        <button
                          onClick={() => handleExternalDownload('mp4')}
                          className="neo-button-primary"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka Downloader Eksternal
                        </button>
                      </div>
                    )
                  ) : (
                    getAudioFormats().length > 0 ? (
                      getAudioFormats().map((format) => (
                        <div
                          key={format.itag}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-neo-black dark:border-white"
                        >
                          <div className="flex items-center gap-3">
                            <Music className="w-5 h-5 text-neo-purple" />
                            <div>
                              <p className="font-bold text-sm text-neo-black dark:text-white">{format.quality}</p>
                              <p className="text-xs text-gray-500">
                                {format.ext} {format.bitrate && `• ${format.bitrate}kbps`} {format.size_mb && `• ${format.size_mb} MB`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(format.itag, `audio-${format.itag}`)}
                              className="w-9 h-9 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-white dark:bg-gray-700 shadow-neo hover:shadow-neo-hover transition-all"
                              title="Copy format ID"
                            >
                              {copiedId === `audio-${format.itag}` ? (
                                <Check className="w-4 h-4 text-neo-green" />
                              ) : (
                                <Copy className="w-4 h-4 text-neo-black dark:text-white" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDownload(format, 'mp3')}
                              disabled={downloadingId === format.itag}
                              className="neo-button-dark text-sm py-2 px-4 disabled:opacity-60"
                            >
                              {downloadingId === format.itag ? (
                                <Loader2 className="w-4 h-4 spinner" />
                              ) : (
                                <Download className="w-4 h-4 mr-1" />
                              )}
                              Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Format audio tidak tersedia.</p>
                        <button
                          onClick={() => handleExternalDownload('mp3')}
                          className="neo-button-dark"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka Converter Eksternal
                        </button>
                      </div>
                    )
                  )}
                </div>

                {/* Note */}
                <div className="mt-4 p-3 bg-neo-yellow/20 dark:bg-neo-yellow/10 border-2 border-neo-yellow rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-neo-yellow-dark flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neo-black dark:text-white">
                      <strong>Railway Backend:</strong> File diunduh ke server lalu di-serve ke Anda. File otomatis dihapus setelah 1 jam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* History Tab */
        <div className="neo-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neo-black dark:text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Riwayat Download
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-neo-red hover:underline font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Semua
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada riwayat download</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-neo-black dark:border-white"
                >
                  <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-neo-black dark:text-white truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`neo-tag ${item.format === 'mp4' ? 'bg-neo-blue text-white' : 'bg-neo-purple text-white'}`}>
                        {item.format.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{item.quality}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neo-red/10 text-gray-400 hover:text-neo-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
