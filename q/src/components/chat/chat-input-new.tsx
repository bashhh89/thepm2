"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, useMemo, useCallback, forwardRef, ForwardedRef } from 'react';
import { Send, Mic, Save, BookOpen, Globe, SendHorizontal, Paperclip, CornerDownLeft, Sparkles, Image as ImageIcon, Wand2, Loader2 } from 'lucide-react';
import { useChatStore } from "@/store/chatStore";
import { useMcpRequest } from "@/lib/mcpHelper";
import { useSettingsStore } from "@/store/settingsStore";
import { toasts } from '@/components/ui/toast-wrapper';
import { callPollinationsChat, AVAILABLE_MODELS, generatePollinationsAudio } from "@/lib/pollinationsApi"
import { showError, showSuccess, showInfo } from '@/components/ui/toast';
import { logError } from '@/utils/errorLogging';
import { cn } from '@/lib/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { processMessage } from '@/lib/prompt-service';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Types for saved prompts
interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  command?: string; // Optional custom command
}

// Define available slash commands
const SLASH_COMMANDS = [
  { command: '/clear', description: 'Clear the current conversation' },
  { command: '/help', description: 'Show available commands and how to use them' },
  { command: '/summarize', description: 'Summarize the current conversation' },
  { command: '/image', description: 'Generate an image from text description' },
  { command: '/model', description: 'Change the current AI model' },
  { command: '/voice', description: 'Change the voice used for audio responses' },
  { command: '/agent', description: 'Switch to a different agent' },
  { command: '/save', description: 'Save current prompt for future use' },
  { command: '/prompts', description: 'Show your saved prompts' }
];

// Get saved prompts from localStorage or return empty array
const getSavedPrompts = (): SavedPrompt[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedPrompts = localStorage.getItem('savedPrompts');
    return savedPrompts ? JSON.parse(savedPrompts) : [];
  } catch (err) {
    console.error('Failed to load saved prompts:', err);
    return [];
  }
};

// Save prompts to localStorage
const savePromptToStorage = (prompts: SavedPrompt[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('savedPrompts', JSON.stringify(prompts));
  } catch (err) {
    console.error('Failed to save prompts:', err);
  }
};

// Use Omit for standard attributes, explicitly list custom ones
export interface ChatInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'onSubmit'> {
  onSubmit: (content: string) => void;
  webSearchEnabled?: boolean;
  onWebSearchToggle?: () => void;
  onImageButtonClick: () => void;
  value: string; 
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  onEnhancePrompt: () => void; 
  isGenerating: boolean; 
  className?: string; // Make className optional
}

