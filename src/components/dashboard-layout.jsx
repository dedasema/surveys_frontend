
import { useState, useEffect } from "react"
import {
  Users,
  LogOut,
  Search,
  Crown,
  User,
  ShieldAlert,
  Building2,
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
import { getCurrentUser } from "../services/auth"
const DashboardLayout = ({ children, activeSection = "roles" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState({
    name: "Usuario Administrador",
    email: "admin@surveysaas.com",
    avatar: "/placeholder.svg?height=32&width=32",
    plan: "Administrador",
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}>
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="SurveySaaS Logo" className="w-10 h-10 rounded-xl shadow-sm object-contain flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SurveySaaS</h2>
              <p className="text-sm text-gray-500">Panel Administrativo</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton href={item.url} isActive={item.isActive} onClick={closeSidebar}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
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
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-2 border-b border-gray-200 bg-white px-4 sm:px-6">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} className="md:hidden" />

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar plantillas, campañas..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="sm:hidden p-2 text-gray-400 hover:text-gray-600">
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/dashboard/perfil-admin"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                {/* Avatar sustituido por icono */}
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">
                  <User className="w-4 h-4 text-white" />
                </div>
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
