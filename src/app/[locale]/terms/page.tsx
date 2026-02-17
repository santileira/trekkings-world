import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        {isSpanish ? 'Términos y Condiciones' : 'Terms and Conditions'}
      </h1>

      <div className="prose prose-slate max-w-none">
        {isSpanish ? (
          <>
            <p className="text-slate-600 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Aceptación de Términos</h2>
            <p className="text-slate-600 mb-4">
              Al acceder y utilizar Trekkings World, aceptas estos términos y condiciones en su totalidad.
              Si no estás de acuerdo con alguna parte, no debes usar este sitio.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Uso del Contenido</h2>
            <p className="text-slate-600 mb-4">
              El contenido de este sitio es solo para fines informativos. La información sobre rutas de trekking
              se proporciona como guía general y puede cambiar sin previo aviso.
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Las condiciones de los senderos pueden variar según la temporada y el clima</li>
              <li>Los tiempos de duración son estimados y pueden variar según la condición física</li>
              <li>Siempre verifica las condiciones actuales antes de emprender un trekking</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Descargo de Responsabilidad</h2>
            <p className="text-slate-600 mb-4">
              <strong>IMPORTANTE:</strong> El trekking y las actividades al aire libre conllevan riesgos inherentes.
              Trekkings World no se hace responsable de:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Accidentes o lesiones durante las actividades</li>
              <li>Información desactualizada sobre rutas o condiciones</li>
              <li>Decisiones tomadas basándose en el contenido de este sitio</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Siempre consulta con guías locales y autoridades antes de realizar cualquier trekking.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Propiedad Intelectual</h2>
            <p className="text-slate-600 mb-4">
              Todo el contenido, diseño y código de este sitio es propiedad de Trekkings World,
              excepto cuando se indique lo contrario. Las imágenes pueden estar sujetas a derechos de terceros.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Enlaces Externos</h2>
            <p className="text-slate-600 mb-4">
              Este sitio contiene enlaces a sitios externos. No somos responsables del contenido
              o las prácticas de privacidad de estos sitios.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Modificaciones</h2>
            <p className="text-slate-600 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios entrarán en vigor inmediatamente después de su publicación.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">7. Contacto</h2>
            <p className="text-slate-600 mb-4">
              Para consultas sobre estos términos, contactanos en: legal@trekkingsworld.com
            </p>
          </>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing and using Trekkings World, you accept these terms and conditions in full.
              If you disagree with any part, you must not use this site.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Use of Content</h2>
            <p className="text-slate-600 mb-4">
              The content on this site is for informational purposes only. Information about trekking routes
              is provided as a general guide and may change without notice.
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Trail conditions may vary depending on season and weather</li>
              <li>Duration times are estimates and may vary based on fitness level</li>
              <li>Always verify current conditions before embarking on a trek</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Disclaimer</h2>
            <p className="text-slate-600 mb-4">
              <strong>IMPORTANT:</strong> Trekking and outdoor activities carry inherent risks.
              Trekkings World is not responsible for:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Accidents or injuries during activities</li>
              <li>Outdated information about routes or conditions</li>
              <li>Decisions made based on this site&apos;s content</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Always consult with local guides and authorities before undertaking any trek.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-slate-600 mb-4">
              All content, design, and code on this site is the property of Trekkings World,
              unless otherwise indicated. Images may be subject to third-party rights.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. External Links</h2>
            <p className="text-slate-600 mb-4">
              This site contains links to external sites. We are not responsible for the content
              or privacy practices of these sites.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Modifications</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to modify these terms at any time.
              Changes will take effect immediately upon publication.
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">7. Contact</h2>
            <p className="text-slate-600 mb-4">
              For inquiries about these terms, contact us at: legal@trekkingsworld.com
            </p>
          </>
        )}
      </div>
    </div>
  );
}
