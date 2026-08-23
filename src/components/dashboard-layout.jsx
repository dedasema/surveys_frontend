
import { useState, useEffect } from "react"
import {
  Users,
  LogOut,
  Crown,
  User,
  ShieldAlert,
  Building2,
  Megaphone,
} from "lucide-react"
import { Link } from "react-router-dom"
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
} from "./sidebar"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, getAvatarUrl } from "../services/auth"
const DashboardLayout = ({ children, activeSection = "roles" }) => {
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
    name: "Usuario Administrador",
    email: "admin@surveysaas.com",
    avatar: "/placeholder.svg?height=32&width=32",
    plan: "Administrador",
    foto_url: null,
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser({
          name: userData.nombre || "Usuario Administrador",
          email: userData.email || "usuario@empresa.com",
          avatar: "/placeholder.svg?height=32&width=32",
          plan: "Administrador",
          foto_url: userData.foto_url || null,
        })
      } catch (error) {
        console.error("Error loading user:", error)
      }
    }
    loadUser()
  }, [])

  const menuItems = [
    {
      title: "Gestión de Empresas",
      items: [
        {
          title: "Suscriptores",
          url: "/dashboard/suscriptores",
          icon: Building2,
          isActive: activeSection === "suscriptores",
        },
      ],
    },
    {
      title: "Gestión y Accesos",
      items: [
        {
          title: "Roles y Permisos",
          url: "/dashboard/roles",
          icon: Users,
          isActive: activeSection === "roles",
        },
      ],
    },
    {
      title: "Suscripciones y Negocio",
      items: [
        {
          title: "Planes",
          url: "/dashboard/planes",
          icon: Crown,
          isActive: activeSection === "planes",
        },
      ],
    },
    {
      title: "Comunicación & Avisos",
      items: [
        {
          title: "Anuncios Globales",
          url: "/dashboard/anuncios",
          icon: Megaphone,
          isActive: activeSection === "anuncios",
        },
      ],
    },
    {
      title: "Seguridad y Auditoría",
      items: [
        {
          title: "Auditoría Global",
          url: "/dashboard/auditoria",
          icon: ShieldAlert,
          isActive: activeSection === "auditoria",
        },
      ],
    },
  ]

  const closeSidebar = () => setSidebarOpen(false)
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      >
        <SidebarHeader className="h-16 flex items-center">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img src="/favicon.svg" alt="SurveySaaS Logo" className="w-10 h-10 rounded-xl shadow-sm object-contain flex-shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <h2 className="text-base font-bold text-gray-900 truncate">SurveySaaS</h2>
                <p className="text-xs text-gray-500 truncate">Panel Administrativo</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      href={item.url}
                      isActive={item.isActive}
                      onClick={closeSidebar}
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
            onClick={() => handleLogout()}
            title="Cerrar sesión"
            className={`w-full flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition py-2.5 ${
              isCollapsed ? "px-0" : "px-4 space-x-2"
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-semibold truncate">Cerrar sesión</span>}
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
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

          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/dashboard/perfil-admin"
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
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
