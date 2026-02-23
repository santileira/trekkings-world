import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

type Tip = {
  icon: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  items: { es: string[]; en: string[] };
};

type Category = {
  id: string;
  icon: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  tips: Tip[];
};

const CATEGORIES: Category[] = [
  {
    id: 'gear',
    icon: '🎒',
    title: {
      es: 'Equipamiento Esencial',
      en: 'Essential Gear',
    },
    description: {
      es: 'Lo que no puede faltar en tu mochila',
      en: 'What you must have in your backpack',
    },
    tips: [
      {
        icon: '👟',
        title: { es: 'Calzado adecuado', en: 'Proper footwear' },
        description: {
          es: 'El calzado es lo más importante. Usa botas ya probadas, nunca estrenes en montaña.',
          en: 'Footwear is the most important. Use already broken-in boots, never wear new ones on the mountain.',
        },
        items: {
          es: ['Botas de trekking con tobillo alto', 'Suela Vibram o similar', 'Impermeables para terreno húmedo', 'Medias técnicas (evitar algodón)'],
          en: ['High-ankle trekking boots', 'Vibram sole or similar', 'Waterproof for wet terrain', 'Technical socks (avoid cotton)'],
        },
      },
      {
        icon: '🧥',
        title: { es: 'Sistema de capas', en: 'Layering system' },
        description: {
          es: 'Vestirse en capas permite regular la temperatura según la actividad y el clima.',
          en: 'Dressing in layers allows you to regulate temperature according to activity and weather.',
        },
        items: {
          es: ['Capa base térmica (dry-fit)', 'Capa media aislante (polar/pluma)', 'Capa externa impermeable y cortaviento', 'Pantalón técnico desmontable'],
          en: ['Thermal base layer (dry-fit)', 'Insulating mid layer (fleece/down)', 'Waterproof and windproof outer layer', 'Convertible technical pants'],
        },
      },
      {
        icon: '🎒',
        title: { es: 'Mochila y accesorios', en: 'Backpack and accessories' },
        description: {
          es: 'Una mochila cómoda y bien organizada hace la diferencia en caminatas largas.',
          en: 'A comfortable and well-organized backpack makes a difference on long hikes.',
        },
        items: {
          es: ['Mochila 20-35L para día, 50-65L para travesías', 'Bastones de trekking telescópicos', 'Funda impermeable para mochila', 'Linterna frontal con pilas extra'],
          en: ['20-35L backpack for day hikes, 50-65L for treks', 'Telescopic trekking poles', 'Waterproof backpack cover', 'Headlamp with extra batteries'],
        },
      },
    ],
  },
  {
    id: 'safety',
    icon: '🛡️',
    title: {
      es: 'Seguridad y Emergencias',
      en: 'Safety and Emergencies',
    },
    description: {
      es: 'Preparación y prevención para volver seguros',
      en: 'Preparation and prevention to return safely',
    },
    tips: [
      {
        icon: '📱',
        title: { es: 'Comunicación y ubicación', en: 'Communication and location' },
        description: {
          es: 'Siempre avisa a alguien tu plan y lleva medios de comunicación.',
          en: 'Always tell someone your plan and carry means of communication.',
        },
        items: {
          es: ['Compartí tu ruta y hora estimada de regreso', 'Celular cargado + batería externa', 'Mapas offline descargados', 'Silbato de emergencia'],
          en: ['Share your route and estimated return time', 'Charged phone + power bank', 'Downloaded offline maps', 'Emergency whistle'],
        },
      },
      {
        icon: '🌡️',
        title: { es: 'Clima y condiciones', en: 'Weather and conditions' },
        description: {
          es: 'El clima en montaña cambia rápido. Consultá el pronóstico y estate preparado.',
          en: 'Mountain weather changes quickly. Check the forecast and be prepared.',
        },
        items: {
          es: ['Revisá el pronóstico 24-48hs antes', 'Salí temprano para evitar tormentas de tarde', 'Conocé los signos de mal tiempo', 'Tené un plan B de escape'],
          en: ['Check the forecast 24-48hrs before', 'Start early to avoid afternoon storms', 'Know the signs of bad weather', 'Have an escape plan B'],
        },
      },
      {
        icon: '🩹',
        title: { es: 'Botiquín básico', en: 'Basic first aid kit' },
        description: {
          es: 'Un botiquín liviano puede marcar la diferencia en situaciones de emergencia.',
          en: 'A lightweight first aid kit can make a difference in emergencies.',
        },
        items: {
          es: ['Vendas, gasas y cinta adhesiva', 'Analgésicos y antiinflamatorios', 'Protector solar y labial', 'Manta térmica de emergencia'],
          en: ['Bandages, gauze and tape', 'Painkillers and anti-inflammatories', 'Sunscreen and lip balm', 'Emergency thermal blanket'],
        },
      },
    ],
  },
  {
    id: 'nutrition',
    icon: '🥤',
    title: {
      es: 'Nutrición e Hidratación',
      en: 'Nutrition and Hydration',
    },
    description: {
      es: 'Combustible para tu cuerpo en la montaña',
      en: 'Fuel for your body in the mountains',
    },
    tips: [
      {
        icon: '💧',
        title: { es: 'Hidratación', en: 'Hydration' },
        description: {
          es: 'La deshidratación afecta el rendimiento y puede ser peligrosa en altura.',
          en: 'Dehydration affects performance and can be dangerous at altitude.',
        },
        items: {
          es: ['Mínimo 2-3 litros por día de caminata', 'Bebé antes de tener sed', 'Sales de rehidratación para caminatas largas', 'Camelback o botella accesible'],
          en: ['Minimum 2-3 liters per hiking day', 'Drink before feeling thirsty', 'Rehydration salts for long hikes', 'Hydration bladder or accessible bottle'],
        },
      },
      {
        icon: '🍫',
        title: { es: 'Snacks energéticos', en: 'Energy snacks' },
        description: {
          es: 'Comé poco y seguido para mantener la energía durante la actividad.',
          en: 'Eat small amounts frequently to maintain energy during activity.',
        },
        items: {
          es: ['Frutos secos y mix de semillas', 'Barras de cereal o energéticas', 'Frutas deshidratadas', 'Chocolate o dulces para energía rápida'],
          en: ['Nuts and seed mix', 'Cereal or energy bars', 'Dried fruits', 'Chocolate or candy for quick energy'],
        },
      },
      {
        icon: '🍱',
        title: { es: 'Comidas principales', en: 'Main meals' },
        description: {
          es: 'Para travesías largas, planificá comidas nutritivas y fáciles de preparar.',
          en: 'For long treks, plan nutritious and easy-to-prepare meals.',
        },
        items: {
          es: ['Comidas liofilizadas (livianas y prácticas)', 'Avena instantánea para desayunos', 'Sándwiches o wraps para el almuerzo', 'Sopas y fideos deshidratados'],
          en: ['Freeze-dried meals (lightweight and practical)', 'Instant oatmeal for breakfast', 'Sandwiches or wraps for lunch', 'Dehydrated soups and noodles'],
        },
      },
    ],
  },
];

