import React, { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  Radio,
  FileText,
  LogOut,
  Search,
  MessageSquare,
  Target,
  Truck,
  CreditCard,
  DollarSign,
  Crown,
  User,
  UserCog,
  PhoneCall,
  Settings,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Bot,
  MessageSquareText,
  Bell,
  Smartphone,
  Download,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
} from "../../components/sidebar"
import { useAuth } from "../../context/AuthContext"
import { getCurrentUser } from "../../services/auth"
import { ChatbotWidget } from "../../features/chatbot"
import { NotificationBellPopover } from "../../features/notifications"
import SystemAnnouncementsBanner from "../../components/SystemAnnouncementsBanner"

/**
 * Strategy Pattern: Configuración de navegación y comportamiento por rol
 */
const ROLE_STRATEGIES = {
  admin: {
    panelTitle: "Panel Administrativo",
    profileUrl: "/dashboard/perfil-admin",
    hasChatbot: false,
    getMenu: (pathname) => [
      {
        title: "Configuración de Encuestas",
        items: [
          {
            title: "Tipos de Pregunta",
            url: "/dashboard/tipos-pregunta",
            icon: MessageSquare,
            isActive: pathname.includes("/dashboard/tipos-pregunta"),
          },
          {
            title: "Canales",
            url: "/dashboard/canales",
            icon: Radio,
            isActive: pathname.includes("/dashboard/canales"),
          },
        ],
      },
      {
        title: "Estados del Sistema",
        items: [
          {
            title: "Estados Campaña",
            url: "/dashboard/estados-campana",
            icon: Target,
            isActive: pathname.includes("/dashboard/estados-campana"),
          },
          {
            title: "Estados Entrega",
            url: "/dashboard/estados-entrega",
            icon: Truck,
            isActive: pathname.includes("/dashboard/estados-entrega"),
          },
          {
            title: "Estados Documento",
            url: "/dashboard/estado-documento",
            icon: FileText,
            isActive: pathname.includes("/dashboard/estado-documento"),
          },
          {
            title: "Estados Pago",
            url: "/dashboard/estados-pago",
            icon: CreditCard,
            isActive: pathname.includes("/dashboard/estados-pago"),
          },
        ],
      },
      {
        title: "Suscripciones y Pagos",
        items: [
          {
            title: "Planes",
            url: "/dashboard/planes",
            icon: Crown,
            isActive: pathname.includes("/dashboard/planes"),
          },
          {
            title: "Métodos de Pago",
            url: "/dashboard/metodos-pago",
            icon: DollarSign,
            isActive: pathname.includes("/dashboard/metodos-pago"),
          },
        ],
      },
    ],
  },
  suscriptor: {
    panelTitle: "Panel Suscriptor",
    profileUrl: "/dashboard-suscriptor/perfil-suscriptor",
    hasChatbot: true,
    getMenu: (pathname) => [
      {
        title: "Panel Principal",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard-suscriptor/dashboard",
            icon: BarChart3,
            isActive: pathname.includes("/dashboard-suscriptor/dashboard"),
          },
          {
            title: "Notificaciones",
            url: "/dashboard-suscriptor/notificaciones",
            icon: Bell,
            isActive: pathname.includes("/dashboard-suscriptor/notificaciones"),
          },
        ],
      },
      {
        title: "Gestión de Encuestas",
        items: [
          {
            title: "Plantillas",
            url: "/dashboard-suscriptor/plantillas",
            icon: FileText,
            isActive: pathname.includes("/dashboard-suscriptor/plantillas"),
          },
          {
            title: "Campañas",
            url: "/dashboard-suscriptor/campanas",
            icon: Target,
            isActive: pathname.includes("/dashboard-suscriptor/campanas"),
          },
          {
            title: "Destinatarios",
            url: "/dashboard-suscriptor/destinatarios",
            icon: Users,
            isActive: pathname.includes("/dashboard-suscriptor/destinatarios"),
          },
          {
            title: "Entregas",
            url: "/dashboard-suscriptor/entregas",
            icon: PhoneCall,
            isActive: pathname.includes("/dashboard-suscriptor/entregas"),
          },
          {
            title: "Respuestas",
            url: "/dashboard-suscriptor/respuestas",
            icon: MessageSquare,
            isActive: pathname.includes("/dashboard-suscriptor/respuestas"),
          },
        ],
      },
      {
        title: "Inteligencia y Analítica",
        items: [
          {
            title: "Clusters Semánticos",
            url: "/dashboard-suscriptor/clusters",
            icon: Sparkles,
            isActive: pathname.includes("/dashboard-suscriptor/clusters"),
          },
          {
            title: "Revisión de Fraude",
            url: "/dashboard-suscriptor/fraude",
            icon: ShieldAlert,
            isActive: pathname.includes("/dashboard-suscriptor/fraude"),
          },
          {
            title: "Análisis Predictivo",
            url: "/dashboard-suscriptor/predictivo",
            icon: TrendingUp,
            isActive: pathname.includes("/dashboard-suscriptor/predictivo"),
          },
          {
            title: "Log del Agente IA",
            url: "/dashboard-suscriptor/agente-logs",
            icon: Bot,
            isActive: pathname.includes("/dashboard-suscriptor/agente-logs"),
          },
          {
            title: "Asistente RAG",
            url: "/dashboard-suscriptor/asistente-rag",
            icon: MessageSquareText,
            isActive: pathname.includes("/dashboard-suscriptor/asistente-rag"),
          },
        ],
      },
      {
        title: "Equipo",
        items: [
          {
            title: "Operadores",
            url: "/dashboard-suscriptor/operadores",
            icon: UserCog,
            isActive: pathname.includes("/dashboard-suscriptor/operadores"),
          },
          {
            title: "Roles y Permisos",
            url: "/dashboard-suscriptor/roles",
            icon: ShieldCheck,
            isActive: pathname.includes("/dashboard-suscriptor/roles"),
          },
        ],
      },
      {
        title: "Seguridad y Auditoría",
        items: [
          {
            title: "Auditoría",
            url: "/dashboard-suscriptor/auditoria",
            icon: ShieldAlert,
            isActive: pathname.includes("/dashboard-suscriptor/auditoria"),
          },
        ],
      },
      {
        title: "Configuración",
        items: [
          {
            title: "Configuración",
            url: "/dashboard-suscriptor/configuracion",
            icon: Settings,
            isActive: pathname.includes("/dashboard-suscriptor/configuracion"),
          },
          {
            title: "Planes",
            url: "/dashboard-suscriptor/planes",
            icon: Crown,
            isActive: pathname.includes("/dashboard-suscriptor/planes"),
          },
        ],
      },
      {
        title: "Aplicación Móvil",
        items: [
          {
            title: "Descargar APK Móvil",
            url: "/descargar-app",
            icon: Smartphone,
            isActive: pathname.includes("/descargar-app"),
          },
        ],
      },
    ],
  },
  operator: {
    panelTitle: "Panel Operador",
    profileUrl: "/dashboard-operador/perfil-operador",
    hasChatbot: true,
    getMenu: (pathname) => [
      {
        title: "Panel Principal",
        items: [
          {
            title: "Notificaciones",
            url: "/dashboard-operador/notificaciones",
            icon: Bell,
            isActive: pathname.includes("/dashboard-operador/notificaciones"),
          },
        ],
      },
      {
        title: "Gestión de Encuestas",
        items: [
          {
            title: "Plantillas",
            url: "/dashboard-operador/plantillas",
            icon: FileText,
            isActive: pathname.includes("/dashboard-operador/plantillas"),
          },
          {
            title: "Destinatarios",
            url: "/dashboard-operador/destinatarios",
            icon: Users,
            isActive: pathname.includes("/dashboard-operador/destinatarios"),
          },
          {
            title: "Entregas",
            url: "/dashboard-operador/entregas",
            icon: PhoneCall,
            isActive: pathname.includes("/dashboard-operador/entregas"),
          },
        ],
      },
      {
        title: "Herramientas de Campo",
        items: [
          {
            title: "Descargar App Móvil",
            url: "/descargar-app",
            icon: Smartphone,
            isActive: pathname.includes("/descargar-app"),
          },
        ],
      },
    ],
  },
}

