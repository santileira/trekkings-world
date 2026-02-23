import { BasePlatformClient } from '../base-platform';
import type { PublishContent, PublishResult } from '../../types';
import { getPlatformConfig } from '../../config';

interface InstagramMediaResponse {
  id: string;
}

interface InstagramPublishResponse {
  id: string;
}

export class InstagramClient extends BasePlatformClient {
  name = 'instagram' as const;
  maxTextLength = 2200; // Instagram caption limit
  supportsImages = true;

  private readonly apiUrl = 'https://graph.facebook.com/v18.0';

  private get credentials() {
    const config = getPlatformConfig('instagram');
    return {
      accountId: config?.credentials.accountId || '',
      accessToken: config?.credentials.accessToken || '',
    };
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const { accountId, accessToken } = this.credentials;

      const response = await fetch(
        `${this.apiUrl}/${accountId}?fields=id,username&access_token=${accessToken}`
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  async publish(content: PublishContent): Promise<PublishResult> {
    try {
      const { accountId, accessToken } = this.credentials;

      if (!accountId || !accessToken) {
        throw new Error('Instagram credentials not configured');
      }

      // Instagram requires an image
      if (!content.imageUrl) {
        throw new Error('Instagram posts require an image');
      }

      // Build caption with hashtags
      const caption = this.buildCaption(content);

      // Step 1: Create media container
      const containerId = await this.createMediaContainer(
        accountId,
        accessToken,
        content.imageUrl,
        caption
      );

      // Step 2: Wait for media to be ready (Instagram processes the image)
      await this.waitForMediaReady(containerId, accessToken);

      // Step 3: Publish the media
      const mediaId = await this.publishMedia(accountId, accessToken, containerId);

      return {
        success: true,
        platform: 'instagram',
        externalId: mediaId,
        externalUrl: `https://www.instagram.com/p/${mediaId}/`,
      };
    } catch (error) {
      return {
        success: false,
        platform: 'instagram',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildCaption(content: PublishContent): string {
    let caption = content.text;

    // Add link (Instagram doesn't make links clickable, but we can include it)
    if (content.link) {
      caption += `\n\n🔗 Link en bio`;
    }

    // Add hashtags
    if (content.hashtags.length > 0) {
      const hashtagText = this.formatHashtags(content.hashtags);
      caption += `\n\n${hashtagText}`;
    }

    return this.truncateText(caption, this.maxTextLength);
  }

  private async createMediaContainer(
    accountId: string,
    accessToken: string,
    imageUrl: string,
    caption: string
  ): Promise<string> {
    const params = new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    });

    const response = await fetch(
      `${this.apiUrl}/${accountId}/media?${params.toString()}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create media container: ${JSON.stringify(error)}`);
    }

    const data: InstagramMediaResponse = await response.json();
    return data.id;
  }

  private async waitForMediaReady(
    containerId: string,
    accessToken: string,
    maxAttempts: number = 10
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(
        `${this.apiUrl}/${containerId}?fields=status_code&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to check media status');
      }

      const data = await response.json();

      if (data.status_code === 'FINISHED') {
        return;
      }

      if (data.status_code === 'ERROR') {
        throw new Error('Media processing failed');
      }

      // Wait 2 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error('Media processing timeout');
  }

  private async publishMedia(
    accountId: string,
    accessToken: string,
    containerId: string
  ): Promise<string> {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    });

    const response = await fetch(
      `${this.apiUrl}/${accountId}/media_publish?${params.toString()}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to publish media: ${JSON.stringify(error)}`);
    }

    const data: InstagramPublishResponse = await response.json();
    return data.id;
  }
}
