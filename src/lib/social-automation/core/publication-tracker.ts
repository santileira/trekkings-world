import { createClient } from '@sanity/client';
import type { Platform, Locale, PublishResult, TrekData, SocialPublication } from '../types';

// Create a client with write access
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function savePublication(
  trek: TrekData,
  platform: Platform,
  locale: Locale,
  content: string,
  result: PublishResult,
  imageUrl?: string
): Promise<void> {
  const publication: Omit<SocialPublication, '_type'> & { _type: string } = {
    _type: 'socialPublication',
    trek: { _ref: trek._id },
    platform,
    locale,
    publishedAt: new Date().toISOString(),
    content,
    success: result.success,
    externalId: result.externalId,
    externalUrl: result.externalUrl,
    error: result.error,
    imageUrl,
  };

  try {
    await writeClient.create(publication);
    console.log(`Saved publication record for ${trek.title[locale]} on ${platform}`);
  } catch (error) {
    console.error('Error saving publication record:', error);
    throw error;
  }
}

export async function getPublicationHistory(
  trekId: string,
  platform?: Platform
): Promise<SocialPublication[]> {
  let query = `*[_type == "socialPublication" && trek._ref == $trekId]`;
  const params: Record<string, any> = { trekId };

  if (platform) {
    query += ` && platform == $platform`;
    params.platform = platform;
  }

  query += ` | order(publishedAt desc)`;

  return writeClient.fetch(query, params);
}

export async function wasRecentlyPublished(
  trekId: string,
  platform: Platform,
  hoursAgo: number = 168 // 7 days
): Promise<boolean> {
  const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  const query = `
    count(*[
      _type == "socialPublication" &&
      trek._ref == $trekId &&
      platform == $platform &&
      publishedAt > $since &&
      success == true
    ])
  `;

  const count = await writeClient.fetch<number>(query, {
    trekId,
    platform,
    since,
  });

  return count > 0;
}
