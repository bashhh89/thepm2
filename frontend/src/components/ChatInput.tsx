import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../extensions/shadcn/components/button";
import { cn } from "../lib/utils";
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string, attachment?: { url: string; type: string; name: string }) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isDisabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    progress: number;
  }>({
    isUploading: false,
    progress: 0
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled && !uploadState.isUploading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, Word document, text file, or image.');
      return;
    }

    setUploadState({ isUploading: true, progress: 0 });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState(prev => ({
            ...prev,
            progress
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          toast.success('File uploaded successfully!');
          onSendMessage(`Uploaded file: ${file.name}`, {
            url: response.fileUrl,
            type: file.type,
            name: file.name
          });
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.onloadend = () => {
        setUploadState({ isUploading: false, progress: 0 });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
      setUploadState({ isUploading: false, progress: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end rounded-lg border bg-card shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled || uploadState.isUploading}
          rows={1}
          className={cn(
            "flex-1 resize-none px-4 py-3 max-h-[200px]",
            "bg-transparent text-foreground placeholder:text-muted-foreground",
            "focus:outline-none disabled:opacity-50",
            "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20"
          )}
          style={{ scrollbarGutter: 'stable' }}
        />
        <div className="flex items-center px-3 py-2 gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0"
            disabled={isDisabled || uploadState.isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadState.isUploading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
            <span className="sr-only">
              {uploadState.isUploading 
                ? `Uploading... ${uploadState.progress}%` 
                : 'Attach file'
              }
            </span>
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isDisabled || uploadState.isUploading}
            className={cn(
              "rounded-full p-2 h-9 w-9",
              "transition-all duration-200",
              message.trim() && !isDisabled && !uploadState.isUploading
                ? "bg-primary text-primary-foreground opacity-100 translate-y-0"
                : "opacity-50 translate-y-1"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      {isDisabled && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-background/50 rounded-lg flex items-center justify-center animate-in">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '600ms' }} />
            </div>
            <span>AI is thinking...</span>
          </div>
        </div>
      )}

      {uploadState.isUploading && (
        <div className="absolute left-0 right-0 -top-8 flex items-center justify-center">
          <div className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">
            Uploading... {uploadState.progress}%
          </div>
        </div>
      )}
    </form>
  );
}
