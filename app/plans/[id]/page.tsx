'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PlanEditor from '@/components/PlanEditor'
import { Menu } from 'lucide-react'

export default function PlanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-72 ml-0">
          <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan Editor</h1>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <PlanEditor />
          </div>
        </main>
      </div>
    </div>
  )
}