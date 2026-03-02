import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import CollapsibleSafety from '@/components/CollapsibleSafety';
import { client } from '@/lib/sanity';
import { countryQuery, regionsQuery } from '@/lib/queries';

type CountryData = {
  _id: string;
  name: { es: string; en: string };
  code: string;
  slug: string;
  flag: string;
  safetyInfo?: { es: any[]; en: any[] };
};

type Region = {
  _id: string;
  name: { es: string; en: string };
  slug: string;
  trekCount: number;
};

type Props = {
  params: Promise<{ locale: string; country: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  const data: CountryData | null = await client.fetch(countryQuery, { slug: country });

  if (!data) {
    return {};
  }

  const isSpanish = locale === 'es';
  const countryName = isSpanish ? data.name.es : data.name.en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';

  const title = isSpanish
    ? `Trekkings en ${countryName} - Gu\u00edas y Rutas`
    : `Treks in ${countryName} - Guides and Routes`;

  const description = isSpanish
    ? `Explor\u00e1 las mejores rutas de trekking en ${countryName}. Gu\u00edas detalladas por regi\u00f3n con mapas, dificultad, distancia y consejos para cada sendero.`
    : `Explore the best trekking routes in ${countryName}. Detailed guides by region with maps, difficulty, distance and tips for every trail.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/${country}`,
      languages: {
        'es': `${siteUrl}/es/${country}`,
        'en': `${siteUrl}/en/${country}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/${country}`,
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

export default async function CountryPage({ params }: Props) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const [data, regions] = await Promise.all([
    client.fetch<CountryData | null>(countryQuery, { slug: country }),
    client.fetch<Region[]>(regionsQuery, { countrySlug: country }),
  ]);

  if (!data) {
    notFound();
  }

  const t = await getTranslations('country');
  const isSpanish = locale === 'es';
  const safetyInfo = isSpanish ? data.safetyInfo?.es : data.safetyInfo?.en;

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{data.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
                {t('trekkingsIn', { country: isSpanish ? data.name.es : data.name.en })}
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                {t('exploreRegions')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Country Safety Info */}
      {safetyInfo && safetyInfo.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            {isSpanish ? 'Seguridad y Emergencias' : 'Safety and Emergencies'}
          </h2>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <CollapsibleSafety
              value={safetyInfo}
              expandLabel={isSpanish ? 'Ver toda la información' : 'Show all information'}
              collapseLabel={isSpanish ? 'Ver menos' : 'Show less'}
            />
          </div>
        </section>
      )}

      {/* Regions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {locale === 'es' ? 'Regiones' : 'Regions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/${country}/${region.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-slate-700 transition-colors">
                {isSpanish ? region.name.es : region.name.en}
              </h3>
              <p className="mt-2 text-gray-500">
                {region.trekCount} trekkings
              </p>
              <div className="mt-4 flex items-center text-slate-600 font-medium">
                <span>{isSpanish ? 'Ver trekkings' : 'View treks'}</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA to all treks */}
        <div className="mt-12 text-center">
          <Link
            href={`/${country}/trekkings`}
            className="inline-flex items-center px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isSpanish ? 'Ver todos los trekkings' : 'View all treks'}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
