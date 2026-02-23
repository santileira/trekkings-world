import type { SocialAutomationConfig, Platform } from './types';

export const config: SocialAutomationConfig = {
  platforms: {
    bluesky: {
      enabled: !!process.env.BLUESKY_HANDLE && !!process.env.BLUESKY_APP_PASSWORD,
      credentials: {
        handle: process.env.BLUESKY_HANDLE || '',
        appPassword: process.env.BLUESKY_APP_PASSWORD || '',
      },
    },
    twitter: {
      enabled: !!(
        process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_SECRET
      ),
      credentials: {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
      },
    },
    instagram: {
      enabled: !!(
        process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID &&
        process.env.INSTAGRAM_ACCESS_TOKEN
      ),
      credentials: {
        accountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
      },
    },
  },
  defaultLocale: 'es',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkingsworld.com',
  dryRun: process.env.SOCIAL_DRY_RUN === 'true',
};

export function getEnabledPlatforms(): Platform[] {
  return (Object.keys(config.platforms) as Platform[]).filter(
    (platform) => config.platforms[platform]?.enabled
  );
}

export function getPlatformConfig(platform: Platform) {
  return config.platforms[platform];
}
