import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import TrekCard from '@/components/TrekCard';
import { client, urlForImage } from '@/lib/sanity';
import { regionQuery, treksForRegionQuery } from '@/lib/queries';

type Region = {
  _id: string;
  name: { es: string; en: string };
  slug: string;
  description?: { es: string; en: string };
  image?: any;
  safetyInfo?: { es: any[]; en: any[] };
  country: {
    name: { es: string; en: string };
    code: string;
    slug: string;
  };
  trekCount: number;
};

type Trek = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: number;
  hasRefugio?: boolean;
  mainImage: any;
};

type Props = {
  params: Promise<{ locale: string; country: string; region: string }>;
};

async function getRegion(countrySlug: string, regionSlug: string): Promise<Region | null> {
  return client.fetch(regionQuery, { countrySlug, regionSlug });
}

async function getRegionTreks(regionSlug: string): Promise<Trek[]> {
  return client.fetch(treksForRegionQuery, { regionSlug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country, region: regionSlug } = await params;
  const region = await getRegion(country, regionSlug);

  if (!region) return {};

  const isSpanish = locale === 'es';
  const regionName = isSpanish ? region.name.es : region.name.en;
  const countryName = isSpanish ? region.country.name.es : region.country.name.en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';

  const title = isSpanish
    ? `Trekkings en ${regionName}, ${countryName}`
    : `Treks in ${regionName}, ${countryName}`;

  const description = isSpanish
    ? (region.description?.es || `Explorá los mejores trekkings en ${regionName}. Guías detalladas con mapas, dificultad y consejos.`)
    : (region.description?.en || `Explore the best treks in ${regionName}. Detailed guides with maps, difficulty and tips.`);

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/${country}/${regionSlug}`,
      languages: {
        es: `${siteUrl}/es/${country}/${regionSlug}`,
        en: `${siteUrl}/en/${country}/${regionSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/${country}/${regionSlug}`,
      siteName: 'Trekkings World',
      locale: isSpanish ? 'es_AR' : 'en_US',
      type: 'website',
      images: region.image
        ? [{ url: urlForImage(region.image).width(1200).height(630).url(), width: 1200, height: 630, alt: regionName }]
        : [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: regionName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RegionPage({ params }: Props) {
  const { locale, country, region: regionSlug } = await params;
  setRequestLocale(locale);

  const [region, treks] = await Promise.all([
    getRegion(country, regionSlug),
    getRegionTreks(regionSlug),
  ]);

  if (!region) {
    notFound();
  }

  const isSpanish = locale === 'es';
  const regionName = isSpanish ? region.name.es : region.name.en;
  const countryName = isSpanish ? region.country.name.es : region.country.name.en;
  const description = isSpanish ? region.description?.es : region.description?.en;
  const safetyInfo = isSpanish ? region.safetyInfo?.es : region.safetyInfo?.en;

  const transformedTreks = treks.map((trek) => ({
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
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">{countryName}</p>
        <h1 className="text-3xl font-bold text-slate-800">{regionName}</h1>
        {description && (
          <p className="mt-3 text-slate-600 text-lg max-w-3xl">{description}</p>
        )}
      </div>

      {/* Safety Info */}
      {safetyInfo && safetyInfo.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            {isSpanish ? 'Seguridad en la Zona' : 'Area Safety'}
          </h2>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="prose prose-slate max-w-none prose-li:marker:text-blue-500 prose-li:my-1">
              <PortableText value={safetyInfo} />
            </div>
          </div>
        </section>
      )}

      {/* Treks */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSpanish ? 'Trekkings' : 'Treks'}
        </h2>
        <p className="text-slate-500 mb-6">
          {isSpanish
            ? `${treks.length} trekkings en ${regionName}`
            : `${treks.length} treks in ${regionName}`}
        </p>

        {transformedTreks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {transformedTreks.map((trek) => (
              <TrekCard key={trek.slug} trek={trek} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isSpanish
                ? 'No hay trekkings cargados en esta región todavía.'
                : 'No treks loaded in this region yet.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
