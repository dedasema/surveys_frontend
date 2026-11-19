import React from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, CreditCard, Activity, Cpu, AlertTriangle, DownloadCloud, Clock, CheckCircle } from "lucide-react";
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
              <span>Condiciones de Servicio &bull; Desesoft S.R.L.</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Términos de Servicio
            </h1>
            <p className="text-gray-600 text-sm">
              Última actualización: 19 de Noviembre de 2026 &bull; Desesoft S.R.L. (Santa Cruz de la Sierra, Bolivia)
            </p>
          </div>

          <div className="prose prose-blue max-w-none space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
            <section className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" /> 1. Aceptación de los Términos
              </h2>
              <p>
                Al registrarse, acceder o utilizar la plataforma de software como servicio <strong>SurveySaaS</strong>, operada y desarrollada por <strong>Desesoft S.R.L.</strong> (Santa Cruz de la Sierra, Bolivia), la organización y sus usuarios designados aceptan cumplir y estar legalmente obligados por estos Términos de Servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" /> 2. Descripción de los Planes
              </h2>
              <p>SurveySaaS ofrece tres modalidades de servicio con las siguientes cuotas y características:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><strong>Plan Gratuito (0 USD):</strong> Hasta 2 campañas activas, 100 entregas o respuestas mensuales, 1 operador de equipo, sin análisis de inteligencia artificial.</li>
                <li><strong>Plan Profesional (29,99 USD/mes):</strong> Hasta 50 campañas activas, 5.000 entregas mensuales, 5 operadores de equipo, con análisis de inteligencia artificial y digitalización OCR.</li>
                <li><strong>Plan Enterprise (99,99 USD/mes):</strong> Campañas ilimitadas, entregas ilimitadas, operadores ilimitados, IA completa, exportación masiva y API para integraciones empresariales.</li>
              </ul>
              <p className="text-xs text-gray-500">
                Los paquetes adicionales de envíos, transcripción y OCR pueden ser contratados como complementos por consumo a través del equipo comercial.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" /> 3. Cuenta y Seguridad
              </h2>
              <p>
                El usuario administrador es el único responsable de salvaguardar la confidencialidad de sus credenciales de acceso (correo y contraseña). Cualquier actividad realizada bajo su cuenta o la de sus operadores se considerará autorizada por la organización. El suscriptor se compromete a notificar de inmediato cualquier sospecha de brecha de seguridad a{" "}
                <a href="mailto:soporte@desesoft.com" className="text-blue-600 hover:underline">
                  soporte@desesoft.com
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" /> 4. Pagos, Renovación y Cancelación
              </h2>
              <p>
                La moneda de referencia para todos los planes comerciales es el <strong>Dólar Estadounidense (USD)</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Métodos de pago:</strong> Se aceptan tarjetas de crédito/débito internacionales mediante Stripe Checkout y pagos en moneda local boliviana (BOB) mediante código QR de PagoFácil, aplicando la conversión al tipo de cambio oficial vigente.</li>
                <li><strong>Renovación y cancelación:</strong> Las suscripciones se renuevan mensualmente de forma automática. El suscriptor puede cancelar su plan en cualquier momento desde su panel de control sin cláusulas de permanencia forzosa ni penalizaciones económicas.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" /> 5. Disponibilidad del Servicio (SLA)
              </h2>
              <p>
                Desesoft S.R.L. se compromete a mantener un objetivo de disponibilidad operativa del <strong>99,5 % mensual</strong> para la plataforma web y la recepción de respuestas, excluyendo ventanas de mantenimiento programadas informadas con anticipación razonable o eventos de fuerza mayor ajenos a su infraestructura en la nube.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> 6. Responsabilidad sobre el Contenido e Interpretación
              </h2>
              <p>
                La organización suscriptora es la propietaria y exclusiva responsable de la legalidad, veracidad y contenido de las encuestas y preguntas que formula, así como de la obtención legítima de datos de contacto de sus destinatarios.
              </p>
              <p>
                Asimismo, la organización asume la total responsabilidad por las conclusiones, decisiones comerciales, operativas o estratégicas tomadas con base en la interpretación de los datos e informes generados por el sistema.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" /> 7. Uso de Inteligencia Artificial
              </h2>
              <p>
                Las herramientas analíticas basadas en inteligencia artificial (Google Gemini) se proveen como asistencia complementaria para agilizar la síntesis cualitativa, la transcripción y el agrupamiento temático. Los análisis automatizados pueden contener discrepancias estadísticas o inferencias probabilísticas, por lo que no constituyen asesoramiento profesional vinculante.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" /> 8. Límite de Responsabilidad
              </h2>
              <p>
                En la máxima medida permitida por la legislación aplicable en el Estado Plurinacional de Bolivia, la responsabilidad total acumulada de Desesoft S.R.L. por cualquier reclamo, daño directo o perjuicio derivado del uso o imposibilidad de uso del software estará estrictamente limitada al monto equivalente a las sumas efectivamente pagadas por el suscriptor durante los <strong>12 meses previos</strong> al evento que originó el reclamo.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DownloadCloud className="h-5 w-5 text-blue-600" /> 9. Exportación de Datos tras la Baja
              </h2>
              <p>
                En caso de cancelación o no renovación de la suscripción, Desesoft S.R.L. garantiza que los datos, cuestionarios y resultados recolectados estarán disponibles para su exportación completa en formatos estándar (CSV/Excel/PDF) durante un período de <strong>30 días calendario</strong> posteriores a la fecha efectiva de baja. Vencido este plazo, los datos se eliminarán de forma segura.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> 10. Modificaciones y Aviso de Cambios
              </h2>
              <p>
                Desesoft S.R.L. podrá actualizar o modificar estos Términos de Servicio para reflejar mejoras en la plataforma o cambios normativos. Cualquier modificación sustancial será notificada a los suscriptores mediante aviso visible en la plataforma o por correo electrónico con al menos <strong>15 días de anticipación</strong> a su entrada en vigor.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
