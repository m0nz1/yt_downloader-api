import { Info, Heart, Zap, Shield, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About - NeoTube',
  description: 'Learn more about NeoTube, the modern Neo Brutalism YouTube Downloader.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="neo-card p-8 md:p-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-neo-blue dark:bg-neo-purple border-neo border-neo-black dark:border-white rounded-xl flex items-center justify-center shadow-neo">
            <Info className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neo-black dark:text-white">About NeoTube</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            NeoTube adalah YouTube Downloader modern dengan desain Neo Brutalism yang unik dan eye-catching. 
            Kami membangun platform ini dengan fokus pada kecepatan, kemudahan penggunaan, dan pengalaman visual 
            yang berbeda dari downloader konvensional.
          </p>

          <h2 className="text-xl font-bold text-neo-black dark:text-white mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Memberikan pengalaman download YouTube yang cepat, aman, dan menyenangkan. Kami percaya bahwa 
            tools utilitas juga bisa terlihat aesthetic dan modern tanpa mengorbankan fungsionalitas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            title: 'Lightning Fast',
            desc: 'Proses fetch dan konversi yang cepat dengan teknologi modern.',
            color: 'bg-neo-yellow',
          },
          {
            icon: Shield,
            title: 'Safe & Secure',
            desc: 'Tidak ada malware, tracking, atau iklan mengganggu.',
            color: 'bg-neo-green',
          },
          {
            icon: Sparkles,
            title: 'Beautiful Design',
            desc: 'Neo Brutalism design yang modern dan responsif.',
            color: 'bg-neo-pink',
          },
        ].map((feature) => (
          <div key={feature.title} className="neo-card p-6 text-center">
            <div className={`w-14 h-14 ${feature.color} border-neo border-neo-black dark:border-white rounded-xl flex items-center justify-center shadow-neo mx-auto mb-4`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-neo-black dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="neo-card p-8 mt-8 text-center">
        <Heart className="w-8 h-8 text-neo-pink mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-300">
          Dibuat dengan cinta untuk komunitas creator Indonesia dan seluruh dunia.
        </p>
      </div>
    </div>
  );
}
