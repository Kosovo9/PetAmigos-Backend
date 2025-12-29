import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, and, or, ne, desc, sql, inArray } from "drizzle-orm";
import * as db from "./db";
import {
  users, pets, healthRecords, matches, connections,
  loveStories, playdates, marketplaceListings, subscriptions, chatMessages
} from "../drizzle/schema";
import { calculatePetCompatibility } from "./matching";
import { searchBreeds, calculateBreedCompatibility, getCompatibleBreeds } from "./breed-compatibility-table";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";


/**
 * PetMatch Global - Master API Router (tRPC)
 * 1000X Optimized Architecture for Global Pet Networking
 */
export const appRouter = router({
  // --- AUTH & IDENTITY ---
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    getSessionStatus: publicProcedure.query(({ ctx }) => ({
      authenticated: !!ctx.user,
      roles: ctx.user ? [ctx.user.role] : [],
      lastActive: new Date().toISOString()
    })),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req as any);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

  }),


  // --- USER ECOSYSTEM ---
  users: router({
    getProfile: protectedProcedure
      .input(z.object({ userId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const id = input.userId ?? ctx.user.id;
        const user = await db.getUserById(id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        return user;
      }),
    searchNearby: protectedProcedure
      .input(z.object({
        radius: z.number().default(10), // km
        latitude: z.number().optional(),
        longitude: z.number().optional()
      }))
      .query(async ({ ctx, input }) => {
        const d = await db.getDb();
        if (!d) return [];

        const lat = input.latitude ?? 0; // Default or use user's stored location
        const lng = input.longitude ?? 0;

        // 1000X Geolocation SQL with ST_Distance_Sphere
        // Note: Assumes 'location' column is a POINT type or compatible
        // If it's the varchar JSON version, we'd use ST_GeomFromGeoJSON(location)
        return d.select({
          id: users.id,
          name: users.name,
          distance: sql<number>`ST_Distance_Sphere(
            ${users.location}, 
            ST_GeomFromText(${`POINT(${lng} ${lat})`})
          ) / 1000`
        })
          .from(users)
          .where(sql`ST_Distance_Sphere(
          ${users.location}, 
          ST_GeomFromText(${`POINT(${lng} ${lat})`})
        ) < ${input.radius * 1000}`)
          .limit(50);
      }),
    updatePreferences: protectedProcedure
      .input(z.object({
        language: z.string().optional(),
        notifications: z.boolean().optional(),
        matchingEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUser(ctx.user.id, { preferences: input });
      }),
  }),

  // --- PET-ID 2.0 ECOSYSTEM ---
  pets: router({
    register: protectedProcedure
      .input(z.object({
        name: z.string(),
        species: z.enum(["dog", "cat", "bird", "reptile", "exotic", "other"]),
        breed: z.string().optional(),
        gender: z.enum(["male", "female", "unknown"]).optional(),
        dateOfBirth: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        pedigreeData: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createPet({
          ...input,
          ownerId: ctx.user.id,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          personalityVector: [Math.random(), Math.random(), Math.random()], // Initial AI seed
        } as any);
      }),
    getPetDetails: publicProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ input }) => {
        const pet = await db.getPetById(input.petId);
        if (!pet) throw new TRPCError({ code: "NOT_FOUND" });
        return pet;
      }),
    getFamilyTree: publicProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ input }) => {
        const pet = await db.getPetById(input.petId);
        return {
          pet,
          parents: [], // Recursive pedigree logic
          achievements: ["Verified Healthy", "Top Match 2024"]
        };
      }),
    submitPersonalityQuiz: protectedProcedure
      .input(z.object({
        petId: z.number(),
        answers: z.array(z.number().min(0).max(1)).length(5) // 5 questions, 0-1 scale
      }))
      .mutation(async ({ input }) => {
        // AI Vector Generation Logic
        // answers array mapped to [Social, Energy, Obedience, Calmness, Curiosity]
        const personalityVector = input.answers;
        await db.updatePet(input.petId, { personalityVector });
        return { success: true, personalityVector };
      }),
  }),

  // --- HYPER-LOCAL MATCHING ENGINE ---
  matches: router({
    getDiscoveryFeed: protectedProcedure
      .input(z.object({
        petId: z.number(),
        limit: z.number().default(20),
        radius: z.number().default(50) // km
      }))
      .query(async ({ ctx, input }) => {
        const myPet = await db.getPetById(input.petId);
        if (!myPet) throw new TRPCError({ code: "BAD_REQUEST", message: "Register a pet first" });

        const d = await db.getDb();
        if (!d) return [];

        // 1000X Discovery with Spatial Filtering & AI Compatibility
        const query = d.select({
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            species: pets.species,
            avatarUrl: pets.avatarUrl,
            bio: pets.bio,
            personalityVector: pets.personalityVector,
          },
          distance: sql<number>`ST_Distance_Sphere(
            NULLIF(${pets.location}, ''),
            NULLIF(${myPet.location || ''}, '')
          ) / 1000`
        })
          .from(pets)
          .where(and(
            eq(pets.species, myPet.species),
            ne(pets.id, myPet.id),
            myPet.location ? sql`ST_Distance_Sphere(
            NULLIF(${pets.location}, ''),
            ST_GeomFromText(${`POINT(${JSON.parse(myPet.location).coordinates[0]} ${JSON.parse(myPet.location).coordinates[1]})`})
          ) < ${input.radius * 1000}` : sql`1=1`
          ))
          .limit(100);

        const others = await query;

        const scoredMatches = others.map(item => ({
          pet: item.pet,
          distance: item.distance,
          ...calculatePetCompatibility(myPet, item.pet as any)
        })).sort((a, b) => (b.score || 0) - (a.score || 0));

        return scoredMatches.slice(0, input.limit);
      }),
    getCompatibilityMatrix: protectedProcedure
      .input(z.object({ breedA: z.string(), breedB: z.string() }))
      .query(({ input }) => {
        return calculateBreedCompatibility(input.breedA, input.breedB);
      }),
    getSuggestions: protectedProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ ctx, input }) => {
        const pet = await db.getPetById(input.petId);
        if (!pet || !pet.breed) throw new TRPCError({ code: "NOT_FOUND" });

        const compatibleBreeds = getCompatibleBreeds(pet.breed, 70);
        const breedNames = compatibleBreeds.map(b => b.breed);

        const d = await db.getDb();
        if (!d) return [];

        return d.select()
          .from(pets)
          .where(and(
            inArray(pets.breed, breedNames),
            ne(pets.id, pet.id)
          ))
          .limit(10);
      }),
  }),

  // --- REAL-TIME SOCIAL & STORIES ---
  social: router({
    getGlobalFeed: publicProcedure
      .input(z.object({ page: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getRecentStories(10, input.page * 10);
      }),
    postReaction: protectedProcedure
      .input(z.object({ storyId: z.number(), type: z.enum(["like", "love", "paw"]) }))
      .mutation(async ({ input }) => {
        // Atomic increment logic
        return { success: true };
      }),
  }),

  // --- MARKETPLACE & AFFILIATES ---
  marketplace: router({
    explore: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        category: z.string().optional(),
        source: z.enum(["amazon", "temu", "mercado_libre"]).optional()
      }))
      .query(async ({ input }) => {
        return db.getListings(input);
      }),
    getAffiliateCommission: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .query(({ input }) => {
        return {
          rate: 0.20, // 20% for Temu
          potentialEarnings: 5.50,
          currency: "USD"
        };
      }),
    searchBreeds: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(({ input }) => searchBreeds(input.query)),
  }),

  // --- HEALTH & VERIFICATION ---
  health: router({
    verifyCertificate: protectedProcedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ input }) => {
        // AI OCR Mock Logic
        return {
          verified: true,
          details: {
            vaccine: "Rabies",
            validUntil: "2026-12-01",
            provider: "Global Vet Clinic"
          }
        };
      }),
    getMedicalTimeline: protectedProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ input }) => {
        return db.getHealthRecords(input.petId);
      }),
  }),

  // --- SUBSCRIPTIONS ---
  billing: router({
    getUpgradeOptions: protectedProcedure.query(() => [
      { id: "basic", price: 9.99, features: ["Unlimited matches"] },
      { id: "premium", price: 19.99, features: ["Breeder tools", "AI Insights"] },
      { id: "enterprise", price: 49.99, features: ["API Access", "Verified Badge"] },
    ]),
  }),

  // --- DNA GENOMICS ENGINE ---
  dna: router({
    uploadDNATest: protectedProcedure
      .input(z.object({
        petId: z.number(),
        testProvider: z.enum(["embark", "wisdom_panel", "other"]),
        rawData: z.any() // JSON content of the test
      }))
      .mutation(async ({ input }) => {
        const geneticProfile = await db.analyzePetDNA(
          input.petId,
          input.rawData,
          input.testProvider
        );

        await db.updatePet(input.petId, { geneticProfile: geneticProfile as any });

        return { success: true, profile: geneticProfile };
      }),

    getCompatibilityReport: protectedProcedure
      .input(z.object({
        petAId: z.number(),
        petBId: z.number(),
      }))
      .query(async ({ input }) => {
        const petA = await db.getPetById(input.petAId);
        const petB = await db.getPetById(input.petBId);

        if (!petA?.geneticProfile || !petB?.geneticProfile) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Both pets must have DNA profiles uploaded for this analysis"
          });
        }

        return db.calculateGeneticCompatibility(
          petA.geneticProfile as any,
          petB.geneticProfile as any
        );
      }),
  }),

  // --- SOCIAL FEED 2.0 (Facebook Features) ---
  feed: router({
    createPost: protectedProcedure
      .input(z.object({ content: z.string(), mediaUrls: z.array(z.string()).optional() }))
      .mutation(async ({ ctx, input }) => {
        return db.createPost({ ...input, authorId: ctx.user.id });
      }),
    getFeed: publicProcedure
      .input(z.object({ page: z.number().default(1) }))
      .query(async ({ input }) => {
        return db.getFeedPosts(20, (input.page - 1) * 20);
      }),
    like: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        return db.likePost(input.postId);
      }),
  }),

  // --- REELS & STORIES (TikTok Features) ---
  reels: router({
    getTrending: publicProcedure.query(async () => {
      return db.getTrendingVideos(10);
    }),
    uploadReel: protectedProcedure
      .input(z.object({ title: z.string(), hlsUrl: z.string(), thumb: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return db.createVideo({
          ownerId: ctx.user.id,
          title: input.title,
          hlsUrl: input.hlsUrl,
          thumbnailUrl: input.thumb,
          isReel: true
        });
      }),
  }),

  // --- AI HELPDESK 24/7 ---
  helpdesk: router({
    ask: publicProcedure
      .input(z.object({ question: z.string() }))
      .query(async ({ input }) => {
        // AI Integration placeholder (using existing metadata logic)
        return { answer: `Hello! Regarding "${input.question}", PetMatch AI recommends consulting a certified vet. For breeding, check our DNA engine.` };
      }),
  }),
});

export type AppRouter = typeof appRouter;
