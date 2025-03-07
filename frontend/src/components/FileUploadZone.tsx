import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { Button } from './Button';

interface FileUploadZoneProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function FileUploadZone({
  onUpload,
  isUploading = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
}: FileUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error) {
        switch (error.code) {
          case 'file-too-large':
            toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
            break;
          case 'file-invalid-type':
            toast.error('Invalid file type. Please upload a PDF, DOC, or DOCX file');
            break;
          default:
            toast.error('Error uploading file');
        }
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
        isDragActive && !isDragReject && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        !isDragActive && !isDragReject && 'border-muted-foreground/20 hover:border-primary/50'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading and analyzing your resume...</p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="w-8 h-8 text-primary" />
            <p className="text-sm text-muted-foreground">Drop your resume here</p>
          </>
        ) : (
          <>
            <File className="w-8 h-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Upload your resume</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop your resume here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, or DOCX up to {maxSize / 1024 / 1024}MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              Browse Files
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 