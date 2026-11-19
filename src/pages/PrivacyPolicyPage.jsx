import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, FileText, Database, KeyRound, Cpu, HelpCircle, CheckCircle2 } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Transparencia y Seguridad &bull; Desesoft S.R.L.</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-gray-600 text-sm">
              Última actualización: 19 de Noviembre de 2026 &bull; Desesoft S.R.L. (Santa Cruz de la Sierra, Bolivia)
            </p>
          </div>

          <div className="prose prose-blue max-w-none space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
            <section className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" /> 1. Compromiso de Privacidad y Alcance
              </h2>
              <p>
                En <strong>Desesoft S.R.L.</strong>, empresa legalmente constituida en Santa Cruz de la Sierra, Bolivia, protegemos la privacidad y confidencialidad de los datos de nuestros suscriptores y de los participantes que responden encuestas a través de nuestra plataforma <strong>SurveySaaS</strong>. Esta Política describe las condiciones bajo las cuales se tratan los datos personales.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> 2. Datos que se Recolectan
              </h2>
              <p>Recopilamos únicamente la información necesaria para la operación y prestación del servicio:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Datos de cuenta y suscripción:</strong> Nombre completo, correo electrónico, nombre de la empresa u organización, cargo y contraseña almacenada mediante hash criptográfico unidireccional.</li>
                <li><strong>Datos de encuestas y respuestas:</strong> Preguntas estructuradas creadas por las organizaciones y respuestas emitidas por los participantes (selección múltiple, respuestas textuales, digitalizaciones de formularios impresos por OCR y grabaciones de audio en encuestas de voz).</li>
                <li><strong>Metadatos técnicos de entrega:</strong> Fecha y hora de recepción, identificador de entrega o token de acceso único, estado de finalización y dirección IP temporal con propósitos exclusivos de prevención de fraude y doble votación.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" /> 3. Finalidad del Tratamiento
              </h2>
              <p>Los datos recolectados se utilizan estrictamente para:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>Permitir a las organizaciones diseñar, distribuir y centralizar los resultados de sus campañas de recolección de información.</li>
                <li>Procesar y tabular respuestas cuantitativas y cualitativas para generar reportes estadísticos y tableros de control.</li>
                <li>Garantizar el soporte técnico, la autenticación de usuarios y la seguridad operativa de la infraestructura.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" /> 4. Procesamiento con Inteligencia Artificial (Gemini)
              </h2>
              <p>
                SurveySaaS integra modelos de inteligencia artificial de última generación de <strong>Google Gemini</strong> para la categorización semántica de respuestas abiertas, análisis cualitativo y transcripción de voz a texto.
              </p>
              <p>
                Declaramos formalmente que <strong>ningún dato personal, contenido de encuesta ni audio es utilizado para reentrenar modelos públicos de terceros ni comercializado</strong>. Las consultas se realizan mediante APIs empresariales en entornos cerrados, preservando el aislamiento total de la información por organización.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" /> 5. Retención y Custodia de Datos
              </h2>
              <p>
                Los datos se conservan mientras la organización mantenga su cuenta o suscripción activa. En caso de baja o cancelación del servicio, la información permanecerá disponible para su exportación completa durante un plazo de <strong>30 días calendario</strong>, tras el cual se procederá a su eliminación segura de los servidores operativos de producción.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-600" /> 6. Medidas de Seguridad
              </h2>
              <p>
                Desesoft S.R.L. implementa salvaguardas técnicas, administrativas y físicas rigurosas para prevenir el acceso no autorizado, alteración o pérdida de datos. Nuestras medidas de seguridad incluyen:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600 font-medium">
                <li>HTTPS en el sitio web para proteger la navegación de usuarios y participantes.</li>
                <li>Cifrado en reposo de los respaldos con AES-256 en almacenamiento seguro.</li>
                <li>Autenticación con JWT (JSON Web Tokens) con expiración programada e invalidación de sesión.</li>
                <li>Control de acceso por roles (Superadmin, Administrador de Empresa y Operador de Campo) con principio de menor privilegio.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" /> 7. Derechos ARCO y Cómo Ejercerlos
              </h2>
              <p>
                Los titulares de los datos tienen derecho en todo momento al <strong>Acceso, Rectificación, Cancelación/Eliminación y Oposición (Derechos ARCO)</strong> sobre su información personal.
              </p>
              <p>
                Estos derechos se pueden ejercer a través de nuestro formulario oficial en{" "}
                <Link to="/soporte?tipo=derechos_datos" className="text-blue-600 hover:underline font-semibold">
                  /soporte (seleccionando el tipo "Derechos sobre mis datos")
                </Link>{" "}
                o enviando una solicitud formal a nuestro correo electrónico{" "}
                <a href="mailto:soporte@desesoft.com" className="text-blue-600 hover:underline font-semibold">
                  soporte@desesoft.com
                </a>
                . Atendemos y resolvemos todas las solicitudes en un plazo máximo de <strong>10 días hábiles</strong>.
              </p>
            </section>

            <section className="bg-blue-50/60 p-6 rounded-2xl border border-blue-200 space-y-3">
              <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" /> 8. Aviso de Consentimiento en Encuestas Públicas
              </h2>
              <p className="text-sm text-blue-900">
                En todas las encuestas públicas desplegadas por SurveySaaS, antes de presentar la primera pregunta, se solicita el consentimiento libre, previo e informado del participante mediante una casilla de aceptación obligatoria vinculada a esta Política.
              </p>
              <p className="text-sm text-blue-900 font-medium">
                Si la encuesta incluye preguntas de voz, el aviso de consentimiento advierte de manera expresa sobre la grabación y transcripción del audio para el análisis exclusivo de la organización responsable del estudio.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
