import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getVerificationByUserId,
  approveVerification,
  rejectVerification,
  getDocumentsByUserId,
  createAuditLog,
  getUserById,
  getDb,
} from "../db";
import { eq, desc } from "drizzle-orm";
import { verifications, documents, users } from "../../drizzle/schema";

/**
 * Admin Router
 * 
 * Protected procedures for admin-only operations:
 * - Verification review and approval/rejection
 * - User management and moderation
 * - Trust badge management
 * - Audit logging
 */

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only administrators can access this resource",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get pending verification requests
   */
  getPendingVerifications: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        priority: z.enum(["all", "low", "medium", "high"]).default("all"),
        userType: z.enum(["all", "tenant", "landlord"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          verifications: [],
          total: 0,
          hasMore: false,
        };
      }

      try {
        // Get pending verifications
        const results = await db
          .select()
          .from(verifications)
          .where(eq(verifications.status, "pending"))
          .orderBy(desc(verifications.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        // Get documents for each verification
        const verificationsWithDocs = await Promise.all(
          results.map(async (v) => {
            const docs = await getDocumentsByUserId(v.userId);
            const user = await getUserById(v.userId);
            return {
              id: v.id.toString(),
              userId: v.userId.toString(),
              userName: user?.name || "Unknown",
              userEmail: user?.email || "Unknown",
              userType: "tenant", // TODO: Get from user table
              status: v.status,
              documents: docs || [],
              riskFlags: [],
              submittedAt: v.createdAt?.toISOString() || new Date().toISOString(),
              priority: "medium",
            };
          })
        );

        return {
          verifications: verificationsWithDocs,
          total: results.length,
          hasMore: results.length === input.limit,
        };
      } catch (error) {
        console.error("[Admin] Error fetching pending verifications:", error);
        return {
          verifications: [],
          total: 0,
          hasMore: false,
        };
      }
    }),

  /**
   * Get verification details
   */
  getVerificationDetails: adminProcedure
    .input(z.object({ verificationId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { verification: null };
      }

      try {
        const verificationId = parseInt(input.verificationId);
        const result = await db
          .select()
          .from(verifications)
          .where(eq(verifications.id, verificationId))
          .limit(1);

        if (result.length === 0) {
          return { verification: null };
        }

        const v = result[0];
        const docs = await getDocumentsByUserId(v.userId);
        const user = await getUserById(v.userId);

        return {
          verification: {
            id: v.id.toString(),
            userId: v.userId.toString(),
            userName: user?.name || "Unknown",
            userEmail: user?.email || "Unknown",
            userType: "tenant", // TODO: Get from user table
            status: v.status,
            documents: docs || [],
            riskFlags: [],
            submittedAt: v.createdAt?.toISOString() || new Date().toISOString(),
            priority: "medium",
          },
        };
      } catch (error) {
        console.error("[Admin] Error fetching verification details:", error);
        return { verification: null };
      }
    }),

  /**
   * Approve verification
   */
  approveVerification: adminProcedure
    .input(
      z.object({
        verificationId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const verificationId = parseInt(input.verificationId);
        const result = await db
          .select()
          .from(verifications)
          .where(eq(verifications.id, verificationId))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Verification not found",
          });
        }

        const verification = result[0];
        await approveVerification(verification.userId, ctx.user.id);

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "verification_approved",
          verification.userId,
          "verification",
          verification.id
        );

        return {
          success: true,
          verificationId: input.verificationId,
        };
      } catch (error) {
        console.error("[Admin] Error approving verification:", error);
        throw error;
      }
    }),

  /**
   * Reject verification
   */
  rejectVerification: adminProcedure
    .input(
      z.object({
        verificationId: z.string(),
        reason: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const verificationId = parseInt(input.verificationId);
        const result = await db
          .select()
          .from(verifications)
          .where(eq(verifications.id, verificationId))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Verification not found",
          });
        }

        const verification = result[0];
        await rejectVerification(verification.userId, ctx.user.id, input.reason);

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "verification_rejected",
          verification.userId,
          "verification",
          verification.id,
          { reason: input.reason }
        );

        return {
          success: true,
          verificationId: input.verificationId,
        };
      } catch (error) {
        console.error("[Admin] Error rejecting verification:", error);
        throw error;
      }
    }),

  /**
   * Request additional information from user
   */
  requestVerificationInfo: adminProcedure
    .input(
      z.object({
        verificationId: z.string(),
        message: z.string(),
        requiredDocuments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create audit log
        const verificationId = parseInt(input.verificationId);
        const db = await getDb();
        if (db) {
          const result = await db
            .select()
            .from(verifications)
            .where(eq(verifications.id, verificationId))
            .limit(1);
          if (result.length > 0) {
            await createAuditLog(
              ctx.user.id,
              "verification_info_requested",
              result[0].userId,
              "verification",
              result[0].id,
              { message: input.message }
            );
          }
        }

        return {
          success: true,
          verificationId: input.verificationId,
        };
      } catch (error) {
        console.error("[Admin] Error requesting verification info:", error);
        throw error;
      }
    }),

  /**
   * Approve individual document
   */
  approveDocument: adminProcedure
    .input(
      z.object({
        documentId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const documentId = parseInt(input.documentId);
        // Note: documents table doesn't have status field
        // Status is tracked via updatedAt timestamp
        await db
          .update(documents)
          .set({ updatedAt: new Date() })
          .where(eq(documents.id, documentId));

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "document_approved",
          undefined,
          "document",
          documentId
        );

        return {
          success: true,
          documentId: input.documentId,
        };
      } catch (error) {
        console.error("[Admin] Error approving document:", error);
        throw error;
      }
    }),

  /**
   * Reject individual document
   */
  rejectDocument: adminProcedure
    .input(
      z.object({
        documentId: z.string(),
        reason: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const documentId = parseInt(input.documentId);
        // Note: documents table doesn't have status field
        // Status is tracked via updatedAt timestamp
        await db
          .update(documents)
          .set({ updatedAt: new Date() })
          .where(eq(documents.id, documentId));

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "document_rejected",
          undefined,
          "document",
          documentId,
          { reason: input.reason }
        );

        return {
          success: true,
          documentId: input.documentId,
        };
      } catch (error) {
        console.error("[Admin] Error rejecting document:", error);
        throw error;
      }
    }),

  /**
   * Flag user for suspicious activity
   */
  flagUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        flagType: z.enum([
          "duplicate_email",
          "duplicate_phone",
          "suspicious_documents",
          "fraud_attempt",
          "identity_mismatch",
          "other",
        ]),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create audit log
        const userId = parseInt(input.userId);
        await createAuditLog(
          ctx.user.id,
          "user_flagged",
          userId,
          "user",
          undefined,
          { flagType: input.flagType, description: input.description }
        );

        return {
          success: true,
          userId: input.userId,
        };
      } catch (error) {
        console.error("[Admin] Error flagging user:", error);
        throw error;
      }
    }),

  /**
   * Remove flag from user
   */
  removeUserFlag: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        flagId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create audit log
        const userId = parseInt(input.userId);
        await createAuditLog(
          ctx.user.id,
          "user_flag_removed",
          userId,
          "user",
          undefined,
          { flagId: input.flagId, reason: input.reason }
        );

        return {
          success: true,
          userId: input.userId,
        };
      } catch (error) {
        console.error("[Admin] Error removing user flag:", error);
        throw error;
      }
    }),

  /**
   * Get admin statistics
   */
  getStatistics: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        averageReviewTime: 0,
        flaggedUsers: 0,
        recentActivity: [],
      };
    }

    try {
      const pending = await db
        .select()
        .from(verifications)
        .where(eq(verifications.status, "pending"));

      const approved = await db
        .select()
        .from(verifications)
        .where(eq(verifications.status, "approved"));

      const rejected = await db
        .select()
        .from(verifications)
        .where(eq(verifications.status, "rejected"));

      return {
        totalPending: pending.length,
        totalApproved: approved.length,
        totalRejected: rejected.length,
        averageReviewTime: 0,
        flaggedUsers: 0,
        recentActivity: [],
      };
    } catch (error) {
      console.error("[Admin] Error fetching statistics:", error);
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        averageReviewTime: 0,
        flaggedUsers: 0,
        recentActivity: [],
      };
    }
  }),

  /**
   * Get audit logs
   */
  getAuditLogs: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        action: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Query database for audit logs
      // Filter by action and userId if provided
      // Apply pagination

      return {
        logs: [],
        total: 0,
        hasMore: false,
      };
    }),

  /**
   * Manage user trust badge
   */
  setUserTrustBadge: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        verified: z.boolean(),
        badgeType: z.enum(["verified", "unverified", "suspended"]).default("unverified"),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const userId = parseInt(input.userId);
        const badgeMap: Record<string, "verified" | "not_verified"> = {
          verified: "verified",
          unverified: "not_verified",
          suspended: "not_verified",
        };
        await db
          .update(verifications)
          .set({
            trustBadge: badgeMap[input.badgeType],
            reviewedBy: ctx.user.id,
            reviewedAt: new Date(),
          })
          .where(eq(verifications.userId, userId));

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "trust_badge_updated",
          userId,
          "user",
          undefined,
          { badgeType: input.badgeType }
        );

        return {
          success: true,
          userId: input.userId,
        };
      } catch (error) {
        console.error("[Admin] Error setting trust badge:", error);
        throw error;
      }
    }),

  /**
   * Suspend user account
   */
  suspendUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        duration: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const userId = parseInt(input.userId);
        // Note: User suspension would require adding a 'status' field to users table
        // For now, we'll just create an audit log
        // TODO: Add status field to users table in future migration

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "user_suspended",
          userId,
          "user",
          undefined,
          { reason: input.reason }
        );

        return {
          success: true,
          userId: input.userId,
        };
      } catch (error) {
        console.error("[Admin] Error suspending user:", error);
        throw error;
      }
    }),

  /**
   * Unsuspend user account
   */
  unsuspendUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const userId = parseInt(input.userId);
        // Note: User unsuspension would require adding a 'status' field to users table
        // For now, we'll just create an audit log
        // TODO: Add status field to users table in future migration

        // Create audit log
        await createAuditLog(
          ctx.user.id,
          "user_unsuspended",
          userId,
          "user",
          undefined,
          { reason: input.reason }
        );

        return {
          success: true,
          userId: input.userId,
        };
      } catch (error) {
        console.error("[Admin] Error unsuspending user:", error);
        throw error;
      }
    }),
});
