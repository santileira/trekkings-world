import { BasePlatformClient } from '../base-platform';
import type { PublishContent, PublishResult } from '../../types';
import { getPlatformConfig } from '../../config';

interface BlueskySession {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
}

interface BlueskyBlob {
  $type: 'blob';
  ref: { $link: string };
  mimeType: string;
  size: number;
}

export class BlueskyClient extends BasePlatformClient {
  name = 'bluesky' as const;
  maxTextLength = 300;
  supportsImages = true;

  private session: BlueskySession | null = null;
  private readonly apiUrl = 'https://bsky.social/xrpc';

  private get credentials() {
    const config = getPlatformConfig('bluesky');
    return {
      handle: config?.credentials.handle || '',
      appPassword: config?.credentials.appPassword || '',
    };
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.login();
      return true;
    } catch {
      return false;
    }
  }

  private async login(): Promise<void> {
    if (this.session) return;

    const { handle, appPassword } = this.credentials;

    const response = await fetch(`${this.apiUrl}/com.atproto.server.createSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: handle,
        password: appPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bluesky login failed: ${error}`);
    }

    this.session = await response.json();
  }

  private async uploadImage(imageUrl: string): Promise<BlueskyBlob | null> {
    try {
      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) return null;

      const imageBuffer = await imageResponse.arrayBuffer();
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

      // Upload to Bluesky
      const uploadResponse = await fetch(`${this.apiUrl}/com.atproto.repo.uploadBlob`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.session!.accessJwt}`,
          'Content-Type': contentType,
        },
        body: imageBuffer,
      });

      if (!uploadResponse.ok) {
        console.error('Bluesky image upload failed:', await uploadResponse.text());
        return null;
      }

      const result = await uploadResponse.json();
      return result.blob;
    } catch (error) {
      console.error('Error uploading image to Bluesky:', error);
      return null;
    }
  }

  async publish(content: PublishContent): Promise<PublishResult> {
    try {
      await this.login();

      const text = this.buildFullText(content);
      const now = new Date().toISOString();

      // Build the post record
      const record: any = {
        $type: 'app.bsky.feed.post',
        text,
        createdAt: now,
        langs: [content.locale],
      };

      // Add link card if provided
      if (content.link) {
        record.facets = this.buildLinkFacets(text, content.link);
        record.embed = {
          $type: 'app.bsky.embed.external',
          external: {
            uri: content.link,
            title: text.slice(0, 50),
            description: '',
          },
        };
      }

      // Upload and attach image if provided
      if (content.imageUrl) {
        const blob = await this.uploadImage(content.imageUrl);
        if (blob) {
          record.embed = {
            $type: 'app.bsky.embed.images',
            images: [
              {
                alt: text.slice(0, 100),
                image: blob,
              },
            ],
          };
        }
      }

      // Create the post
      const response = await fetch(`${this.apiUrl}/com.atproto.repo.createRecord`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.session!.accessJwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: this.session!.did,
          collection: 'app.bsky.feed.post',
          record,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to post: ${error}`);
      }

      const result = await response.json();
      const postId = result.uri.split('/').pop();

      return {
        success: true,
        platform: 'bluesky',
        externalId: result.uri,
        externalUrl: `https://bsky.app/profile/${this.credentials.handle}/post/${postId}`,
      };
    } catch (error) {
      return {
        success: false,
        platform: 'bluesky',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildLinkFacets(text: string, link: string): any[] {
    // Find URL in text and create facet
    const urlIndex = text.indexOf(link);
    if (urlIndex === -1) return [];

    return [
      {
        index: {
          byteStart: urlIndex,
          byteEnd: urlIndex + link.length,
        },
        features: [
          {
            $type: 'app.bsky.richtext.facet#link',
            uri: link,
          },
        ],
      },
    ];
  }
}
