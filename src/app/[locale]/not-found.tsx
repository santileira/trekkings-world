'use client';

import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

const content = {
  es: {
    title: 'Página no encontrada',
    description: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
    button: 'Volver al inicio',
  },
  en: {
    title: 'Page not found',
    description: "Sorry, the page you're looking for doesn't exist or has been moved.",
    button: 'Back to home',
  },
};

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = content[locale] || content.es;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mt-4">
          {t.title}
        </h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          {t.description}
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            {t.button}
          </Link>
        </div>
      </div>
    </div>
  );
}
