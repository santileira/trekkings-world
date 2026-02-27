import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import TrekMap from '@/components/TrekMap';
import ImageCarousel from '@/components/ImageCarousel';
import AdBanner from '@/components/AdBanner';
import ExternalLinks from '@/components/ExternalLinks';
import SocialLinks from '@/components/SocialLinks';
import WeatherWidget from '@/components/WeatherWidget';
import RelatedTreks from '@/components/RelatedTreks';
import ShareButtons from '@/components/ShareButtons';
import { client, urlForImage } from '@/lib/sanity';
import { trekQuery, relatedTreksQuery } from '@/lib/queries';
import { sortByProximity } from '@/lib/geo';

type Trek = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: {
    name: { es: string; en: string };
    code: string;
    slug: string;
  };
  region: {
    name: { es: string; en: string };
    slug: string;
  };
  difficulty: string;
  duration: string;
  distance: number;
  elevation: number;
  bestSeason: string[];
  description: {
    es: any[];
    en: any[];
  };
  mainImage: any;
  gallery: any[];
  coordinates: { lat: number; lng: number };
  tips: {
    es: any[];
    en: any[];
  };
  essentialInfo?: {
    es: any[];
    en: any[];
  };
  externalLinks?: { title: string; url: string; description?: string }[];
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
    twitter?: string;
  };
};

type Props = {
  params: Promise<{ locale: string; country: string; slug: string }>;
};

async function getTrek(slug: string): Promise<Trek | null> {
  return client.fetch(trekQuery, { slug });
}

type RelatedTrek = {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  country: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: number;
  mainImage: string;
  coordinates?: { lat: number; lng: number };
};

async function getRelatedTreks(countrySlug: string, currentSlug: string): Promise<RelatedTrek[]> {
  return client.fetch(relatedTreksQuery, { countrySlug, currentSlug });
}

function extractPlainText(portableTextBlocks: any[]): string {
  if (!portableTextBlocks || portableTextBlocks.length === 0) return '';
  return portableTextBlocks
    .filter((block: any) => block._type === 'block' && block.children)
    .map((block: any) => block.children.map((child: any) => child.text || '').join(''))
    .join(' ')
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country, slug } = await params;
  const trek = await getTrek(slug);

  if (!trek || trek.country.slug !== country) {
    return {};
  }

  const isSpanish = locale === 'es';
  const title = isSpanish ? trek.title.es : trek.title.en;
  const countryName = isSpanish ? trek.country.name.es : trek.country.name.en;
  const regionName = isSpanish ? trek.region.name.es : trek.region.name.en;

  // Build description from Portable Text content or generate a summary
  const descriptionBlocks = isSpanish ? trek.description?.es : trek.description?.en;
  const plainDescription = extractPlainText(descriptionBlocks);
  const description = plainDescription
    ? plainDescription.substring(0, 160) + (plainDescription.length > 160 ? '...' : '')
    : isSpanish
      ? `${title} - Trekking en ${regionName}, ${countryName}. Distancia: ${trek.distance} km, Desnivel: ${trek.elevation} m. Guia completa con mapa, consejos y mas.`
      : `${title} - Trekking in ${regionName}, ${countryName}. Distance: ${trek.distance} km, Elevation: ${trek.elevation} m. Complete guide with map, tips and more.`;

  // Build OG image URL from Sanity mainImage
  const ogImageUrl = trek.mainImage
    ? urlForImage(trek.mainImage).width(1200).height(630).url()
    : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';
  const canonicalUrl = `${siteUrl}/${locale}/${country}/trekkings/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': `${siteUrl}/es/${country}/trekkings/${slug}`,
        'en': `${siteUrl}/en/${country}/trekkings/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Trekkings World',
      locale: isSpanish ? 'es_AR' : 'en_US',
      type: 'article',
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl && {
        images: [ogImageUrl],
      }),
    },
  };
}

