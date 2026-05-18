'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Download, Sun, Moon, Menu, X } from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ];

  // Prevent hydration mismatch by rendering consistent icon during SSR
  const themeIcon = mounted ? (
    theme === 'light' ? (
      <Moon className="w-5 h-5 text-neo-black" />
    ) : (
      <Sun className="w-5 h-5 text-neo-yellow" />
    )
  ) : (
    <Moon className="w-5 h-5 text-neo-black" />
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#1a1a2e] border-b-neo border-neo-black dark:border-white shadow-neo">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-neo-blue dark:bg-neo-purple border-neo border-neo-black dark:border-white rounded-lg flex items-center justify-center shadow-neo group-hover:shadow-neo-hover transition-all">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neo-black dark:text-white">
              Neo<span className="text-neo-blue dark:text-neo-purple">Tube</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-neo-black dark:text-white hover:bg-neo-yellow dark:hover:bg-neo-purple rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-gray-100 dark:bg-gray-800 shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center border-neo border-neo-black dark:border-white rounded-lg bg-gray-100 dark:bg-gray-800 shadow-neo hover:shadow-neo-hover transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-neo-black dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-neo-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-neo border-neo-black dark:border-white bg-white dark:bg-[#1a1a2e]">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-neo-black dark:text-white hover:bg-neo-yellow dark:hover:bg-neo-purple rounded-lg transition-colors border-neo border-transparent hover:border-neo-black dark:hover:border-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
