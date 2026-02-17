'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

type Trek = {
  slug: string;
  title: { es: string; en: string };
  mainImage: string;
  country: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: number;
};

type Props = {
  trek: Trek;
  locale: string;
};

export default function TrekCard({ trek, locale }: Props) {
  const t = useTranslations('trek');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return t('easy');
      case 'moderate':
        return t('moderate');
      case 'hard':
        return t('hard');
      case 'expert':
        return t('expert');
      default:
        return difficulty;
    }
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '-';

    const lower = duration.toLowerCase();
    const numbers = duration.match(/\d+/g);

    if (!numbers) return duration;

    // Get the max number for ranges
    const maxNum = Math.max(...numbers.map(Number));

    // Check if it's hours or days
    if (lower.includes('hora') || lower.includes('hour')) {
      // Divide by 2 to show one-way time
      const oneWay = Math.round(maxNum / 2);
      const label = locale === 'es' ? 'ida' : 'one-way';
      return `${oneWay}h ${label}`;
    } else if (lower.includes('día') || lower.includes('day')) {
      return `${maxNum}d`;
    }

    return duration;
  };

  return (
    <Link
      href={`/${trek.country}/trekkings/${trek.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent z-10" />
        {trek.mainImage ? (
          <Image
            src={trek.mainImage}
            alt={locale === 'es' ? trek.title.es : trek.title.en}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Difficulty badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getDifficultyColor(trek.difficulty)}`}>
            {getDifficultyLabel(trek.difficulty)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-slate-700 transition-colors line-clamp-2">
          {locale === 'es' ? trek.title.es : trek.title.en}
        </h3>
        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(trek.duration)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {trek.distance} km
          </div>
        </div>
      </div>
    </Link>
  );
}
