import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Globe, Smartphone } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function PublicFooter() {
  const corporateUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_CORPORATE_URL) ||
    (typeof process !== "undefined" && (process.env?.VITE_CORPORATE_URL || process.env?.REACT_APP_CORPORATE_URL)) ||
    "";
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

            <div className="pt-2 space-y-3 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 text-gray-200">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-white block">Dirección:</span>
                    <span className="text-gray-300">Manzana 40 - Plaza Empresarial, Av. San Martin, Santa Cruz de la Sierra</span>
                  </div>
                </div>

                {/* Mapa Incrustado */}
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-800 shadow-md h-40 max-w-sm">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2140.020440357915!2d-63.19898350970343!3d-17.756734352519935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e70cca02d2c7%3A0x51870ea50241886c!2sManzana%2040%20-%20Plaza%20Empresarial!5e0!3m2!1ses-419!2sbo!4v1794988673274!5m2!1ses-419!2sbo"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Mapa Manzana 40 - Footer"
                  />
                </div>

                <div className="pt-1">
                  <a
                    href={corporateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    <span>Conoce a Desesoft (desesoft.vercel.app)</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:dedasema734012@gmail.com" className="hover:text-white transition-colors">
                  dedasema734012@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+59162795140" className="hover:text-white transition-colors">
                  +591 62795140
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
                  Grabación de Voz y Transcripción
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
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Empresa</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {corporateUrl && (
                <li>
                  <a
                    href={corporateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Empresa
                  </a>
                </li>
              )}
              {corporateUrl && (
                <li>
                  <a
                    href={corporateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Conoce a Desesoft
                  </a>
                </li>
              )}
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
          <div className="flex flex-col sm:flex-row items-center gap-1.5 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} SurveySaaS. Todos los derechos reservados.</span>
            <span className="hidden sm:inline">&bull;</span>
            {corporateUrl ? (
              <a
                href={corporateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 font-medium transition-colors"
              >
                Un producto de Desesoft S.R.L.
              </a>
            ) : (
              <span className="text-gray-400 font-medium">Un producto de Desesoft S.R.L.</span>
            )}
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
