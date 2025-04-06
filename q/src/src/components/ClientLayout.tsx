'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

// Define the ClientLayout component
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Log the pathname for debugging
  useEffect(() => {
    console.log("ClientLayout active on path:", pathname)
  }, [pathname])
  
  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // If not authenticated and finished loading, redirect to login
  if (!user && !loading) {
    router.push('/login')
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  // Authenticated user with sidebar for all pages
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default ClientLayout 