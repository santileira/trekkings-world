import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import TrekCard from '@/components/TrekCard';
import TrekFilters from '@/components/TrekFilters';
import { client, urlForImage } from '@/lib/sanity';
import { treksQuery, countryQuery } from '@/lib/queries';

type Trek = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: string;
  region: string;
  regionName: { es: string; en: string };
  difficulty: string;
  duration: string;
  distance: number;
  hasRefugio?: boolean;
  mainImage: any;
};

type Country = {
  _id: string;
  name: { es: string; en: string };
  code: string;
  slug: string;
};

type Props = {
  params: Promise<{ locale: string; country: string }>;
  searchParams: Promise<{ difficulty?: string; duration?: string; region?: string; refugio?: string }>;
};

// Difficulty order for sorting (easy to hard)
const difficultyOrder: Record<string, number> = {
  easy: 1,
  moderate: 2,
  hard: 3,
  expert: 4,
};

// Parse duration string to get number of days
function parseDurationToDays(duration: string): number {
  if (!duration) return 1;

  const lowerDuration = duration.toLowerCase();

  // Check for hours (count as less than 1 day)
  if (lowerDuration.includes('hora') || lowerDuration.includes('hour')) {
    return 0.5;
  }

  // Extract numbers from the string
  const numbers = duration.match(/\d+/g);
  if (!numbers) return 1;

  // If it's a range like "2-3 días", take the higher number
  const maxNumber = Math.max(...numbers.map(Number));

  return maxNumber;
}

// Check if trek matches duration filter
function matchesDurationFilter(trekDuration: string, filter: string): boolean {
  const days = parseDurationToDays(trekDuration);

  switch (filter) {
    case '1day':
      return days <= 1;
    case '2-3days':
      return days >= 2 && days <= 3;
    case '4-7days':
      return days >= 4 && days <= 7;
    case '7+days':
      return days > 7;
    default:
      return true;
  }
}

async function getTreks(countrySlug: string): Promise<Trek[]> {
  return client.fetch(treksQuery, { countrySlug });
}

async function getCountry(slug: string): Promise<Country | null> {
  return client.fetch(countryQuery, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  const countryData = await getCountry(country);

  const isSpanish = locale === 'es';
  const countryName = countryData
    ? (isSpanish ? countryData.name.es : countryData.name.en)
    : country.toUpperCase();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';

  const title = isSpanish
    ? `Trekkings en ${countryName} - Lista Completa`
    : `Treks in ${countryName} - Complete List`;

  const description = isSpanish
    ? `Todos los trekkings disponibles en ${countryName}. Filtr\u00e1 por dificultad, duraci\u00f3n y regi\u00f3n. Encontr\u00e1 tu pr\u00f3xima aventura.`
    : `All available treks in ${countryName}. Filter by difficulty, duration and region. Find your next adventure.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/${country}/trekkings`,
      languages: {
        'es': `${siteUrl}/es/${country}/trekkings`,
        'en': `${siteUrl}/en/${country}/trekkings`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/${country}/trekkings`,
      siteName: 'Trekkings World',
      locale: isSpanish ? 'es_AR' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Trekkings in ${countryName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default async function TrekkingsPage({ params, searchParams }: Props) {
  const { locale, country } = await params;
  const filters = await searchParams;
  setRequestLocale(locale);

  const [treks, countryData] = await Promise.all([
    getTreks(country),
    getCountry(country),
  ]);

  const countryName = countryData
    ? (locale === 'es' ? countryData.name.es : countryData.name.en)
    : country.toUpperCase();

  // Filter treks based on search params
  let filteredTreks = treks;

  if (filters.difficulty) {
    filteredTreks = filteredTreks.filter((trek) => trek.difficulty === filters.difficulty);
  }

  if (filters.duration) {
    filteredTreks = filteredTreks.filter((trek) => matchesDurationFilter(trek.duration, filters.duration!));
  }

  if (filters.region) {
    filteredTreks = filteredTreks.filter((trek) => trek.region === filters.region);
  }

  if (filters.refugio) {
    filteredTreks = filteredTreks.filter((trek) =>
      filters.refugio === 'yes' ? trek.hasRefugio === true : trek.hasRefugio !== true
    );
  }

  // Sort by difficulty (easy to hard)
  filteredTreks = filteredTreks.sort((a, b) => {
    const orderA = difficultyOrder[a.difficulty] || 99;
    const orderB = difficultyOrder[b.difficulty] || 99;
    return orderA - orderB;
  });

  // Transform treks for TrekCard component
  const transformedTreks = filteredTreks.map((trek) => ({
    slug: trek.slug,
    title: trek.title,
    mainImage: trek.mainImage ? urlForImage(trek.mainImage).width(400).height(300).url() : '',
    country: trek.country,
    region: trek.region,
    difficulty: trek.difficulty,
    duration: trek.duration,
    distance: trek.distance,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          {locale === 'es' ? `Trekkings en ${countryName}` : `Treks in ${countryName}`}
        </h1>
        <p className="mt-2 text-slate-500">
          {locale === 'es'
            ? `${filteredTreks.length} trekkings encontrados (ordenados por dificultad)`
            : `${filteredTreks.length} treks found (sorted by difficulty)`}
        </p>
      </div>

      {/* Filters at top */}
      <div className="mb-6">
        <TrekFilters
          locale={locale}
          currentFilters={filters}
          country={country}
        />
      </div>

      {/* Trek Grid */}
      <div>
        {transformedTreks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {transformedTreks.map((trek) => (
              <TrekCard key={trek.slug} trek={trek} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">
              {locale === 'es'
                ? 'No se encontraron trekkings con estos filtros'
                : 'No treks found with these filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
