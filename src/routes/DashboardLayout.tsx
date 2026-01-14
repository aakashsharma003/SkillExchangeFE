import { Outlet, useLocation, useNavigate } from "react-router-dom"

import Sidebar from "@/components/Dashboard/SideBar"

/**
 * Shared layout for all dashboard-style pages.
 *
 * - Renders the left sidebar once and keeps it mounted while only the
 *   right-hand content switches via nested routes.
 * - Ensures smoother navigation when switching between "Home", "My Requests",
 *   "Find Skills", "Certifications", etc.
 */
export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPath={location.pathname} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}


