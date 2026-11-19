import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Building2,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Printer,
  ChevronRight,
  Layers,
  Sparkles,
  Users,
  Send,
  BarChart3,
  Brain,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Mic,
  Camera,
  WifiOff,
  HelpCircle,
  FileText,
} from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function UserManualPage() {
  const [activeRole, setActiveRole] = useState("empresa"); // "empresa" | "operador"
  const [activeSection, setActiveSection] = useState("intro");

  // Scroll to section helper
  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div className="print:hidden">
        <PublicNavbar />
      </div>

      {/* HERO DEL MANUAL */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 px-4 border-b border-slate-800 print:bg-white print:text-black print:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-400/30 print:hidden">
                <BookOpen className="w-3.5 h-3.5" />
                Documentación y Manual Oficial
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Manual de Usuario <span className="text-blue-400">SurveySaaS</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed print:text-gray-700">
                Guía integral y paso a paso para la gestión de encuestas multicanal, recolección de datos en terreno,
                digitalización OCR y analítica predictiva asistida por Inteligencia Artificial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/20 shadow-xs hover:shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <Link
                to="/soporte"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Centro de Soporte</span>
              </Link>
            </div>
          </div>

          {/* SELECTOR DE ROL */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap gap-4 print:hidden">
            <button
              type="button"
              onClick={() => {
                setActiveRole("empresa");
                setActiveSection("empresa-dashboard");
              }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeRole === "empresa"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <Building2 className="w-5 h-5 text-blue-300" />
              <span>Rol: Empresa (Suscriptor)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole("operador");
                setActiveSection("operador-app");
              }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeRole === "operador"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <Smartphone className="w-5 h-5 text-emerald-300" />
              <span>Rol: Operador de Campo (App Móvil)</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* TABLA DE CONTENIDO (STICKY SIDEBAR) */}
          <aside className="lg:col-span-1 print:hidden">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Índice del Manual ({activeRole === "empresa" ? "Empresa" : "Operador"})
              </h3>

              {activeRole === "empresa" ? (
                <nav className="space-y-1.5 text-sm">
                  {[
                    { id: "empresa-dashboard", label: "1. Panel de Control (Dashboard)" },
                    { id: "empresa-plantillas", label: "2. Plantillas y Constructor de Preguntas" },
                    { id: "empresa-campanas", label: "3. Planificación de Campañas" },
                    { id: "empresa-destinatarios", label: "4. Destinatarios e Importación Excel" },
                    { id: "empresa-entregas", label: "5. Monitoreo de Entregas y Respuestas" },
                    { id: "empresa-operadores", label: "6. Gestión de Operadores de Campo" },
                    { id: "empresa-ia", label: "7. Inteligencia Artificial y Clusters" },
                    { id: "empresa-fraude", label: "8. Detección de Fraude y Auditoría" },
                    { id: "empresa-copiloto", label: "9. Copiloto IA con RAG Unificado" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium cursor-pointer ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </nav>
              ) : (
                <nav className="space-y-1.5 text-sm">
                  {[
                    { id: "operador-app", label: "1. Instalación de App Móvil y APK" },
                    { id: "operador-offline", label: "2. Modo 100% Offline y Sincronización" },
                    { id: "operador-encuestas", label: "3. Aplicación de Encuestas en Terreno" },
                    { id: "operador-voz", label: "4. Grabación y Transcripción de Voz" },
                    { id: "operador-ocr", label: "5. Digitalización OCR de Papel" },
                    { id: "operador-web", label: "6. Panel Web del Operador" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium cursor-pointer ${
                        activeSection === item.id
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </nav>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/descargar-app"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar APK Offline</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* CONTENIDO DEL MANUAL */}
          <div className="lg:col-span-3 space-y-16">
            {/* VISTA 1: GUÍA DE LA EMPRESA / SUSCRIPTOR */}
            {activeRole === "empresa" && (
              <div className="space-y-16">
                {/* 1. Dashboard */}
                <section id="empresa-dashboard" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Layers className="w-4 h-4" />
                      Capítulo 1
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Panel de Control y Métricas Ejecutivas (Dashboard)
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      El centro neurálgico donde monitorear el pulso de todas las campañas de recolección de datos de tu organización.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <img
                      src="/images/manual/dashboard.png"
                      alt="Dashboard Analítico de la Empresa"
                      className="w-full h-auto object-cover border-b border-slate-200"
                    />
                    <div className="p-6 bg-slate-50 space-y-4">
                      <h4 className="font-bold text-sm text-slate-800">Indicadores Clave de Desempeño (KPIs):</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="block text-slate-900 font-bold">Total Plantillas</strong>
                          <span className="text-slate-500">Cuestionarios activos y disponibles.</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="block text-slate-900 font-bold">Total Campañas</strong>
                          <span className="text-slate-500">Proyectos creados y en ejecución.</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="block text-slate-900 font-bold">Total Entregas</strong>
                          <span className="text-slate-500">Volumen despachado a destinatarios.</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="block text-slate-900 font-bold">Tasa de Respuesta</strong>
                          <span className="text-slate-500">Porcentaje de éxito y conversión.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Plantillas */}
                <section id="empresa-plantillas" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <FileText className="w-4 h-4" />
                      Capítulo 2
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Diseño de Plantillas y Constructor de Preguntas
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Configuración de cuestionarios inteligentes con soporte multicanal: texto, opciones, audio/voz y formularios listos para impresión OCR.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/plantillas.png"
                        alt="Catálogo de Plantillas"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">1. Catálogo Centralizado</h4>
                        <p className="text-slate-600 text-xs">
                          Visualizá, activá, cloná o editá tus encuestas. Podés marcar plantillas con soporte de voz o modo adaptativo asistido por IA.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/constructor-preguntas.png"
                        alt="Constructor de Preguntas"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">2. Constructor Multimodal</h4>
                        <p className="text-slate-600 text-xs">
                          Definí preguntas de opción múltiple, escala NPS, valores numéricos, texto abierto o habilitá el micrófono para respuestas dictadas.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Campañas */}
                <section id="empresa-campanas" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Send className="w-4 h-4" />
                      Capítulo 3
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Planificación, Canales y Creación de Campañas
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Cómo asociar una plantilla a una campaña, seleccionar los canales de salida y asignar fechas de inicio y expiración.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/campanas.png"
                        alt="Lista de Campañas"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Flujo de Estados de Campaña</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Tus campañas transicionan de <strong>Borrador</strong> &rarr; <strong>Programada</strong> &rarr; <strong>Enviada</strong> &rarr; <strong>Cerrada</strong>, asegurando trazabilidad en cada etapa.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/crear-campana.png"
                        alt="Crear Campaña Modal"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Canales de Recolección</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Elegí entre <strong>Email</strong> (enlace web responsivo), <strong>Audio / Voz</strong> (entrevistas asistidas) o <strong>Papel</strong> (PDF con código QR y cuadrícula de digitalización).
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Destinatarios */}
                <section id="empresa-destinatarios" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Users className="w-4 h-4" />
                      Capítulo 4
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Directorio de Destinatarios e Importación Masiva
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Administrá la base de contactos y cargá miles de prospectos en segundos utilizando archivos Excel o CSV.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/destinatarios.png"
                        alt="Directorio de Contactos"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Gestión de Contactos</h4>
                        <p className="text-slate-600 text-xs">
                          Almacená nombre, correo electrónico y teléfono con validación automática de formato para evitar rebotes en los envíos.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/importar-destinatarios.png"
                        alt="Importación Masiva Excel"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Carga en Lote con Excel</h4>
                        <p className="text-slate-600 text-xs">
                          Descargá la plantilla preformateada, pegá los datos de tu empresa y subí el archivo para importar los registros al instante.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. Entregas y Respuestas */}
                <section id="empresa-entregas" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <BarChart3 className="w-4 h-4" />
                      Capítulo 5
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Monitoreo de Despachos y Respuestas Recopiladas
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Supervisá el estado individual de cada entrega (pendiente, entregado, fallido, completado) y exportá las respuestas en formato plano.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/entregas.png"
                        alt="Monitor de Entregas"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Trazabilidad de Entregas</h4>
                        <p className="text-slate-600 text-xs">
                          Rastreo detallado por token, destinatario, fecha de despacho y estado de visualización en tiempo real.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/respuestas.png"
                        alt="Exportación de Respuestas"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Visualización y Descarga CSV</h4>
                        <p className="text-slate-600 text-xs">
                          Consultá las respuestas tabuladas con marcas de tiempo exactas y exportalas a CSV para procesarlas en Excel o Power BI.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. Operadores */}
                <section id="empresa-operadores" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Users className="w-4 h-4" />
                      Capítulo 6
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Gestión de Operadores y Encuestadores de Campo
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Cómo dar de alta a tu equipo de encuestadores móviles, asignar credenciales seguras y supervisar su actividad.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/operadores.png"
                        alt="Lista de Operadores"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Directorio de Operadores</h4>
                        <p className="text-slate-600 text-xs">
                          Controlá el estado de cuenta de cada encuestador, activá o deshabilitá accesos de forma instantánea.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/nuevo-operador.png"
                        alt="Registrar Nuevo Operador"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Asignación de Credenciales</h4>
                        <p className="text-slate-600 text-xs">
                          Registrá el nombre y correo institucional del operador para que pueda autenticarse directamente en la App Móvil Android.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7. IA y Clusters */}
                <section id="empresa-ia" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Brain className="w-4 h-4" />
                      Capítulo 7
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Inteligencia Artificial: Clusters Semánticos y Analítica Predictiva
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Transformá miles de respuestas cualitativas en patrones accionables mediante modelos de lenguaje Gemini y proyecciones automáticas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/clusters-ia.png"
                        alt="Clusters Semánticos"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Agrupamiento Semántico con IA</h4>
                        <p className="text-slate-600 text-xs">
                          La IA clasifica automáticamente las respuestas de texto y voz en tópicos temáticos y analiza el sentimiento positivo, neutral o crítico.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <img
                        src="/images/manual/predictivo.png"
                        alt="Analítica Predictiva"
                        className="w-full h-auto object-cover border-b border-slate-200"
                      />
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Modelos Predictivos</h4>
                        <p className="text-slate-600 text-xs">
                          Proyecciones automatizadas de tendencias basadas en el histórico de recolección para anticipar comportamientos de mercado.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 8. Fraude */}
                <section id="empresa-fraude" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      Capítulo 8
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Detección de Fraude, Anomalías y Control de Calidad
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Filtros automáticos contra respuestas sospechosas, patrones repetitivos o anomalías en los tiempos de respuesta.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <img
                      src="/images/manual/deteccion-fraude.png"
                      alt="Cola de Revisión de Fraude"
                      className="w-full h-auto object-cover border-b border-slate-200"
                    />
                    <div className="p-6 bg-slate-50 space-y-3">
                      <h4 className="font-bold text-sm text-slate-800">Criterios de Inspección Heurística:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                        <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Detección de respuestas enviadas a velocidades no humanas (straightlining).</span>
                        </li>
                        <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Inconsistencias semánticas entre preguntas trampa de control cruzado.</span>
                        </li>
                        <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Posibilidad de aprobar o descartar respuestas antes del cálculo analítico.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 9. Copiloto */}
                <section id="empresa-copiloto" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4" />
                      Capítulo 9
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Copiloto IA: Asistente RAG y Herramientas MCP
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Interactuá en lenguaje natural con todos los datos de tu empresa. Preguntale sobre rendimiento, sugerencias de preguntas o insights clave.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <img
                      src="/images/manual/copiloto-ia.png"
                      alt="Copiloto IA con MCP"
                      className="w-full h-auto object-cover border-b border-slate-200"
                    />
                    <div className="p-6 bg-slate-50 space-y-2">
                      <h4 className="font-bold text-sm text-slate-800">Capacidades del Asistente:</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        El Copiloto se conecta mediante el protocolo MCP (Model Context Protocol) a la base de datos de tu organización, permitiendo consultar métricas, redactar resúmenes ejecutivos para gerencia y detectar cuellos de botella sin necesidad de armar consultas SQL.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* VISTA 2: GUÍA DEL OPERADOR DE CAMPO */}
            {activeRole === "operador" && (
              <div className="space-y-16">
                {/* 1. App Móvil */}
                <section id="operador-app" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Download className="w-4 h-4" />
                      Capítulo 1
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Descarga e Instalación del APK Móvil Oficial
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      La herramienta de campo para dispositivos Android que permite trabajar en cualquier punto geográfico sin depender de conexión a internet.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <img
                      src="/images/manual/app-movil-ocr.png"
                      alt="Portal de Descarga de App Móvil"
                      className="w-full h-auto object-cover border-b border-slate-200"
                    />
                    <div className="p-6 bg-slate-50 space-y-4">
                      <h4 className="font-bold text-sm text-slate-800">Pasos de Instalación en Android:</h4>
                      <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
                        <li>Ingresá desde el navegador de tu teléfono móvil a <Link to="/descargar-app" className="text-blue-600 underline font-medium">/descargar-app</Link>.</li>
                        <li>Presioná el botón <strong>"Descargar APK Oficial"</strong> o escaneá el código QR.</li>
                        <li>Al abrir el archivo, si Android lo solicita, autorizá la instalación desde fuentes desconocidas.</li>
                        <li>Iniciá sesión con el correo y contraseña provistos por la Empresa que administra la cuenta.</li>
                      </ol>
                    </div>
                  </div>
                </section>

                {/* 2. Modo Offline */}
                <section id="operador-offline" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <WifiOff className="w-4 h-4" />
                      Capítulo 2
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Modo 100% Offline y Cola de Sincronización
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Diseñado especialmente para brigadas en zonas rurales, ferias o galpones industriales sin cobertura de red.
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Persistencia Local SQLite</h4>
                        <p className="text-slate-600 text-xs">
                          Todas las respuestas capturadas se almacenan inmediatamente en el almacenamiento local cifrado del dispositivo.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs">
                        <strong className="block text-slate-900 mb-1">1. Descarga previa</strong>
                        <p className="text-slate-500">Conectate a Wi-Fi antes de salir a campo para sincronizar las plantillas de la campaña.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs">
                        <strong className="block text-slate-900 mb-1">2. Captura offline</strong>
                        <p className="text-slate-500">Realizá las encuestas sin datos móviles; el sistema almacena cada respuesta con fecha y hora.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs">
                        <strong className="block text-slate-900 mb-1">3. Auto-sync</strong>
                        <p className="text-slate-500">Al recuperar señal (Wi-Fi o 4G/5G), la cola de envíos sube automáticamente a los servidores centrales.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Encuestas en terreno */}
                <section id="operador-encuestas" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Layers className="w-4 h-4" />
                      Capítulo 3
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Aplicación de Encuestas Presenciales
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Interfaz optimizada para pantallas táctiles con botones de gran tamaño y flujo fluido pregunta a pregunta.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      El encuestador visualiza la lista de destinatarios asignados o puede iniciar una encuesta anónima presencial seleccionando la campaña correspondiente.
                    </p>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                      <strong className="block text-slate-900 font-bold">Validaciones activas:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Comprobación de campos obligatorios antes de avanzar de pregunta.</li>
                        <li>Verificación de rangos numéricos y formatos de fecha.</li>
                        <li>Consentimiento informado obligatorio previo al inicio del cuestionario.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 4. Voz */}
                <section id="operador-voz" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Mic className="w-4 h-4" />
                      Capítulo 4
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Grabación y Transcripción de Respuestas por Voz
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Permite que el encuestado responda naturalmente con sus propias palabras sin que el operador deba tipear textos largos en la calle.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                        <Mic className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">Flujo de Grabación con Micrófono</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Al presionar el ícono del micrófono, la aplicación solicita los permisos de audio del dispositivo y graba la respuesta. El audio se comprime localmente y se procesa mediante Inteligencia Artificial (Google Gemini) para generar la transcripción exacta e interpretación semántica.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. OCR */}
                <section id="operador-ocr" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Camera className="w-4 h-4" />
                      Capítulo 5
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Digitalización Fotográfica y OCR de Formularios en Papel
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Transformá formularios impresos llenados a mano en datos digitales en menos de 3 segundos utilizando la cámara del celular.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <strong className="block text-slate-900 font-bold">1. Encuadre Óptico</strong>
                      <p className="text-slate-600">
                        Alineá las 4 esquinas de la hoja impresa con los marcadores visuales de la cámara para corregir la perspectiva.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <strong className="block text-slate-900 font-bold">2. Lectura Automática OCR</strong>
                      <p className="text-slate-600">
                        El motor detecta casillas marcadas (checkboxes), números y código QR identificador de la campaña.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <strong className="block text-slate-900 font-bold">3. Confirmación Visual</strong>
                      <p className="text-slate-600">
                        El operador revisa en pantalla la interpretación antes de confirmar el guardado definitivo.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 6. Panel Web Operador */}
                <section id="operador-web" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Layers className="w-4 h-4" />
                      Capítulo 6
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Panel Web del Operador (/dashboard-operador)
                    </h2>
                    <p className="text-slate-600 text-sm mt-2">
                      Acceso desde navegadores de escritorio para revisar las asignaciones diarias y gestionar el perfil de campo.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600 shadow-xs">
                    <p className="leading-relaxed">
                      Además de la app móvil Android, los operadores cuentan con un acceso web simplificado en <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">/dashboard-operador</code> donde pueden consultar el listado de plantillas vigentes, la agenda de entregas asignadas y su historial personal de encuestas completadas.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <PublicFooter />
      </div>
    </div>
  );
}
