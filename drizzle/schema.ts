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
  geneticProfile: json("geneticProfile"),
  behavioralProfile: json("behavioralProfile"),
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

// --- SOCIAL ECOSYSTEM (Facebook Features) ---

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls"), // Store as string array
  likesCount: int("likesCount").default(0),
  commentsCount: int("commentsCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// --- MESSAGING SYSTEM ---

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  participantIds: json("participantIds").notNull(), // Array of user IDs
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  text: text("text"),
  mediaUrls: json("mediaUrls"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// --- ADVANCED MARKETPLACE ---

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: int("price").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD"),
  mediaUrls: json("mediaUrls"),
  stock: int("stock").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  total: int("total").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 64 }).default("pending"),
  paymentId: varchar("paymentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// --- VIDEO & REELS (TikTok/Instagram Features) ---

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  hlsUrl: varchar("hlsUrl", { length: 512 }), // m3u8 path
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  viewCount: int("viewCount").default(0),
  likeCount: int("likeCount").default(0),
  isReel: boolean("isReel").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  mediaUrl: varchar("mediaUrl", { length: 512 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // image | video
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

export const creatorAnalytics = mysqlTable("creatorAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  views: int("views").default(0),
  likes: int("likes").default(0),
  earnings: int("earnings").default(0),
});

export type CreatorAnalytic = typeof creatorAnalytics.$inferSelect;
export type InsertCreatorAnalytic = typeof creatorAnalytics.$inferInsert;

// --- NOTIFICATIONS ---

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(), // like, comment, message, match
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// --- RELATIONS ---

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, { fields: [products.sellerId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  buyer: one(users, { fields: [orders.buyerId], references: [users.id] }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  owner: one(users, { fields: [videos.ownerId], references: [users.id] }),
}));

export const storiesRelations = relations(stories, ({ one }) => ({
  owner: one(users, { fields: [stories.ownerId], references: [users.id] }),
}));

export const creatorAnalyticsRelations = relations(creatorAnalytics, ({ one }) => ({
  user: one(users, { fields: [creatorAnalytics.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));