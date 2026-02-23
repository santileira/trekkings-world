'use client';

import TrekCard from './TrekCard';

type Trek = {
  _id: string;
  slug: string;
  title: { es: string; en: string };
  mainImage: string;
  country: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: number;
  distanceKm: number;
};

type Props = {
  treks: Trek[];
  locale: string;
};

export default function RelatedTreks({ treks, locale }: Props) {
  if (!treks || treks.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {locale === 'es' ? 'Trekkings Cercanos' : 'Nearby Treks'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {treks.map((trek) => (
          <div key={trek._id} className="relative">
            <TrekCard trek={trek} locale={locale} />
            <div className="absolute top-3 left-3 z-20">
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700 shadow-sm">
                ~{Math.round(trek.distanceKm)} km
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
