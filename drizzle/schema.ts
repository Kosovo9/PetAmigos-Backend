import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, float } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with additional profile fields for PetMatch Global.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  bio: text("bio"),
  location: varchar("location", { length: 255 }), // GeoJSON format: {"type":"Point","coordinates":[lng,lat]}
  avatarUrl: varchar("avatarUrl", { length: 512 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferences: json("preferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  loveStories: many(loveStories),
  playdates: many(playdates),
  subscriptions: many(subscriptions),
  sentConnections: many(connections, { relationName: "sender" }),
  receivedConnections: many(connections, { relationName: "receiver" }),
}));

/**
 * Pets table (Pet-ID 2.0)
 * Comprehensive pet profiles with health, pedigree, and AI matching data
 */
export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  species: mysqlEnum("species", ["dog", "cat", "bird", "reptile", "exotic", "other"]).notNull(),
  breed: varchar("breed", { length: 255 }),
  temperament: json("temperament"),
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["male", "female", "unknown"]),
  location: varchar("location", { length: 255 }), // GeoJSON format: {"type":"Point","coordinates":[lng,lat]}
  bio: text("bio"),
  photos: json("photos"),
  pedigreeData: json("pedigreeData"),
  healthStatus: json("healthStatus"),
  avatarUrl: varchar("avatarUrl", { length: 512 }),
  personalityVector: json("personalityVector"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;
export const petsRelations = relations(pets, ({ one, many }) => ({
  owner: one(users, { fields: [pets.ownerId], references: [users.id] }),
  healthRecords: many(healthRecords),
  matches: many(matches),
  loveStories: many(loveStories),
}));

/**
 * Health records for vaccine verification and medical history
 */
export const healthRecords = mysqlTable("healthRecords", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  recordType: mysqlEnum("recordType", ["vaccine", "microchip", "surgery", "checkup", "other"]).notNull(),
  provider: varchar("provider", { length: 255 }),
  certificateUrl: varchar("certificateUrl", { length: 512 }),
  certificateHash: varchar("certificateHash", { length: 255 }),
  verifiedByAi: boolean("verifiedByAi").default(false),
  verifiedAt: timestamp("verifiedAt"),
  expiryDate: timestamp("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = typeof healthRecords.$inferInsert;
export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  pet: one(pets, { fields: [healthRecords.petId], references: [pets.id] }),
}));

/**
 * Pet-to-pet matches with compatibility scoring
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  petAId: int("petAId").notNull(),
  petBId: int("petBId").notNull(),
  compatibilityScore: float("compatibilityScore"),
  matchReason: json("matchReason"),
  interactionCount: int("interactionCount").default(0),
  lastInteraction: timestamp("lastInteraction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
export const matchesRelations = relations(matches, ({ one }) => ({
  petA: one(pets, { fields: [matches.petAId], references: [pets.id], relationName: "petA" }),
  petB: one(pets, { fields: [matches.petBId], references: [pets.id], relationName: "petB" }),
}));

/**
 * Owner-to-owner connections (following, friends, etc)
 */
export const connections = mysqlTable("connections", {
  id: int("id").autoincrement().primaryKey(),
  userAId: int("userAId").notNull(),
  userBId: int("userBId").notNull(),
  connectionType: mysqlEnum("connectionType", ["following", "friend", "blocked"]).default("following"),
  mutual: boolean("mutual").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = typeof connections.$inferInsert;
export const connectionsRelations = relations(connections, ({ one }) => ({
  userA: one(users, { fields: [connections.userAId], references: [users.id], relationName: "sender" }),
  userB: one(users, { fields: [connections.userBId], references: [users.id], relationName: "receiver" }),
}));

/**
 * Love stories (adoption stories and pet achievements)
 */
export const loveStories = mysqlTable("loveStories", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  photos: json("photos"),
  likes: int("likes").default(0),
  commentsCount: int("commentsCount").default(0),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoveStory = typeof loveStories.$inferSelect;
export type InsertLoveStory = typeof loveStories.$inferInsert;
export const loveStoriesRelations = relations(loveStories, ({ one }) => ({
  pet: one(pets, { fields: [loveStories.petId], references: [pets.id] }),
  owner: one(users, { fields: [loveStories.ownerId], references: [users.id] }),
}));

/**
 * Playdates and events
 */
export const playdates = mysqlTable("playdates", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  petIds: json("petIds"),
  location: varchar("location", { length: 255 }), // GeoJSON format: {"type":"Point","coordinates":[lng,lat]}
  scheduledAt: timestamp("scheduledAt"),
  durationMinutes: int("durationMinutes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Playdate = typeof playdates.$inferSelect;
export type InsertPlaydate = typeof playdates.$inferInsert;
export const playdatesRelations = relations(playdates, ({ one }) => ({
  organizer: one(users, { fields: [playdates.organizerId], references: [users.id] }),
}));

/**
 * Marketplace listings with affiliate tracking
 */
export const marketplaceListings = mysqlTable("marketplaceListings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["food", "toys", "accessories", "services", "courses"]).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  affiliateSource: mysqlEnum("affiliateSource", ["amazon", "mercado_libre", "temu", "internal"]),
  affiliateLink: varchar("affiliateLink", { length: 512 }),
  commissionRate: float("commissionRate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = typeof marketplaceListings.$inferInsert;

/**
 * Subscriptions and monetization
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["free", "basic", "premium", "enterprise"]).default("free"),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active"),
  renewsAt: timestamp("renewsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

/**
 * Chat messages for real-time communication
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: text("content").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;