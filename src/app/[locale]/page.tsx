import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import TrekCard from '@/components/TrekCard';
import { client, urlForImage } from '@/lib/sanity';
import { featuredTreksQuery, countriesQuery } from '@/lib/queries';

type FeaturedTrek = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: number;
  mainImage: any;
};

type Country = {
  _id: string;
  name: { es: string; en: string };
  code: string;
  slug: string;
  flag: string;
  enabled: boolean;
  trekCount: number;
};

type Props = {
  params: Promise<{ locale: string }>;
};

async function getFeaturedTreks(): Promise<FeaturedTrek[]> {
  return client.fetch(featuredTreksQuery);
}

async function getCountries(): Promise<Country[]> {
  return client.fetch(countriesQuery);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [featuredTreks, countries] = await Promise.all([
    getFeaturedTreks(),
    getCountries(),
  ]);

  // Transform treks for TrekCard
  const transformedTreks = featuredTreks.map((trek) => ({
    slug: trek.slug,
    title: trek.title,
    mainImage: trek.mainImage ? urlForImage(trek.mainImage).width(400).height(300).url() : '',
    country: trek.country,
    region: trek.region,
    difficulty: trek.difficulty,
    duration: trek.duration,
    distance: trek.distance,
  }));

  // Get the first enabled country for the CTA button
  const firstEnabledCountry = countries.find((c) => c.enabled);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800">
              {t('title')}
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              {t('subtitle')}
            </p>
            {firstEnabledCountry && (
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/${firstEnabledCountry.code}/trekkings`}
                  className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {locale === 'es' ? `Explorar ${firstEnabledCountry.name.es}` : `Explore ${firstEnabledCountry.name.en}`}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Treks */}
      {transformedTreks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('featuredTreks')}
            </h2>
            {firstEnabledCountry && (
              <Link
                href={`/${firstEnabledCountry.code}/trekkings`}
                className="text-slate-600 hover:text-slate-800 font-medium flex items-center"
              >
                {t('viewAll')}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedTreks.map((trek) => (
              <TrekCard
                key={trek.slug}
                trek={trek}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Explore by Country */}
      {countries.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {t('exploreByCountry')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {countries.map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.code}`}
                  className={`relative group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    !country.enabled ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  <div className="p-6 flex items-center space-x-4">
                    <span className="text-5xl">{country.flag}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {locale === 'es' ? country.name.es : country.name.en}
                      </h3>
                      {country.enabled ? (
                        <p className="text-sm text-gray-500">{country.trekCount} trekkings</p>
                      ) : (
                        <p className="text-sm text-gray-400">Coming Soon</p>
                      )}
                    </div>
                    {country.enabled && (
                      <svg className="ml-auto w-6 h-6 text-gray-400 group-hover:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State - when no content in Sanity */}
      {transformedTreks.length === 0 && countries.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === 'es' ? 'Sin contenido todavía' : 'No content yet'}
            </h2>
            <p className="text-gray-500 mb-6">
              {locale === 'es'
                ? 'Ve al panel de administración para agregar países y trekkings.'
                : 'Go to the admin panel to add countries and treks.'}
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              {locale === 'es' ? 'Ir a Sanity Studio' : 'Go to Sanity Studio'}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
