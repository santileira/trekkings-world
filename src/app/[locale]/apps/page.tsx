import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

const TREKKING_APPS = [
  {
    name: 'Wikiloc',
    icon: '🗺️',
    url: 'https://www.wikiloc.com/',
    appStore: 'https://apps.apple.com/app/wikiloc-outdoor-navigation-gps/id432102730',
    playStore: 'https://play.google.com/store/apps/details?id=com.wikiloc.wikilocandroid',
    pros: {
      es: ['Comunidad grande', 'Rutas compartidas por usuarios', 'Gratis'],
      en: ['Large community', 'User-shared routes', 'Free'],
    },
    cons: {
      es: ['Algunas funciones premium', 'Interfaz algo antigua'],
      en: ['Some premium features', 'Somewhat dated interface'],
    },
  },
  {
    name: 'AllTrails',
    icon: '🥾',
    url: 'https://www.alltrails.com/',
    appStore: 'https://apps.apple.com/app/alltrails-hike-bike-run/id405075943',
    playStore: 'https://play.google.com/store/apps/details?id=com.alltrails.alltrails',
    pros: {
      es: ['400k+ rutas', 'Reseñas detalladas', 'Interfaz moderna'],
      en: ['400k+ routes', 'Detailed reviews', 'Modern interface'],
    },
    cons: {
      es: ['Suscripción cara', 'Menos rutas en Latinoamérica'],
      en: ['Expensive subscription', 'Fewer routes in Latin America'],
    },
  },
  {
    name: 'Gaia GPS',
    icon: '🧭',
    url: 'https://www.gaiagps.com/',
    appStore: 'https://apps.apple.com/app/gaia-gps-offroad-hiking-maps/id1201979492',
    playStore: 'https://play.google.com/store/apps/details?id=com.trailbehind.android.gaiagps.pro',
    pros: {
      es: ['Mapas topográficos', 'Navegación offline', 'Profesional'],
      en: ['Topographic maps', 'Offline navigation', 'Professional'],
    },
    cons: {
      es: ['Precio alto', 'Curva de aprendizaje'],
      en: ['High price', 'Learning curve'],
    },
  },
  {
    name: 'Komoot',
    icon: '📍',
    url: 'https://www.komoot.com/',
    appStore: 'https://apps.apple.com/app/komoot-bike-hike-mtb/id447374873',
    playStore: 'https://play.google.com/store/apps/details?id=de.komoot.android',
    pros: {
      es: ['Planificador inteligente', 'Navegación por voz', 'Gratis básico'],
      en: ['Smart planner', 'Voice navigation', 'Basic free'],
    },
    cons: {
      es: ['Mapas premium de pago', 'Menos comunidad'],
      en: ['Premium maps paid', 'Smaller community'],
    },
  },
  {
    name: 'Maps.me',
    icon: '🌍',
    url: 'https://maps.me/',
    appStore: 'https://apps.apple.com/app/maps-me-offline-map-nav/id510623322',
    playStore: 'https://play.google.com/store/apps/details?id=com.mapswithme.maps.pro',
    pros: {
      es: ['100% gratis', 'Offline completo', 'Muy ligera'],
      en: ['100% free', 'Fully offline', 'Very lightweight'],
    },
    cons: {
      es: ['Menos rutas de trekking', 'Sin funciones avanzadas'],
      en: ['Fewer trekking routes', 'No advanced features'],
    },
  },
];

export default async function AppsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isSpanish ? 'Apps de Trekking' : 'Trekking Apps'}
        </h1>
        <p className="text-slate-600">
          {isSpanish
            ? 'Compara las mejores apps para planificar y navegar tus aventuras al aire libre.'
            : 'Compare the best apps for planning and navigating your outdoor adventures.'}
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-4 font-semibold text-slate-700 border-b border-slate-200">
                App
              </th>
              <th className="text-left p-4 font-semibold text-slate-700 border-b border-slate-200">
                {isSpanish ? 'Pros' : 'Pros'}
              </th>
              <th className="text-left p-4 font-semibold text-slate-700 border-b border-slate-200">
                {isSpanish ? 'Contras' : 'Cons'}
              </th>
              <th className="text-left p-4 font-semibold text-slate-700 border-b border-slate-200">
                {isSpanish ? 'Descargar' : 'Download'}
              </th>
            </tr>
          </thead>
          <tbody>
            {TREKKING_APPS.map((app, index) => (
              <tr
                key={app.name}
                className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
              >
                <td className="p-4 border-b border-slate-200">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-slate-600"
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="font-medium text-slate-900">{app.name}</span>
                  </a>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <ul className="space-y-1">
                    {(isSpanish ? app.pros.es : app.pros.en).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <ul className="space-y-1">
                    {(isSpanish ? app.cons.es : app.cons.en).map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-red-400 mt-0.5">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <div className="flex flex-col gap-2">
                    <a
                      href={app.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      iOS
                    </a>
                    <a
                      href={app.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      Android
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {TREKKING_APPS.map((app) => (
          <div key={app.name} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{app.icon}</span>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-slate-900 hover:text-slate-600"
              >
                {app.name}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {isSpanish ? 'Pros' : 'Pros'}
                </h4>
                <ul className="space-y-1">
                  {(isSpanish ? app.pros.es : app.pros.en).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-sm text-slate-700">
                      <span className="text-green-500">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {isSpanish ? 'Contras' : 'Cons'}
                </h4>
                <ul className="space-y-1">
                  {(isSpanish ? app.cons.es : app.cons.en).map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-sm text-slate-700">
                      <span className="text-red-400">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <a
                href={app.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                iOS
              </a>
              <a
                href={app.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Android
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
