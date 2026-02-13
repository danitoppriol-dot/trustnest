import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getOrCreateVerification,
  getVerificationByUserId,
  updateVerificationStatus,
  approveVerification,
  rejectVerification,
  createDocument,
  getDocumentsByUserId,
  getOrCreateUserProfile,
  getUserProfile,
  updateUserProfile,
  getOrCreateMatchingProfile,
  updateMatchingProfile,
  createProperty,
  getPropertiesByLandlord,
  getAllActiveProperties,
  getOrCreateConversation,
  createMessage,
  getConversationMessages,
  markMessageAsRead,
  createMatch,
  createAuditLog,
  getUserById,
} from "./db";
import { storagePut, storageGet } from "./storage";

export const appRouter = router({
  system: systemRouter,

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // VERIFICATION SYSTEM
  // ============================================================================

  verification: router({
    // Get or create verification record for current user
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const verification = await getVerificationByUserId(ctx.user.id);
      if (!verification) {
        return await getOrCreateVerification(ctx.user.id);
      }
      return verification;
    }),

    // Upload government ID document
    uploadGovernmentId: protectedProcedure
      .input(
        z.object({
          fileBuffer: z.instanceof(Buffer),
          fileName: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const fileKey = `verifications/${ctx.user.id}/id/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          const document = await createDocument(
            ctx.user.id,
            "government_id",
            fileKey,
            url,
            input.mimeType,
            input.fileBuffer.length
          );

          // Mark ID as pending verification
          await updateVerificationStatus(ctx.user.id, { idVerified: false });

          return {
            success: true,
            document,
          };
        } catch (error) {
          console.error("Failed to upload government ID:", error);
          throw new Error("Failed to upload government ID");
        }
      }),

    // Upload selfie for liveness detection
    uploadSelfie: protectedProcedure
      .input(
        z.object({
          fileBuffer: z.instanceof(Buffer),
          fileName: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const fileKey = `verifications/${ctx.user.id}/selfie/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          const document = await createDocument(
            ctx.user.id,
            "selfie",
            fileKey,
            url,
            input.mimeType,
            input.fileBuffer.length
          );

          // In production, integrate with liveness detection API here
          // For MVP, mark as verified after upload
          await updateVerificationStatus(ctx.user.id, { selfieVerified: true });

          return {
            success: true,
            document,
          };
        } catch (error) {
          console.error("Failed to upload selfie:", error);
          throw new Error("Failed to upload selfie");
        }
      }),

    // Verify email
    verifyEmail: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        // In production, send OTP email here
        // For MVP, mark as verified
        await updateVerificationStatus(ctx.user.id, { emailVerified: true });

        return {
          success: true,
          message: "Email verification sent",
        };
      }),

    // Verify phone with OTP
    verifyPhoneOtp: protectedProcedure
      .input(z.object({ phoneNumber: z.string(), otp: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // In production, validate OTP against sent code
        // For MVP, mark as verified
        await updateVerificationStatus(ctx.user.id, { phoneVerified: true });

        return {
          success: true,
          message: "Phone verified",
        };
      }),

    // Get verification documents
    getDocuments: protectedProcedure.query(async ({ ctx }) => {
      return await getDocumentsByUserId(ctx.user.id);
    }),
  }),

  // ============================================================================
  // USER PROFILES
  // ============================================================================

  profile: router({
    // Get current user profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserProfile(ctx.user.id);
    }),

    // Update user profile with matching preferences
    updateProfile: protectedProcedure
      .input(
        z.object({
          age: z.number().optional(),
          nationality: z.string().optional(),
          languages: z.array(z.string()).optional(),
          budgetMin: z.number().optional(),
          budgetMax: z.number().optional(),
          workType: z.enum(["student", "remote", "office", "freelance", "other"]).optional(),
          sleepSchedule: z.enum(["early_bird", "night_owl", "flexible"]).optional(),
          cleanlinessLevel: z.number().min(1).max(5).optional(),
          smokingPreference: z.enum(["no_smoking", "occasional", "regular"]).optional(),
          drinkingPreference: z.enum(["no_drinking", "occasional", "regular"]).optional(),
          petsAllowed: z.boolean().optional(),
          petDetails: z.string().optional(),
          socialLevel: z.number().min(1).max(5).optional(),
          interests: z.array(z.string()).optional(),
          bio: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await updateUserProfile(ctx.user.id, input);

        // Update matching profile cache
        if (input.budgetMin || input.budgetMax) {
          await updateMatchingProfile(ctx.user.id, {
            budget: input.budgetMin || input.budgetMax,
          });
        }

        return profile;
      }),
  }),

  // ============================================================================
  // PROPERTY LISTINGS
  // ============================================================================

  properties: router({
    // Create new property listing
    createProperty: protectedProcedure
      .input(
        z.object({
          title: z.string().min(5),
          description: z.string().min(20),
          price: z.number().positive(),
          country: z.string(),
          city: z.string(),
          address: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          roomCount: z.number().optional(),
          bathroomCount: z.number().optional(),
          squareMeters: z.number().optional(),
          amenities: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const property = await createProperty(
          ctx.user.id,
          input.title,
          input.description,
          input.price,
          input.country,
          input.city,
          input.address,
          input.latitude,
          input.longitude,
          input.roomCount,
          input.bathroomCount,
          input.squareMeters,
          input.amenities
        );

        return property;
      }),

    // Get properties by landlord
    getMyProperties: protectedProcedure.query(async ({ ctx }) => {
      return await getPropertiesByLandlord(ctx.user.id);
    }),

    // Get all active properties
    getAllActive: publicProcedure.query(async () => {
      return await getAllActiveProperties();
    }),

    // Upload property photo
    uploadPhoto: protectedProcedure
      .input(
        z.object({
          propertyId: z.number(),
          fileBuffer: z.instanceof(Buffer),
          fileName: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const fileKey = `properties/${input.propertyId}/photos/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          const document = await createDocument(
            ctx.user.id,
            "property_photo",
            fileKey,
            url,
            input.mimeType,
            input.fileBuffer.length,
            undefined,
            input.propertyId
          );

          return {
            success: true,
            document,
          };
        } catch (error) {
          console.error("Failed to upload property photo:", error);
          throw new Error("Failed to upload property photo");
        }
      }),
  }),

  // ============================================================================
  // MESSAGING
  // ============================================================================

  messaging: router({
    // Get or create conversation
    getConversation: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getOrCreateConversation(ctx.user.id, input.userId);
      }),

    // Send message
    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const message = await createMessage(input.conversationId, ctx.user.id, input.content);
        return message;
      }),

    // Get conversation messages
    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number(), limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await getConversationMessages(input.conversationId, input.limit);
      }),

    // Mark message as read
    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        return await markMessageAsRead(input.messageId);
      }),
  }),

  // ============================================================================
  // MATCHING
  // ============================================================================

  matching: router({
    // Calculate compatibility between two users
    calculateCompatibility: protectedProcedure
      .input(z.object({ targetUserId: z.number() }))
      .query(async ({ ctx, input }) => {
        const currentUser = await getUserProfile(ctx.user.id);
        const targetUser = await getUserProfile(input.targetUserId);

        if (!currentUser || !targetUser) {
          throw new Error("User profile not found");
        }

        // Simple weighted compatibility algorithm
        let budgetMatch = 100;
        let scheduleMatch = 100;
        let cleanlinessMatch = 100;
        let lifestyleMatch = 100;
        let petsMatch = 100;

        // Budget matching (within 20% range)
        if (currentUser.budgetMin && currentUser.budgetMax && targetUser.budgetMin && targetUser.budgetMax) {
          const currentMid = (Number(currentUser.budgetMin) + Number(currentUser.budgetMax)) / 2;
          const targetMid = (Number(targetUser.budgetMin) + Number(targetUser.budgetMax)) / 2;
          const diff = Math.abs(currentMid - targetMid);
          const maxDiff = Math.max(currentMid, targetMid) * 0.2;
          budgetMatch = Math.max(0, 100 - (diff / maxDiff) * 100);
        }

        // Sleep schedule matching
        if (currentUser.sleepSchedule && targetUser.sleepSchedule) {
          scheduleMatch = currentUser.sleepSchedule === targetUser.sleepSchedule ? 100 : 50;
        }

        // Cleanliness matching (within 1 level)
        if (currentUser.cleanlinessLevel && targetUser.cleanlinessLevel) {
          const diff = Math.abs(currentUser.cleanlinessLevel - targetUser.cleanlinessLevel);
          cleanlinessMatch = Math.max(0, 100 - diff * 20);
        }

        // Lifestyle matching (smoking/drinking)
        let lifestylePoints = 0;
        if (currentUser.smokingPreference === targetUser.smokingPreference) lifestylePoints += 50;
        if (currentUser.drinkingPreference === targetUser.drinkingPreference) lifestylePoints += 50;
        lifestyleMatch = lifestylePoints;

        // Pets matching
        petsMatch = currentUser.petsAllowed === targetUser.petsAllowed ? 100 : 50;

        // Calculate overall score (weighted average)
        const weights = {
          budget: 0.25,
          schedule: 0.2,
          cleanliness: 0.2,
          lifestyle: 0.2,
          pets: 0.15,
        };

        const compatibilityScore = Math.round(
          budgetMatch * weights.budget +
            scheduleMatch * weights.schedule +
            cleanlinessMatch * weights.cleanliness +
            lifestyleMatch * weights.lifestyle +
            petsMatch * weights.pets
        );

        // Generate explanation
        const explanations = [];
        if (budgetMatch > 80) explanations.push("Budget compatibility");
        if (scheduleMatch > 80) explanations.push("Sleep schedule match");
        if (cleanlinessMatch > 80) explanations.push("Cleanliness preferences aligned");
        if (lifestyleMatch > 80) explanations.push("Lifestyle preferences match");
        if (petsMatch > 80) explanations.push("Pet preferences compatible");

        const explanation = explanations.length > 0 ? explanations.join(", ") : "Some differences in preferences";

        // Save match
        await createMatch(
          ctx.user.id,
          input.targetUserId,
          compatibilityScore,
          Math.round(budgetMatch),
          Math.round(scheduleMatch),
          Math.round(cleanlinessMatch),
          Math.round(lifestyleMatch),
          Math.round(petsMatch),
          explanation
        );

        return {
          compatibilityScore,
          budgetMatch: Math.round(budgetMatch),
          scheduleMatch: Math.round(scheduleMatch),
          cleanlinessMatch: Math.round(cleanlinessMatch),
          lifestyleMatch: Math.round(lifestyleMatch),
          petsMatch: Math.round(petsMatch),
          explanation,
        };
      }),
  }),

  // ============================================================================
  // ADMIN DASHBOARD
  // ============================================================================

  admin: router({
    // Approve verification
    approveVerification: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const verification = await approveVerification(input.userId, ctx.user.id);
        await createAuditLog(ctx.user.id, "APPROVE_VERIFICATION", input.userId, "user", input.userId);

        return verification;
      }),

    // Reject verification
    rejectVerification: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const verification = await rejectVerification(input.userId, ctx.user.id, input.reason);
        await createAuditLog(ctx.user.id, "REJECT_VERIFICATION", input.userId, "user", input.userId, {
          reason: input.reason,
        });

        return verification;
      }),
  }),
});

export type AppRouter = typeof appRouter;
