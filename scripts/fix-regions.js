const fs = require('fs');

// Mapeo de trek ID a nueva región
const regionMap = {
  // Santa Cruz (El Chaltén, Glaciar Perito Moreno)
  'trek-fitz-roy': 'region-santa-cruz',
  'trek-cerro-torre': 'region-santa-cruz',
  'trek-huemul-circuit': 'region-santa-cruz',
  'trek-perito-moreno': 'region-santa-cruz',
  'trek-loma-pliegue': 'region-santa-cruz',
  'trek-pn-perito-moreno': 'region-santa-cruz',
  'trek-refugio-piedra-fraile': 'region-santa-cruz',
  'trek-refugio-cagliero': 'region-santa-cruz',

  // Chubut
  'trek-lago-puelo-cholila': 'region-chubut',

  // Río Negro (Bariloche y El Bolsón)
  'trek-5-lagunas': 'region-rio-negro',
  'trek-refugios-bariloche': 'region-rio-negro',
  'trek-cerro-tronador': 'region-rio-negro',
  'trek-cajon-azul': 'region-rio-negro',
  'trek-cerro-otto': 'region-rio-negro',
  'trek-cerro-campanario': 'region-rio-negro',
  'trek-cerro-llao-llao': 'region-rio-negro',
  'trek-refugio-frey': 'region-rio-negro',
  'trek-refugio-jakob': 'region-rio-negro',
  'trek-refugio-lopez': 'region-rio-negro',
  'trek-refugio-laguna-negra': 'region-rio-negro',
  'trek-refugio-otto-meiling': 'region-rio-negro',
  'trek-travesia-4-refugios': 'region-rio-negro',
  'trek-refugio-hielo-azul': 'region-rio-negro',
  'trek-refugio-natacion': 'region-rio-negro',
  'trek-refugio-piltriquitron': 'region-rio-negro',
  'trek-refugio-cerro-lindo': 'region-rio-negro',
  'trek-refugio-encanto-blanco': 'region-rio-negro',
  'trek-refugio-retamal': 'region-rio-negro',
  'trek-refugio-horqueta': 'region-rio-negro',
  'trek-refugio-los-laguitos': 'region-rio-negro',
  'trek-refugio-dedo-gordo': 'region-rio-negro',

  // Neuquén
  'trek-huella-andina-traful': 'region-neuquen',
  'trek-volcan-lanin': 'region-neuquen',
  'trek-refugio-lanin-caja': 'region-neuquen',

  // Mendoza
  'trek-aconcagua-francia': 'region-mendoza',
  'trek-aconcagua-mulas': 'region-mendoza',
  'trek-avion-uruguayos': 'region-mendoza',
  'trek-cruce-andes-portillo': 'region-mendoza',
  'trek-cerro-arco': 'region-mendoza',
  'trek-plaza-mulas': 'region-mendoza',
  'trek-confluencia-aconcagua': 'region-mendoza',

  // Jujuy
  'trek-hornocal': 'region-jujuy',
  'trek-salinas-grandes': 'region-jujuy',
  'trek-nevado-chani': 'region-jujuy',
  'trek-volcan-tuzgle': 'region-jujuy',
  'trek-tilcara-calilegua': 'region-jujuy',
  'trek-siete-colores': 'region-jujuy',
  'trek-ocloyas-maimara': 'region-jujuy',

  // Salta
  'trek-iruya-nazareno': 'region-salta',
  'trek-nubes': 'region-salta',
  'trek-san-bernardo': 'region-salta',

  // Tucumán
  'trek-jardin-republica': 'region-tucuman',
  'trek-ciudacita': 'region-tucuman',
  'trek-refugio-aconquija': 'region-tucuman',

  // Catamarca
  'trek-cruce-aconquija': 'region-catamarca',
  'trek-manchao': 'region-catamarca',

  // Córdoba
  'trek-champaqui': 'region-cordoba',
  'trek-condorito': 'region-cordoba',
  'trek-cerro-uritorco': 'region-cordoba',
  'trek-refugio-champaqui': 'region-cordoba',

  // Misiones
  'trek-iguazu-superior': 'region-misiones',
  'trek-iguazu-inferior': 'region-misiones',
  'trek-macuco': 'region-misiones',

  // Tierra del Fuego - mantener
  // Buenos Aires - mantener

  // Chile - Magallanes
  'trek-w-torres': 'region-magallanes',
  'trek-o-torres': 'region-magallanes',
  'trek-base-torres': 'region-magallanes',

  // Chile - Aysén
  'trek-cerro-castillo': 'region-aysen',
  'trek-queulat': 'region-aysen',
  'trek-exploradores': 'region-aysen',

  // Chile - Araucanía
  'trek-volcan-villarrica': 'region-araucania',
  'trek-conguillio': 'region-araucania',

  // Chile - Antofagasta
  'trek-geiseres-tatio': 'region-antofagasta',
  'trek-valle-luna': 'region-antofagasta',
};

// Leer archivo
const inputFile = '/tmp/production-export-2026-02-14t02-57-22-341z/data.ndjson';
const outputFile = '/tmp/data-fixed.ndjson';

const lines = fs.readFileSync(inputFile, 'utf8').split('\n').filter(line => line.trim());

const fixedLines = lines.map(line => {
  const doc = JSON.parse(line);

  // Si es un trek y está en el mapeo, actualizar la región
  if (doc._type === 'trek' && regionMap[doc._id]) {
    doc.region = { _type: 'reference', _ref: regionMap[doc._id] };
    console.log(`Updated ${doc._id} -> ${regionMap[doc._id]}`);
  }

  return JSON.stringify(doc);
});

fs.writeFileSync(outputFile, fixedLines.join('\n'));
console.log(`\nWrote ${fixedLines.length} documents to ${outputFile}`);
