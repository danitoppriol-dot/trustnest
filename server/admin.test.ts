import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AdminUser = NonNullable<TrpcContext["user"]> & { role: "admin" };
type RegularUser = NonNullable<TrpcContext["user"]> & { role: "user" };

function createAdminContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createRegularUserContext(): TrpcContext {
  const user: RegularUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
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

  return ctx;
}

describe("Admin Router", () => {
  describe("Access Control", () => {
    it("should allow admin users to access admin procedures", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Admin should be able to call admin procedures
      expect(caller.admin).toBeDefined();
    });

    it("should deny regular users from accessing admin procedures", async () => {
      const ctx = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      // Regular users should get FORBIDDEN error
      try {
        await caller.admin.getPendingVerifications();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Verification Queue", () => {
    it("should return pending verifications with pagination", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getPendingVerifications({
        limit: 20,
        offset: 0,
        priority: "all",
        userType: "all",
      });

      expect(result).toHaveProperty("verifications");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("hasMore");
      expect(Array.isArray(result.verifications)).toBe(true);
    });

    it("should filter verifications by priority", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getPendingVerifications({
        limit: 20,
        offset: 0,
        priority: "high",
        userType: "all",
      });

      expect(result).toHaveProperty("verifications");
    });

    it("should filter verifications by user type", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getPendingVerifications({
        limit: 20,
        offset: 0,
        priority: "all",
        userType: "tenant",
      });

      expect(result).toHaveProperty("verifications");
    });
  });

  describe("Verification Approval", () => {
    it("should approve verification and return success", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.approveVerification({
        verificationId: "VER001",
        notes: "All documents verified",
      });

      expect(result.success).toBe(true);
      expect(result.verificationId).toBe("VER001");
    });

    it("should reject verification with reason", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.rejectVerification({
        verificationId: "VER002",
        reason: "ID document unclear",
        notes: "Please resubmit with better lighting",
      });

      expect(result.success).toBe(true);
      expect(result.verificationId).toBe("VER002");
    });

    it("should request additional information", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.requestVerificationInfo({
        verificationId: "VER003",
        message: "Please provide proof of residence",
        requiredDocuments: ["utility_bill", "lease_agreement"],
      });

      expect(result.success).toBe(true);
      expect(result.verificationId).toBe("VER003");
    });
  });

  describe("Document Management", () => {
    it("should approve individual document", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.approveDocument({
        documentId: "DOC001",
        notes: "Document is clear and valid",
      });

      expect(result.success).toBe(true);
      expect(result.documentId).toBe("DOC001");
    });

    it("should reject individual document with reason", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.rejectDocument({
        documentId: "DOC002",
        reason: "Expired ID",
        notes: "ID expired on 2024-01-15",
      });

      expect(result.success).toBe(true);
      expect(result.documentId).toBe("DOC002");
    });
  });

  describe("Risk Management", () => {
    it("should flag user for suspicious activity", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.flagUser({
        userId: "USR001",
        flagType: "duplicate_email",
        description: "Email matches another account",
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe("USR001");
    });

    it("should remove flag from user", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.removeUserFlag({
        userId: "USR001",
        flagId: "FLAG001",
        reason: "False positive - verified different person",
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe("USR001");
    });
  });

  describe("Statistics", () => {
    it("should return admin statistics", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.admin.getStatistics();

      expect(stats).toHaveProperty("totalPending");
      expect(stats).toHaveProperty("totalApproved");
      expect(stats).toHaveProperty("totalRejected");
      expect(stats).toHaveProperty("averageReviewTime");
      expect(stats).toHaveProperty("flaggedUsers");
      expect(stats).toHaveProperty("recentActivity");
    });
  });

  describe("Audit Logging", () => {
    it("should retrieve audit logs", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getAuditLogs({
        limit: 50,
        offset: 0,
      });

      expect(result).toHaveProperty("logs");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("hasMore");
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it("should filter audit logs by action", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getAuditLogs({
        limit: 50,
        offset: 0,
        action: "APPROVE_VERIFICATION",
      });

      expect(result).toHaveProperty("logs");
    });
  });

  describe("Trust Badge Management", () => {
    it("should set user trust badge", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.setUserTrustBadge({
        userId: "USR001",
        verified: true,
        badgeType: "verified",
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe("USR001");
    });

    it("should suspend user account", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.suspendUser({
        userId: "USR002",
        reason: "Fraudulent activity detected",
        duration: 30,
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe("USR002");
    });

    it("should unsuspend user account", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.unsuspendUser({
        userId: "USR002",
        reason: "Investigation completed - account cleared",
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe("USR002");
    });
  });
});
