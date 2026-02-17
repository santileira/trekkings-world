/**
 * Script to import Latin America countries, regions, and treks to Sanity
 *
 * Usage:
 * 1. Set SANITY_API_TOKEN in .env.local (get from sanity.io/manage)
 * 2. Run: npx ts-node scripts/import-latam-data.ts
 */

import { createClient } from '@sanity/client';
import countriesData from './seed-latam-countries.json';
import treksData from './seed-latam-treks.json';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jej16uyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function importCountries() {
  console.log('📍 Importing countries...');

  for (const country of countriesData.countries) {
    try {
      await sanityClient.createOrReplace(country);
      console.log(`  ✅ ${country.name.en}`);
    } catch (error) {
      console.error(`  ❌ Error importing ${country.name.en}:`, error);
    }
  }
}

async function importRegions() {
  console.log('\n🗺️  Importing regions...');

  for (const [countrySlug, regions] of Object.entries(countriesData.regions)) {
    console.log(`  ${countrySlug}:`);

    for (const region of regions as any[]) {
      const countryId = countriesData.countries.find(c => c.slug === countrySlug)?._id;

      const regionDoc = {
        ...region,
        _type: 'region',
        country: {
          _type: 'reference',
          _ref: countryId,
        },
      };

      try {
        await sanityClient.createOrReplace(regionDoc);
        console.log(`    ✅ ${region.name.en}`);
      } catch (error) {
        console.error(`    ❌ Error importing ${region.name.en}:`, error);
      }
    }
  }
}

async function importTreks() {
  console.log('\n🥾 Importing treks...');

  for (const trek of treksData.treks) {
    const trekDoc = {
      ...trek,
      slug: {
        _type: 'slug',
        current: trek.slug,
      },
      country: {
        _type: 'reference',
        _ref: trek.country,
      },
      region: {
        _type: 'reference',
        _ref: trek.region,
      },
      description: {
        es: [
          {
            _type: 'block',
            _key: 'desc-es',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'span-es',
                text: `Descripción pendiente para ${trek.title.es}. Próximamente más información.`,
                marks: [],
              },
            ],
          },
        ],
        en: [
          {
            _type: 'block',
            _key: 'desc-en',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'span-en',
                text: `Description pending for ${trek.title.en}. More information coming soon.`,
                marks: [],
              },
            ],
          },
        ],
      },
      tips: {
        es: [],
        en: [],
      },
    };

    // Remove the string versions
    delete (trekDoc as any).country;
    delete (trekDoc as any).region;

    // Add proper references
    (trekDoc as any).country = {
      _type: 'reference',
      _ref: trek.country,
    };
    (trekDoc as any).region = {
      _type: 'reference',
      _ref: trek.region,
    };

    try {
      await sanityClient.createOrReplace(trekDoc);
      console.log(`  ✅ ${trek.title.en}`);
    } catch (error) {
      console.error(`  ❌ Error importing ${trek.title.en}:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Starting Latin America data import...\n');

  await importCountries();
  await importRegions();
  await importTreks();

  console.log('\n✅ Import complete!');
  console.log('\nNext steps:');
  console.log('1. Add images via Sanity Studio or run: npx ts-node scripts/fetch-trek-images.ts');
  console.log('2. Add descriptions and tips for each trek');
  console.log('3. Add essential info for safety information');
}

main().catch(console.error);
