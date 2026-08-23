import { useState, useEffect } from "react"
import {
  FileText,
  Users,
  LogOut,
  Search,
  User,
  Send,
} from "lucide-react"
import { getCurrentUser } from "../../services/auth"
import { useAuth } from "../../context/AuthContext"

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
import ChatbotWidget from "../ChatbotWidget"
import SystemAnnouncementsBanner from "../SystemAnnouncementsBanner"

const DashboardOperadorLayout = ({ children, activeSection = "plantillas" }) => {
  /* ──────────────────────── Auth & user ─────────────────────── */
  const { logout } = useAuth()
  const [user, setUser] = useState({
    name: "Usuario Operador",
    email: "operador@empresa.com",
    avatar: "/placeholder.svg?height=32&width=32",
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser((prev) => ({
          ...prev,
          name: userData?.nombre_completo ?? prev.name,
          email: userData?.email ?? prev.email,
        }))
      } catch (err) {
        console.error("Error loading user:", err)
      }
    }
    loadUser()
  }, [])

  /* ─────────────────────── Sidebar state ────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)
  const handleLogout = () => logout()

  /* ─────────────────────── Menú lateral ─────────────────────── */
  const menu = [
    {
      title: "Gestión de Encuestas",
      items: [
        { title: "Plantillas", url: "/dashboard-operador/plantillas", icon: FileText },
        { title: "Destinatarios", url: "/dashboard-operador/destinatarios", icon: Users },
        { title: "Entregas", url: "/dashboard-operador/entregas", icon: Send },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ──────────────── Sidebar ──────────────── */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}>
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="SurveySaaS Logo" className="w-10 h-10 rounded-xl shadow-sm object-contain flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SurveySaaS</h2>
              <p className="text-sm text-gray-500">Panel de Control</p>
            </div>
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
                      isActive={activeSection === title.toLowerCase()}
                      onClick={closeSidebar}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{title}</span>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* ──────────────── Main ──────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-2 border-b border-gray-200 bg-white px-4 sm:px-6">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} className="md:hidden" />

          {/* Search */}
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Buscar plantillas, destinatarios..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="sm:hidden p-2 text-gray-400 hover:text-gray-600">
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/dashboard-operador/perfil-operador" className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="w-8 h-8 grid place-items-center rounded-full bg-blue-600">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name}
                </span>
              </a>
            </div>
          </div>
        </header>
        <SystemAnnouncementsBanner />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>

        {/* ──────────────── Chatbot Copilot (Gemini) ──────────────── */}
        <ChatbotWidget activeSection={activeSection} />
      </div>
    </div>
  )
}

export default DashboardOperadorLayout
