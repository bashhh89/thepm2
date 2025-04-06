"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChatInterface } from "@/components/chat/chat-interface";
import Sidebar from '@/components/sidebar';
import { useSidebarStore } from '@/store/sidebarStore';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isHistoryPage = pathname === '/chat/history';
  const { isExpanded } = useSidebarStore();

  return (
    <div className="flex h-screen bg-zinc-900 overflow-hidden">
      {/* Sidebar will be fixed positioned */}
      <Sidebar />
      
      {/* Fixed width placeholder that matches sidebar width */}
      <div className={`flex-none transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-56' : 'w-16'
      }`} aria-hidden="true" />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          {isHistoryPage ? children : <ChatInterface />}
        </main>
      </div>
    </div>
  )
} 