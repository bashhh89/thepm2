"use client"

import { usePathname } from 'next/navigation';
import { ChatInterface } from "@/components/chat/chat-interface";
import Sidebar from '@/components/sidebar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isHistoryPage = pathname === '/chat/history';

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        {isHistoryPage ? children : <ChatInterface />}
      </div>
    </div>
  )
} 