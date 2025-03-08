import React from 'react';
import { Button } from './Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}

export function ChatMessages({ messages, isTyping = false, onLeadCapture }: ChatMessagesProps & { onLeadCapture: (name: string, email: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      <AnimatePresence>
        {!messages.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Let's get started!</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                onLeadCapture(name, email);
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Chat
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <motion.div
              layout
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground ml-4' : 'bg-muted mr-4'} ${message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
            >
              <div className="flex flex-col">
                <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{message.content}</div>
                {message.attachment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-sm bg-black/5 rounded-lg p-2 hover:bg-black/10 transition-colors"
                  >
                    📎 <a href={message.attachment.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{message.attachment.name}</a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-muted p-4 rounded-2xl rounded-bl-sm max-w-[80%] shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