export const AppLayout = ({ children, role = "suscriptor" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
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

  const [user, setUser] = useState({
    name: "Usuario",
    email: "",
  })

  const strategy = ROLE_STRATEGIES[role] || ROLE_STRATEGIES.suscriptor
  const currentSection = location.pathname.split("/")[2] || "dashboard"

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser({
            name: userData.nombre || "Usuario",
            email: userData.email || "",
          })
        }
      } catch (error) {
        console.error("Error cargando usuario:", error)
      }
    }
    loadUser()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menu = strategy.getMenu(location.pathname)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      >
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-sm flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <h2 className="text-lg font-semibold text-gray-900 leading-none truncate">SurveySaaS</h2>
                <p className="text-xs text-gray-500 mt-1 truncate">{strategy.panelTitle}</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {menu.map((group) => (
            <SidebarGroup key={group.title}>
              {!isCollapsed && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      href={item.url}
                      isActive={item.isActive}
                      onClick={() => setSidebarOpen(false)}
                      title={item.title}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className={`w-full flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition py-2.5 ${
              isCollapsed ? "px-0" : "px-4 gap-2"
            } font-medium text-sm`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
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

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <NotificationBellPopover />
              <Link
                to={strategy.profileUrl}
                className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium text-sm shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Global System Announcements Banner */}
        <SystemAnnouncementsBanner />

        {/* Content View */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>

        {/* Chatbot Widget */}
        {strategy.hasChatbot && <ChatbotWidget currentSection={currentSection} />}
      </div>
    </div>
  )
}
