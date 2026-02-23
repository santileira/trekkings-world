// Types for Social Media Automation System

export type Platform = 'bluesky' | 'twitter' | 'instagram';

export type Locale = 'es' | 'en';

export interface TrekData {
  _id: string;
  title: { es: string; en: string };
  slug: string;
  description?: { es: any[]; en: any[] };
  tips?: { es: any[]; en: any[] };
  mainImage?: {
    asset: { _ref: string };
  };
  country?: {
    name: { es: string; en: string };
    code: string;
  };
  region?: {
    name: { es: string; en: string };
  };
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  duration?: string;
  distance?: number;
  elevation?: number;
  bestSeason?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PublishContent {
  text: string;
  imageUrl?: string;
  hashtags: string[];
  link?: string;
  locale: Locale;
}

export interface PublishResult {
  success: boolean;
  platform: Platform;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}

export interface SocialPublication {
  _type: 'socialPublication';
  trek: { _ref: string };
  platform: Platform;
  publishedAt: string;
  externalId?: string;
  externalUrl?: string;
  content: string;
  imageUrl?: string;
  success: boolean;
  error?: string;
  locale: Locale;
}

export interface PlatformConfig {
  enabled: boolean;
  credentials: Record<string, string>;
}

export interface SocialAutomationConfig {
  platforms: Partial<Record<Platform, PlatformConfig>>;
  defaultLocale: Locale;
  siteUrl: string;
  dryRun?: boolean;
}

export interface ContentGeneratorOptions {
  trek: TrekData;
  platform: Platform;
  locale: Locale;
  maxLength?: number;
}

export interface SocialPlatformClient {
  name: Platform;
  maxTextLength: number;
  supportsImages: boolean;

  validateCredentials(): Promise<boolean>;
  publish(content: PublishContent): Promise<PublishResult>;
}
