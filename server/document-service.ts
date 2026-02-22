import { storagePut, storageGet } from "./storage";
import crypto from "crypto";

export interface DocumentUploadOptions {
  userId: string;
  documentType: "government_id" | "selfie" | "property_photo" | "other";
  file: Buffer;
  fileName: string;
  mimeType: string;
}

export interface DocumentMetadata {
  key: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  documentType: string;
}

const ALLOWED_MIME_TYPES: Record<DocumentUploadOptions["documentType"], string[]> = {
  government_id: ["image/jpeg", "image/png", "application/pdf"],
  selfie: ["image/jpeg", "image/png"],
  property_photo: ["image/jpeg", "image/png", "image/webp"],
  other: ["application/pdf", "image/jpeg", "image/png"],
};

const MAX_FILE_SIZES: Record<DocumentUploadOptions["documentType"], number> = {
  government_id: 10 * 1024 * 1024, // 10MB
  selfie: 5 * 1024 * 1024, // 5MB
  property_photo: 10 * 1024 * 1024, // 10MB
  other: 15 * 1024 * 1024, // 15MB
};

/**
 * Validate document before upload
 */
export function validateDocument(
  options: DocumentUploadOptions
): { valid: boolean; error?: string } {
  const allowedTypes = ALLOWED_MIME_TYPES[options.documentType];
  const maxSize = MAX_FILE_SIZES[options.documentType];

  if (!allowedTypes.includes(options.mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  if (options.file.length > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Encrypt file content using AES-256-GCM
 */
export function encryptDocument(
  file: Buffer,
  encryptionKey: string
): { encrypted: Buffer; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "hex"),
    iv
  );

  const encrypted = Buffer.concat([cipher.update(file), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypt file content
 */
export function decryptDocument(
  encrypted: Buffer,
  encryptionKey: string,
  iv: string,
  authTag: string
): Buffer {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
}

/**
 * Upload document to S3 with encryption
 */
export async function uploadDocument(
  options: DocumentUploadOptions,
  encryptionKey: string
): Promise<DocumentMetadata> {
  // Validate document
  const validation = validateDocument(options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Encrypt file
  const { encrypted, iv, authTag } = encryptDocument(
    options.file,
    encryptionKey
  );

  // Generate unique key
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const fileKey = `documents/${options.userId}/${options.documentType}/${timestamp}-${randomSuffix}`;

  // Upload to S3
  const { url } = await storagePut(
    fileKey,
    encrypted,
    "application/octet-stream"
  );

  return {
    key: fileKey,
    url,
    fileName: options.fileName,
    mimeType: options.mimeType,
    size: options.file.length,
    uploadedAt: new Date(),
    documentType: options.documentType,
  };
}

/**
 * Get secure download URL for document
 */
export async function getDocumentUrl(key: string): Promise<string> {
  const { url } = await storageGet(key);
  return url;
}

/**
 * Delete document from S3
 */
export async function deleteDocument(key: string): Promise<void> {
  // TODO: Implement S3 delete when available in storage service
  console.log(`Document deletion scheduled for: ${key}`);
}