export default async function TrekDetailPage({ params }: Props) {
  const { locale, country, slug } = await params;
  setRequestLocale(locale);

  const trek = await getTrek(slug);

  if (!trek || trek.country.slug !== country) {
    notFound();
  }

  // Fetch related treks and sort by proximity
  const relatedTreksCandidates = await getRelatedTreks(country, slug);
  const relatedTreks = trek.coordinates
    ? sortByProximity(relatedTreksCandidates, trek.coordinates.lat, trek.coordinates.lng, 3)
    : [];

  const title = locale === 'es' ? trek.title.es : trek.title.en;
  const description = locale === 'es' ? trek.description?.es : trek.description?.en;
  const tips = locale === 'es' ? trek.tips?.es : trek.tips?.en;
  const essentialInfo = locale === 'es' ? trek.essentialInfo?.es : trek.essentialInfo?.en;
  const countryName = locale === 'es' ? trek.country.name.es : trek.country.name.en;
  const regionName = locale === 'es' ? trek.region.name.es : trek.region.name.en;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';
  const trekUrl = `${baseUrl}/${locale}/${country}/trekkings/${slug}`;

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
    const labels: Record<string, { es: string; en: string }> = {
      easy: { es: 'F\u00e1cil', en: 'Easy' },
      moderate: { es: 'Moderado', en: 'Moderate' },
      hard: { es: 'Dif\u00edcil', en: 'Hard' },
      expert: { es: 'Experto', en: 'Expert' },
    };
    return locale === 'es' ? labels[difficulty]?.es : labels[difficulty]?.en;
  };

  const shareDescription = `${getDifficultyLabel(trek.difficulty)} | ${trek.distance} km | ${regionName}, ${countryName}`;

  const formatDuration = (duration: string) => {
    if (!duration) return '-';

    const lower = duration.toLowerCase();
    const numbers = duration.match(/\d+/g);

    if (!numbers) return duration;

    const maxNum = Math.max(...numbers.map(Number));

    // For hours, divide by 2 to show one-way time
    if (lower.includes('hora') || lower.includes('hour')) {
      const oneWay = Math.round(maxNum / 2);
      return locale === 'es' ? `${oneWay} horas (ida)` : `${oneWay} hours (one-way)`;
    } else if (lower.includes('d\u00eda') || lower.includes('day')) {
      return locale === 'es' ? `${maxNum} d\u00edas` : `${maxNum} days`;
    }

    return duration;
  };

  // Translate month names
  const getMonthName = (month: string) => {
    const months: Record<string, { es: string; en: string }> = {
      January: { es: 'Enero', en: 'January' },
      February: { es: 'Febrero', en: 'February' },
      March: { es: 'Marzo', en: 'March' },
      April: { es: 'Abril', en: 'April' },
      May: { es: 'Mayo', en: 'May' },
      June: { es: 'Junio', en: 'June' },
      July: { es: 'Julio', en: 'July' },
      August: { es: 'Agosto', en: 'August' },
      September: { es: 'Septiembre', en: 'September' },
      October: { es: 'Octubre', en: 'October' },
      November: { es: 'Noviembre', en: 'November' },
      December: { es: 'Diciembre', en: 'December' },
    };
    return locale === 'es' ? months[month]?.es || month : months[month]?.en || month;
  };

  const getBestSeasonText = () => {
    if (!trek.bestSeason || trek.bestSeason.length === 0) return '-';
    const first = getMonthName(trek.bestSeason[0]);
    const last = getMonthName(trek.bestSeason[trek.bestSeason.length - 1]);
    return first === last ? first : `${first} - ${last}`;
  };

  // Extract tips as individual items (split by bullet points or newlines)
  const extractTips = (tipsContent: any[]): string[] => {
    if (!tipsContent || tipsContent.length === 0) return [];

    const tips: string[] = [];
    for (const block of tipsContent) {
      if (block._type === 'block' && block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        // Split by bullet points or by lines starting with -
        const lines = text.split(/[\u2022\n]/).map((line: string) => line.trim()).filter((line: string) => line.length > 0);
        tips.push(...lines);
      }
    }
    return tips;
  };

  const tipsList = extractTips(tips);

  // Get image URLs from Sanity - combine mainImage + gallery for carousel
  const mainImageUrl = trek.mainImage ? urlForImage(trek.mainImage).width(1200).height(600).url() : null;
  const galleryUrls = trek.gallery?.map((img: any) => urlForImage(img).width(1200).height(600).url()) || [];

  // Combine all images for the hero carousel
  const allImages = mainImageUrl ? [mainImageUrl, ...galleryUrls] : galleryUrls;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: title,
    description: extractPlainText(locale === 'es' ? trek.description?.es : trek.description?.en),
    url: trekUrl,
    touristType: 'Hiking',
    ...(trek.mainImage && {
      image: urlForImage(trek.mainImage).width(1200).height(630).url(),
    }),
    ...(trek.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: trek.coordinates.lat,
        longitude: trek.coordinates.lng,
      },
    }),
    isAccessibleForFree: true,
    address: {
      '@type': 'PostalAddress',
      addressRegion: regionName,
      addressCountry: countryName,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Difficulty',
        value: getDifficultyLabel(trek.difficulty),
      },
      {
        '@type': 'PropertyValue',
        name: 'Distance',
        value: `${trek.distance} km`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Elevation Gain',
        value: `${trek.elevation} m`,
      },
      ...(trek.duration
        ? [{
            '@type': 'PropertyValue' as const,
            name: 'Duration',
            value: trek.duration,
          }]
        : []),
      ...(trek.bestSeason && trek.bestSeason.length > 0
        ? [{
            '@type': 'PropertyValue' as const,
            name: 'Best Season',
            value: getBestSeasonText(),
          }]
        : []),
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'es' ? 'Inicio' : 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: countryName,
        item: `${baseUrl}/${locale}/${country}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Trekkings',
        item: `${baseUrl}/${locale}/${country}/trekkings`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: title,
        item: trekUrl,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm overflow-x-auto">
        <ol className="flex items-center space-x-2 text-gray-500 whitespace-nowrap">
          <li>
            <a href={`/${locale}`} className="hover:text-slate-700">
              {locale === 'es' ? 'Inicio' : 'Home'}
            </a>
          </li>
          <li>/</li>
          <li>
            <a href={`/${locale}/${country}`} className="hover:text-slate-700">
              {countryName}
            </a>
          </li>
          <li>/</li>
          <li>
            <a href={`/${locale}/${country}/trekkings`} className="hover:text-slate-700">
              Trekkings
            </a>
          </li>
          <li className="hidden sm:block">/</li>
          <li className="hidden sm:block text-gray-900 font-medium truncate max-w-[150px] md:max-w-none">{title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
              <span className={`self-start px-3 py-1 text-sm font-medium rounded-full shrink-0 ${getDifficultyColor(trek.difficulty)}`}>
                {getDifficultyLabel(trek.difficulty)}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="mb-4">
              <ShareButtons
                url={trekUrl}
                title={title}
                description={shareDescription}
                locale={locale}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">{locale === 'es' ? 'Duraci\u00f3n' : 'Duration'}</p>
                <p className="text-lg font-semibold text-gray-900">{formatDuration(trek.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{locale === 'es' ? 'Distancia' : 'Distance'}</p>
                <p className="text-lg font-semibold text-gray-900">{trek.distance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{locale === 'es' ? 'Desnivel' : 'Elevation'}</p>
                <p className="text-lg font-semibold text-gray-900">{trek.elevation} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{locale === 'es' ? 'Mejor \u00e9poca' : 'Best Season'}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getBestSeasonText()}
                </p>
              </div>
            </div>
          </header>

          {/* Hero Image Carousel */}
          <div className="mb-8">
            <ImageCarousel images={allImages} alt={title} />
          </div>

          {/* Description */}
          {description && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'es' ? 'Descripci\u00f3n' : 'Description'}
              </h2>
              <div className="prose prose-slate max-w-none">
                <PortableText value={description} />
              </div>
            </section>
          )}

          {/* Starting Point */}
          {trek.coordinates && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'es' ? 'Punto de Inicio' : 'Starting Point'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-3">
                      {locale === 'es'
                        ? `Coordenadas: ${trek.coordinates.lat.toFixed(5)}, ${trek.coordinates.lng.toFixed(5)}`
                        : `Coordinates: ${trek.coordinates.lat.toFixed(5)}, ${trek.coordinates.lng.toFixed(5)}`
                      }
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${trek.coordinates.lat},${trek.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {locale === 'es' ? 'Ver en Google Maps' : 'View on Google Maps'}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Map */}
          {trek.coordinates && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'es' ? 'Mapa' : 'Map'}
              </h2>
              <TrekMap
                center={[trek.coordinates.lat, trek.coordinates.lng]}
                zoom={12}
                markerTitle={title}
              />
              <a
                href={`https://www.google.com/maps?q=${trek.coordinates.lat},${trek.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {locale === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}
              </a>
            </section>
          )}


          {/* Tips */}
          {tipsList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'es' ? 'Consejos' : 'Tips'}
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {tipsList.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Essential Info - Important to Know */}
          {essentialInfo && essentialInfo.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {locale === 'es' ? 'Importante a Saber' : 'Important to Know'}
              </h2>
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <div className="prose prose-slate max-w-none prose-li:marker:text-red-500 prose-li:my-1">
                  <PortableText value={essentialInfo} />
                </div>
              </div>
            </section>
          )}

          {/* External Links */}
          {trek.externalLinks && trek.externalLinks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'es' ? 'M\u00e1s Recursos' : 'More Resources'}
              </h2>
              <ExternalLinks links={trek.externalLinks} locale={locale} />
            </section>
          )}

          {/* Related Treks */}
          <RelatedTreks treks={relatedTreks} locale={locale} />

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-6">
            {/* Quick Info Card - show first on mobile for better UX */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 order-first lg:order-none">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                {locale === 'es' ? 'Informaci\u00f3n r\u00e1pida' : 'Quick Info'}
              </h3>
              <dl className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{locale === 'es' ? 'Regi\u00f3n' : 'Region'}</dt>
                  <dd className="font-medium text-gray-900">{regionName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{locale === 'es' ? 'Dificultad' : 'Difficulty'}</dt>
                  <dd className="font-medium text-gray-900">{getDifficultyLabel(trek.difficulty)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{locale === 'es' ? 'Distancia' : 'Distance'}</dt>
                  <dd className="font-medium text-gray-900">{trek.distance} km</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{locale === 'es' ? 'Desnivel' : 'Elevation'}</dt>
                  <dd className="font-medium text-gray-900">{trek.elevation} m</dd>
                </div>
              </dl>
            </div>

            {/* Current Weather */}
            {trek.coordinates && (
              <WeatherWidget coordinates={trek.coordinates} locale={locale} />
            )}

            {/* Ad Banner - hidden on mobile, show on desktop */}
            <AdBanner position="sidebar" slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} />

            {/* Social Links */}
            {trek.socialLinks && (
              <SocialLinks links={trek.socialLinks} locale={locale} />
            )}

            {/* Another Ad - hidden on mobile */}
            <AdBanner position="sidebar" slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} />
          </div>
        </aside>
      </div>
    </div>
  );
}
