import type { TrekData, Locale } from '../types';

const BASE_HASHTAGS = {
  es: ['trekking', 'senderismo', 'naturaleza', 'aventura', 'montaña'],
  en: ['trekking', 'hiking', 'nature', 'adventure', 'mountains'],
};

const DIFFICULTY_HASHTAGS = {
  easy: { es: ['senderosfaciles', 'familytrip'], en: ['easyhikes', 'familyhiking'] },
  moderate: { es: ['trekkingmoderado'], en: ['moderatehike'] },
  hard: { es: ['trekkingexigente', 'desafio'], en: ['challenging', 'hardcorehiking'] },
  expert: { es: ['montañismo', 'alpinismo'], en: ['mountaineering', 'alpinism'] },
};

const COUNTRY_HASHTAGS: Record<string, { es: string[]; en: string[] }> = {
  ar: {
    es: ['Argentina', 'TrekkingArgentina', 'PatagoniaArgentina'],
    en: ['Argentina', 'TrekkingArgentina', 'ArgentinaTrails'],
  },
  cl: {
    es: ['Chile', 'TrekkingChile', 'PatagoniaChilena'],
    en: ['Chile', 'ChileTrails', 'HikingChile'],
  },
  pe: {
    es: ['Peru', 'TrekkingPeru', 'AndesPeruanos'],
    en: ['Peru', 'PeruTrails', 'HikingPeru'],
  },
  bo: {
    es: ['Bolivia', 'TrekkingBolivia'],
    en: ['Bolivia', 'HikingBolivia'],
  },
  ec: {
    es: ['Ecuador', 'TrekkingEcuador'],
    en: ['Ecuador', 'HikingEcuador'],
  },
  co: {
    es: ['Colombia', 'TrekkingColombia'],
    en: ['Colombia', 'HikingColombia'],
  },
};

export function generateHashtags(
  trek: TrekData,
  locale: Locale,
  maxHashtags: number = 5
): string[] {
  const hashtags: string[] = [];

  // Add 1-2 base hashtags
  const baseHashtags = BASE_HASHTAGS[locale] || BASE_HASHTAGS.es;
  const shuffledBase = [...baseHashtags].sort(() => Math.random() - 0.5);
  hashtags.push(...shuffledBase.slice(0, 2));

  // Add difficulty hashtag
  const difficultyTags = DIFFICULTY_HASHTAGS[trek.difficulty]?.[locale];
  if (difficultyTags && difficultyTags.length > 0) {
    hashtags.push(difficultyTags[0]);
  }

  // Add country hashtag
  const countryCode = trek.country?.code?.toLowerCase();
  if (countryCode && COUNTRY_HASHTAGS[countryCode]) {
    const countryTags = COUNTRY_HASHTAGS[countryCode][locale];
    if (countryTags && countryTags.length > 0) {
      hashtags.push(countryTags[0]);
    }
  }

  // Add region-based hashtag (clean it up for hashtag format)
  const regionName = trek.region?.name[locale];
  if (regionName) {
    const cleanRegion = regionName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric
    if (cleanRegion.length >= 3) {
      hashtags.push(cleanRegion);
    }
  }

  // Ensure unique and limit count
  const uniqueHashtags = [...new Set(hashtags)];
  return uniqueHashtags.slice(0, maxHashtags);
}
