import React from "react";
import { FileText } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Condiciones Legales &bull; Desesoft</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Términos de Servicio
            </h1>
            <p className="text-gray-600 text-sm">
              Última actualización: Agosto de 2026 &bull; Desesoft SRL (Santa Cruz de la Sierra, Bolivia)
            </p>
          </div>

          <div className="prose prose-blue max-w-none space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
            <section className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar la plataforma <strong>SurveySaaS</strong> desarrollada y operada por <strong>Desesoft SRL</strong> (Santa Cruz, Bolivia), usted acepta estar legalmente sujeto a los presentes Términos de Servicio y a todas las leyes y regulaciones aplicables.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">2. Uso Aceptable de la Plataforma</h2>
              <p>
                El usuario se compromete a no utilizar los servicios para recopilar información ilícita, suplantar identidad, realizar campañas de spam no autorizadas o vulnerar derechos fundamentales de terceros. Desesoft se reserva el derecho de suspender cuentas que infrinjan estas directrices.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">3. Suscripciones, Cuotas y Facturación</h2>
              <p>
                Los planes comerciales se rigen por las cuotas mensuales de respuestas, operadores y plantillas especificadas al momento de la contratación. Las facturas son emitidas por Desesoft SRL conforme a la normativa tributaria boliviana o facturación internacional según el país del suscriptor.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">4. Propiedad Intelectual</h2>
              <p>
                El software, arquitectura, algoritmos de OCR, diseños e interfaces de SurveySaaS son propiedad exclusiva de Desesoft SRL. Todos los datos, marcas y contenidos recolectados dentro de las encuestas pertenecen íntegramente al suscriptor.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">5. Jurisdicción y Ley Aplicable</h2>
              <p>
                Estos términos se rigen e interpretan de acuerdo con las leyes del Estado Plurinacional de Bolivia. Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de la ciudad de Santa Cruz de la Sierra.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
