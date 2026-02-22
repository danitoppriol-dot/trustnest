import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { uploadDocument, validateDocument } from "../document-service";
import { documents } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

const ENCRYPTION_KEY = process.env.DOCUMENT_ENCRYPTION_KEY || "0".repeat(64); // 64 hex chars = 32 bytes

export const documentsRouter = router({
  /**
   * Upload a document (ID, selfie, property photo, property deed)
   */
  upload: protectedProcedure
    .input(
      z.object({
        documentType: z.enum(["government_id", "selfie", "property_photo", "other"]),
        fileName: z.string(),
        mimeType: z.string(),
        fileData: z.string(), // base64 encoded
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Decode base64 file
        const fileBuffer = Buffer.from(input.fileData, "base64");

        // Validate document
        const validation = validateDocument({
          userId: ctx.user.id.toString(),
          documentType: input.documentType,
          file: fileBuffer,
          fileName: input.fileName,
          mimeType: input.mimeType,
        });

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Upload to S3
        const metadata = await uploadDocument(
          {
            userId: ctx.user.id.toString(),
            documentType: input.documentType,
            file: fileBuffer,
            fileName: input.fileName,
            mimeType: input.mimeType,
          },
          ENCRYPTION_KEY
        );

        // Save to database
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(documents).values({
          userId: ctx.user.id,
          documentType: input.documentType,
          fileKey: metadata.key,
          fileUrl: metadata.url,
          mimeType: input.mimeType,
          fileSize: metadata.size,
          encryptionAlgorithm: "AES-256-GCM",
          encryptionKeyId: "default",
        });

        return {
          success: true,
          documentType: input.documentType,
          fileName: input.fileName,
          uploadedAt: new Date(),
        };
      } catch (error) {
        console.error("Document upload error:", error);
        throw new Error(
          `Failed to upload document: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Get user's documents
   */
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, ctx.user.id));

      return userDocs.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        mimeType: doc.mimeType,
        fileSize: doc.fileSize,
        createdAt: doc.createdAt,
        // Don't expose S3 URL directly - use getUrl procedure
      }));
    } catch (error) {
      console.error("Get documents error:", error);
      throw new Error("Failed to fetch documents");
    }
  }),

  /**
   * Get secure URL for document (admin only)
   */
  getUrl: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get document
        const doc = await db
          .select()
          .from(documents)
          .where(eq(documents.id, input.documentId))
          .limit(1);

        if (!doc.length) {
          throw new Error("Document not found");
        }

        const document = doc[0];

        // Check permissions - user can view their own docs, admin can view all
        if (ctx.user.role !== "admin" && document?.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Return S3 URL (already signed by storagePut)
        return {
          url: document.fileUrl,
          key: document.fileKey,
          mimeType: document.mimeType,
        };
      } catch (error) {
        console.error("Get document URL error:", error);
        throw new Error("Failed to get document URL");
      }
    }),

  /**
   * Delete document (user can delete own, admin can delete any)
   */
  delete: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get document
        const doc = await db
          .select()
          .from(documents)
          .where(eq(documents.id, input.documentId))
          .limit(1);

        if (!doc.length) {
          throw new Error("Document not found");
        }

        const document = doc[0];

        // Check permissions
        if (ctx.user.role !== "admin" && document?.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Delete from database
        await db
          .delete(documents)
          .where(eq(documents.id, input.documentId));

        return { success: true };
      } catch (error) {
        console.error("Delete document error:", error);
        throw new Error("Failed to delete document");
      }
    }),
});
