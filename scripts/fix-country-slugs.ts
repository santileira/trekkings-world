/**
 * Script to fix country slugs to use 2-letter codes
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

const countrySlugFixes: Record<string, string> = {
  'country-bolivia': 'bo',
  'country-brazil': 'br',
  'country-colombia': 'co',
  'country-costa-rica': 'cr',
  'country-ecuador': 'ec',
  'country-mexico': 'mx',
  'country-peru': 'pe',
};

async function main() {
  console.log('🔧 Fixing country slugs...\n');

  for (const [countryId, newSlug] of Object.entries(countrySlugFixes)) {
    console.log(`Updating ${countryId} -> ${newSlug}`);

    await sanityClient
      .patch(countryId)
      .set({
        slug: {
          _type: 'slug',
          current: newSlug,
        },
      })
      .commit();

    console.log(`✅ ${countryId} updated`);
  }

  console.log('\n🎉 All country slugs fixed!');
  console.log('\nCountries now available at:');
  console.log('  /es/bo/trekkings - Bolivia');
  console.log('  /es/br/trekkings - Brasil');
  console.log('  /es/co/trekkings - Colombia');
  console.log('  /es/cr/trekkings - Costa Rica');
  console.log('  /es/ec/trekkings - Ecuador');
  console.log('  /es/mx/trekkings - México');
  console.log('  /es/pe/trekkings - Perú');
}

main().catch(console.error);
