import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { enviarContacto } from "../services/api";

export default function SupportPage() {
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    categoria: "tecnica",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tipoParam = searchParams.get("tipo");
    if (tipoParam) {
      const normalized = tipoParam.toLowerCase();
      if (normalized === "comercial") {
        setFormData((prev) => ({ ...prev, categoria: "comercial" }));
      } else if (normalized.includes("derecho") || normalized.includes("datos")) {
        setFormData((prev) => ({ ...prev, categoria: "derechos_datos" }));
      }
    }
  }, [searchParams]);

  const faqs = [
    {
      pregunta: "¿Cómo crear una campaña de encuestas?",
      respuesta:
        "Inicia sesión en tu cuenta de suscriptor, dirígete al módulo de Campañas y haz clic en 'Nueva Campaña'. Podrás elegir una plantilla prediseñada o crear preguntas desde cero (texto, opción múltiple, grabación de voz o cuestionario imprimible para OCR), definir las fechas de vigencia y seleccionar los canales de entrega.",
    },
    {
      pregunta: "¿Cómo se envían las encuestas a los participantes?",
      respuesta:
        "SurveySaaS permite distribución multicanal: puedes enviar enlaces directos por correo electrónico a tus listas de destinatarios, compartir un enlace público web o QR para responder desde cualquier navegador, o imprimir hojas físicas con códigos QR para captura en campo mediante nuestra app móvil.",
    },
    {
      pregunta: "¿Cómo funciona el plan gratuito?",
      respuesta:
        "El plan Gratuito te permite comenzar sin costo ni tarjeta de crédito. Incluye hasta 2 campañas activas, 100 respuestas o entregas mensuales, 1 operador de equipo y acceso a recolección por correo y web. Es ideal para probar la plataforma y realizar proyectos pequeños.",
    },
    {
      pregunta: "¿Cómo descargar la aplicación móvil offline?",
      respuesta:
        "Puedes acceder a la sección /descargar-app desde tu dispositivo Android o escanear el código QR que se encuentra en esa página para descargar directamente el archivo APK de SurveySaaS Móvil. La app permite recolectar respuestas sin conexión a internet y sincronizarlas automáticamente cuando recuperes señal.",
    },
    {
      pregunta: "¿Cómo ejercer mis derechos sobre mis datos personales?",
      respuesta:
        "Puedes ejercer tus derechos de acceso, rectificación, objeción y eliminación (ARCO) completando el formulario de esta misma página seleccionando el tipo 'Derechos sobre mis datos' o escribiendo directamente a nuestro correo oficial. Atendemos todas las solicitudes en un plazo máximo de 10 días hábiles.",
    },
    {
      pregunta: "¿Cómo contactar al equipo de soporte técnico?",
      respuesta:
        "Puedes enviar un ticket usando el formulario de esta página seleccionando 'Soporte técnico', o escribir directamente a soporte@desesoft.com. Nuestro equipo en Santa Cruz de la Sierra (Bolivia) atiende solicitudes de lunes a viernes de 9:00 a 18:00 y monitorea incidencias críticas de forma continua.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullMessage = formData.asunto
        ? `[${formData.categoria.toUpperCase()}] ${formData.asunto.trim()}: ${formData.mensaje.trim()}`
        : `[${formData.categoria.toUpperCase()}] ${formData.mensaje.trim()}`;

      const tipoMapeado =
        formData.categoria === "derechos_datos"
          ? "derechos sobre datos"
          : formData.categoria === "comercial"
          ? "comercial"
          : "soporte técnico";

      await enviarContacto({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        empresa: formData.empresa ? formData.empresa.trim() : null,
        origen: "producto",
        tipo: tipoMapeado,
        mensaje: fullMessage,
      });

      toast.success(
        "¡Ticket de soporte recibido! Nuestro equipo en Santa Cruz, Bolivia te responderá a la brevedad."
      );
      setFormData({
        nombre: "",
        email: "",
        empresa: "",
        categoria: "tecnica",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      toast.error(err.message || "Error al enviar la solicitud de soporte. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
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
                Configuración de correos masivos, enlaces personalizados y grabación de voz.
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
                        placeholder="tu@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Empresa (Opcional)
                      </label>
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Tipo de Solicitud *
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all outline-none font-medium"
                      >
                        <option value="tecnica">Soporte técnico</option>
                        <option value="comercial">Comercial</option>
                        <option value="derechos_datos">Derechos sobre mis datos</option>
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

                  {formData.categoria === "derechos_datos" && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-start gap-3 shadow-xs">
                      <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Atendemos solicitudes de acceso, rectificación, objeción y eliminación de tus datos en un plazo máximo de 10 días hábiles.
                      </p>
                    </div>
                  )}

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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
