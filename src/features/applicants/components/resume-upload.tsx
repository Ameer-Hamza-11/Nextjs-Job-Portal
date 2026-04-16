// src/components/ResumeUpload.tsx
"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X, FileText, CheckCircle } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface ResumeUploadProps {
  value?: string;
  onChange: (url: string, fileName: string, fileSize: number) => void;
  className?: string;
}

export const ResumeUpload = ({
  value,
  onChange,
  className,
}: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const file = res[0];
        onChange(file.ufsUrl, file.name, file.size);
        setFileName(file.name);
        toast.success("Resume uploaded successfully!");
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    await startUpload([file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", "", 0);
    setFileName(null);
    toast.success("Resume removed");
  };

  // If a resume is already uploaded
  if (value) {
    return (
      <div
        className={cn(
          "border-2 border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-green-50 to-emerald-50",
          className
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {fileName || "Resume.pdf"}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <FileText className="h-3 w-3" />
                View Document
              </a>
              <span className="text-xs text-green-600 inline-flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Uploaded
              </span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 w-full sm:w-auto"
          onClick={handleRemove}
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    );
  }

  // Upload State UI
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-700">Uploading securely...</p>
          <p className="text-xs text-gray-400">Please don't close this window</p>
        </div>
      ) : (
        <>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 transition-transform group-hover:scale-110">
            <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-800">
            <span className="text-blue-600">Click to browse</span> or drag and drop
          </h4>
          <p className="text-xs text-gray-500 mt-2">
            PDF format only • Max size 5MB
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your resume will be visible to employers when you apply
          </p>
        </>
      )}
    </div>
  );
};