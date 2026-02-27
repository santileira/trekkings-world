import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

type Trek = {
  slug: string;
  countrySlug: string;
  _updatedAt: string;
};

type Country = {
  slug: string;
  enabled: boolean;
};

async function getTreks(): Promise<Trek[]> {
  return client.fetch(`
    *[_type == "trek"] {
      "slug": slug.current,
      "countrySlug": country->slug,
      _updatedAt
    }
  `);
}

async function getCountries(): Promise<Country[]> {
  return client.fetch(`
    *[_type == "country" && enabled == true] {
      slug,
      enabled
    }
  `);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkings-world.vercel.app';
  const locales = ['es', 'en'];

  const [treks, countries] = await Promise.all([getTreks(), getCountries()]);

  const staticPages = [
    '',
    '/privacy',
    '/terms',
    '/tips',
    '/apps',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1 : 0.5,
      });
    }
  }

  // Country pages
  for (const locale of locales) {
    for (const country of countries) {
      entries.push({
        url: `${baseUrl}/${locale}/${country.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      entries.push({
        url: `${baseUrl}/${locale}/${country.slug}/trekkings`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Trek pages
  for (const locale of locales) {
    for (const trek of treks) {
      entries.push({
        url: `${baseUrl}/${locale}/${trek.countrySlug}/trekkings/${trek.slug}`,
        lastModified: new Date(trek._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
