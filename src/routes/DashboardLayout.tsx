import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useState, createContext, useContext } from "react"
import Sidebar from "@/components/Dashboard/SideBar"

// Context for sidebar state
type SidebarContextType = {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within DashboardLayout")
  }
  return context
}

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
    <SidebarContext.Provider value={{ isSidebarOpen, setSidebarOpen: setIsSidebarOpen }}>
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
    </SidebarContext.Provider>
  )
}


