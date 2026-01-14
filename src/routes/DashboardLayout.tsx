import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import Sidebar from "@/components/Dashboard/SideBar"

/**
 * Shared layout for all dashboard-style pages.
 *
 * - Renders the left sidebar once and keeps it mounted while only the
 *   right-hand content switches via nested routes.
 * - Ensures smoother navigation when switching between "Home", "My Requests",
 *   "Find Skills", "Certifications", etc.
 * - Sidebar is fixed and collapsible
 * - Main content area is scrollable
 */
export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentPath={location.pathname} 
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "ml-64" : "ml-20"
      }`}>
        <Outlet />
      </main>
    </div>
  )
}


