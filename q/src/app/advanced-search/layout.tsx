'use client'

import React from 'react'
import Sidebar from '../../components/sidebar'
import { useAuth } from '../../context/AuthContext'
import { useSidebarStore } from '../../store/sidebarStore'
import { useRouter, usePathname } from 'next/navigation'

export default function AdvancedSearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { isExpanded } = useSidebarStore()
  
  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // If authenticated, render without header
  if (user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex flex-1">
          {/* Fixed sidebar */}
          <div className="fixed inset-y-0 left-0 z-40">
            <Sidebar />
          </div>
          
          {/* Main content with responsive sidebar spacing */}
          <main 
            className={`flex-1 transition-all duration-300 px-6 py-6 overflow-y-auto ${
              isExpanded 
                ? "ml-64" // Expanded sidebar (default)
                : "ml-16" // Collapsed sidebar
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    )
  }
  
  // If not authenticated, redirect to login
  router.push('/login')
  
  // Fallback loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  )
} 