import { HelpCircle, ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'FAQ - NeoTube',
  description: 'Frequently asked questions about NeoTube YouTube Downloader.',
};

const faqs = [
  {
    question: 'Apakah NeoTube gratis digunakan?',
    answer: 'Ya, NeoTube sepenuhnya gratis untuk digunakan. Tidak ada biaya tersembunyi atau langganan yang diperlukan.',
  },
  {
    question: 'Format apa saja yang didukung?',
    answer: 'Kami mendukung download video dalam format MP4 dengan berbagai kualitas (360p, 720p, 1080p) dan audio dalam format MP3.',
  },
  {
    question: 'Apakah legal mendownload video dari YouTube?',
    answer: 'Mendownload video dari YouTube untuk penggunaan pribadi umumnya diperbolehkan di banyak yurisdiksi. Namun, mendistribusikan ulang konten berhak cipta tanpa izin melanggar hukum. Selalu hormati hak cipta creator.',
  },
  {
    question: 'Mengapa download langsung terkadang tidak tersedia?',
    answer: 'YouTube secara aktif mengubah sistem mereka untuk mencegah download. Saat API kami terblokir, kami mengarahkan ke layanan eksternal terpercaya sebagai fallback.',
  },
  {
    question: 'Apakah ada batasan jumlah download?',
    answer: 'Tidak ada batasan ketat, tetapi kami menerapkan rate limiting yang adil untuk mencegah penyalahgunaan server.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Sangat aman. Kami tidak menyimpan video atau data pribadi di server. Riwayat download hanya tersimpan di browser Anda (localStorage).',
  },
  {
    question: 'Mengapa desainnya Neo Brutalism?',
    answer: 'Kami ingin menawarkan pengalaman yang berbeda dari downloader biasa. Neo Brutalism memberikan karakter bold, modern, dan memorable.',
  },
  {
    question: 'Bagaimana cara mengubah tema Light/Dark?',
    answer: 'Klik ikon matahari/bulan di navbar kanan atas. Preferensi tema akan disimpan di browser Anda.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="neo-card p-8 md:p-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-neo-yellow border-neo border-neo-black dark:border-white rounded-xl flex items-center justify-center shadow-neo">
            <HelpCircle className="w-6 h-6 text-neo-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neo-black dark:text-white">FAQ</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Pertanyaan yang sering ditanyakan tentang NeoTube.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="neo-card group overflow-hidden"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-neo-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="pr-4">{faq.question}</span>
              <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed border-t-2 border-gray-100 dark:border-gray-700 pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
