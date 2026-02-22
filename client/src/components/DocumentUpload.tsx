import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface DocumentUploadProps {
  documentType: "government_id" | "selfie" | "property_photo" | "other";
  label: string;
  description?: string;
  onSuccess?: () => void;
}

export default function DocumentUpload({
  documentType,
  label,
  description,
  onSuccess,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    uploadedAt: Date;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => {
      toast.success(`${label} uploaded successfully`);
      setSelectedFile(null);
      setUploadedFile({
        name: selectedFile?.name || "File",
        size: selectedFile?.size || 0,
        uploadedAt: new Date(),
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes: Record<string, string[]> = {
      government_id: ["image/jpeg", "image/png", "application/pdf"],
      selfie: ["image/jpeg", "image/png"],
      property_photo: ["image/jpeg", "image/png", "image/webp"],
      other: ["application/pdf", "image/jpeg", "image/png"],
    };

    const maxSizes: Record<string, number> = {
      government_id: 10 * 1024 * 1024,
      selfie: 5 * 1024 * 1024,
      property_photo: 10 * 1024 * 1024,
      other: 15 * 1024 * 1024,
    };

    const allowed = allowedTypes[documentType] || [];
    const maxSize = maxSizes[documentType] || 10 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowed.join(", ")}`);
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];

        await uploadMutation.mutateAsync({
          documentType,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileData: base64,
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{label}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>

        {uploadedFile ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{uploadedFile.name}</p>
                <p className="text-sm text-green-700">
                  {(uploadedFile.size / 1024).toFixed(2)} KB • Uploaded{" "}
                  {uploadedFile.uploadedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Drag and drop your file here
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept={
                  documentType === "government_id"
                    ? "image/jpeg,image/png,application/pdf"
                    : documentType === "selfie"
                      ? "image/jpeg,image/png"
                      : documentType === "property_photo"
                        ? "image/jpeg,image/png,image/webp"
                        : "application/pdf,image/jpeg,image/png"
                }
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Select File
              </button>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-sm text-blue-700">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