// Use the ForwardRefRenderFunction signature correctly
const ChatInputComponent: React.ForwardRefRenderFunction<HTMLTextAreaElement, ChatInputProps> = (
  { onSubmit, webSearchEnabled, onWebSearchToggle, onImageButtonClick, value, onChange, onEnhancePrompt, isGenerating, className, ...props }, 
  ref // This is the forwarded ref
) => {
  const { sendRequest } = useMcpRequest();
  const addMessage = useChatStore(state => state.addMessage);
  const { activeAgent } = useSettingsStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || localRef;
  const autoPlayAfterVoiceInput = useSettingsStore(state => state.autoPlayAfterVoiceInput);
  const activeVoice = useSettingsStore(state => state.activeVoice);
  
  // State for saved prompts functionality
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [promptNameInput, setPromptNameInput] = useState('');
  const [promptCommandInput, setPromptCommandInput] = useState('');
  const [showSavePromptDialog, setShowSavePromptDialog] = useState(false);
  const [customCommands, setCustomCommands] = useState<typeof SLASH_COMMANDS>([]);
  
  // Add command history
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Load saved prompts on component mount
  useEffect(() => {
    setSavedPrompts(getSavedPrompts());
  }, []);
  
  // Watch for window resize to adjust the height of textarea
  useEffect(() => {
    function handleResize() {
      if (textareaRef.current) {
        adjustTextareaHeight(textareaRef);
      }
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust height after component mounts or when value changes
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef);
    }
  }, [value]);
  
  // Focus textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Adjust the height of the textarea based on its content
  const adjustTextareaHeight = (textareaRef: ForwardedRef<HTMLTextAreaElement> | React.RefObject<HTMLTextAreaElement>) => {
    if (textareaRef && typeof textareaRef === 'object' && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; 
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`; 
    }
  };
  
  // Function to get all available commands including custom ones
  const getAllCommands = useMemo(() => {
    return [...SLASH_COMMANDS, ...customCommands];
  }, [customCommands]);
  
  // Update the handleChange function to use provided onChange handler
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Call the parent's onChange handler to update the value
    onChange(e);
    
    // Handle slash commands
    if (e.target.value.startsWith('/')) {
      const query = e.target.value.slice(1).toLowerCase();
      setFilteredCommands(
        getAllCommands.filter(cmd => 
          cmd.command.toLowerCase().slice(1).includes(query) || 
          cmd.description.toLowerCase().includes(query)
        )
      );
      setShowCommands(true);
      setSelectedCommandIndex(0);
      
      // Hide prompts menu if showing
      setShowPrompts(false);
    } else {
      setShowCommands(false);
    }
    
    // Adjust height based on content
    adjustTextareaHeight(textareaRef);
  };

  // Handle selecting and using slash commands
  const handleCommandSelect = (command: string) => {
    const newEvent = {
      target: {
        value: command + ' '
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(newEvent);
    setShowCommands(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Handle selecting a saved prompt
  const handlePromptSelect = (prompt: SavedPrompt) => {
    const newEvent = {
      target: {
        value: prompt.prompt
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(newEvent);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    adjustTextareaHeight(textareaRef);
  };
  
  // Handle saving a new prompt
  const handleSavePrompt = () => {
    if (!value.trim()) {
      toasts.error('Cannot save an empty prompt');
      return;
    }
    
    setShowSavePromptDialog(true);
  };
  
  // Complete the save prompt process
  const completePromptSave = () => {
    if (!promptNameInput.trim()) {
      toasts.error('Please provide a name for your prompt');
      return;
    }
    
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      name: promptNameInput.trim(),
      prompt: value.trim(),
      command: promptCommandInput.trim() ? `/${promptCommandInput.trim()}` : undefined
    };
    
    const updatedPrompts = [...savedPrompts, newPrompt];
    setSavedPrompts(updatedPrompts);
    savePromptToStorage(updatedPrompts);
    
    setPromptNameInput('');
    setPromptCommandInput('');
    setShowSavePromptDialog(false);
    toasts.success(`Prompt "${newPrompt.name}" saved successfully`);
    
    // If a custom command was added, update the SLASH_COMMANDS
    if (newPrompt.command) {
      const newSlashCommand = { 
        command: newPrompt.command, 
        description: `Custom prompt: ${newPrompt.name}` 
      };
      setCustomCommands([...customCommands, newSlashCommand]);
    }
  };
  
  // Handle deleting a saved prompt
  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updatedPrompts);
    savePromptToStorage(updatedPrompts);
    toasts.success('Prompt deleted');
  };
  
  // Handle paste events for file uploads
  const handlePaste = async (e: React.ClipboardEvent) => {
    try {
      const items = Array.from(e.clipboardData.items);
      const hasImage = items.some(item => item.type.startsWith('image/'));
      
      if (hasImage) {
        e.preventDefault();
        showInfo('Processing pasted image...');
        
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              // Handle image paste - you can implement this based on your needs
              // For example, upload to storage and insert the URL
              showSuccess('Image pasted successfully');
            }
          }
        }
      }
    } catch (error) {
      logError({
        error: error instanceof Error ? error.toString() : 'Failed to handle paste',
        context: 'Chat Input Paste'
      });
      showError('Failed to process pasted content');
    }
  };

  // Store command history
  useEffect(() => {
    if (historyIndex >= 0) {
      onChange({
        target: {
          value: commandHistory[historyIndex] || ''
        }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [historyIndex, commandHistory, onChange]);

  // Handle key press events for special keys (e.g., Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle command history with arrow keys and Ctrl
    if (e.key === 'ArrowUp' && e.ctrlKey) {
      e.preventDefault();
      if (commandHistory.length > 0) {
        setHistoryIndex(prev => 
          prev < commandHistory.length - 1 ? prev + 1 : commandHistory.length - 1
        );
      }
      return;
    }
    
    if (e.key === 'ArrowDown' && e.ctrlKey) {
      e.preventDefault();
      setHistoryIndex(prev => (prev > 0 ? prev - 1 : 0));
      return;
    }

    // Handle keyboard shortcuts for commands
    if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredCommands[selectedCommandIndex]) {
          handleCommandSelect(filteredCommands[selectedCommandIndex].command);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommands(false);
      }
      return;
    }
    
    // Submit on Enter (but not with Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmedValue = value.trim();
      if (trimmedValue) {
        onSubmit(trimmedValue);
        // Clear the input by updating the parent's state
        onChange({
          target: {
            value: ''
          }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      }
    }
  };

  // Render web search indicator
  const renderWebSearchIndicator = () => {
    if (!webSearchEnabled) return null;
    
    return (
      <div className="absolute top-1 right-2 z-10">
        <div className="flex items-center text-xs text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-full">
          <Globe size={10} className="mr-1" />
          Web Search
        </div>
      </div>
    );
  };
  
  // Handle submit logic (send button or Enter key)
  const handleSend = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || isSubmitting) return;

    setIsSubmitting(true);
    onSubmit(trimmedValue);
    
    // Clear the input by updating the parent's state
    onChange({
      target: {
        value: ''
      }
    } as React.ChangeEvent<HTMLTextAreaElement>);
    
    setTimeout(() => setIsSubmitting(false), 100);
  };
  
  // Handle image button click
  const handleImageActionClick = () => {
        onImageButtonClick();
  };
  
  return (
    <div className={cn("relative", className)}>
      {/* Command suggestions */}
      {showCommands && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-h-60 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg z-10">
          <div className="p-2 border-b border-zinc-700 text-xs text-zinc-400">
            Available commands
          </div>
          <ul>
            {filteredCommands.map((cmd, index) => (
              <li
                key={cmd.command}
                onClick={() => handleCommandSelect(cmd.command)}
                className={`px-3 py-2 cursor-pointer ${
                  index === selectedCommandIndex
                    ? 'bg-zinc-700 text-white'
                    : 'hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <span className="font-mono text-zinc-400">{cmd.command}</span>
                <span className="text-xs text-zinc-500 ml-2">
                  {cmd.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saved prompts dialog */}
      {showPrompts && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-h-60 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg z-10">
          <div className="p-2 border-b border-zinc-700 text-xs text-zinc-400">
            Your saved prompts
          </div>
          {savedPrompts.length > 0 ? (
            <ul>
              {savedPrompts.map((prompt) => (
                <li
                  key={prompt.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <span className="text-zinc-300 truncate">{prompt.name}</span>
                  <button
                    className="text-zinc-500 hover:text-zinc-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePrompt(prompt.id);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-zinc-500 text-sm">
              No saved prompts yet. Use "/save" to create one.
            </div>
          )}
        </div>
      )}

      {/* Save prompt dialog */}
      {showSavePromptDialog && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg z-10 p-3">
          <h3 className="text-zinc-300 mb-2">Save This Prompt</h3>
          <input
            type="text"
            value={promptNameInput}
            onChange={(e) => setPromptNameInput(e.target.value)}
            placeholder="Name for this prompt"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 mb-2 text-zinc-200"
          />
          <input
            type="text"
            value={promptCommandInput}
            onChange={(e) => setPromptCommandInput(e.target.value)}
            placeholder="Custom command (optional, without /)"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 mb-2 text-zinc-200"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSavePromptDialog(false)}
              className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={completePromptSave}
              disabled={!promptNameInput.trim()}
              className={`px-3 py-1 rounded-md ${
                promptNameInput.trim()
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Main input area - Redesigned with Web Search toggle */}
      <div className="flex items-stretch gap-2"> 
        {/* Web Search Toggle Button */}
        {onWebSearchToggle && (
          <button
            onClick={onWebSearchToggle}
            className={`flex-shrink-0 p-1.5 rounded-md border ${
              webSearchEnabled 
                ? 'bg-blue-900/40 border-blue-700 text-blue-300 hover:bg-blue-900/60' 
                : 'border-zinc-700 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
            }`}
            title={webSearchEnabled ? "Web Search Enabled" : "Web Search Disabled"}
          >
            <Globe size={16} />
          </button>
        )}

        <div className="relative flex-grow flex items-end border border-zinc-700/75 rounded-lg bg-zinc-800/50 focus-within:border-zinc-600 p-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Type a message..."
            className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-zinc-300 placeholder:text-zinc-500 py-1 px-2 max-h-[180px] min-h-[36px]"
            {...props}
          />
          {renderWebSearchIndicator()}
          
          <div className="flex items-center flex-shrink-0 gap-1">
            {/* Enhance Prompt Button - Added for image generation flow */}
            <button
              onClick={onEnhancePrompt}
              disabled={!value.trim() || isGenerating}
              className={`p-1.5 rounded-md ${
                value.trim() && !isGenerating 
                  ? 'text-violet-400 hover:text-violet-300 hover:bg-zinc-700' 
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Enhance prompt with AI"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </button>

            {/* Image Generation Button */}
            <button
              onClick={handleImageActionClick}
              disabled={!value.trim() || isSubmitting}
              className={`p-1.5 rounded-md ${
                value.trim() ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Generate image"
              data-image-button="true"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            
            {/* Save Prompt Button */}
            <button
              onClick={handleSavePrompt}
              disabled={!value.trim() || isSubmitting}
              className={`p-1.5 rounded-md ${
                value.trim() ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Save current prompt"
            >
              <Save className="w-4 h-4" />
            </button>
            
            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!value.trim() || isSubmitting}
              className={`p-1.5 rounded-md ${
                value.trim() ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-500'
              }`}
              title="Send message"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export a forwardRef component
export const ChatInput = forwardRef(ChatInputComponent);

// Set display name for DevTools
ChatInput.displayName = 'ChatInput';