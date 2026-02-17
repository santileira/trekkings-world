import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'jej16uyf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Argentina Country
const argentina = {
  _type: 'country',
  _id: 'country-ar',
  name: { es: 'Argentina', en: 'Argentina' },
  code: 'ar',
  slug: { _type: 'slug', current: 'ar' },
  flag: '🇦🇷',
  enabled: true,
  description: {
    es: 'Argentina ofrece algunos de los paisajes más espectaculares del mundo para el trekking, desde los glaciares de la Patagonia hasta los coloridos cerros del norte.',
    en: 'Argentina offers some of the most spectacular landscapes in the world for trekking, from the glaciers of Patagonia to the colorful mountains of the north.',
  },
};

// Regions
const regions = [
  {
    _type: 'region',
    _id: 'region-patagonia',
    name: { es: 'Patagonia', en: 'Patagonia' },
    slug: { _type: 'slug', current: 'patagonia' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'La Patagonia argentina es el destino de trekking más famoso del país, con glaciares, montañas imponentes y lagos cristalinos.',
      en: 'Argentine Patagonia is the most famous trekking destination in the country, with glaciers, imposing mountains, and crystal-clear lakes.',
    },
  },
  {
    _type: 'region',
    _id: 'region-cuyo',
    name: { es: 'Cuyo', en: 'Cuyo' },
    slug: { _type: 'slug', current: 'cuyo' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'La región de Cuyo alberga el Aconcagua, la montaña más alta de América, y ofrece trekkings de alta montaña.',
      en: 'The Cuyo region is home to Aconcagua, the highest mountain in the Americas, and offers high-altitude treks.',
    },
  },
  {
    _type: 'region',
    _id: 'region-noa',
    name: { es: 'Noroeste Argentino', en: 'Northwest Argentina' },
    slug: { _type: 'slug', current: 'noa' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'El NOA ofrece paisajes únicos con cerros multicolores, salares y cultura andina.',
      en: 'The NOA offers unique landscapes with multicolored hills, salt flats, and Andean culture.',
    },
  },
  {
    _type: 'region',
    _id: 'region-litoral',
    name: { es: 'Litoral', en: 'Litoral' },
    slug: { _type: 'slug', current: 'litoral' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'El Litoral argentino ofrece selvas subtropicales y las cataratas del Iguazú.',
      en: 'The Argentine Litoral offers subtropical jungles and the Iguazu Falls.',
    },
  },
  {
    _type: 'region',
    _id: 'region-centro',
    name: { es: 'Centro', en: 'Central' },
    slug: { _type: 'slug', current: 'centro' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'Las sierras de Córdoba y San Luis ofrecen trekkings accesibles y paisajes serranos.',
      en: 'The mountains of Córdoba and San Luis offer accessible treks and highland landscapes.',
    },
  },
  {
    _type: 'region',
    _id: 'region-tierradelfuego',
    name: { es: 'Tierra del Fuego', en: 'Tierra del Fuego' },
    slug: { _type: 'slug', current: 'tierra-del-fuego' },
    country: { _type: 'reference', _ref: 'country-ar' },
    description: {
      es: 'El fin del mundo ofrece trekkings únicos entre bosques australes y paisajes subantárticos.',
      en: 'The end of the world offers unique treks through southern forests and sub-Antarctic landscapes.',
    },
  },
];

