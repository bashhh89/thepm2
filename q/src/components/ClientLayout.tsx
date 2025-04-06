'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import Header from './Header'
import { useAuth } from '../context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

// Define the ClientLayout component
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [mountTime] = useState(Date.now())
  
  // Log the pathname for debugging
  useEffect(() => {
    console.log("ClientLayout active on path:", pathname)
    console.log("Auth state:", { user, loading, isRedirecting })
  }, [pathname, user, loading, isRedirecting])
  
  // Handle authentication redirects
  useEffect(() => {
    // Don't redirect during loading or if already redirecting
    if (loading || isRedirecting) return
    
    // If the user is not authenticated and we're not on the login page
    if (!user && !pathname.includes('/login') && !pathname.includes('/signup')) {
      // Don't redirect immediately on first mount to prevent flicker
      const timeOnPage = Date.now() - mountTime
      const minimumTimeBeforeRedirect = 1500 // 1.5 seconds
      
      // Only redirect if we've been on the page for a minimum time
      // This prevents redirect flicker on first load
      if (timeOnPage < minimumTimeBeforeRedirect) {
        const redirectDelay = minimumTimeBeforeRedirect - timeOnPage
        console.log(`Delaying auth redirect for ${redirectDelay}ms`)
        
        setIsRedirecting(true)
        setTimeout(() => {
          console.log('Redirecting to login due to no authenticated user')
          router.push('/login')
        }, redirectDelay)
      } else {
        console.log('Redirecting to login due to no authenticated user')
        setIsRedirecting(true)
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router, mountTime, isRedirecting])
  
  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // If authenticated or on a public page, render the content
  if (user || pathname.includes('/login') || pathname.includes('/signup') || isRedirecting) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Fixed header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        
        {/* Fixed sidebar and scrollable main content with proper spacing */}
        <div className="flex flex-1 pt-16"> {/* Space for header */}
          {/* Fixed sidebar */}
          <div className="fixed top-16 left-0 bottom-0 z-40">
            <Sidebar />
          </div>
          
          {/* Main content with proper sidebar spacing */}
          <main className="flex-1 ml-16 md:ml-64 lg:ml-64 px-6 py-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    )
  }
  
  // Fallback loading state while redirecting (should rarely appear)
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  )
}

export default ClientLayout 