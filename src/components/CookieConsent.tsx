'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Props = {
  locale: string;
};

export default function CookieConsent({ locale }: Props) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Enable analytics after consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const isSpanish = locale === 'es';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          {isSpanish ? (
            <>
              Usamos cookies para mejorar tu experiencia.{' '}
              <Link href="/privacy" className="text-slate-700 underline hover:text-slate-900">
                Más información
              </Link>
            </>
          ) : (
            <>
              We use cookies to improve your experience.{' '}
              <Link href="/privacy" className="text-slate-700 underline hover:text-slate-900">
                Learn more
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isSpanish ? 'Rechazar' : 'Decline'}
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            {isSpanish ? 'Aceptar' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
