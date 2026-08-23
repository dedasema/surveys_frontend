import React, { useState, useEffect, useContext, createContext } from "react"
import { X, ChevronLeft, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"

const SidebarContext = createContext({
  isCollapsed: false,
  isMobile: false,
  toggleCollapse: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

const Sidebar = ({
  children,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, isMobile])

  const contextValue = {
    isCollapsed: isMobile ? false : isCollapsed,
    isMobile,
    toggleCollapse: onToggleCollapse || (() => {}),
  }

  if (isMobile) {
    return (
      <SidebarContext.Provider value={contextValue}>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-2xs transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
          fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${className}
        `}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-800"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </SidebarContext.Provider>
    )
  }

  // Desktop Sidebar (Collapsible)
  return (
    <SidebarContext.Provider value={contextValue}>
      <aside
        className={`
        bg-white border-r border-gray-200 flex flex-col h-screen flex-shrink-0 transition-all duration-300 ease-in-out relative
        ${isCollapsed ? "w-20" : "w-64"}
        ${className}
      `}
      >
        {children}

        {/* Botón flotante para colapsar/expandir en el borde derecho del sidebar */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
            className="hidden md:flex absolute -right-3.5 top-20 z-30 w-7 h-7 bg-white hover:bg-blue-50 border border-gray-200 text-gray-600 hover:text-blue-600 rounded-full shadow-md items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </aside>
    </SidebarContext.Provider>
  )
}

const SidebarHeader = ({ children, className = "" }) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      className={`border-b border-gray-200 px-4 py-3 flex items-center transition-all duration-300 ${
        isCollapsed ? "justify-center px-2" : "justify-between"
      } ${className}`}
    >
      {children}
    </div>
  )
}

const SidebarContent = ({ children, className = "" }) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 transition-all duration-300 ${
        isCollapsed ? "px-2" : "px-3"
      } ${className}`}
    >
      {children}
    </div>
  )
}

const SidebarFooter = ({ children, className = "" }) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      className={`border-t border-gray-200 p-3 transition-all duration-300 ${
        isCollapsed ? "px-2" : "p-3"
      } ${className}`}
    >
      {children}
    </div>
  )
}

const SidebarGroup = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

const SidebarGroupLabel = ({ children, className = "" }) => {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) {
    return <div className="h-px bg-gray-200 my-2 mx-2" />
  }
  return (
    <div
      className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 truncate ${className}`}
    >
      {children}
    </div>
  )
}

const SidebarMenu = ({ children, className = "" }) => {
  return <div className={`space-y-1 ${className}`}>{children}</div>
}

const SidebarMenuItem = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>
}

const SidebarMenuButton = ({
  children,
  isActive = false,
  onClick,
  href,
  title,
  className = "",
}) => {
  const { isCollapsed } = useSidebar()

  const baseClasses = `
    w-full flex items-center py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative
    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20
    ${
      isActive
        ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs border border-blue-200/60"
        : "text-gray-600 hover:text-gray-900"
    }
    ${isCollapsed ? "justify-center px-0" : "px-3"}
    ${className}
  `

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick} title={title || ""}>
        {children}
        {isCollapsed && title && (
          <div className="absolute left-full ml-3.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
            {title}
          </div>
        )}
      </a>
    )
  }

  return (
    <button type="button" className={baseClasses} onClick={onClick} title={title || ""}>
      {children}
      {isCollapsed && title && (
        <div className="absolute left-full ml-3.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
          {title}
        </div>
      )}
    </button>
  )
}

const SidebarTrigger = ({ onClick, className = "", isCollapsed = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Alternar menú lateral"
      className={`
        p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        ${className}
      `}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarContext,
}
