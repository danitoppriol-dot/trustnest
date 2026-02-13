import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  longtext,
  tinyint,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * TrustNest MVP Database Schema
 * Designed for Phase 1 MVP with scalability hooks for Phase 2
 */

// ============================================================================
// CORE AUTHENTICATION & USERS
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  profilePictureUrl: text("profilePictureUrl"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // User type: tenant or landlord (can be both)
  userType: mysqlEnum("userType", ["tenant", "landlord", "both"]).default("tenant").notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// USER PROFILES & PREFERENCES
// ============================================================================

export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  // Basic info
  age: int("age"),
  nationality: varchar("nationality", { length: 100 }),
  languages: json("languages").$type<string[]>(),
  // Budget & work
  budgetMin: decimal("budgetMin", { precision: 10, scale: 2 }),
  budgetMax: decimal("budgetMax", { precision: 10, scale: 2 }),
  workType: mysqlEnum("workType", ["student", "remote", "office", "freelance", "other"]),
  // Living preferences (1-5 scale where applicable)
  sleepSchedule: mysqlEnum("sleepSchedule", ["early_bird", "night_owl", "flexible"]),
  cleanlinessLevel: tinyint("cleanlinessLevel"), // 1-5
  smokingPreference: mysqlEnum("smokingPreference", ["no_smoking", "occasional", "regular"]),
  drinkingPreference: mysqlEnum("drinkingPreference", ["no_drinking", "occasional", "regular"]),
  petsAllowed: boolean("petsAllowed").default(false),
  petDetails: text("petDetails"), // Description of pets if any
  // Social preferences
  socialLevel: tinyint("socialLevel"), // 1-5: introvert to extrovert
  interests: json("interests").$type<string[]>(),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// ============================================================================
// IDENTITY VERIFICATION SYSTEM
// ============================================================================

export const verifications = mysqlTable("verifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  // Verification status
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  trustBadge: mysqlEnum("trustBadge", ["not_verified", "verified"]).default("not_verified").notNull(),
  // Verification components
  emailVerified: boolean("emailVerified").default(false),
  emailVerifiedAt: timestamp("emailVerifiedAt"),
  phoneVerified: boolean("phoneVerified").default(false),
  phoneVerifiedAt: timestamp("phoneVerifiedAt"),
  phoneOtpAttempts: int("phoneOtpAttempts").default(0),
  idVerified: boolean("idVerified").default(false),
  idVerifiedAt: timestamp("idVerifiedAt"),
  selfieVerified: boolean("selfieVerified").default(false),
  selfieVerifiedAt: timestamp("selfieVerifiedAt"),
  // Admin review
  reviewedBy: int("reviewedBy"), // admin user id
  reviewedAt: timestamp("reviewedAt"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;

// ============================================================================
// DOCUMENTS & FILE STORAGE (GDPR-COMPLIANT)
// ============================================================================

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentType: mysqlEnum("documentType", ["government_id", "selfie", "property_photo", "other"]).notNull(),
  // S3 storage reference (encrypted in transit)
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  fileUrl: text("fileUrl"), // Presigned URL or CDN URL
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  // Encryption metadata
  encryptionAlgorithm: varchar("encryptionAlgorithm", { length: 50 }).default("AES-256-GCM"),
  encryptionKeyId: varchar("encryptionKeyId", { length: 100 }),
  // Metadata
  expiresAt: timestamp("expiresAt"), // For temporary URLs
  verificationId: int("verificationId"), // Link to verification
  propertyId: int("propertyId"), // Link to property if photo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// ============================================================================
// PROPERTY LISTINGS
// ============================================================================

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  landlordId: int("landlordId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  // Location
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  // Property details
  roomCount: int("roomCount"),
  bathroomCount: int("bathroomCount"),
  squareMeters: int("squareMeters"),
  amenities: json("amenities").$type<string[]>(),
  // Status
  status: mysqlEnum("status", ["active", "inactive", "rented"]).default("active").notNull(),
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ============================================================================
// ROOMMATE MATCHING
// ============================================================================

export const matchingProfiles = mysqlTable("matchingProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  // Matching parameters (stored for quick access)
  budget: decimal("budget", { precision: 10, scale: 2 }),
  sleepSchedule: varchar("sleepSchedule", { length: 50 }),
  cleanlinessLevel: tinyint("cleanlinessLevel"),
  smokingPreference: varchar("smokingPreference", { length: 50 }),
  drinkingPreference: varchar("drinkingPreference", { length: 50 }),
  petsAllowed: boolean("petsAllowed"),
  // Matching history
  lastMatchedAt: timestamp("lastMatchedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchingProfile = typeof matchingProfiles.$inferSelect;
export type InsertMatchingProfile = typeof matchingProfiles.$inferInsert;

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId1: int("userId1").notNull(),
  userId2: int("userId2").notNull(),
  compatibilityScore: tinyint("compatibilityScore"), // 0-100
  // Breakdown of compatibility
  budgetMatch: tinyint("budgetMatch"),
  scheduleMatch: tinyint("scheduleMatch"),
  cleanlinessMatch: tinyint("cleanlinessMatch"),
  lifestyleMatch: tinyint("lifestyleMatch"),
  petsMatch: tinyint("petsMatch"),
  // Explanation
  explanation: text("explanation"),
  // Status
  status: mysqlEnum("status", ["active", "archived", "rejected"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// ============================================================================
// MESSAGING SYSTEM
// ============================================================================

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: longtext("content").notNull(),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================================================
// AUDIT & ADMIN
// ============================================================================

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId"),
  action: varchar("action", { length: 100 }).notNull(),
  targetUserId: int("targetUserId"),
  targetType: varchar("targetType", { length: 50 }),
  targetId: int("targetId"),
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============================================================================
// RELATIONS (for Drizzle ORM)
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  verification: one(verifications, {
    fields: [users.id],
    references: [verifications.userId],
  }),
  documents: many(documents),
  properties: many(properties, {
    relationName: "landlord",
  }),
  matchingProfile: one(matchingProfiles, {
    fields: [users.id],
    references: [matchingProfiles.userId],
  }),
  conversationsAsUser1: many(conversations, {
    relationName: "user1",
  }),
  conversationsAsUser2: many(conversations, {
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const verificationsRelations = relations(verifications, ({ one, many }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  verification: one(verifications, {
    fields: [documents.verificationId],
    references: [verifications.id],
  }),
  property: one(properties, {
    fields: [documents.propertyId],
    references: [properties.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  landlord: one(users, {
    fields: [properties.landlordId],
    references: [users.id],
    relationName: "landlord",
  }),
  documents: many(documents),
}));

export const matchingProfilesRelations = relations(matchingProfiles, ({ one }) => ({
  user: one(users, {
    fields: [matchingProfiles.userId],
    references: [users.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  user1: one(users, {
    fields: [matches.userId1],
    references: [users.id],
  }),
  user2: one(users, {
    fields: [matches.userId2],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user1: one(users, {
    fields: [conversations.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [conversations.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, {
    fields: [auditLogs.adminId],
    references: [users.id],
  }),
}));
