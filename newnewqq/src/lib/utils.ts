import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats date string to a readable format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

// Format file size to human readable size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Conversation Memory Helper
 * Handles conversation context processing for more coherent voice conversations
 */
export class ConversationMemory {
  // Process messages to create a well-formatted conversation context
  static processMessages(messages: any[]): Array<{role: string, content: string}> {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return [];
    }
    
    // Add a system message to ensure the model remembers context
    const systemMessage = {
      role: "system",
      content: "You are a helpful voice assistant with memory of this conversation. Remember all relevant details from previous messages, and refer to them when appropriate. Keep your responses concise and conversational. Never say you can't remember previous messages as you have full access to conversation history."
    };
    
    // Process each message to extract plain text content
    const processedMessages = messages.flatMap(message => {
      // Skip empty or malformed messages
      if (!message || !message.role) {
        return [];
      }
      
      if (message.content && Array.isArray(message.content)) {
        return message.content
          .filter((item: any) => item.type === "text" && item.content.trim().length > 0)
          .map((item: any) => ({
            role: message.role,
            content: item.content
          }));
      } else if (message.content && typeof message.content === "string") {
        return [{
          role: message.role, 
          content: message.content.trim()
        }];
      }
      
      return [];
    }).filter(msg => msg.content && msg.content.trim() !== "");
    
    // Keep the most recent messages to avoid token limits (18 messages max)
    // This allows for about 8-9 full exchanges which is plenty for voice conversation
    const recentMessages = processedMessages.slice(-18);
    
    // Return with system message first, then conversation history
    return [systemMessage, ...recentMessages];
  }
  
  // Create a summary of the conversation for debugging
  static summarizeContext(context: Array<{role: string, content: string}>): string {
    if (!context || context.length <= 1) {
      return "Empty context";
    }
    
    return `${context.length} messages: ${
      context.slice(1, 4).map(m => `[${m.role.substring(0, 1)}:"${m.content.substring(0, 30)}..."]`).join(", ")
    }${context.length > 4 ? ', ...' : ''}`;
  }
}