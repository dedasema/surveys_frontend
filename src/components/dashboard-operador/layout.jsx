import { useState, useEffect } from "react"
import {
  FileText,
  Users,
  LogOut,
  User,
  Send,
} from "lucide-react"
import { getCurrentUser, getAvatarUrl } from "../../services/auth"
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
    foto_url: null,
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser((prev) => ({
          ...prev,
          name: userData?.nombre_completo ?? prev.name,
          email: userData?.email ?? prev.email,
          foto_url: userData?.foto_url ?? null,
        }))
      } catch (err) {
        console.error("Error loading user:", err)
      }
    }
    loadUser()
  }, [])

  /* ─────────────────────── Sidebar state ────────────────────── */
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ──────────────── Sidebar ──────────────── */}
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
                      isActive={activeSection === title.toLowerCase()}
                      onClick={closeSidebar}
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
            onClick={handleLogout}
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

      {/* ──────────────── Main ──────────────── */}
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

          {/* User */}
          <div className="flex flex-1 items-center justify-end">
              <a href="/dashboard-operador/perfil-operador" className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                {user.foto_url ? (
                  <img
                    src={getAvatarUrl(user.foto_url)}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 grid place-items-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name}
                </span>
              </a>
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
