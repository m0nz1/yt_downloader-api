import { Hero } from '@/components/Hero';
import { Downloader } from '@/components/Downloader';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Hero />
      <Downloader />
    </div>
  );
}
