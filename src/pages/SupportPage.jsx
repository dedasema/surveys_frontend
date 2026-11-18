import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  MessageSquare,
  FileText,
  CreditCard,
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
} from "lucide-react";
import { toast } from "sonner";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    categoria: "tecnica",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      pregunta: "¿Cómo funciona la digitalización de encuestas en papel con OCR?",
      respuesta:
        "Nuestra plataforma te permite imprimir formularios estandarizados con códigos de referencia. Una vez completados a mano por los encuestados, puedes escanearlos o tomarles una fotografía; nuestro motor de OCR con visión artificial extraerá automáticamente las respuestas y las centralizará en tu panel.",
    },
    {
      pregunta: "¿Qué incluye el Asistente de Voz e Inteligencia Artificial?",
      respuesta:
        "Permite realizar o recibir llamadas telefónicas automatizadas donde un agente de IA interactúa en lenguaje natural con el encuestado, transcribe las respuestas en tiempo real y realiza un análisis de sentimientos de cada interacción.",
    },
    {
      pregunta: "¿Cuáles son los métodos de pago disponibles en Bolivia e internacionalmente?",
      respuesta:
        "Aceptamos transferencias bancarias locales en Bolivia, pagos QR y tarjetas de crédito/débito internacionales mediante pasarelas de pago seguras con facturación disponible por parte de Desesoft SRL.",
    },
    {
      pregunta: "¿Puedo cambiar de plan o cancelar en cualquier momento?",
      respuesta:
        "Sí. Puedes actualizar tu plan (Upgrade) o cancelar tu suscripción en cualquier momento desde tu panel de suscriptor sin penalidades ni contratos forzosos.",
    },
    {
      pregunta: "¿Qué nivel de seguridad y privacidad tienen los datos de mis encuestas?",
      respuesta:
        "Toda la información se transmite bajo protocolos encriptados TLS/SSL y se almacena en bases de datos con aislamiento por organización. Desesoft no comercializa ni comparte tus datos ni los de tus encuestados bajo ninguna circunstancia.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "¡Ticket de soporte recibido! Nuestro equipo en Santa Cruz, Bolivia te responderá a la brevedad."
      );
      setFormData({
        nombre: "",
        email: "",
        categoria: "tecnica",
        asunto: "",
        mensaje: "",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-grow">
        {/* HERO / HEADER */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 py-16 px-4 border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <LifeBuoy className="h-4 w-4 text-blue-600" />
              <span>Centro de Ayuda Desesoft</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              ¿En qué podemos ayudarte hoy?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encuentra respuestas rápidas o comunícate directamente con nuestro equipo de soporte técnico en Santa Cruz, Bolivia.
            </p>
          </div>
        </section>

        {/* CATEGORÍAS DE AYUDA */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Canales y Distribución</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configuración de correos masivos, enlaces personalizados y asistentes de voz.
              </p>
              <a href="#faqs" className="text-blue-600 text-sm font-semibold hover:underline">
                Ver preguntas sobre canales &rarr;
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Digitalización OCR</h3>
              <p className="text-gray-600 text-sm mb-4">
                Instrucciones para escanear hojas, formatos aceptados y verificación de datos.
              </p>
              <a href="#faqs" className="text-purple-600 text-sm font-semibold hover:underline">
                Guía de digitalización &rarr;
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Planes y Facturación</h3>
              <p className="text-gray-600 text-sm mb-4">
                Cambio de plan, métodos de pago, facturación boliviana y cuotas mensuales.
              </p>
              <a href="#faqs" className="text-emerald-600 text-sm font-semibold hover:underline">
                Detalles de facturación &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* FORMULARIO DE SOPORTE & INFO DE CONTACTO */}
        <section id="ticket" className="py-12 px-4 bg-gray-50/70 border-y border-gray-100 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Información de contacto */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Soporte Directo</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Contáctanos directamente
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nuestro equipo técnico y de atención al cliente está radicado en Santa Cruz, Bolivia y listo para asistirte en tiempo real.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Correo Electrónico</h4>
                      <a href="mailto:dedasema734012@gmail.com" className="text-blue-600 text-sm hover:underline">
                        dedasema734012@gmail.com
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Respuesta promedio en menos de 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Teléfono / WhatsApp</h4>
                      <a href="tel:+59162795140" className="text-gray-700 text-sm font-medium hover:text-emerald-600 transition-colors">
                        +591 62795140
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Atención en horario de oficina y soporte 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Horario de Atención</h4>
                      <p className="text-gray-700 text-sm">Lunes a Viernes: 08:30 - 18:30</p>
                      <p className="text-xs text-gray-500 mt-0.5">Hora de Bolivia (GMT-4)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Oficina Principal & Sede</h4>
                      <p className="text-gray-700 text-sm">Manzana 40 - Plaza Empresarial, Av. San Martin, Santa Cruz de la Sierra</p>
                      <p className="text-xs text-gray-500 mt-0.5">Desesoft SRL &bull; Bolivia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de Ticket */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enviar un Ticket de Soporte</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Completa el formulario y un especialista de Desesoft revisará tu caso.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Correo de Contacto *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="tu@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Categoría
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all outline-none"
                      >
                        <option value="tecnica">Soporte Técnico / Errores</option>
                        <option value="ocr">OCR y Digitalización de Papel</option>
                        <option value="ia">Asistente de Voz e IA</option>
                        <option value="facturacion">Planes y Facturación</option>
                        <option value="otro">Consulta General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Asunto
                      </label>
                      <input
                        type="text"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Breve descripción del caso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Mensaje / Descripción del problema *
                    </label>
                    <textarea
                      name="mensaje"
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="Explícanos con detalle cómo podemos ayudarte..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Enviando..." : "Enviar Solicitud de Soporte"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES (FAQS) */}
        <section id="faqs" className="py-20 px-4 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <HelpCircle className="h-4 w-4" />
                <span>Base de Conocimiento</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Preguntas Frecuentes</h2>
              <p className="text-gray-600">Respuestas rápidas a las consultas más comunes de nuestros usuarios</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      <span className="text-base">{faq.pregunta}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
                        {faq.respuesta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
