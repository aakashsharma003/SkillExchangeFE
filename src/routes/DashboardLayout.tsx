import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useState, createContext, useContext, useEffect } from "react"
import Sidebar from "@/components/Dashboard/SideBar"
import DynamicIsland from "@/components/ui/DynamicIsland"
import { Menu } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

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

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768)

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname])

  // Close sidebar on resize to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setSidebarOpen: setIsSidebarOpen }}>
      <div className="flex h-screen bg-background overflow-hidden relative">
        <Sidebar
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className={`flex flex-col flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#e4efe8] via-[#eef4f1] to-[#f9fbfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-0 pt-16 md:p-6 transition-all duration-300 ease-in-out md:pb-6 pb-[74px] ${isSidebarOpen ? "md:ml-64 ml-0" : "md:ml-20 ml-0"}`}>
          {/* Mobile Dynamic Island Top Bar */}
          <DynamicIsland />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-[1600px] mx-auto p-4 md:p-0 flex-1 flex flex-col min-h-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
