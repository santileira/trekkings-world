/**
 * Script to fix region slugs to use proper slug object format
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

async function main() {
  console.log('🔧 Fixing region slugs...\n');

  // Get all regions with string slugs (not proper slug objects)
  const regions = await sanityClient.fetch(`
    *[_type == "region" && defined(slug) && !defined(slug._type)]{
      _id,
      slug
    }
  `);

  console.log(`Found ${regions.length} regions with incorrect slug format\n`);

  for (const region of regions) {
    const slugValue = typeof region.slug === 'string' ? region.slug : region.slug.current;

    console.log(`Updating ${region._id} -> ${slugValue}`);

    await sanityClient
      .patch(region._id)
      .set({
        slug: {
          _type: 'slug',
          current: slugValue,
        },
      })
      .commit();

    console.log(`✅ ${region._id} updated`);
  }

  console.log('\n🎉 All region slugs fixed!');
}

main().catch(console.error);
