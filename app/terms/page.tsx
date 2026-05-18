import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - NeoTube',
  description: 'Terms and conditions for using NeoTube YouTube Downloader.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="neo-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-neo-blue border-neo border-neo-black dark:border-white rounded-xl flex items-center justify-center shadow-neo">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neo-black dark:text-white">Terms of Service</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>Terakhir diperbarui: Mei 2026</p>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>Dengan mengakses dan menggunakan NeoTube, Anda menyetujui untuk terikat oleh Terms of Service ini. Jika Anda tidak setuju, harap tidak menggunakan layanan kami.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">2. Use of Service</h2>
            <p>NeoTube disediakan untuk tujuan personal dan non-komersial. Anda setuju untuk tidak:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Menggunakan layanan untuk mendistribusikan ulang konten berhak cipta tanpa izin</li>
              <li>Menggunakan layanan untuk tujuan ilegal atau tidak sah</li>
              <li>Mencoba merusak, menonaktifkan, atau mengganggu layanan</li>
              <li>Menggunakan bot atau script otomatis untuk mengakses layanan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">3. Intellectual Property</h2>
            <p>Semua konten yang Anda download tetap menjadi milik pemilik aslinya. NeoTube tidak mengklaim kepemilikan atas konten YouTube apa pun. Anda bertanggung jawab penuh atas penggunaan konten yang di-download.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">4. Disclaimer</h2>
            <p>Layanan ini disediakan &quot;as is&quot; tanpa jaminan apa pun. NeoTube tidak bertanggung jawab atas kerugian yang diakibatkan oleh penggunaan layanan ini.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neo-black dark:text-white mb-3">5. Changes to Terms</h2>
            <p>Kami berhak mengubah Terms of Service ini kapan saja. Perubahan akan efektif segera setelah diposting di halaman ini.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
