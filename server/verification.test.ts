import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1, role: "user" | "admin" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Verification System", () => {
  describe("verification.getStatus", () => {
    it("should return verification status for authenticated user", async () => {
      const { ctx } = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.verification.getStatus();

      expect(result).toBeDefined();
      expect(result.userId).toBe(1);
      expect(result.trustBadge).toBe("not_verified");
      expect(result.status).toBe("pending");
    });

    it("should require authentication", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      await expect(caller.verification.getStatus()).rejects.toThrow();
    });
  });

  describe("verification.verifyEmail", () => {
    it("should mark email as verified", async () => {
      const { ctx } = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.verification.verifyEmail({
        email: "test1@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Email verification sent");
    });
  });

  describe("verification.verifyPhoneOtp", () => {
    it("should mark phone as verified with OTP", async () => {
      const { ctx } = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.verification.verifyPhoneOtp({
        phoneNumber: "+39 123 456 7890",
        otp: "123456",
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Phone verified");
    });
  });
});

describe("User Profile", () => {
  describe("profile.updateProfile", () => {
    it("should update user profile with matching preferences", async () => {
      const { ctx } = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateProfile({
        age: 28,
        nationality: "Italian",
        languages: ["it", "en"],
        budgetMin: 500,
        budgetMax: 1000,
        workType: "remote",
        sleepSchedule: "flexible",
        cleanlinessLevel: 4,
        smokingPreference: "no_smoking",
        drinkingPreference: "occasional",
        petsAllowed: true,
        socialLevel: 4,
        interests: ["travel", "cooking", "tech"],
        bio: "Looking for a clean and friendly roommate",
      });

      expect(result).toBeDefined();
      expect(result.age).toBe(28);
      expect(result.nationality).toBe("Italian");
      expect(result.cleanlinessLevel).toBe(4);
    });
  });
});

describe("Matching Algorithm", () => {
  describe("matching.calculateCompatibility", () => {
    it("should calculate compatibility score between two users", async () => {
      const { ctx: ctx1 } = createAuthContext(1);
      const { ctx: ctx2 } = createAuthContext(2);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Setup profiles
      await caller1.profile.updateProfile({
        age: 28,
        budgetMin: 500,
        budgetMax: 1000,
        sleepSchedule: "flexible",
        cleanlinessLevel: 4,
        smokingPreference: "no_smoking",
        drinkingPreference: "occasional",
        petsAllowed: true,
      });

      await caller2.profile.updateProfile({
        age: 26,
        budgetMin: 550,
        budgetMax: 950,
        sleepSchedule: "flexible",
        cleanlinessLevel: 4,
        smokingPreference: "no_smoking",
        drinkingPreference: "occasional",
        petsAllowed: true,
      });

      // Calculate compatibility
      const result = await caller1.matching.calculateCompatibility({
        targetUserId: 2,
      });

      expect(result).toBeDefined();
      expect(result.compatibilityScore).toBeGreaterThan(0);
      expect(result.compatibilityScore).toBeLessThanOrEqual(100);
      expect(result.budgetMatch).toBeGreaterThan(80);
      expect(result.scheduleMatch).toBe(100);
      expect(result.cleanlinessMatch).toBe(100);
      expect(result.lifestyleMatch).toBe(100);
      expect(result.petsMatch).toBe(100);
      expect(result.explanation).toBeDefined();
    });

    it("should handle incompatible profiles", async () => {
      const { ctx: ctx1 } = createAuthContext(3);
      const { ctx: ctx2 } = createAuthContext(4);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Setup incompatible profiles
      await caller1.profile.updateProfile({
        budgetMin: 500,
        budgetMax: 700,
        sleepSchedule: "early_bird",
        cleanlinessLevel: 5,
        smokingPreference: "no_smoking",
        drinkingPreference: "no_drinking",
        petsAllowed: false,
      });

      await caller2.profile.updateProfile({
        budgetMin: 1500,
        budgetMax: 2000,
        sleepSchedule: "night_owl",
        cleanlinessLevel: 1,
        smokingPreference: "regular",
        drinkingPreference: "regular",
        petsAllowed: true,
      });

      // Calculate compatibility
      const result = await caller1.matching.calculateCompatibility({
        targetUserId: 4,
      });

      expect(result.compatibilityScore).toBeLessThan(50);
      expect(result.budgetMatch).toBeLessThan(50);
      expect(result.scheduleMatch).toBeLessThan(100);
    });
  });
});

describe("Admin Functions", () => {
  describe("admin.approveVerification", () => {
    it("should approve verification as admin", async () => {
      const { ctx: adminCtx } = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(adminCtx);

      const result = await caller.admin.approveVerification({
        userId: 2,
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("approved");
      expect(result.trustBadge).toBe("verified");
    });

    it("should reject verification if not admin", async () => {
      const { ctx: userCtx } = createAuthContext(1, "user");
      const caller = appRouter.createCaller(userCtx);

      await expect(
        caller.admin.approveVerification({
          userId: 2,
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("admin.rejectVerification", () => {
    it("should reject verification with reason", async () => {
      const { ctx: adminCtx } = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(adminCtx);

      const result = await caller.admin.rejectVerification({
        userId: 2,
        reason: "Invalid government ID",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("rejected");
      expect(result.trustBadge).toBe("not_verified");
      expect(result.rejectionReason).toBe("Invalid government ID");
    });
  });
});
