import React, { useState } from "react"

import { Bell, Home, MessageSquare, Search, Settings, Target, Users, LogOut, CalendarDays } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import appRoutes from "@/routes/appRoutes"
import { useAuth } from "@/context/auth/useAuth"
import { useUser } from "@/context/auth/useUser"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Home", href: appRoutes.dashboard, icon: Home },
  { name: "Find Skills", href: appRoutes.findSkills, icon: Search },
  { name: "Chats", href: appRoutes.chats, icon: MessageSquare },
  { name: "Calendar", href: appRoutes.calendar, icon: CalendarDays },
  // These routes are not fully implemented yet – we keep them in the UI but
  // show a toast instead of navigating to a 404.
  { name: "Notifications", href: appRoutes.notifications, icon: Bell },
  { name: "Settings", href: appRoutes.settings, icon: Settings },
]

interface SidebarProps {
  currentPath?: string
  onNavigate?: (href: string) => void
  isOpen?: boolean
  onToggle?: () => void
}

export default function Sidebar({ currentPath = "/dashboard", onNavigate, isOpen = true, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  // Get current user for profile display
  let currentUser = null
  try {
    currentUser = useUser().user
  } catch (error) {
    // User not loaded yet, will show default
  }

  // Prefer the explicitly provided path, otherwise fall back to the real URL.
  const activePath = currentPath || location.pathname

  const handleClick = (href: string) => {

    // Auto-shrink sidebar when clicking on Chats
    if (href === appRoutes.chats && isOpen) {
      onToggle?.()
    }

    if (onNavigate) {
      onNavigate(href)
    } else {
      navigate(href)
    }
  }

  const handleLogoutClick = () => {
    window.dispatchEvent(new CustomEvent('trigger-island', {
      detail: {
        state: 'logout',
        onAccept: logout
      }
    }))
  }

  return (
    <>      
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex fixed left-0 top-0 h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-20"} z-40`}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black flex-shrink-0">
                <span className="text-base font-bold text-white">SE</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 whitespace-nowrap">SkillExchange</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ${!isOpen ? 'ml-auto' : ''}`}
            aria-label="Toggle sidebar"
          >
            <svg
              className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = activePath === item.href
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => handleClick(item.href)}
                title={!isOpen ? item.name : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.name}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => handleClick(appRoutes.editProfile)}
            title={!isOpen ? "View Profile" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-50 ${activePath === appRoutes.editProfile ? "bg-gray-100" : ""}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {currentUser?.fullName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden text-left hover:text-gray-600">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {currentUser?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-gray-500">Edit Profile</p>
              </div>
            )}
          </button>
          <button
            onClick={handleLogoutClick}
            title={!isOpen ? "Log out" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-red-50 text-gray-600 hover:text-red-600`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isOpen && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Appbar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around h-[64px] px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        {navigation.map((item) => {
           // On mobile, let's limit nav items to top 4 to prevent crowding, mostly core functionalities
           if (!['Home', 'Find Skills', 'Chats', 'Calendar'].includes(item.name)) return null;

           const isActive = activePath === item.href
           const Icon = item.icon
           return (
              <button 
                  key={item.name} 
                  onClick={() => handleClick(item.href)} 
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-slate-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                 <Icon className={`h-[22px] w-[22px] ${isActive ? "fill-slate-900/10 stroke-[2.5px]" : "stroke-2"}`} />
                 <span className={`text-[10px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
              </button>
           )
        })}
        {/* Profile Mobile */}
        <button 
             onClick={() => handleClick(appRoutes.editProfile)} 
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activePath === appRoutes.editProfile ? "text-slate-900" : "text-gray-400 hover:text-gray-600"}`}
        >
             <div className={`flex h-[24px] w-[24px] items-center justify-center rounded-full bg-slate-100 ${activePath === appRoutes.editProfile ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}>
                 <span className="text-[11px] font-bold text-gray-700">
                    {currentUser?.fullName?.charAt(0).toUpperCase() || "U"}
                 </span>
             </div>
             <span className={`text-[10px] tracking-wide ${activePath === appRoutes.editProfile ? "font-bold" : "font-medium"}`}>Profile</span>
        </button>
      </nav>
    </>
  )
}