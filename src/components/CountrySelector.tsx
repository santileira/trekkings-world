'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';

const countries = [
  { code: 'ar', flag: '🇦🇷', enabled: true },
  { code: 'cl', flag: '🇨🇱', enabled: false },
  { code: 'us', flag: '🇺🇸', enabled: false },
];

export default function CountrySelector() {
  const t = useTranslations('country');
  const [isOpen, setIsOpen] = useState(false);

  const getCountryName = (code: string) => {
    switch (code) {
      case 'ar':
        return t('argentina');
      case 'cl':
        return t('chile');
      case 'us':
        return t('usa');
      default:
        return code;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
      >
        <span>Trekkings</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Country
              </span>
            </div>
            {countries.map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !country.enabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <span className="text-sm font-medium text-gray-900">{getCountryName(country.code)}</span>
                  {!country.enabled && (
                    <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
