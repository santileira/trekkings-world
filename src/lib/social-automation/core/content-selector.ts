import { client } from '@/lib/sanity';
import type { Platform, TrekData, Locale } from '../types';

// Query to get treks that haven't been published on a specific platform
const unpublishedTreksQuery = `
  *[_type == "trek" &&
    !(_id in *[_type == "socialPublication" && platform == $platform && locale == $locale && success == true].trek._ref)
  ] {
    _id,
    title,
    slug,
    description,
    tips,
    mainImage,
    difficulty,
    duration,
    distance,
    elevation,
    bestSeason,
    coordinates,
    "country": country->{
      name,
      code
    },
    "region": region->{
      name
    }
  } | order(_createdAt desc)[0...10]
`;

// Query to check if a trek was recently published (avoid spam)
const recentPublicationsQuery = `
  count(*[_type == "socialPublication" &&
    publishedAt > $since &&
    platform == $platform &&
    success == true
  ])
`;

export async function selectTrekToPublish(
  platform: Platform,
  locale: Locale = 'es'
): Promise<TrekData | null> {
  try {
    // Get unpublished treks
    const candidates = await client.fetch<TrekData[]>(unpublishedTreksQuery, {
      platform,
      locale,
    });

    if (candidates.length === 0) {
      console.log(`No unpublished treks found for ${platform} in ${locale}`);
      return null;
    }

    // Select a random trek from candidates
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  } catch (error) {
    console.error('Error selecting trek to publish:', error);
    return null;
  }
}

export async function checkRecentPublications(
  platform: Platform,
  hoursAgo: number = 24
): Promise<number> {
  const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  try {
    const count = await client.fetch<number>(recentPublicationsQuery, {
      platform,
      since,
    });
    return count;
  } catch (error) {
    console.error('Error checking recent publications:', error);
    return 0;
  }
}

export async function canPublish(
  platform: Platform,
  maxPerDay: number = 3
): Promise<boolean> {
  const recentCount = await checkRecentPublications(platform, 24);
  return recentCount < maxPerDay;
}
