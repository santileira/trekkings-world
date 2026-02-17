import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';

const countryData: Record<string, { name: { es: string; en: string }; flag: string; regions: { slug: string; name: { es: string; en: string }; trekCount: number }[] }> = {
  ar: {
    name: { es: 'Argentina', en: 'Argentina' },
    flag: '🇦🇷',
    regions: [
      { slug: 'patagonia', name: { es: 'Patagonia', en: 'Patagonia' }, trekCount: 12 },
      { slug: 'cuyo', name: { es: 'Cuyo', en: 'Cuyo' }, trekCount: 5 },
      { slug: 'noa', name: { es: 'Noroeste Argentino', en: 'Northwest Argentina' }, trekCount: 4 },
      { slug: 'litoral', name: { es: 'Litoral', en: 'Litoral' }, trekCount: 2 },
      { slug: 'centro', name: { es: 'Centro', en: 'Central' }, trekCount: 2 },
    ],
  },
};

type Props = {
  params: Promise<{ locale: string; country: string }>;
};

export default async function CountryPage({ params }: Props) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const data = countryData[country];
  if (!data) {
    notFound();
  }

  const t = await getTranslations('country');

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{data.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
                {t('trekkingsIn', { country: locale === 'es' ? data.name.es : data.name.en })}
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                {t('exploreRegions')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {locale === 'es' ? 'Regiones' : 'Regions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.regions.map((region) => (
            <Link
              key={region.slug}
              href={`/${country}/trekkings?region=${region.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-slate-700 transition-colors">
                {locale === 'es' ? region.name.es : region.name.en}
              </h3>
              <p className="mt-2 text-gray-500">
                {region.trekCount} trekkings
              </p>
              <div className="mt-4 flex items-center text-slate-600 font-medium">
                <span>{locale === 'es' ? 'Ver trekkings' : 'View treks'}</span>
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
            {locale === 'es' ? 'Ver todos los trekkings' : 'View all treks'}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
