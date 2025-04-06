import './globals.css'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/AuthContext'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import React from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import MarketingLayout from './marketing-layout'

const inter = Inter({ subsets: ['latin'] })

// Define public/marketing routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/features',
  '/about',
  '/pricing',
  '/contact',
]

// Define routes that need special handling
const SPECIAL_ROUTES = [
  '/chat',
  '/dashboard',
]

export const metadata: Metadata = {
  title: 'QanDuAI - All-in-one AI Productivity Platform',
  description: 'Generate presentations, manage projects, and create content with AI',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ErrorBoundary>
            <AuthProvider>
              {/* We'll handle route checking client-side */}
              {typeof window !== 'undefined' ? (
                <>
                  {PUBLIC_ROUTES.some(route => 
                    window.location.pathname === route || 
                    window.location.pathname.startsWith(`${route}/`)
                  ) ? (
                    <MarketingLayout>{children}</MarketingLayout>
                  ) : (
                    <ClientLayout>{children}</ClientLayout>
                  )}
                </>
              ) : (
                // Server-side fallback - client will correct it on hydration
                <div>{children}</div>
              )}
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}