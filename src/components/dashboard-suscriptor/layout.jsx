
import { useState, useEffect } from "react"
import {
  BarChart3,
  FileText,
  Target,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  User,
  UserCog,
  Send,
  Crown,
  Receipt,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Bot,
  MessageSquareText,
  Bell,
  Smartphone,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import { getCurrentUser, getAvatarUrl } from "../../services/auth"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { NotificationBellPopover } from "../../features/notifications"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../sidebar"
import SystemAnnouncementsBanner from "../SystemAnnouncementsBanner"

/* ───────── Utilidades ───────── */

/* ──────────────────────────────── Componente ─────────────────────────────── */
const DashboardSuscriptorLayout = ({ children }) => {
  /* Localización para contexto y resaltado de menú */
  const location = useLocation()
  const currentSection = location.pathname.split("/")[2] || "dashboard"

  /* Auth & usuario */
  const { logout } = useAuth()
  const [user, setUser] = useState({
    name: "Usuario Suscriptor",
    email: "usuario@empresa.com",
    avatar: "/placeholder.svg?height=32&width=32",
    plan: "Professional",
    foto_url: null,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const u = await getCurrentUser()
        setUser((prev) => ({
          ...prev,
          name: u?.nombre ?? prev.name,
          email: u?.email ?? prev.email,
          foto_url: u?.foto_url ?? null,
        }))
      } catch (err) {
        console.error("Error loading user:", err)
      }
    })()
  }, [])

  /* Sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true"
  })

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar_collapsed", next ? "true" : "false")
      return next
    })
  }

  /* Menú lateral */
  const menu = [
    {
      title: "Panel Principal",
      items: [
        { title: "Dashboard", url: "/dashboard-suscriptor/dashboard", icon: BarChart3 },
        { title: "Notificaciones", url: "/dashboard-suscriptor/notificaciones", icon: Bell },
      ],
    },
    {
      title: "Gestión de Encuestas",
      items: [
        { title: "Plantillas", url: "/dashboard-suscriptor/plantillas", icon: FileText },
        { title: "Destinatarios", url: "/dashboard-suscriptor/destinatarios", icon: Users },
        { title: "Campañas", url: "/dashboard-suscriptor/campanas", icon: Target },
        { title: "Respuestas", url: "/dashboard-suscriptor/respuestas", icon: MessageSquare },
        { title: "Entregas", url: "/dashboard-suscriptor/entregas", icon: Send },
      ],
    },
    {
      title: "Inteligencia y Analítica",
      items: [
        { title: "Clusters Semánticos", url: "/dashboard-suscriptor/clusters", icon: Sparkles },
        { title: "Revisión de Fraude", url: "/dashboard-suscriptor/fraude", icon: ShieldAlert },
        { title: "Análisis Predictivo", url: "/dashboard-suscriptor/predictivo", icon: TrendingUp },
        { title: "Log del Agente IA", url: "/dashboard-suscriptor/agente-logs", icon: Bot },
        { title: "Copiloto IA (MCP)", url: "/dashboard-suscriptor/copilot", icon: Sparkles },
      ],
    },
    {
      title: "Equipo",
      items: [
        { title: "Operadores", url: "/dashboard-suscriptor/operadores", icon: UserCog },
        { title: "Roles y Permisos", url: "/dashboard-suscriptor/roles", icon: ShieldCheck },
      ],
    },
    {
      title: "Facturación y Membresía",
      items: [
        { title: "Mi Suscripción", url: "/dashboard-suscriptor/mi-suscripcion", icon: Crown },
        { title: "Historial de Pagos", url: "/dashboard-suscriptor/historial-pagos", icon: Receipt },
        { title: "Planes Disponibles", url: "/dashboard-suscriptor/planes", icon: Sparkles },
      ],
    },
    {
      title: "Sistema",
      items: [
        { title: "Auditoría", url: "/dashboard-suscriptor/auditoria", icon: ShieldAlert },
        { title: "Configuración", url: "/dashboard-suscriptor/configuracion", icon: Settings },
      ],
    },
    {
      title: "Aplicación Móvil",
      items: [
        { title: "Descargar App Móvil", url: "/descargar-app", icon: Smartphone },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ───────── Sidebar ───────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      >
        <SidebarHeader className="h-16 flex items-center">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img src="/favicon.svg" alt="SurveySaaS Logo" className="w-10 h-10 rounded-xl shadow-sm object-contain flex-shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <h2 className="text-base font-bold text-gray-900 truncate">SurveySaaS</h2>
                <p className="text-xs text-gray-500 truncate">Panel de Control</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {menu.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      href={url}
                      isActive={location.pathname.startsWith(url)}
                      onClick={() => setSidebarOpen(false)}
                      title={title}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <span className="truncate">{title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className={`w-full flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition py-2.5 ${
              isCollapsed ? "px-0" : "px-4 gap-2"
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-semibold truncate">Cerrar sesión</span>}
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* ───────── Main ───────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-2 border-b border-gray-200 bg-white px-4 sm:px-6">
          <SidebarTrigger
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(true)
              } else {
                toggleSidebarCollapse()
              }
            }}
            isCollapsed={isCollapsed}
          />

          <div className="flex flex-1 items-center justify-end gap-3">
            <NotificationBellPopover />
            <Link
              to="/dashboard-suscriptor/perfil-suscriptor"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              {user.foto_url ? (
                <img
                  src={getAvatarUrl(user.foto_url)}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}

              {/* Nombre (solo en pantallas ≥ sm) */}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.name}
              </span>
            </Link>
          </div>
        </header>
        <SystemAnnouncementsBanner />

        {/* Contenido */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

export default DashboardSuscriptorLayout
