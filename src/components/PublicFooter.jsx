import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Globe } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function PublicFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-12 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Location */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" textColor="light" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Plataforma SaaS integral de recolección multicanal, digitalización con OCR y análisis inteligente de encuestas con IA.
            </p>

            <div className="pt-2 space-y-2.5 text-sm text-gray-300">
              <Link to="/sobre-nosotros#ubicacion" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Santa Cruz de la Sierra, Bolivia</span>
              </Link>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:contacto@desesoft.com" className="hover:text-white transition-colors">
                  contacto@desesoft.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">Desesoft — Tecnología e Innovación</span>
              </div>
            </div>
          </div>

          {/* Col 2: Producto */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Producto</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="/#funcionalidades" className="hover:text-blue-400 transition-colors">
                  Encuestas Multicanal
                </a>
              </li>
              <li>
                <a href="/#funcionalidades" className="hover:text-blue-400 transition-colors">
                  Digitalización OCR Papel
                </a>
              </li>
              <li>
                <a href="/#funcionalidades" className="hover:text-blue-400 transition-colors">
                  Asistente de Voz e IA
                </a>
              </li>
              <li>
                <a href="/#precios" className="hover:text-blue-400 transition-colors">
                  Planes y Tarifas
                </a>
              </li>
              <li>
                <Link to="/descargar-app" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5">
                  <span>App Móvil (APK Android)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Offline
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Empresa */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Desesoft</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/sobre-nosotros" className="hover:text-blue-400 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros#mision" className="hover:text-blue-400 transition-colors">
                  Misión y Visión
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros#ubicacion" className="hover:text-blue-400 transition-colors">
                  Ubicación
                </Link>
              </li>
              <li>
                <a href="/#contacto" className="hover:text-blue-400 transition-colors">
                  Contacto Comercial
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Soporte & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Soporte y Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/soporte" className="hover:text-blue-400 transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/soporte#faqs" className="hover:text-blue-400 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-blue-400 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-blue-400 transition-colors">
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Desesoft. Todos los derechos reservados. Creado en Santa Cruz, Bolivia.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/privacidad" className="hover:text-gray-300 transition-colors">
              Privacidad
            </Link>
            <Link to="/terminos" className="hover:text-gray-300 transition-colors">
              Términos
            </Link>
            <Link to="/soporte" className="hover:text-gray-300 transition-colors">
              Soporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
