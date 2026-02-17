'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBar from './SearchBar';
import MobileSidebar from './MobileSidebar';

type HeaderProps = {
  locale: string;
};

export default function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile menu button + Logo */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">Trekkings World</span>
              </Link>
            </div>

            {/* Center: Search bar */}
            <div className="flex-1 max-w-xl mx-4 hidden sm:block">
              <SearchBar locale={locale} />
            </div>

            {/* Right: Language switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="pb-3 sm:hidden">
            <SearchBar locale={locale} />
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
      />
    </>
  );
}
