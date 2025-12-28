import { eq, and, or, ne, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, pets, healthRecords, matches, connections,
  loveStories, playdates, marketplaceListings, subscriptions, chatMessages,
  InsertPet, InsertLoveStory, InsertChatMessage, InsertHealthRecord, InsertMarketplaceListing
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// --- USER QUERIES ---

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: any = { openId: user.openId };
  const updateSet: any = {};

  ["name", "email", "loginMethod", "bio", "location", "avatarUrl", "preferences"].forEach(field => {
    if ((user as any)[field] !== undefined) {
      values[field] = (user as any)[field];
      updateSet[field] = (user as any)[field];
    }
  });

  if (user.role) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = 'admin';
    updateSet.role = 'admin';
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUser(id: number, data: any) {
  const db = await getDb();
  if (!db) return;
  return db.update(users).set(data).where(eq(users.id, id));
}

// --- PET QUERIES ---

export async function createPet(data: InsertPet) {
  const db = await getDb();
  if (!db) return;
  return db.insert(pets).values(data);
}

export async function getPetById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pets).where(eq(pets.id, id)).limit(1);
  return result[0];
}

export async function updatePet(id: number, data: any) {
  const db = await getDb();
  if (!db) return;
  return db.update(pets).set(data).where(eq(pets.id, id));
}

export async function getPetsByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pets).where(eq(pets.ownerId, ownerId));
}

export async function getPetsBySpecies(species: string, excludeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(pets)
    .where(and(
      eq(pets.species, species as any),
      ne(pets.id, excludeId)
    ));
}

// --- SOCIAL QUERIES ---

export async function createStory(data: InsertLoveStory) {
  const db = await getDb();
  if (!db) return;
  return db.insert(loveStories).values(data);
}

export async function getRecentStories(limit: number, offset: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loveStories).orderBy(desc(loveStories.createdAt)).limit(limit).offset(offset);
}

// --- CHAT QUERIES ---

export async function createMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) return;
  return db.insert(chatMessages).values(data);
}

export async function getChatHistory(userA: number, userB: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(chatMessages)
    .where(or(
      and(eq(chatMessages.senderId, userA), eq(chatMessages.recipientId, userB)),
      and(eq(chatMessages.senderId, userB), eq(chatMessages.recipientId, userA))
    ))
    .orderBy(chatMessages.createdAt);
}

// --- MARKETPLACE QUERIES ---

export async function createListing(data: InsertMarketplaceListing) {
  const db = await getDb();
  if (!db) return;
  return db.insert(marketplaceListings).values(data);
}

export async function getListings(filters: any) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(marketplaceListings);
  if (filters.category) {
    // Basic filter logic
  }
  return query;
}

// --- HEALTH QUERIES ---

export async function createHealthRecord(data: InsertHealthRecord) {
  const db = await getDb();
  if (!db) return;
  return db.insert(healthRecords).values(data);
}

export async function getHealthRecords(petId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(healthRecords).where(eq(healthRecords.petId, petId));
}

// --- SUBSCRIPTION QUERIES ---

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0];
}
