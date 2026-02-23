// Social Automation Module
// A generic system for automated social media publishing

// Types
export * from './types';

// Configuration
export { config, getEnabledPlatforms, getPlatformConfig } from './config';

// Core modules
export { selectTrekToPublish, canPublish, checkRecentPublications } from './core/content-selector';
export { savePublication, getPublicationHistory, wasRecentlyPublished } from './core/publication-tracker';
export { handleError, logError, withErrorHandling, SocialAutomationError } from './core/error-handler';

// Generators
export { generateText } from './generators/text-generator';
export { generateHashtags } from './generators/hashtag-generator';

// Platforms
export { BlueskyClient } from './platforms/bluesky/bluesky-client';
export { InstagramClient } from './platforms/instagram/instagram-client';

// Main publish function
import { selectTrekToPublish, canPublish } from './core/content-selector';
import { savePublication } from './core/publication-tracker';
import { generateText } from './generators/text-generator';
import { generateHashtags } from './generators/hashtag-generator';
import { BlueskyClient } from './platforms/bluesky/bluesky-client';
import { InstagramClient } from './platforms/instagram/instagram-client';
import { getEnabledPlatforms, config } from './config';
import { urlForImage } from '@/lib/sanity';
import type { Platform, Locale, PublishResult, TrekData, PublishContent, SocialPlatformClient } from './types';

function getPlatformClient(platform: Platform): SocialPlatformClient | null {
  switch (platform) {
    case 'bluesky':
      return new BlueskyClient();
    case 'instagram':
      return new InstagramClient();
    // case 'twitter':
    //   return new TwitterClient();
    default:
      return null;
  }
}

export async function publishToAllPlatforms(
  trek: TrekData,
  locale: Locale = 'es'
): Promise<PublishResult[]> {
  const enabledPlatforms = getEnabledPlatforms();
  const results: PublishResult[] = [];

  for (const platform of enabledPlatforms) {
    const result = await publishToPlatform(trek, platform, locale);
    results.push(result);
  }

  return results;
}

export async function publishToPlatform(
  trek: TrekData,
  platform: Platform,
  locale: Locale = 'es'
): Promise<PublishResult> {
  const client = getPlatformClient(platform);

  if (!client) {
    return {
      success: false,
      platform,
      error: `Platform ${platform} is not implemented`,
    };
  }

  try {
    // Check if we can publish (rate limits)
    const allowed = await canPublish(platform);
    if (!allowed) {
      return {
        success: false,
        platform,
        error: 'Rate limit reached for today',
      };
    }

    // Generate content
    const text = await generateText({ trek, platform, locale });
    const hashtags = generateHashtags(trek, locale, 5);

    // Get image URL if available
    let imageUrl: string | undefined;
    if (trek.mainImage?.asset?._ref) {
      imageUrl = urlForImage(trek.mainImage).width(1200).height(675).url();
    }

    // Build link to trek
    const trekLink = `${config.siteUrl}/${locale}/${trek.country?.code}/trekkings/${trek.slug}`;

    const content: PublishContent = {
      text,
      imageUrl,
      hashtags,
      link: trekLink,
      locale,
    };

    // Dry run mode
    if (config.dryRun) {
      console.log(`[DRY RUN] Would publish to ${platform}:`, content);
      return {
        success: true,
        platform,
        externalId: 'dry-run',
        externalUrl: 'https://example.com/dry-run',
      };
    }

    // Publish
    const result = await client.publish(content);

    // Save to Sanity
    await savePublication(trek, platform, locale, text, result, imageUrl);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Save failed attempt
    await savePublication(
      trek,
      platform,
      locale,
      '',
      { success: false, platform, error: errorMessage }
    );

    return {
      success: false,
      platform,
      error: errorMessage,
    };
  }
}

export async function runAutomatedPublish(
  locale: Locale = 'es'
): Promise<{ trek: TrekData | null; results: PublishResult[] }> {
  const enabledPlatforms = getEnabledPlatforms();

  if (enabledPlatforms.length === 0) {
    console.log('No platforms enabled');
    return { trek: null, results: [] };
  }

  // Select a trek (use first enabled platform as reference)
  const trek = await selectTrekToPublish(enabledPlatforms[0], locale);

  if (!trek) {
    console.log('No trek available to publish');
    return { trek: null, results: [] };
  }

  console.log(`Selected trek: ${trek.title[locale]}`);

  // Publish to all platforms
  const results = await publishToAllPlatforms(trek, locale);

  return { trek, results };
}
