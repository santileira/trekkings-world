/**
 * Script to fetch and upload images for treks from Unsplash
 *
 * Usage:
 * 1. Get a free Unsplash API key: https://unsplash.com/developers
 * 2. Set UNSPLASH_ACCESS_KEY in .env.local
 * 3. Run: npx ts-node scripts/fetch-trek-images.ts
 */

import { createClient } from '@sanity/client';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jej16uyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Need write token
  useCdn: false,
});

// Search terms for each trek to get relevant images
const trekImageSearchTerms: Record<string, string> = {
  // Mexico
  'trek-mx-iztaccihuatl': 'iztaccihuatl volcano mexico snow',
  'trek-mx-pico-orizaba': 'pico de orizaba volcano mexico',
  'trek-mx-nevado-toluca': 'nevado toluca crater lake mexico',
  'trek-mx-copper-canyon': 'copper canyon barrancas cobre mexico',
  'trek-mx-la-malinche': 'la malinche volcano tlaxcala',

  // Peru
  'trek-pe-inca-trail': 'inca trail machu picchu peru',
  'trek-pe-salkantay': 'salkantay trek peru mountains',
  'trek-pe-ausangate': 'ausangate rainbow mountain peru',
  'trek-pe-colca-canyon': 'colca canyon condor peru',
  'trek-pe-huayhuash': 'cordillera huayhuash peru',
  'trek-pe-rainbow-mountain': 'vinicunca rainbow mountain peru',

  // Colombia
  'trek-co-ciudad-perdida': 'ciudad perdida lost city colombia',
  'trek-co-cocuy': 'cocuy national park colombia glacier',
  'trek-co-valle-cocora': 'cocora valley wax palms colombia',
  'trek-co-los-nevados': 'los nevados national park colombia',

  // Ecuador
  'trek-ec-cotopaxi': 'cotopaxi volcano ecuador',
  'trek-ec-quilotoa': 'quilotoa crater lake ecuador',
  'trek-ec-chimborazo': 'chimborazo volcano ecuador',
  'trek-ec-el-altar': 'el altar volcano ecuador',

  // Bolivia
  'trek-bo-choro': 'choro trek bolivia yungas',
  'trek-bo-huayna-potosi': 'huayna potosi bolivia glacier',
  'trek-bo-isla-del-sol': 'isla del sol lake titicaca bolivia',
  'trek-bo-tunupa': 'tunupa volcano salar uyuni bolivia',

  // Costa Rica
  'trek-cr-chirripo': 'chirripo costa rica mountain',
  'trek-cr-arenal': 'arenal volcano costa rica',
  'trek-cr-rio-celeste': 'rio celeste waterfall costa rica blue',
  'trek-cr-corcovado': 'corcovado national park costa rica jungle',

  // Brazil
  'trek-br-vale-pati': 'chapada diamantina pati valley brazil',
  'trek-br-pico-neblina': 'pico neblina amazon brazil',
  'trek-br-travessia-petropolis': 'serra dos orgaos brazil mountains',
  'trek-br-lencois-maranhenses': 'lencois maranhenses dunes brazil',
  'trek-br-monte-roraima': 'mount roraima brazil tepui',
};

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
    console.error(`Error fetching image for "${searchQuery}":`, error);
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

async function updateTrekWithImage(trekId: string, imageAsset: any) {
  try {
    await sanityClient
      .patch(trekId)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
      })
      .commit();

    console.log(`✅ Updated ${trekId} with image`);
  } catch (error) {
    console.error(`Error updating trek ${trekId}:`, error);
  }
}

async function main() {
  console.log('🖼️  Fetching images for treks...\n');

  for (const [trekId, searchQuery] of Object.entries(trekImageSearchTerms)) {
    console.log(`Processing: ${trekId}`);

    // Fetch image from Unsplash
    const imageUrl = await fetchUnsplashImage(searchQuery);

    if (!imageUrl) {
      console.log(`  ⚠️  No image found for "${searchQuery}"`);
      continue;
    }

    // Upload to Sanity
    const asset = await uploadImageToSanity(imageUrl, trekId);

    if (!asset) {
      console.log(`  ⚠️  Failed to upload image`);
      continue;
    }

    // Update trek document
    await updateTrekWithImage(trekId, asset);

    // Rate limiting - Unsplash allows 50 requests/hour on free plan
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
