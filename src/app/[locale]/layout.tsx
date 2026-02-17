import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  const title = isSpanish
    ? 'Trekkings World - Guías de Trekking en Argentina, Chile y más'
    : 'Trekkings World - Trekking Guides in Argentina, Chile and more';

  const description = isSpanish
    ? 'Descubre las mejores rutas de trekking en Patagonia, Mendoza, Ushuaia y más. Guías detalladas, mapas, consejos y toda la información que necesitas para tu próxima aventura.'
    : 'Discover the best trekking routes in Patagonia, Mendoza, Ushuaia and more. Detailed guides, maps, tips and all the information you need for your next adventure.';

  return {
    title: {
      default: title,
      template: `%s | Trekkings World`,
    },
    description,
    keywords: isSpanish
      ? ['trekking', 'senderismo', 'patagonia', 'argentina', 'chile', 'montaña', 'aventura', 'rutas', 'fitz roy', 'torres del paine']
      : ['trekking', 'hiking', 'patagonia', 'argentina', 'chile', 'mountain', 'adventure', 'trails', 'fitz roy', 'torres del paine'],
    authors: [{ name: 'Trekkings World' }],
    creator: 'Trekkings World',
    publisher: 'Trekkings World',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://trekkingsworld.com'),
    alternates: {
      canonical: '/',
      languages: {
        'es': '/es',
        'en': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: 'Trekkings World',
      locale: locale === 'es' ? 'es_AR' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Trekkings World',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-gray-50">
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          {/* Header - full width at top */}
          <Header locale={locale} />

          <div className="flex">
            {/* Sidebar - fixed on desktop, hidden on mobile */}
            <Sidebar
              locale={locale}
              className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto"
            />

            {/* Main content area */}
            <div className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] flex flex-col">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </div>

          <CookieConsent locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
