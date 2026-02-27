/**
 * Script to add a placeholder "Imagen pronto / Image coming soon" image
 * to all treks that don't have a mainImage.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@sanity/client';
import sharp from 'sharp';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jej16uyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createPlaceholderImage(): Promise<Buffer> {
  const width = 800;
  const height = 600;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#334155;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <!-- Mountain silhouette -->
      <polygon points="0,600 200,250 350,400 500,200 650,350 800,150 800,600" fill="#475569" opacity="0.5" />
      <polygon points="0,600 100,350 250,450 400,300 550,400 700,280 800,350 800,600" fill="#64748b" opacity="0.3" />
      <!-- Camera icon -->
      <g transform="translate(350, 220)">
        <rect x="10" y="25" width="80" height="55" rx="8" fill="none" stroke="#94a3b8" stroke-width="3"/>
        <rect x="30" y="15" width="40" height="15" rx="4" fill="none" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="50" cy="52" r="16" fill="none" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="50" cy="52" r="8" fill="none" stroke="#94a3b8" stroke-width="2"/>
      </g>
      <!-- Text -->
      <text x="${width / 2}" y="340" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="#e2e8f0">
        Imagen pronto
      </text>
      <text x="${width / 2}" y="380" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">
        Image coming soon
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function run() {
  // 1. Find all treks without mainImage
  const treks = await sanityClient.fetch<{ _id: string; title: { es: string } }[]>(
    `*[_type == "trek" && !defined(mainImage)]{_id, title}`
  );

  console.log(`Found ${treks.length} treks without images`);

  if (treks.length === 0) {
    console.log('All treks have images!');
    return;
  }

  // 2. Create and upload the placeholder image once
  console.log('Creating placeholder image...');
  const imageBuffer = await createPlaceholderImage();

  console.log('Uploading placeholder image to Sanity...');
  const imageAsset = await sanityClient.assets.upload('image', imageBuffer, {
    filename: 'placeholder-coming-soon.png',
    contentType: 'image/png',
  });

  console.log(`Uploaded image asset: ${imageAsset._id}`);

  // 3. Patch all treks to use the placeholder image
  let success = 0;
  let failed = 0;

  for (const trek of treks) {
    try {
      await sanityClient
        .patch(trek._id)
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

      success++;
      console.log(`✓ ${trek.title.es} (${trek._id})`);
    } catch (error: any) {
      failed++;
      console.error(`✗ ${trek.title.es} (${trek._id}): ${error.message}`);
    }
  }

  console.log(`\nDone! ${success} updated, ${failed} failed.`);
}

run().catch(console.error);
