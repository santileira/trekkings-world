import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
      </h1>

      <div className="prose prose-slate max-w-none">
        {isSpanish ? (
          <>
            <p className="text-slate-600 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Información que Recopilamos</h2>
            <p className="text-slate-600 mb-4">
              En Trekkings World, recopilamos información limitada para mejorar tu experiencia:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Datos de uso anónimos (páginas visitadas, tiempo en el sitio)</li>
              <li>Información del dispositivo y navegador</li>
              <li>Cookies para preferencias de idioma</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Uso de Cookies</h2>
            <p className="text-slate-600 mb-4">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Recordar tu preferencia de idioma</li>
              <li>Analizar el tráfico del sitio (Google Analytics)</li>
              <li>Mostrar publicidad relevante</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Compartir Información</h2>
            <p className="text-slate-600 mb-4">
              No vendemos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Proveedores de análisis (Google Analytics)</li>
              <li>Servicios de publicidad</li>
              <li>Cuando sea requerido por ley</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Tus Derechos</h2>
            <p className="text-slate-600 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Optar por no recibir cookies no esenciales</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Contacto</h2>
            <p className="text-slate-600 mb-4">
              Para consultas sobre privacidad, contactanos en: santiagoleira10@gmail.com o al teléfono +5491135219400
            </p>
          </>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 mb-4">
              At Trekkings World, we collect limited information to improve your experience:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Anonymous usage data (pages visited, time on site)</li>
              <li>Device and browser information</li>
              <li>Cookies for language preferences</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Use of Cookies</h2>
            <p className="text-slate-600 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Remember your language preference</li>
              <li>Analyze site traffic (Google Analytics)</li>
              <li>Display relevant advertising</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-slate-600 mb-4">
              We do not sell or share your personal information with third parties, except:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Analytics providers (Google Analytics)</li>
              <li>Advertising services</li>
              <li>When required by law</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Your Rights</h2>
            <p className="text-slate-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of non-essential cookies</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Contact</h2>
            <p className="text-slate-600 mb-4">
              For privacy inquiries, contact us at: santiagoleira10@gmail.com or by phone at +5491135219400
            </p>
          </>
        )}
      </div>
    </div>
  );
}
