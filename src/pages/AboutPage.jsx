import React from "react";
import {
  Building2,
  MapPin,
  Target,
  Eye,
  Users,
  Cpu,
  ShieldCheck,
  Globe2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-grow">
        {/* HERO / HEADER */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 py-20 px-4 border-b border-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-100/80 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Desesoft SRL &bull; Santa Cruz, Bolivia</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Tecnología de Vanguardia nacida en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Santa Cruz de la Sierra
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              En <strong className="text-gray-900 font-semibold">Desesoft</strong> desarrollamos plataformas SaaS de alto impacto, combinando inteligencia artificial, digitalización OCR y recolección multicanal para transformar datos en decisiones estratégicas.
            </p>
          </div>
        </section>

        {/* QUIÉNES SOMOS & HISTORIA & SEDE */}
        <section id="ubicacion" className="py-20 px-4 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wider uppercase">
                  <Building2 className="h-4 w-4" />
                  <span>Sobre Nosotros</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Ingeniería de software con visión global y corazón boliviano
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Fundada en Santa Cruz de la Sierra, <strong>Desesoft</strong> nació con la convicción de que las empresas de Bolivia y Latinoamérica merecen software empresarial de clase mundial, sin intermediarios costosos ni tecnologías obsoletas.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Con <strong>SurveySaaS</strong>, resolvimos el desafío de integrar en una sola plataforma la recolección de campo física (encuestas en papel con reconocimiento OCR de ultra precisión), digital (correos y enlaces interactivos) y conversacional (llamadas telefónicas y asistentes de voz con IA).
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">+500K</div>
                    <div className="text-sm text-gray-600 font-medium">Respuestas Procesadas</div>
                  </div>
                  <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                    <div className="text-3xl font-extrabold text-purple-600 mb-1">99.8%</div>
                    <div className="text-sm text-gray-600 font-medium">Precisión de OCR e IA</div>
                  </div>
                </div>
              </div>

              {/* Card visual / oficina */}
              <div className="relative">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-white/20">
                    <div>
                      <h3 className="text-2xl font-bold">Desesoft SRL</h3>
                      <p className="text-blue-200 text-sm">Sede Central Corporativa</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <MapPin className="h-7 w-7 text-yellow-300" />
                    </div>
                  </div>

                  <div className="space-y-4 text-blue-50 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Ubicación & Sede:</strong>
                        <span>Manzana 40 - Plaza Empresarial, Av. San Martin, Santa Cruz de la Sierra, Bolivia</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cpu className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Especialidad:</strong>
                        <span>SaaS Empresarial, Visión Artificial OCR, IA Generativa y Multicanal</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe2 className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Alcance:</strong>
                        <span>Operaciones e infraestructura en la nube para Bolivia e Hispanoamérica</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-blue-200">
                    <span>Comprometidos con el desarrollo tecnológico</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-white font-semibold">100% Cloud</span>
                  </div>
                </div>

                {/* Mapa Corporativo */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg h-52">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2140.020440357915!2d-63.19898350970343!3d-17.756734352519935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e70cca02d2c7%3A0x51870ea50241886c!2sManzana%2040%20-%20Plaza%20Empresarial!5e0!3m2!1ses-419!2sbo!4v1794988673274!5m2!1ses-419!2sbo"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Ubicación Manzana 40 - Sobre Nosotros"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISIÓN & VISIÓN */}
        <section id="mision" className="py-20 px-4 bg-gray-50/70 border-y border-gray-100 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nuestros Pilares</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Guiados por principios de excelencia técnica, transparencia y satisfacción del usuario
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Misión */}
              <div className="bg-white p-8 rounded-3xl shadow-xs border border-gray-200 hover:shadow-md transition-shadow">
                <div className="bg-blue-100 text-blue-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                <p className="text-gray-600 leading-relaxed">
                  Empoderar a empresas e instituciones públicas y privadas con herramientas de recolección de datos y automatización de procesos sin fricción técnica, reduciendo los tiempos de análisis de semanas a minutos gracias a la inteligencia artificial.
                </p>
              </div>

              {/* Visión */}
              <div className="bg-white p-8 rounded-3xl shadow-xs border border-gray-200 hover:shadow-md transition-shadow">
                <div className="bg-indigo-100 text-indigo-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consolidarnos como el referente tecnológico líder en software de analítica, encuestas multicanal y visión por computadora en la región, impulsando la innovación desde Bolivia hacia el mercado global.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Lo que define cada línea de código y cada interacción con nuestros clientes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-xs hover:border-blue-200 transition-colors">
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Privacidad y Seguridad</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tratamiento ético y riguroso de la información bajo estándares internacionales de encriptación y protección de datos.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-xs hover:border-blue-200 transition-colors">
                <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Innovación Continua</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Evolución permanente incorporando los últimos avances en modelos de lenguaje y visión artificial aplicados al mundo real.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-xs hover:border-blue-200 transition-colors">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Cercanía y Soporte Humano</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompañamiento personalizado y directo a nuestros suscriptores con respuestas claras y soporte técnico dedicado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">¿Listo para transformar la gestión de encuestas en tu empresa?</h2>
            <p className="text-blue-100 text-lg">
              Comienza hoy mismo con nuestra prueba gratuita o comunícate con el equipo de Desesoft en Santa Cruz, Bolivia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a
                href="/register"
                className="bg-white text-blue-700 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-md inline-flex items-center justify-center"
              >
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/soporte"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold transition-all inline-flex items-center justify-center"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
