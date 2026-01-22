"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, Image, X } from "lucide-react";

export interface MultiFileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  className?: string;
  maxFiles?: number;
}

export function MultiFileUpload({
  onFilesChange,
  accept = ".pdf,.jpeg,.jpg,.png",
  className,
  maxFiles,
}: MultiFileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    const validFiles = newFiles.filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      return accept.split(",").some((ext) => extension === ext.trim());
    });

    const updatedFiles = maxFiles
      ? [...files, ...validFiles].slice(0, maxFiles)
      : [...files, ...validFiles];

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors relative cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="relative z-0 pointer-events-none flex items-center gap-2">
          <Upload className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-700">
            Drop files here or Upload files
          </p>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">Accepted file type: .pdf, .jpeg & .png</p>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
            const FileIcon = isPDF ? FileText : Image;
            
            return (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full"
              >
                <FileIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => removeFile(index, e)}
                  className="ml-1 p-0.5 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

