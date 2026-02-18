/**
 * Script to patch the Palotinos trek with country/region references and image
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jej16uyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function fetchUnsplashImage(searchQuery: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('UNSPLASH_ACCESS_KEY not set');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching image:`, error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: `${filename}.jpg`,
    });

    return asset;
  } catch (error) {
    console.error(`Error uploading image:`, error);
    return null;
  }
}

async function main() {
  console.log('🔧 Patching Palotinos trek...\n');

  // Find the draft document
  const drafts = await sanityClient.fetch(
    `*[_type == "trek" && slug.current == "refugio-lopez-palotinos"][0]`
  );

  if (!drafts) {
    console.error('❌ Document not found');
    return;
  }

  console.log(`Found document: ${drafts._id}`);

  // Patch with country and region references
  console.log('📍 Adding country and region references...');
  await sanityClient
    .patch(drafts._id)
    .set({
      country: {
        _type: 'reference',
        _ref: 'country-ar',
      },
      region: {
        _type: 'reference',
        _ref: 'region-rio-negro',
      },
    })
    .commit();
  console.log('✅ References added');

  // Fetch and upload image
  console.log('🖼️ Fetching image from Unsplash...');
  const imageUrl = await fetchUnsplashImage('cerro lopez bariloche patagonia mountain hiking');

  if (imageUrl) {
    console.log('📤 Uploading image to Sanity...');
    const asset = await uploadImageToSanity(imageUrl, 'trek-refugio-lopez-palotinos');

    if (asset) {
      await sanityClient
        .patch(drafts._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();
      console.log('✅ Image added');
    }
  } else {
    console.log('⚠️ No image found, using existing López refuge image...');
    // Copy image from the original trek
    const originalTrek = await sanityClient.fetch(
      `*[_id == "trek-refugio-lopez"][0]{mainImage}`
    );
    if (originalTrek?.mainImage) {
      await sanityClient
        .patch(drafts._id)
        .set({
          mainImage: originalTrek.mainImage,
        })
        .commit();
      console.log('✅ Image copied from original trek');
    }
  }

  // Publish the document
  console.log('📤 Publishing document...');
  const publishedId = drafts._id.replace('drafts.', '');

  // Create the published version
  const draftDoc = await sanityClient.fetch(`*[_id == "${drafts._id}"][0]`);
  const { _id, _rev, ...docWithoutMeta } = draftDoc;

  await sanityClient.createOrReplace({
    ...docWithoutMeta,
    _id: publishedId,
  });

  // Delete the draft
  await sanityClient.delete(drafts._id);

  console.log('✅ Document published!');
  console.log(`\n🎉 Done! Trek available at: /es/ar/trekkings/refugio-lopez-palotinos`);
}

main().catch(console.error);
