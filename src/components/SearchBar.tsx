'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';

type SearchResult = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: {
    code: string;
    flag: string;
    name: { es: string; en: string };
  };
  region: { es: string; en: string };
  difficulty: string;
  mainImage: string | null;
};

type SearchBarProps = {
  locale: string;
};

export default function SearchBar({ locale }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        router.push(`/${selected.country.code}/trekkings/${selected.slug}`);
        setIsOpen(false);
        setQuery('');
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [results, selectedIndex, router]
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'moderate':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-orange-100 text-orange-700';
      case 'expert':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={locale === 'es' ? 'Buscar trekkings...' : 'Search trekkings...'}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((trek, index) => (
                <li key={trek._id}>
                  <button
                    onClick={() => {
                      router.push(`/${trek.country.code}/trekkings/${trek.slug}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                      index === selectedIndex ? 'bg-slate-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl mr-3">{trek.country.flag}</span>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {locale === 'es' ? trek.title.es : trek.title.en}
                      </p>
                      <p className="text-xs text-gray-500">
                        {locale === 'es' ? trek.region?.es : trek.region?.en}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(
                        trek.difficulty
                      )}`}
                    >
                      {trek.difficulty}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg
                className="mx-auto w-10 h-10 text-gray-300 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">
                {locale === 'es' ? 'No se encontraron trekkings' : 'No treks found'}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
