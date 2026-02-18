/**
 * Script to fetch and upload images for treks from Unsplash
 *
 * Usage:
 * 1. Get a free Unsplash API key: https://unsplash.com/developers
 * 2. Set UNSPLASH_ACCESS_KEY in .env.local
 * 3. Set SANITY_API_TOKEN in .env.local
 * 4. Run: npx ts-node scripts/fetch-trek-images.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@sanity/client';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jej16uyf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Search terms for each trek to get relevant images
const trekImageSearchTerms: Record<string, string> = {
  // Mexico
  'trek-mx-iztaccihuatl': 'iztaccihuatl volcano mexico snow mountain',
  'trek-mx-pico-orizaba': 'pico de orizaba volcano mexico summit',
  'trek-mx-nevado-toluca': 'nevado toluca crater lake mexico',
  'trek-mx-copper-canyon': 'copper canyon barrancas cobre mexico',
  'trek-mx-la-malinche': 'la malinche volcano tlaxcala mexico',
  'trek-mx-ajusco': 'ajusco volcano mexico city hiking',
  'trek-mx-calakmul': 'calakmul mayan ruins jungle mexico',
  'trek-mx-ruta-cenotes': 'cenotes yucatan mexico swimming',
  'trek-mx-las-pozas': 'las pozas xilitla surreal garden',
  'trek-mx-desierto-leones': 'desierto de los leones forest mexico',
  'trek-mx-huasteca-potosina': 'huasteca potosina waterfalls mexico',
  'trek-mx-pico-tancitaro': 'tancitaro michoacan mountain',
  'trek-mx-basaseachi': 'basaseachi waterfall chihuahua mexico',
  'trek-mx-agua-azul': 'agua azul waterfalls chiapas mexico',
  'trek-mx-misol-ha': 'misol ha waterfall chiapas jungle',

  // Peru
  'trek-pe-inca-trail': 'inca trail machu picchu peru hiking',
  'trek-pe-salkantay': 'salkantay trek peru andes mountains',
  'trek-pe-ausangate': 'ausangate rainbow mountain peru',
  'trek-pe-choquequirao': 'choquequirao ruins peru andes',
  'trek-pe-colca-canyon': 'colca canyon condor arequipa peru',
  'trek-pe-huayhuash': 'cordillera huayhuash peru glacier',
  'trek-pe-rainbow-mountain': 'vinicunca rainbow mountain peru colorful',
  'trek-pe-lares': 'lares trek sacred valley peru',
  'trek-pe-inca-jungle': 'inca jungle trek cloud forest peru',
  'trek-pe-cordillera-blanca': 'cordillera blanca peru glacier lake',
  'trek-pe-laguna-69': 'laguna 69 huaraz peru turquoise',
  'trek-pe-sacred-valley': 'sacred valley ollantaytambo peru ruins',

  // Colombia
  'trek-co-ciudad-perdida': 'ciudad perdida lost city colombia jungle',
  'trek-co-pan-azucar': 'popayan colombia mountains cauca',
  'trek-co-valle-cocora': 'cocora valley wax palms colombia tall',
  'trek-co-cocuy': 'cocuy national park glacier colombia',
  'trek-co-los-nevados': 'los nevados national park colombia volcano',
  'trek-co-tayrona': 'tayrona national park caribbean beach jungle',
  'trek-co-chicamocha': 'chicamocha canyon colombia santander',
  'trek-co-purace': 'purace volcano colombia crater',
  'trek-co-guatavita': 'guatavita lagoon el dorado colombia',
  'trek-co-sumapaz': 'sumapaz paramo frailejones colombia',
  'trek-co-monserrate': 'monserrate bogota colombia hiking',
  'trek-co-chingaza': 'chingaza paramo lagoon colombia',

  // Ecuador
  'trek-ec-cotopaxi': 'cotopaxi volcano ecuador glacier',
  'trek-ec-quilotoa': 'quilotoa crater lake ecuador lagoon',
  'trek-ec-chimborazo': 'chimborazo volcano ecuador highest',
  'trek-ec-cayambe': 'cayambe volcano ecuador glacier',
  'trek-ec-el-altar': 'el altar volcano ecuador crater',
  'trek-ec-pasochoa': 'pasochoa volcano ecuador paramo',
  'trek-ec-rucu-pichincha': 'rucu pichincha quito ecuador volcano',
  'trek-ec-antisana': 'antisana volcano ecuador glacier',
  'trek-ec-iliniza-norte': 'iliniza norte ecuador mountain',
  'trek-ec-iliniza-sur': 'iliniza sur ecuador glacier',
  'trek-ec-tungurahua': 'tungurahua volcano banos ecuador',
  'trek-ec-cuicocha': 'cuicocha crater lake ecuador lagoon',
  'trek-ec-pailon-diablo': 'pailon del diablo waterfall banos',
  'trek-ec-imbabura': 'imbabura volcano otavalo ecuador',

  // Bolivia
  'trek-bo-choro': 'choro trek bolivia yungas cloud forest',
  'trek-bo-takesi': 'takesi trail bolivia inca road',
  'trek-bo-huayna-potosi': 'huayna potosi bolivia glacier climbing',
  'trek-bo-illimani': 'illimani mountain la paz bolivia',
  'trek-bo-condoriri': 'condoriri peak bolivia cordillera real',
  'trek-bo-illampu': 'illampu sorata bolivia mountain',
  'trek-bo-apolobamba': 'apolobamba cordillera bolivia remote',
  'trek-bo-death-road': 'death road yungas bolivia cycling',
  'trek-bo-isla-del-sol': 'isla del sol lake titicaca bolivia',
  'trek-bo-tunupa': 'tunupa volcano uyuni salt flat bolivia',
  'trek-bo-torotoro': 'torotoro dinosaur footprints bolivia canyon',
  'trek-bo-valle-animas': 'valley of souls la paz bolivia rocks',
  'trek-bo-cordillera-real': 'cordillera real bolivia andes mountains',

  // Costa Rica
  'trek-cr-chirripo': 'chirripo costa rica highest peak paramo',
  'trek-cr-arenal': 'arenal volcano costa rica rainforest',
  'trek-cr-cerro-chato': 'cerro chato crater lake costa rica',
  'trek-cr-monteverde': 'monteverde cloud forest costa rica',
  'trek-cr-santa-elena': 'santa elena cloud forest reserve',
  'trek-cr-rio-celeste': 'rio celeste waterfall blue costa rica',
  'trek-cr-rincon-vieja': 'rincon de la vieja volcano hot springs',
  'trek-cr-la-cangreja': 'la cangreja waterfall costa rica',
  'trek-cr-manuel-antonio': 'manuel antonio national park beach',
  'trek-cr-corcovado': 'corcovado national park jungle wildlife',
  'trek-cr-nauyaca': 'nauyaca waterfalls costa rica swimming',

  // Brazil
  'trek-br-vale-pati': 'chapada diamantina pati valley brazil',
  'trek-br-pico-neblina': 'pico da neblina amazon brazil highest',
  'trek-br-pedra-sino': 'pedra do sino teresopolis brazil',
  'trek-br-travessia-petropolis': 'serra dos orgaos brazil mountains',
  'trek-br-cachoeira-fumaca': 'cachoeira da fumaca chapada diamantina',
  'trek-br-chapada-veadeiros': 'chapada dos veadeiros waterfall brazil',
  'trek-br-agulhas-negras': 'agulhas negras itatiaia brazil',
  'trek-br-fernando-noronha': 'fernando de noronha island beach brazil',
  'trek-br-pico-bandeira': 'pico da bandeira caparao brazil',
  'trek-br-lencois-maranhenses': 'lencois maranhenses dunes lagoon brazil',
  'trek-br-monte-roraima': 'mount roraima tepui brazil venezuela',
  'trek-br-pao-acucar': 'sugarloaf mountain rio de janeiro brazil',
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
  console.log(`Total treks to process: ${Object.keys(trekImageSearchTerms).length}\n`);

  let processed = 0;
  let success = 0;
  let failed = 0;

  for (const [trekId, searchQuery] of Object.entries(trekImageSearchTerms)) {
    processed++;
    console.log(`[${processed}/${Object.keys(trekImageSearchTerms).length}] ${trekId}`);

    // Fetch image from Unsplash
    const imageUrl = await fetchUnsplashImage(searchQuery);

    if (!imageUrl) {
      console.log(`  ⚠️  No image found for "${searchQuery}"`);
      failed++;
      continue;
    }

    // Upload to Sanity
    const asset = await uploadImageToSanity(imageUrl, trekId);

    if (!asset) {
      console.log(`  ⚠️  Failed to upload image`);
      failed++;
      continue;
    }

    // Update trek document
    await updateTrekWithImage(trekId, asset);
    success++;

    // Rate limiting - Unsplash allows 50 requests/hour on free plan
    // Wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n========================================');
  console.log(`✅ Successfully processed: ${success}`);
  console.log(`⚠️  Failed: ${failed}`);
  console.log('========================================');
}

main().catch(console.error);
