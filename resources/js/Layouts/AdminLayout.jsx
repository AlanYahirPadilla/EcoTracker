"use client"

import { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Users,
  Recycle,
  Gift,
  Clock,
  BarChart3,
  Ticket,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react"

export default function AdminLayout({ children, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { url } = usePage()

  // Cerrar el menú móvil cuando cambia la URL
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [url])

  const renderNavLinks = () => {
    const links = [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Validaciones Pendientes", href: "/admin/validations", icon: Clock },
      { name: "Actividad Reciente", href: "/admin/activity", icon: BarChart3 },
      { name: "Historial de Canjes", href: "/admin/redemptions", icon: Gift },
      { name: "Tickets de Reciclaje", href: "/admin/tickets", icon: Ticket },
      { name: "Usuarios", href: "/admin/users", icon: Users },
      { name: "Materiales", href: "/admin/materials", icon: Recycle },
      { name: "Recompensas", href: "/admin/rewards", icon: Gift },
      { name: "Actividades", href: "/admin/activities", icon: Calendar },
      { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
    ]

    return links.map((link) => {
      const isActive = url.startsWith(link.href)
      const Icon = link.icon

      return (
        <Link
          key={link.name}
          href={link.href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive ? "bg-green-700 text-white" : "text-green-100 hover:bg-green-700 hover:text-white"
          }`}
        >
          <Icon
            className={`mr-3 flex-shrink-0 h-6 w-6 ${
              isActive ? "text-white" : "text-green-300 group-hover:text-white"
            }`}
          />
          {link.name}
        </Link>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para escritorio */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-green-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-white">EcoTracker Admin</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">{renderNavLinks()}</nav>
          </div>
          <div className="flex flex-shrink-0 bg-green-700 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || "Admin User"}</p>
                  <p className="text-xs font-medium text-green-200">{user?.email || "admin@example.com"}</p>
                </div>
                <Link href="/logout" method="post" as="button" className="ml-auto text-green-200 hover:text-white">
                  <LogOut className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="md:hidden">
        <div className="flex items-center justify-between bg-green-800 px-4 py-3">
          <h1 className="text-xl font-bold text-white">EcoTracker Admin</h1>
          <button
            type="button"
            className="text-green-200 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && <div className="bg-green-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">{renderNavLinks()}</div>}
      </div>

      {/* Contenido principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

