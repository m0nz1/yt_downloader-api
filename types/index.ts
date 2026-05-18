export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  formats: VideoFormat[];
}

export interface VideoFormat {
  itag: number;
  quality: string;
  type: 'video' | 'audio';
  container: string;
  url: string;
  size?: string;
  bitrate?: string;
}

export interface DownloadHistory {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  format: string;
  quality: string;
  date: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
