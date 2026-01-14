import React from "react"

import { Bell, Award, Home, MessageSquare, Search, Settings, Target, Users } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import appRoutes from "@/routes/appRoutes"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Home", href: appRoutes.dashboard, icon: Home },
  { name: "My Requests", href: appRoutes.skillExchangeRequests, icon: Users },
  { name: "Find Skills", href: appRoutes.findSkills, icon: Search },
  { name: "Chats", href: appRoutes.chats, icon: MessageSquare },
  // These routes are not fully implemented yet – we keep them in the UI but
  // show a toast instead of navigating to a 404.
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Certifications", href: appRoutes.certifications, icon: Award },
  { name: "Challenges", href: appRoutes.skillChallenges, icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  currentPath?: string
  onNavigate?: (href: string) => void
}

export default function Sidebar({ currentPath = "/dashboard", onNavigate }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Prefer the explicitly provided path, otherwise fall back to the real URL.
  const activePath = currentPath || location.pathname

  const handleClick = (href: string) => {
    // For unfinished sections, keep the UI but avoid broken navigation.
    if (href === "/notifications" || href === "/settings") {
      toast.info("This section is coming soon.")
      return
    }

    if (onNavigate) {
      onNavigate(href)
    } else {
      navigate(href)
    }
  }

  return (
    <div className="relative flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
          <span className="text-base font-bold text-white">SE</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">SkillExchange</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = activePath === item.href
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.href)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <button
          // Use the existing edit-profile route so this always works from dashboard.
          onClick={() => handleClick(appRoutes.editProfile)}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-50 ${
            activePath === appRoutes.editProfile ? "bg-gray-100" : ""
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium text-gray-700">AS</span>
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-semibold text-gray-900">Akash Sharma</p>
            <p className="truncate text-xs text-gray-500">View Profile</p>
          </div>
        </button>
      </div>
    </div>
  )
}