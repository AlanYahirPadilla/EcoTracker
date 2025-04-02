"use client"

import { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Recycle,
  Gift,
  Trophy,
  History,
  Ticket,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react"

export default function Authenticated({ user, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true) // Por defecto visible en desktop
  const [isCollapsed, setIsCollapsed] = useState(false) // Estado para sidebar colapsado en desktop

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarCollapsed")
    if (savedSidebarState !== null) {
      setIsCollapsed(savedSidebarState === "true")
    }
  }, [])

  // Función para alternar el estado del sidebar en desktop
  const toggleSidebarCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", newState.toString())
  }

  // Función para crear un ResponsiveNavLink
  const ResponsiveNavLink = ({ href, method = "get", as = "a", active = false, children }) => {
    return (
      <Link
        href={href}
        method={method}
        as={as}
        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
          active
            ? "border-white text-white bg-green-700"
            : "border-transparent text-gray-200 hover:text-white hover:bg-green-700"
        }`}
      >
        {children}
      </Link>
    )
  }

  const { route } = usePage().props

  // Elementos del menú
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Registrar Reciclaje", href: "/recycle", icon: Recycle },
    { name: "Recompensas", href: "/rewards", icon: Gift },
    { name: "Ranking", href: "/ranking", icon: Trophy },
    { name: "Niveles", href: "/levels", icon: Star }, // Añadido el elemento Niveles
    { name: "Historial de Canjes", href: "/rewards/history", icon: History },
    { name: "Mis Tickets", href: "/tickets", icon: Ticket },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar izquierdo para desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-64"} md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            {!isCollapsed ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="text-xl font-bold text-green-600">EcoTracker</span>
              </Link>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            )}

            <div className="flex">
              {/* Botón para colapsar/expandir en desktop */}
              <button onClick={toggleSidebarCollapse} className="text-gray-500 hover:text-gray-700 hidden md:block">
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>

              {/* Botón para cerrar en móvil */}
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-500 hover:text-gray-700 md:hidden ml-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"} p-2 rounded-md hover:bg-green-50 transition-colors ${
                    window.location.pathname.startsWith(item.href) ? "bg-green-100 text-green-700" : "text-gray-700"
                  }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}

              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"} p-2 rounded-md hover:bg-green-50 transition-colors text-gray-700`}
                  title={isCollapsed ? "Admin Dashboard" : ""}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  {!isCollapsed && <span>Admin Dashboard</span>}
                </Link>
              )}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Link
              href="/profile/edit"
              className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"} p-2 rounded-md hover:bg-green-50 transition-colors text-gray-700`}
              title={isCollapsed ? "Mi Perfil" : ""}
            >
              <User className="h-5 w-5" />
              {!isCollapsed && <span>Mi Perfil</span>}
            </Link>

            <Link
              href="/logout"
              method="post"
              as="button"
              className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-2"} p-2 rounded-md hover:bg-green-50 transition-colors text-gray-700`}
              title={isCollapsed ? "Cerrar Sesión" : ""}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "md:ml-16" : "md:ml-64"}`}>
        {/* Barra superior */}
        <nav className="bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* Botón para mostrar sidebar en móvil */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none transition duration-150 ease-in-out md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <h1 className="text-2xl font-bold">EcoTracker</h1>
                  {user.role === "admin" && (
                    <span className="bg-white text-green-600 px-2 py-0.5 rounded text-xs font-bold">ADMIN</span>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-bold">{user.points || 0} puntos</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.name}</span>
                  </div>
                </div>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <ResponsiveNavLink
                  key={item.name}
                  href={item.href}
                  active={window.location.pathname.startsWith(item.href)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                </ResponsiveNavLink>
              ))}
            </div>

            <div className="pt-4 pb-1 border-t border-gray-200">
              <div className="px-4">
                <div className="font-medium text-base text-white">{user.name}</div>
                <div className="font-medium text-sm text-gray-200">{user.email}</div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href="/profile/edit">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </div>
                </ResponsiveNavLink>
                <ResponsiveNavLink method="post" href="/logout" as="button">
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </div>
                </ResponsiveNavLink>
              </div>
            </div>
          </div>
        </nav>

        {header && (
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
          </header>
        )}

        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Overlay para cerrar el sidebar al hacer clic fuera (solo en móvil) */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
    </div>
  )
}