// Treks
const treks = [
  // PATAGONIA
  {
    _type: 'trek',
    _id: 'trek-fitz-roy',
    title: { es: 'Laguna de los Tres - Fitz Roy', en: 'Laguna de los Tres - Fitz Roy' },
    slug: { _type: 'slug', current: 'laguna-de-los-tres-fitz-roy' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-patagonia' },
    difficulty: 'hard',
    duration: '10-12 horas',
    distance: 25,
    elevation: 1200,
    bestSeason: ['October', 'November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -49.2719, lng: -72.9891 },
    featured: true,
    description: {
      es: [
        {
          _type: 'block',
          _key: 'desc1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'El trekking a la Laguna de los Tres es uno de los más icónicos de la Patagonia Argentina. Esta caminata te lleva hasta la base del famoso Monte Fitz Roy, ofreciendo vistas espectaculares de sus agujas graníticas que se elevan más de 3400 metros sobre el nivel del mar.' }],
        },
        {
          _type: 'block',
          _key: 'desc2',
          style: 'normal',
          children: [{ _type: 'span', _key: 's2', text: 'El sendero comienza en El Chaltén, la capital argentina del trekking, y atraviesa bosques de lengas, praderas alpinas y finalmente un empinado ascenso de 400 metros hasta la laguna glaciar que refleja la imponente pared del Fitz Roy.' }],
        },
      ],
      en: [
        {
          _type: 'block',
          _key: 'desc1en',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1en', text: 'The trek to Laguna de los Tres is one of the most iconic in Argentine Patagonia. This hike takes you to the base of the famous Mount Fitz Roy, offering spectacular views of its granite spires that rise more than 3400 meters above sea level.' }],
        },
        {
          _type: 'block',
          _key: 'desc2en',
          style: 'normal',
          children: [{ _type: 'span', _key: 's2en', text: 'The trail begins in El Chaltén, the Argentine trekking capital, and passes through lenga forests, alpine meadows, and finally a steep 400-meter climb to the glacial lagoon that reflects the imposing wall of Fitz Roy.' }],
        },
      ],
    },
    tips: {
      es: [
        {
          _type: 'block',
          _key: 'tip1',
          style: 'normal',
          children: [{ _type: 'span', _key: 't1', text: '• Comienza temprano (antes de las 7am) para evitar el viento fuerte de la tarde y tener mejor luz para fotos' }],
        },
        {
          _type: 'block',
          _key: 'tip2',
          style: 'normal',
          children: [{ _type: 'span', _key: 't2', text: '• Lleva al menos 2-3 litros de agua y snacks energéticos' }],
        },
        {
          _type: 'block',
          _key: 'tip3',
          style: 'normal',
          children: [{ _type: 'span', _key: 't3', text: '• Los bastones de trekking son muy útiles para el descenso' }],
        },
        {
          _type: 'block',
          _key: 'tip4',
          style: 'normal',
          children: [{ _type: 'span', _key: 't4', text: '• El clima cambia rápidamente, lleva capas de ropa y abrigo impermeable' }],
        },
      ],
      en: [
        {
          _type: 'block',
          _key: 'tip1en',
          style: 'normal',
          children: [{ _type: 'span', _key: 't1en', text: '• Start early (before 7am) to avoid strong afternoon winds and have better light for photos' }],
        },
        {
          _type: 'block',
          _key: 'tip2en',
          style: 'normal',
          children: [{ _type: 'span', _key: 't2en', text: '• Bring at least 2-3 liters of water and energy snacks' }],
        },
        {
          _type: 'block',
          _key: 'tip3en',
          style: 'normal',
          children: [{ _type: 'span', _key: 't3en', text: '• Trekking poles are very useful for the descent' }],
        },
        {
          _type: 'block',
          _key: 'tip4en',
          style: 'normal',
          children: [{ _type: 'span', _key: 't4en', text: '• Weather changes quickly, bring layers and waterproof jacket' }],
        },
      ],
    },
    socialLinks: {
      website: 'https://www.elchalten.com/',
      instagram: 'https://www.instagram.com/elchaltenoficial/',
      facebook: 'https://www.facebook.com/elchaltenoficial',
    },
    externalLinks: [
      { title: 'Parque Nacional Los Glaciares', url: 'https://www.argentina.gob.ar/parquesnacionales/losglaciares', description: 'Información oficial del parque' },
      { title: 'AllTrails - Laguna de los Tres', url: 'https://www.alltrails.com/trail/argentina/santa-cruz/laguna-de-los-tres', description: 'Mapas y reviews' },
    ],
  },
  {
    _type: 'trek',
    _id: 'trek-cerro-torre',
    title: { es: 'Laguna Torre - Cerro Torre', en: 'Laguna Torre - Cerro Torre' },
    slug: { _type: 'slug', current: 'laguna-torre-cerro-torre' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-patagonia' },
    difficulty: 'moderate',
    duration: '7-8 horas',
    distance: 18,
    elevation: 350,
    bestSeason: ['October', 'November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -49.3167, lng: -73.0167 },
    featured: true,
    description: {
      es: [
        {
          _type: 'block',
          _key: 'desc1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'El trekking a Laguna Torre ofrece vistas espectaculares del Cerro Torre, una de las montañas más difíciles de escalar del mundo. El sendero es más suave que el de Fitz Roy y atraviesa bosques patagónicos con vistas al glaciar.' }],
        },
      ],
      en: [
        {
          _type: 'block',
          _key: 'desc1en',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1en', text: 'The trek to Laguna Torre offers spectacular views of Cerro Torre, one of the most difficult mountains to climb in the world. The trail is gentler than Fitz Roy and passes through Patagonian forests with glacier views.' }],
        },
      ],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• Ideal para combinar con Fitz Roy en días consecutivos. Mirador del Cerro Torre tiene vistas increíbles.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• Ideal to combine with Fitz Roy on consecutive days. Cerro Torre viewpoint has incredible views.' }] }],
    },
    socialLinks: {
      website: 'https://www.elchalten.com/',
    },
  },
  {
    _type: 'trek',
    _id: 'trek-huemul-circuit',
    title: { es: 'Circuito Huemul', en: 'Huemul Circuit' },
    slug: { _type: 'slug', current: 'circuito-huemul' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-patagonia' },
    difficulty: 'expert',
    duration: '4-5 días',
    distance: 65,
    elevation: 2500,
    bestSeason: ['December', 'January', 'February'],
    coordinates: { _type: 'geopoint', lat: -49.35, lng: -73.05 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Circuito Huemul es uno de los trekkings más desafiantes de la Patagonia. Requiere experiencia en cruces de ríos con tirolesa, navegación y camping en condiciones extremas. Rodea el Campo de Hielo Sur con vistas únicas.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The Huemul Circuit is one of the most challenging treks in Patagonia. It requires experience in river crossings with tyrolean traverse, navigation, and camping in extreme conditions. It circles the Southern Ice Field with unique views.' }] }],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• Requiere registro obligatorio en el Centro de Visitantes. Solo para expertos con experiencia en montaña.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• Mandatory registration at the Visitor Center. Only for experts with mountain experience.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-perito-moreno',
    title: { es: 'Trekking Glaciar Perito Moreno', en: 'Perito Moreno Glacier Trek' },
    slug: { _type: 'slug', current: 'glaciar-perito-moreno' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-patagonia' },
    difficulty: 'moderate',
    duration: '5-6 horas',
    distance: 8,
    elevation: 200,
    bestSeason: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'],
    coordinates: { _type: 'geopoint', lat: -50.4967, lng: -73.0378 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Caminar sobre el Glaciar Perito Moreno es una experiencia única. El "Big Ice" te permite explorar el glaciar durante 3 horas caminando entre grietas, seracs y lagunas de un azul intenso. Incluye crampones y guía.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Walking on the Perito Moreno Glacier is a unique experience. "Big Ice" allows you to explore the glacier for 3 hours walking among crevasses, seracs, and intensely blue lagoons. Includes crampons and guide.' }] }],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• Reservar con anticipación en temporada alta. Llevar ropa abrigada y gafas de sol. Edad mínima 10 años.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• Book in advance during high season. Bring warm clothes and sunglasses. Minimum age 10 years.' }] }],
    },
    socialLinks: {
      website: 'https://hieloyaventura.com/',
      instagram: 'https://www.instagram.com/hieloyaventura/',
    },
  },
  {
    _type: 'trek',
    _id: 'trek-loma-del-pliegue',
    title: { es: 'Loma del Pliegue Tumbado', en: 'Loma del Pliegue Tumbado' },
    slug: { _type: 'slug', current: 'loma-del-pliegue-tumbado' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-patagonia' },
    difficulty: 'hard',
    duration: '8-9 horas',
    distance: 22,
    elevation: 1000,
    bestSeason: ['October', 'November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -49.33, lng: -72.95 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'La Loma del Pliegue Tumbado ofrece una vista panorámica de 360° de todo el macizo del Fitz Roy y Cerro Torre. Es menos concurrido que otros senderos y la cumbre permite ver ambos iconos en una sola vista.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Loma del Pliegue Tumbado offers a 360° panoramic view of the entire Fitz Roy and Cerro Torre massif. It is less crowded than other trails and the summit allows you to see both icons in a single view.' }] }],
    },
  },
  // CUYO
  {
    _type: 'trek',
    _id: 'trek-aconcagua-plaza-francia',
    title: { es: 'Aconcagua - Plaza Francia', en: 'Aconcagua - Plaza Francia' },
    slug: { _type: 'slug', current: 'aconcagua-plaza-francia' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-cuyo' },
    difficulty: 'moderate',
    duration: '2 días',
    distance: 25,
    elevation: 800,
    bestSeason: ['November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -32.6532, lng: -70.0109 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El trekking a Plaza Francia te lleva al pie de la imponente Pared Sur del Aconcagua (6,962m), la montaña más alta de América. No requiere equipo técnico y ofrece vistas increíbles del coloso de América.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The trek to Plaza Francia takes you to the foot of the imposing South Wall of Aconcagua (6,962m), the highest mountain in the Americas. It does not require technical equipment and offers incredible views of the colossus of America.' }] }],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• Se requiere permiso del Parque Provincial Aconcagua. Llevar protección solar alta y mucha agua por la altura.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• Permit required from Aconcagua Provincial Park. Bring high SPF sunscreen and plenty of water due to altitude.' }] }],
    },
    socialLinks: {
      website: 'https://www.mendoza.gov.ar/aconcagua/',
    },
  },
  {
    _type: 'trek',
    _id: 'trek-aconcagua-base',
    title: { es: 'Aconcagua - Campo Base Plaza de Mulas', en: 'Aconcagua - Plaza de Mulas Base Camp' },
    slug: { _type: 'slug', current: 'aconcagua-plaza-de-mulas' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-cuyo' },
    difficulty: 'hard',
    duration: '3-4 días',
    distance: 40,
    elevation: 1800,
    bestSeason: ['December', 'January', 'February'],
    coordinates: { _type: 'geopoint', lat: -32.65, lng: -70.02 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El trekking al Campo Base Plaza de Mulas (4,370m) es la ruta clásica de aproximación al Aconcagua. Una experiencia de alta montaña sin necesidad de equipo técnico, cruzando el Valle de las Vacas y el paisaje lunar de la Cuesta Brava.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The trek to Plaza de Mulas Base Camp (4,370m) is the classic approach route to Aconcagua. A high mountain experience without technical equipment, crossing the Vacas Valley and the lunar landscape of Cuesta Brava.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-cerro-vallecitos',
    title: { es: 'Cerro Vallecitos', en: 'Cerro Vallecitos' },
    slug: { _type: 'slug', current: 'cerro-vallecitos' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-cuyo' },
    difficulty: 'hard',
    duration: '2 días',
    distance: 20,
    elevation: 1500,
    bestSeason: ['November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -32.98, lng: -69.35 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Cerro Vallecitos (5,450m) es ideal para quienes buscan su primera experiencia en alta montaña. Cerca de Mendoza, ofrece un ascenso técnicamente simple pero físicamente demandante con vistas a los Andes centrales.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Cerro Vallecitos (5,450m) is ideal for those seeking their first high mountain experience. Near Mendoza, it offers a technically simple but physically demanding climb with views of the central Andes.' }] }],
    },
  },
  // NOA
  {
    _type: 'trek',
    _id: 'trek-humahuaca',
    title: { es: 'Serranías de Hornocal', en: 'Hornocal Mountains' },
    slug: { _type: 'slug', current: 'serrranias-hornocal' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-noa' },
    difficulty: 'easy',
    duration: '3-4 horas',
    distance: 8,
    elevation: 300,
    bestSeason: ['April', 'May', 'June', 'July', 'August', 'September', 'October'],
    coordinates: { _type: 'geopoint', lat: -23.2, lng: -65.2 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Las Serranías de Hornocal, conocidas como el Cerro de los 14 Colores, ofrecen uno de los paisajes más impresionantes del NOA. Las montañas multicolores crean un espectáculo visual único cerca de Humahuaca.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The Hornocal Mountains, known as the Hill of 14 Colors, offer one of the most impressive landscapes in the NOA. The multicolored mountains create a unique visual spectacle near Humahuaca.' }] }],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• Mejor ir por la tarde para la mejor luz en los colores. Llevar abrigo ya que está a 4,350m de altura.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• Best to go in the afternoon for the best light on the colors. Bring warm clothes as it is at 4,350m altitude.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-cerro-chani',
    title: { es: 'Nevado de Chañi', en: 'Nevado de Chañi' },
    slug: { _type: 'slug', current: 'nevado-de-chani' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-noa' },
    difficulty: 'expert',
    duration: '3-4 días',
    distance: 35,
    elevation: 2200,
    bestSeason: ['May', 'June', 'July', 'August', 'September'],
    coordinates: { _type: 'geopoint', lat: -24.05, lng: -65.75 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Nevado de Chañi (5,896m) es la montaña más alta del NOA. La expedición atraviesa paisajes de puna con vicuñas y ofrece una cumbre con vistas a la Quebrada de Humahuaca.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Nevado de Chañi (5,896m) is the highest mountain in the NOA. The expedition crosses puna landscapes with vicuñas and offers a summit with views of the Quebrada de Humahuaca.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-salinas-grandes',
    title: { es: 'Salinas Grandes', en: 'Salinas Grandes Salt Flats' },
    slug: { _type: 'slug', current: 'salinas-grandes' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-noa' },
    difficulty: 'easy',
    duration: '2-3 horas',
    distance: 5,
    elevation: 50,
    bestSeason: ['April', 'May', 'June', 'July', 'August', 'September', 'October'],
    coordinates: { _type: 'geopoint', lat: -23.6, lng: -65.9 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Las Salinas Grandes son un inmenso salar a 3,450m de altura. Caminatas cortas permiten explorar las piscinas de extracción de sal y tomar fotos con perspectivas únicas en el blanco infinito.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Salinas Grandes is a vast salt flat at 3,450m altitude. Short walks allow you to explore the salt extraction pools and take photos with unique perspectives in the infinite white.' }] }],
    },
  },
  // TIERRA DEL FUEGO
  {
    _type: 'trek',
    _id: 'trek-glaciar-martial',
    title: { es: 'Glaciar Martial', en: 'Martial Glacier' },
    slug: { _type: 'slug', current: 'glaciar-martial' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-tierradelfuego' },
    difficulty: 'moderate',
    duration: '4-5 horas',
    distance: 8,
    elevation: 600,
    bestSeason: ['November', 'December', 'January', 'February', 'March'],
    coordinates: { _type: 'geopoint', lat: -54.78, lng: -68.35 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Glaciar Martial ofrece vistas panorámicas de Ushuaia y el Canal Beagle. El ascenso atraviesa bosques de lengas hasta llegar al glaciar, donde en verano se puede caminar sobre el hielo.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Martial Glacier offers panoramic views of Ushuaia and the Beagle Channel. The ascent passes through lenga forests until reaching the glacier, where in summer you can walk on the ice.' }] }],
    },
    socialLinks: {
      website: 'https://www.ushuaia.gob.ar/',
    },
  },
  {
    _type: 'trek',
    _id: 'trek-laguna-esmeralda',
    title: { es: 'Laguna Esmeralda', en: 'Emerald Lagoon' },
    slug: { _type: 'slug', current: 'laguna-esmeralda' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-tierradelfuego' },
    difficulty: 'moderate',
    duration: '4-5 horas',
    distance: 9,
    elevation: 400,
    bestSeason: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    coordinates: { _type: 'geopoint', lat: -54.72, lng: -68.15 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'La Laguna Esmeralda es uno de los trekkings más populares de Ushuaia. Atraviesa turberas y bosques fueguinos hasta llegar a una laguna de aguas turquesas rodeada de montañas nevadas.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Emerald Lagoon is one of the most popular treks in Ushuaia. It crosses peat bogs and Fuegian forests until reaching a turquoise lagoon surrounded by snow-capped mountains.' }] }],
    },
    tips: {
      es: [{ _type: 'block', _key: 'tip1', style: 'normal', children: [{ _type: 'span', _key: 't1', text: '• El sendero puede ser muy barroso, llevar botas impermeables. En invierno se puede hacer con raquetas de nieve.' }] }],
      en: [{ _type: 'block', _key: 'tip1en', style: 'normal', children: [{ _type: 'span', _key: 't1en', text: '• The trail can be very muddy, bring waterproof boots. In winter it can be done with snowshoes.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-parque-nacional-tdf',
    title: { es: 'Senda Costera - Parque Nacional TDF', en: 'Coastal Trail - TDF National Park' },
    slug: { _type: 'slug', current: 'senda-costera-tdf' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-tierradelfuego' },
    difficulty: 'easy',
    duration: '3-4 horas',
    distance: 8,
    elevation: 100,
    bestSeason: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    coordinates: { _type: 'geopoint', lat: -54.85, lng: -68.55 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'La Senda Costera del Parque Nacional Tierra del Fuego bordea la costa del Canal Beagle. Conecta Bahía Ensenada con Bahía Lapataia, el fin de la Ruta 3 y punto más austral accesible por carretera.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The Coastal Trail of Tierra del Fuego National Park borders the Beagle Channel coast. It connects Ensenada Bay with Lapataia Bay, the end of Route 3 and the southernmost point accessible by road.' }] }],
    },
    socialLinks: {
      website: 'https://www.argentina.gob.ar/parquesnacionales/tierradelfuego',
    },
  },
  // CENTRO
  {
    _type: 'trek',
    _id: 'trek-cerro-champaqui',
    title: { es: 'Cerro Champaquí', en: 'Cerro Champaquí' },
    slug: { _type: 'slug', current: 'cerro-champaqui' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-centro' },
    difficulty: 'moderate',
    duration: '2 días',
    distance: 30,
    elevation: 1200,
    bestSeason: ['March', 'April', 'May', 'September', 'October', 'November'],
    coordinates: { _type: 'geopoint', lat: -31.98, lng: -64.93 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Cerro Champaquí (2,884m) es el punto más alto de las Sierras de Córdoba. El trekking parte desde Villa Alpina y ofrece vistas de toda la provincia. Se puede hacer en un día largo o con noche en el refugio.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Cerro Champaquí (2,884m) is the highest point in the Sierras de Córdoba. The trek starts from Villa Alpina and offers views of the entire province. It can be done in a long day or with a night at the refuge.' }] }],
    },
  },
  {
    _type: 'trek',
    _id: 'trek-quebrada-condorito',
    title: { es: 'Quebrada del Condorito', en: 'Condorito Canyon' },
    slug: { _type: 'slug', current: 'quebrada-del-condorito' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-centro' },
    difficulty: 'moderate',
    duration: '6-7 horas',
    distance: 18,
    elevation: 500,
    bestSeason: ['March', 'April', 'May', 'September', 'October', 'November'],
    coordinates: { _type: 'geopoint', lat: -31.73, lng: -64.78 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Parque Nacional Quebrada del Condorito protege el hábitat del cóndor andino. El trekking lleva al Balcón Norte donde se pueden observar cóndores volando a la altura de los ojos sobre el cañón de 800m de profundidad.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'Quebrada del Condorito National Park protects the Andean condor habitat. The trek leads to the North Balcony where you can watch condors flying at eye level over the 800m deep canyon.' }] }],
    },
    socialLinks: {
      website: 'https://www.argentina.gob.ar/parquesnacionales/quebradadelcondorito',
    },
  },
  // LITORAL
  {
    _type: 'trek',
    _id: 'trek-iguazu-superior',
    title: { es: 'Circuito Superior - Cataratas del Iguazú', en: 'Upper Trail - Iguazu Falls' },
    slug: { _type: 'slug', current: 'iguazu-circuito-superior' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-litoral' },
    difficulty: 'easy',
    duration: '2-3 horas',
    distance: 3,
    elevation: 50,
    bestSeason: ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'],
    coordinates: { _type: 'geopoint', lat: -25.68, lng: -54.44 },
    featured: true,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Circuito Superior ofrece vistas panorámicas desde arriba de las Cataratas del Iguazú. Pasarelas elevadas permiten caminar sobre los saltos y sentir la fuerza del agua en una de las maravillas naturales del mundo.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The Upper Trail offers panoramic views from above Iguazu Falls. Elevated walkways allow you to walk over the falls and feel the power of the water at one of the natural wonders of the world.' }] }],
    },
    socialLinks: {
      website: 'https://iguazuargentina.com/',
      instagram: 'https://www.instagram.com/iguazuargentina/',
    },
  },
  {
    _type: 'trek',
    _id: 'trek-sendero-macuco',
    title: { es: 'Sendero Macuco', en: 'Macuco Trail' },
    slug: { _type: 'slug', current: 'sendero-macuco' },
    country: { _type: 'reference', _ref: 'country-ar' },
    region: { _type: 'reference', _ref: 'region-litoral' },
    difficulty: 'easy',
    duration: '3 horas',
    distance: 7,
    elevation: 100,
    bestSeason: ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'],
    coordinates: { _type: 'geopoint', lat: -25.67, lng: -54.42 },
    featured: false,
    description: {
      es: [{ _type: 'block', _key: 'desc1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'El Sendero Macuco es una caminata por la selva misionera hasta un salto de agua escondido. Es ideal para observar aves y monos, y termina en el Salto Arrechea, una cascada secreta donde pocos visitantes llegan.' }] }],
      en: [{ _type: 'block', _key: 'desc1en', style: 'normal', children: [{ _type: 'span', _key: 's1en', text: 'The Macuco Trail is a walk through the Misiones jungle to a hidden waterfall. It is ideal for bird and monkey watching, ending at Salto Arrechea, a secret waterfall where few visitors reach.' }] }],
    },
  },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Create country
  console.log('Creating Argentina...');
  await client.createOrReplace(argentina);

  // Create regions
  console.log('Creating regions...');
  for (const region of regions) {
    await client.createOrReplace(region);
    console.log(`  ✓ ${region.name.es}`);
  }

  // Create treks
  console.log('Creating treks...');
  for (const trek of treks) {
    await client.createOrReplace(trek);
    console.log(`  ✓ ${trek.title.es}`);
  }

  console.log('✅ Seed complete!');
}

seed().catch(console.error);
