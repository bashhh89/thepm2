import React, { useRef } from 'react';
import { Button } from './Button';
import { Upload, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  accept: string;
  maxSize: number;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function FileUpload({ accept, maxSize, onUpload, isUploading }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    onUpload(file);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Resume
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open('https://www.qandu.ai/resume-tips', '_blank')}
        className="text-xs text-muted-foreground"
      >
        <FileText className="w-4 h-4 mr-1" />
        Resume Tips
      </Button>
    </div>
  );
} 