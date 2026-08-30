import React from "react";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
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
              <span>Transparencia y Seguridad &bull; Desesoft</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-gray-600 text-sm">
              Última actualización: Agosto de 2026 &bull; Desesoft SRL (Santa Cruz de la Sierra, Bolivia)
            </p>
          </div>

          <div className="prose prose-blue max-w-none space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
            <section className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" /> 1. Compromiso de Privacidad de Desesoft
              </h2>
              <p>
                En <strong>Desesoft SRL</strong>, con domicilio legal en Santa Cruz de la Sierra, Bolivia, valoramos profundamente la confianza de nuestros usuarios y clientes. Esta Política de Privacidad describe cómo recopilamos, procesamos, almacenamos y protegemos la información a través de la plataforma <strong>SurveySaaS</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">2. Información que Recopilamos</h2>
              <p>Recopilamos únicamente los datos necesarios para brindar y optimizar nuestros servicios:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Datos de Cuenta:</strong> Nombre, dirección de correo electrónico, nombre de empresa o institución y credenciales de acceso seguras (hash encriptado).</li>
                <li><strong>Datos de Encuestas y Respuestas:</strong> Preguntas formuladas, respuestas proporcionadas por encuestados (digitales, transcripciones de voz o digitalizadas por OCR).</li>
                <li><strong>Datos de Uso y Logs Técnicos:</strong> Direcciones IP, navegador, fecha y hora de peticiones con fines exclusivos de auditoría de seguridad.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">3. Tratamiento de Modelos de IA y OCR</h2>
              <p>
                Garantizamos que los datos, documentos escaneados y audios procesados a través de nuestros motores de Visión por Computadora (OCR) y Modelos de Lenguaje (IA) <strong>NUNCA son utilizados para reentrenar modelos públicos de terceros ni compartidos con fines publicitarios</strong>. El procesamiento ocurre en canales cerrados con aislamiento por suscriptor.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">4. Almacenamiento y Seguridad de Datos</h2>
              <p>
                Toda la información se cifra en tránsito mediante TLS 1.3 y en reposo mediante algoritmos AES-256. Mantenemos copias de seguridad continuas y controles estrictos de acceso basados en roles de usuario.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">5. Derechos de los Titulares</h2>
              <p>
                Como usuario o suscriptor, tienes derecho en cualquier momento a acceder, rectificar, exportar o solicitar la eliminación total de tus encuestas y datos almacenados comunicándote con nuestro Delegado de Protección de Datos a <a href="mailto:privacidad@desesoft.com" className="text-blue-600 hover:underline">privacidad@desesoft.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
