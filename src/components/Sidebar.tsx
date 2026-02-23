'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

type Region = {
  _id: string;
  name: { es: string; en: string };
  slug: string;
};

type Country = {
  _id: string;
  name: { es: string; en: string };
  code: string;
  slug: string;
  flag: string;
  enabled: boolean;
  regions: Region[];
  trekCount: number;
};

type SidebarProps = {
  locale: string;
  className?: string;
  onLinkClick?: () => void;
};

export default function Sidebar({ locale, className = '', onLinkClick }: SidebarProps) {
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const t = useTranslations('common');

  // Fetch countries from Sanity
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('/api/countries');
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
          // Auto-expand the first enabled country
          const firstEnabled = data.find((c: Country) => c.enabled);
          if (firstEnabled) {
            setExpandedCountries([firstEnabled.code]);
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const toggleCountry = (code: string) => {
    setExpandedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const isActive = (path: string) => pathname.startsWith(path);

  if (loading) {
    return (
      <aside className={`bg-white border-r border-gray-200 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t('trekkings')}
        </h2>
        <nav className="space-y-1">
          {countries.map((country) => (
            <div key={country.code}>
              {/* Country header */}
              <button
                onClick={() => country.enabled && toggleCountry(country.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  country.enabled
                    ? isActive(`/${country.code}`)
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={!country.enabled}
              >
                <span className="flex items-center">
                  <span className="text-xl mr-3">{country.flag}</span>
                  <span>{locale === 'es' ? country.name.es : country.name.en}</span>
                </span>
                {country.enabled && country.regions.length > 0 && (
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCountries.includes(country.code) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {!country.enabled && (
                  <span className="text-xs text-gray-400">Soon</span>
                )}
              </button>

              {/* Regions */}
              {country.enabled && expandedCountries.includes(country.code) && (
                <div className="ml-8 mt-1 space-y-1">
                  {/* All trekkings link */}
                  <Link
                    href={`/${country.code}/trekkings`}
                    onClick={onLinkClick}
                    className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === `/${country.code}/trekkings`
                        ? 'text-slate-900 bg-slate-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {locale === 'es' ? 'Todos los trekkings' : 'All trekkings'}
                  </Link>
                  {/* Region links */}
                  {country.regions.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/${country.code}/trekkings?region=${region.slug}`}
                      onClick={onLinkClick}
                      className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                        pathname.includes(region.slug)
                          ? 'text-slate-900 bg-slate-50 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {locale === 'es' ? region.name.es : region.name.en}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {countries.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-sm">
              {locale === 'es' ? 'Sin países' : 'No countries'}
            </div>
          )}
        </nav>

        {/* Resources Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {locale === 'es' ? 'Recursos' : 'Resources'}
          </h2>
          <div className="space-y-2">
            <Link
              href="/tips"
              onClick={onLinkClick}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/tips'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🎒</span>
                <span>{locale === 'es' ? 'Recomendaciones' : 'Recommendations'}</span>
              </span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/apps"
              onClick={onLinkClick}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/apps'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span>{locale === 'es' ? 'Apps de trekking' : 'Trekking apps'}</span>
              </span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
