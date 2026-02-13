import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  verifications,
  documents,
  userProfiles,
  matchingProfiles,
  properties,
  conversations,
  messages,
  matches,
  auditLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phoneNumber", "profilePictureUrl"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      values[field] = value;
      updateSet[field] = value;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// VERIFICATION SYSTEM
// ============================================================================

export async function getOrCreateVerification(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(verifications).where(eq(verifications.userId, userId)).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new verification record
  await db.insert(verifications).values({
    userId,
    status: "pending",
    trustBadge: "not_verified",
  });

  const result = await db.select().from(verifications).where(eq(verifications.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVerificationByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(verifications).where(eq(verifications.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVerificationStatus(
  userId: number,
  updates: {
    emailVerified?: boolean;
    phoneVerified?: boolean;
    idVerified?: boolean;
    selfieVerified?: boolean;
  }
) {
  const db = await getDb();
  if (!db) return undefined;

  const updateSet: Record<string, unknown> = {};
  if (updates.emailVerified !== undefined) updateSet.emailVerified = updates.emailVerified;
  if (updates.phoneVerified !== undefined) updateSet.phoneVerified = updates.phoneVerified;
  if (updates.idVerified !== undefined) updateSet.idVerified = updates.idVerified;
  if (updates.selfieVerified !== undefined) updateSet.selfieVerified = updates.selfieVerified;

  if (Object.keys(updateSet).length === 0) return;

  // Check if all verifications are complete
  const verification = await getVerificationByUserId(userId);
  if (!verification) return;

  const newEmailVerified = updates.emailVerified ?? verification.emailVerified;
  const newPhoneVerified = updates.phoneVerified ?? verification.phoneVerified;
  const newIdVerified = updates.idVerified ?? verification.idVerified;
  const newSelfieVerified = updates.selfieVerified ?? verification.selfieVerified;

  // If all verifications are complete, set trust badge to verified
  if (newEmailVerified && newPhoneVerified && newIdVerified && newSelfieVerified) {
    updateSet.trustBadge = "verified";
    updateSet.status = "approved";
  }

  await db.update(verifications).set(updateSet).where(eq(verifications.userId, userId));

  return getVerificationByUserId(userId);
}

export async function approveVerification(userId: number, adminId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(verifications)
    .set({
      status: "approved",
      trustBadge: "verified",
      reviewedBy: adminId,
      reviewedAt: new Date(),
    })
    .where(eq(verifications.userId, userId));

  return getVerificationByUserId(userId);
}

export async function rejectVerification(userId: number, adminId: number, reason: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(verifications)
    .set({
      status: "rejected",
      trustBadge: "not_verified",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: reason,
    })
    .where(eq(verifications.userId, userId));

  return getVerificationByUserId(userId);
}

// ============================================================================
// DOCUMENT STORAGE
// ============================================================================

export async function createDocument(
  userId: number,
  documentType: "government_id" | "selfie" | "property_photo" | "other",
  fileKey: string,
  fileUrl: string,
  mimeType?: string,
  fileSize?: number,
  verificationId?: number,
  propertyId?: number
) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(documents).values({
    userId,
    documentType,
    fileKey,
    fileUrl,
    mimeType,
    fileSize,
    verificationId,
    propertyId,
    encryptionAlgorithm: "AES-256-GCM",
  });

  const result = await db.select().from(documents).where(eq(documents.fileKey, fileKey)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDocumentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(documents).where(eq(documents.userId, userId));
}

export async function getDocumentsByType(userId: number, documentType: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(documents)
    .where(and(eq(documents.userId, userId), eq(documents.documentType, documentType as any)));
}

// ============================================================================
// USER PROFILES
// ============================================================================

export async function getOrCreateUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new profile
  await db.insert(userProfiles).values({ userId });

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, updates: Record<string, any>) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));

  return getUserProfile(userId);
}

// ============================================================================
// MATCHING PROFILES
// ============================================================================

export async function getOrCreateMatchingProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(matchingProfiles).where(eq(matchingProfiles.userId, userId)).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(matchingProfiles).values({ userId });

  const result = await db.select().from(matchingProfiles).where(eq(matchingProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMatchingProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(matchingProfiles).where(eq(matchingProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMatchingProfile(userId: number, updates: Record<string, any>) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(matchingProfiles).set(updates).where(eq(matchingProfiles.userId, userId));

  return getMatchingProfile(userId);
}

// ============================================================================
// PROPERTIES
// ============================================================================

export async function createProperty(
  landlordId: number,
  title: string,
  description: string,
  price: number,
  country: string,
  city: string,
  address?: string,
  latitude?: number,
  longitude?: number,
  roomCount?: number,
  bathroomCount?: number,
  squareMeters?: number,
  amenities?: string[]
) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(properties).values({
    landlordId,
    title,
    description,
    price: price.toString(),
    country,
    city,
    address,
    latitude: latitude?.toString(),
    longitude: longitude?.toString(),
    roomCount,
    bathroomCount,
    squareMeters,
    amenities: amenities || [],
  });

  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.landlordId, landlordId))
    .orderBy(properties.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPropertiesByLandlord(landlordId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(properties).where(eq(properties.landlordId, landlordId));
}

export async function getPropertyById(propertyId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllActiveProperties() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(properties).where(eq(properties.status, "active"));
}

// ============================================================================
// MESSAGING
// ============================================================================

export async function getOrCreateConversation(user1Id: number, user2Id: number) {
  const db = await getDb();
  if (!db) return undefined;

  // Ensure consistent ordering
  const [minId, maxId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

  const existing = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.user1Id, minId), eq(conversations.user2Id, maxId)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(conversations).values({
    user1Id: minId,
    user2Id: maxId,
  });

  const result = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.user1Id, minId), eq(conversations.user2Id, maxId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getConversationById(conversationId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get conversations where user is either user1 or user2
  // For now, return empty - will implement with proper OR logic
  return [];
}

export async function createMessage(conversationId: number, senderId: number, content: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(messages).values({
    conversationId,
    senderId,
    content,
    isRead: false,
  });

  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getConversationMessages(conversationId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)
    .limit(limit);
}

export async function markMessageAsRead(messageId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(messages).set({ isRead: true, readAt: new Date() }).where(eq(messages.id, messageId));

  const result = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// MATCHING
// ============================================================================

export async function createMatch(
  userId1: number,
  userId2: number,
  compatibilityScore: number,
  budgetMatch: number,
  scheduleMatch: number,
  cleanlinessMatch: number,
  lifestyleMatch: number,
  petsMatch: number,
  explanation: string
) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(matches).values({
    userId1,
    userId2,
    compatibilityScore,
    budgetMatch,
    scheduleMatch,
    cleanlinessMatch,
    lifestyleMatch,
    petsMatch,
    explanation,
    status: "active",
  });

  const result = await db
    .select()
    .from(matches)
    .where(and(eq(matches.userId1, userId1), eq(matches.userId2, userId2)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserMatches(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get matches where user is either userId1 or userId2
  // For now, return empty - will implement with proper OR logic
  return [];
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export async function createAuditLog(
  adminId: number,
  action: string,
  targetUserId?: number,
  targetType?: string,
  targetId?: number,
  details?: Record<string, any>
) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(auditLogs).values({
    adminId,
    action,
    targetUserId,
    targetType,
    targetId,
    details: details || {},
  });

  return true;
}
