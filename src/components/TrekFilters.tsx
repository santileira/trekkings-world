'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useCallback } from 'react';

type Props = {
  locale: string;
  currentFilters: { difficulty?: string; duration?: string; region?: string };
  country: string;
};

export default function TrekFilters({ locale, currentFilters, country }: Props) {
  const t = useTranslations('filters');
  const tTrek = useTranslations('trek');
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams();

      // Keep existing filters
      if (currentFilters.difficulty && key !== 'difficulty') {
        params.set('difficulty', currentFilters.difficulty);
      }
      if (currentFilters.duration && key !== 'duration') {
        params.set('duration', currentFilters.duration);
      }
      if (currentFilters.region && key !== 'region') {
        params.set('region', currentFilters.region);
      }

      // Set new filter
      if (value) {
        params.set(key, value);
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [currentFilters, pathname, router]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const difficulties = [
    { value: 'easy', label: tTrek('easy') },
    { value: 'moderate', label: tTrek('moderate') },
    { value: 'hard', label: tTrek('hard') },
    { value: 'expert', label: tTrek('expert') },
  ];

  const durations = [
    { value: '1day', label: t('day1') },
    { value: '2-3days', label: t('days2_3') },
    { value: '4-7days', label: t('days4_7') },
    { value: '7+days', label: t('daysMore') },
  ];

  const hasFilters = currentFilters.difficulty || currentFilters.duration || currentFilters.region;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        {/* Title */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <h3 className="text-sm font-semibold text-gray-900">{t('title')}</h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              {t('clear')}
            </button>
          )}
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm text-gray-500">{t('difficulty')}:</span>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() =>
                  updateFilter(
                    'difficulty',
                    currentFilters.difficulty === diff.value ? null : diff.value
                  )
                }
                className={`px-3 py-1.5 sm:py-1 text-sm rounded-full transition-colors ${
                  currentFilters.difficulty === diff.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm text-gray-500">{t('duration')}:</span>
          <div className="flex flex-wrap gap-2">
            {durations.map((dur) => (
              <button
                key={dur.value}
                onClick={() =>
                  updateFilter(
                    'duration',
                    currentFilters.duration === dur.value ? null : dur.value
                  )
                }
                className={`px-3 py-1.5 sm:py-1 text-sm rounded-full transition-colors ${
                  currentFilters.duration === dur.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
