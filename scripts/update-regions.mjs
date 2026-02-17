import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'jej16uyf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const updates = [
  // Santa Cruz (El Chaltén, Glaciar Perito Moreno)
  { id: 'trek-fitz-roy', region: 'region-santa-cruz' },
  { id: 'trek-cerro-torre', region: 'region-santa-cruz' },
  { id: 'trek-huemul-circuit', region: 'region-santa-cruz' },
  { id: 'trek-perito-moreno', region: 'region-santa-cruz' },
  { id: 'trek-loma-pliegue', region: 'region-santa-cruz' },
  { id: 'trek-pn-perito-moreno', region: 'region-santa-cruz' },
  { id: 'trek-refugio-piedra-fraile', region: 'region-santa-cruz' },
  { id: 'trek-refugio-cagliero', region: 'region-santa-cruz' },

  // Chubut
  { id: 'trek-lago-puelo-cholila', region: 'region-chubut' },

  // Río Negro (Bariloche y El Bolsón)
  { id: 'trek-5-lagunas', region: 'region-rio-negro' },
  { id: 'trek-refugios-bariloche', region: 'region-rio-negro' },
  { id: 'trek-cerro-tronador', region: 'region-rio-negro' },
  { id: 'trek-cajon-azul', region: 'region-rio-negro' },
  { id: 'trek-cerro-otto', region: 'region-rio-negro' },
  { id: 'trek-cerro-campanario', region: 'region-rio-negro' },
  { id: 'trek-cerro-llao-llao', region: 'region-rio-negro' },
  { id: 'trek-refugio-frey', region: 'region-rio-negro' },
  { id: 'trek-refugio-jakob', region: 'region-rio-negro' },
  { id: 'trek-refugio-lopez', region: 'region-rio-negro' },
  { id: 'trek-refugio-laguna-negra', region: 'region-rio-negro' },
  { id: 'trek-refugio-otto-meiling', region: 'region-rio-negro' },
  { id: 'trek-travesia-4-refugios', region: 'region-rio-negro' },
  { id: 'trek-refugio-hielo-azul', region: 'region-rio-negro' },
  { id: 'trek-refugio-natacion', region: 'region-rio-negro' },
  { id: 'trek-refugio-piltriquitron', region: 'region-rio-negro' },
  { id: 'trek-refugio-cerro-lindo', region: 'region-rio-negro' },
  { id: 'trek-refugio-encanto-blanco', region: 'region-rio-negro' },
  { id: 'trek-refugio-retamal', region: 'region-rio-negro' },
  { id: 'trek-refugio-horqueta', region: 'region-rio-negro' },
  { id: 'trek-refugio-los-laguitos', region: 'region-rio-negro' },
  { id: 'trek-refugio-dedo-gordo', region: 'region-rio-negro' },

  // Neuquén
  { id: 'trek-huella-andina-traful', region: 'region-neuquen' },
  { id: 'trek-volcan-lanin', region: 'region-neuquen' },
  { id: 'trek-refugio-lanin-caja', region: 'region-neuquen' },

  // Mendoza
  { id: 'trek-aconcagua-francia', region: 'region-mendoza' },
  { id: 'trek-aconcagua-mulas', region: 'region-mendoza' },
  { id: 'trek-avion-uruguayos', region: 'region-mendoza' },
  { id: 'trek-cruce-andes-portillo', region: 'region-mendoza' },
  { id: 'trek-cerro-arco', region: 'region-mendoza' },
  { id: 'trek-plaza-mulas', region: 'region-mendoza' },
  { id: 'trek-confluencia-aconcagua', region: 'region-mendoza' },

  // Jujuy
  { id: 'trek-hornocal', region: 'region-jujuy' },
  { id: 'trek-salinas-grandes', region: 'region-jujuy' },
  { id: 'trek-nevado-chani', region: 'region-jujuy' },
  { id: 'trek-volcan-tuzgle', region: 'region-jujuy' },
  { id: 'trek-tilcara-calilegua', region: 'region-jujuy' },
  { id: 'trek-siete-colores', region: 'region-jujuy' },
  { id: 'trek-ocloyas-maimara', region: 'region-jujuy' },

  // Salta
  { id: 'trek-iruya-nazareno', region: 'region-salta' },
  { id: 'trek-nubes', region: 'region-salta' },
  { id: 'trek-san-bernardo', region: 'region-salta' },

  // Tucumán
  { id: 'trek-jardin-republica', region: 'region-tucuman' },
  { id: 'trek-ciudacita', region: 'region-tucuman' },
  { id: 'trek-refugio-aconquija', region: 'region-tucuman' },

  // Catamarca
  { id: 'trek-cruce-aconquija', region: 'region-catamarca' },
  { id: 'trek-manchao', region: 'region-catamarca' },

  // Córdoba
  { id: 'trek-champaqui', region: 'region-cordoba' },
  { id: 'trek-condorito', region: 'region-cordoba' },
  { id: 'trek-cerro-uritorco', region: 'region-cordoba' },
  { id: 'trek-refugio-champaqui', region: 'region-cordoba' },

  // Misiones
  { id: 'trek-iguazu-superior', region: 'region-misiones' },
  { id: 'trek-iguazu-inferior', region: 'region-misiones' },
  { id: 'trek-macuco', region: 'region-misiones' },

  // Chile - Magallanes
  { id: 'trek-w-torres', region: 'region-magallanes' },
  { id: 'trek-o-torres', region: 'region-magallanes' },
  { id: 'trek-base-torres', region: 'region-magallanes' },

  // Chile - Aysén
  { id: 'trek-cerro-castillo', region: 'region-aysen' },
  { id: 'trek-queulat', region: 'region-aysen' },
  { id: 'trek-exploradores', region: 'region-aysen' },

  // Chile - Araucanía
  { id: 'trek-volcan-villarrica', region: 'region-araucania' },
  { id: 'trek-conguillio', region: 'region-araucania' },

  // Chile - Antofagasta
  { id: 'trek-geiseres-tatio', region: 'region-antofagasta' },
  { id: 'trek-valle-luna', region: 'region-antofagasta' },
];

async function updateRegions() {
  console.log(`Updating ${updates.length} treks to new provinces...`);

  let success = 0;
  let failed = 0;

  for (const update of updates) {
    try {
      await client
        .patch(update.id)
        .set({ region: { _type: 'reference', _ref: update.region } })
        .commit();
      console.log(`✓ ${update.id} → ${update.region}`);
      success++;
    } catch (error) {
      console.error(`✗ ${update.id}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
}

updateRegions();
