import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'NeoTube - Modern YouTube Downloader',
  description: 'Download YouTube videos as MP4 or MP3 with our modern Neo Brutalism downloader. Fast, free, and beautiful.',
  keywords: ['youtube downloader', 'mp4 downloader', 'mp3 converter', 'youtube to mp3', 'youtube to mp4'],
  authors: [{ name: 'NeoTube' }],
  openGraph: {
    title: 'NeoTube - Modern YouTube Downloader',
    description: 'Download YouTube videos as MP4 or MP3 with style.',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoTube - Modern YouTube Downloader',
    description: 'Download YouTube videos as MP4 or MP3 with style.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
