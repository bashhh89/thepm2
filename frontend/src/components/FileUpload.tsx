import React, { forwardRef, useState } from 'react';
import { cn } from '../lib/utils';
import { Upload, X } from 'lucide-react';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onClear?: () => void;
  maxSize?: number; // Add maxSize prop to FileUploadProps
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, error, helperText, value, onClear, onChange, accept, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(value || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      setPreview(null);
      onClear?.();
    };

    const isImage = accept?.includes('image/*');

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="file"
            className="hidden"
            ref={ref}
            onChange={handleChange}
            accept={accept}
            {...props}
          />
          <div
            onClick={() => ref && (ref as React.MutableRefObject<HTMLInputElement>).current?.click()}
            className={cn(
              "flex min-h-[160px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-input bg-background p-4",
              "hover:bg-accent hover:text-accent-foreground",
              error && "border-destructive",
              className
            )}
          >
            {preview ? (
              isImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">File uploaded</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="p-1 rounded-full hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span>Click to upload or drag and drop</span>
                {accept && <span className="text-xs">{accept.replace(',', ' or ')}</span>}
              </div>
            )}
          </div>
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
