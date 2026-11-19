import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";
import { isTokenExpired, redirectBasedOnRole } from "../services/auth";

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const corporateUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_CORPORATE_URL) ||
    (typeof process !== "undefined" && (process.env?.VITE_CORPORATE_URL || process.env?.REACT_APP_CORPORATE_URL)) ||
    "";
  const isHome = location.pathname === "/";
  const { isAuthenticated, user } = useAuth();

  const isUserLoggedIn =
    isAuthenticated ||
    Boolean(
      localStorage.getItem("token") &&
        !isTokenExpired(localStorage.getItem("token"))
    );

  const getTargetDashboard = () => {
    if (user) return redirectBasedOnRole(user);
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        return redirectBasedOnRole(JSON.parse(cached));
      } catch (e) {
        console.warn(e);
      }
    }
    return "/dashboard-suscriptor/plantillas";
  };
  const targetDashboard = getTargetDashboard();

  const getAnchorHref = (hash) => {
    return isHome ? hash : `/${hash}`;
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <BrandLogo size="lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href={getAnchorHref("#funcionalidades")}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              Funcionalidades
            </a>
            <a
              href={getAnchorHref("#beneficios")}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              Beneficios
            </a>
            <a
              href={getAnchorHref("#precios")}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              Precios
            </a>
            <Link
              to="/descargar-app"
              className={`inline-flex items-center gap-1.5 transition-colors font-medium text-sm ${
                location.pathname === "/descargar-app"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span>App Móvil</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                APK
              </span>
            </Link>
            <Link
              to="/manual"
              className={`transition-colors font-medium text-sm ${
                location.pathname.startsWith("/manual")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Manual
            </Link>
            {corporateUrl && (
              <a
                href={corporateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors font-medium text-sm text-gray-600 hover:text-blue-600"
              >
                Empresa
              </a>
            )}
            <Link
              to="/soporte"
              className={`transition-colors font-medium text-sm ${
                location.pathname === "/soporte"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Soporte
            </Link>

            {isUserLoggedIn ? (
              <div className="flex items-center gap-3">
                <a
                  href={targetDashboard}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-xs hover:shadow-md text-sm"
                >
                  <span>Ir al dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                )}
                {!isRegisterPage && (
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs hover:shadow-md"
                  >
                    Registrarse
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 focus:outline-none"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a
                href={getAnchorHref("#funcionalidades")}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Funcionalidades
              </a>
              <a
                href={getAnchorHref("#beneficios")}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Beneficios
              </a>
              <a
                href={getAnchorHref("#precios")}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Precios
              </a>
              <Link
                to="/descargar-app"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between text-gray-600 hover:text-blue-600 font-medium"
              >
                <span>Descargar App Móvil (Android)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  APK
                </span>
              </Link>
              <Link
                to="/manual"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Manual de Usuario
              </Link>
              {corporateUrl && (
                <a
                  href={corporateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Empresa
                </a>
              )}
              <Link
                to="/soporte"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Soporte y Ayuda
              </Link>

              {isUserLoggedIn ? (
                <a
                  href={targetDashboard}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-center font-semibold text-sm"
                >
                  <span>Ir al dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  {!isLoginPage && (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium text-center py-2"
                    >
                      Iniciar sesión
                    </Link>
                  )}
                  {!isRegisterPage && (
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-center font-semibold"
                    >
                      Registrarse
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
