import type { Platform, PublishContent, PublishResult, SocialPlatformClient } from '../types';

export abstract class BasePlatformClient implements SocialPlatformClient {
  abstract name: Platform;
  abstract maxTextLength: number;
  abstract supportsImages: boolean;

  abstract validateCredentials(): Promise<boolean>;
  abstract publish(content: PublishContent): Promise<PublishResult>;

  protected truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  protected formatHashtags(hashtags: string[]): string {
    return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
  }

  protected buildFullText(content: PublishContent): string {
    let fullText = content.text;

    if (content.hashtags.length > 0) {
      const hashtagText = this.formatHashtags(content.hashtags);
      fullText = `${fullText}\n\n${hashtagText}`;
    }

    return this.truncateText(fullText, this.maxTextLength);
  }
}
