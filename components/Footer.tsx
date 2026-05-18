'use client';

import Link from 'next/link';
import { Download, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1a1a2e] border-t-neo border-neo-black dark:border-white mt-16">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-neo-blue dark:bg-neo-purple border-neo border-neo-black dark:border-white rounded-lg flex items-center justify-center shadow-neo">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neo-black dark:text-white">
                Neo<span className="text-neo-blue dark:text-neo-purple">Tube</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              Modern YouTube downloader dengan desain Neo Brutalism. Download video dan audio dengan cepat, aman, dan gratis.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-neo-black dark:text-white mb-4">Menu</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-neo-blue dark:hover:text-neo-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-neo-black dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-neo-blue dark:hover:text-neo-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-neo-pink fill-neo-pink" /> by NeoTube Team
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-gray-100 dark:bg-gray-800 shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Github className="w-4 h-4 text-neo-black dark:text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-gray-100 dark:bg-gray-800 shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Twitter className="w-4 h-4 text-neo-black dark:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
