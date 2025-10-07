'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { 
  LogOut, 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  Plus,
  FolderOpen,
  Calendar,
  Users,
  Home,
  BarChart3,
  Zap,
  Bell,
  Search,
  X,
  Menu,
  Bot,
  Activity,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeTab?: string
  setActiveTab?: (tab: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ isOpen = true, onClose, activeTab = 'dashboard', setActiveTab, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  // Helper function to check if we're on mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1024
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 z-10 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'w-16' : 'w-72'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
        <div className={`border-b border-slate-200 dark:border-slate-700 ${isCollapsed ? 'p-3' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Traycer
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    AI-Powered Planning
                  </p>
                </div>
              )}
            </div>
            {/* Hamburger menu button */}
            <button
              onClick={onToggleCollapse}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* User Info */}
        <div className={`border-b border-slate-200 dark:border-slate-700 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Bell className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-1 ${isCollapsed ? 'p-2' : 'p-4'} overflow-y-auto hover:scrollbar-thin hover:scrollbar-thumb-slate-300 hover:scrollbar-track-transparent dark:hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent transition-all duration-200`}>
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Main
              </p>
            )}
            <button
              onClick={() => {
                setActiveTab?.('dashboard')
                router.push('/dashboard')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <Home className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Dashboard</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('projects')
                router.push('/dashboard?tab=projects')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'projects'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Projects' : undefined}
            >
              <FolderOpen className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Projects</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('analytics')
                router.push('/dashboard?tab=analytics')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Analytics' : undefined}
            >
              <BarChart3 className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Analytics</span>}
            </button>
          </div>

          <div className="space-y-1 mt-6">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Team
              </p>
            )}
            <button
              onClick={() => {
                setActiveTab?.('collaborators')
                router.push('/dashboard?tab=collaborators')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'collaborators'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Collaborators' : undefined}
            >
              <Users className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Collaborators</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('plans')
                router.push('/dashboard?tab=plans')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'plans'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Plans' : undefined}
            >
              <Calendar className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Plans</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('templates')
                router.push('/dashboard?tab=templates')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'templates'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Templates' : undefined}
            >
              <Plus className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Templates</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('agents')
                router.push('/dashboard?tab=agents')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'agents'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Agents' : undefined}
            >
              <Bot className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Agents</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab?.('workflow')
                router.push('/dashboard?tab=workflow')
                // Only close sidebar on mobile devices
                if (isMobile()) {
                  onClose?.()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'workflow'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? 'Workflow' : undefined}
            >
              <Sparkles className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Agent Workflow</span>}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-200 dark:border-slate-700 space-y-2 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}
            title={isCollapsed ? 'Theme' : undefined}
          >
            {getThemeIcon()}
            {!isCollapsed && <span className="font-medium">Theme</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab?.('settings')
              router.push('/dashboard?tab=settings')
              // Only close sidebar on mobile devices
              if (window.innerWidth < 1024) {
                onClose?.()
              }
            }}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
        </div>
      </div>
    </>
  )
}
