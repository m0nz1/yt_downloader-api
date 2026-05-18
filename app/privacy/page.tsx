import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - NeoTube',
  description: 'Privacy policy for NeoTube YouTube Downloader.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="neo-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-neo-purple border-neo border-neo-black dark:border-white rounded-xl flex items-center justify-center shadow-neo">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neo-black dark:text-white">Privacy Policy</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>Terakhir diperbarui: Mei 2026</p>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">1. Information We Collect</h2>
            <p>NeoTube dirancang dengan privasi sebagai prioritas utama. Kami mengumpulkan data minimal:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Local Storage:</strong> Riwayat download Anda disimpan hanya di browser Anda (localStorage), bukan di server kami.</li>
              <li><strong>Analytics:</strong> Kami tidak menggunakan Google Analytics atau tracking pihak ketiga.</li>
              <li><strong>Server Logs:</strong> Server kami mungkin mencatat IP address dan request untuk keperluan debugging dan rate limiting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">2. How We Use Information</h2>
            <p>Data yang dikumpulkan digunakan untuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Menyediakan fitur riwayat download (localStorage)</li>
              <li>Mencegah penyalahgunaan layanan (rate limiting)</li>
              <li>Meningkatkan performa dan keandalan layanan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">3. Data Security</h2>
            <p>Kami tidak menyimpan video atau file audio di server. Semua proses konversi dan download berlangsung melalui API eksternal atau browser Anda langsung. Kami menggunakan HTTPS untuk mengamankan semua komunikasi.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">4. Third-Party Services</h2>
            <p>Kami menggunakan layanan pihak ketiga berikut:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>YouTube Data API (untuk mengambil metadata video)</li>
              <li>Vercel (hosting platform)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">5. Your Rights</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Menghapus riwayat download kapan saja (melalui tombol hapus di halaman History)</li>
              <li>Menggunakan mode private/incognito untuk tidak menyimpan riwayat</li>
              <li>Menghubungi kami untuk pertanyaan privasi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">6. Contact</h2>
            <p>Jika Anda memiliki pertanyaan tentang privasi, silakan hubungi kami melalui GitHub Issues.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