export default async function TipsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isSpanish ? 'Recomendaciones para la Montaña' : 'Mountain Recommendations'}
        </h1>
        <p className="text-slate-600">
          {isSpanish
            ? 'Consejos esenciales para que tu aventura sea segura y disfrutable.'
            : 'Essential tips to make your adventure safe and enjoyable.'}
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-200">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors"
          >
            <span>{category.icon}</span>
            <span>{isSpanish ? category.title.es : category.title.en}</span>
          </a>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-2xl font-bold text-slate-800">
                {isSpanish ? category.title.es : category.title.en}
              </h2>
            </div>
            <p className="text-slate-600 mb-6 ml-12">
              {isSpanish ? category.description.es : category.description.en}
            </p>

            {/* Tips Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <h3 className="font-semibold text-slate-800">
                      {isSpanish ? tip.title.es : tip.title.en}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {isSpanish ? tip.description.es : tip.description.en}
                  </p>
                  <ul className="space-y-2">
                    {(isSpanish ? tip.items.es : tip.items.en).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">
              {isSpanish ? 'Importante' : 'Important'}
            </h3>
            <p className="text-sm text-amber-700">
              {isSpanish
                ? 'Estas recomendaciones son generales. Cada trekking tiene sus propias exigencias según dificultad, clima y duración. Consultá siempre fuentes locales y evaluá tu nivel de experiencia antes de emprender cualquier aventura.'
                : 'These recommendations are general. Each trek has its own requirements based on difficulty, weather, and duration. Always consult local sources and evaluate your experience level before embarking on any adventure.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
