import "dotenv/config";
import { users, pets } from "../drizzle/schema.ts";
import { nanoid } from "nanoid";

async function seed() {
    console.log("🚀 Starting 1000X Global PetMatch Seeding...");

    // Use dynamic import to avoid static resolution issues
    const dbModule = await import("../server/db.ts");
    const getDb = dbModule.getDb;
    const db = await getDb();

    if (!db) {
        console.error("❌ Database connection failed. Set DATABASE_URL.");
        process.exit(1);
    }

    const locations = [
        { name: "CDMX", lat: 19.4326, lng: -99.1332 },
        { name: "New York", lat: 40.7128, lng: -74.0060 },
        { name: "London", lat: 51.5074, lng: -0.1278 },
        { name: "Madrid", lat: 40.4168, lng: -3.7038 },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
        { name: "Sydney", lat: -33.8688, lng: 151.2093 },
        { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 }
    ];

    const dogBreeds = [
        "Golden Retriever", "Labrador Retriever", "German Shepherd", "French Bulldog",
        "Beagle", "Poodle", "Rottweiler", "Bulldog", "Boxer", "Dachshund", "Border Collie"
    ];
    const catBreeds = [
        "Maine Coon", "Siamese", "Ragdoll", "Persian", "Bengal", "Sphynx", "British Shorthair"
    ];

    const insertedUsers: any[] = [];

    // Create 10 Global Owners
    console.log("👤 Creating 10 Global Pet Owners...");
    for (let i = 1; i <= 10; i++) {
        const loc = locations[i % locations.length];
        const openId = `seed_user_${i}_${nanoid(5)}`;
        const userLoc = {
            type: "Point",
            coordinates: [loc.lng + (Math.random() - 0.5) * 0.1, loc.lat + (Math.random() - 0.5) * 0.1]
        };

        const result: any = await db.insert(users).values({
            openId,
            name: `Global Owner ${i}`,
            email: `owner${i}@petmatch.global`,
            location: JSON.stringify(userLoc),
            role: "user"
        } as any);

        // Result handling for MySQL2
        const userId = result[0]?.insertId || result.insertId;
        if (!userId) {
            console.warn(`⚠️ Failed to get userId for owner ${i}, skipping pets.`);
            continue;
        }
        insertedUsers.push({ id: userId, loc: userLoc });
    }

    // Create 50 Pets
    console.log(`🐾 Creating 50 Diversified Pets (Owners: ${insertedUsers.length})...`);
    if (insertedUsers.length === 0) {
        console.error("❌ No users were created. Check DB permissions.");
        process.exit(1);
    }

    const petNames = [
        "Max", "Luna", "Rocky", "Bella", "Charlie", "Molly", "Buddy", "Lucy", "Cooper", "Daisy",
        "Milo", "Ginger", "Simba", "Nala", "Oliver", "Chloe", "Leo", "Mia", "Jack", "Sophie",
        "Toby", "Penny", "Bear", "Ruby", "Duke", "Zoe", "Teddy", "Lily", "Tucker", "Lola",
        "Cleo", "Jasper", "Willow", "Felix", "Smokey", "Oscar", "Sasha", "Zeus", "Athena",
        "Apollo", "Diana", "Bruno", "Coco", "Sparky", "Mittens", "Whiskers", "Shadow", "Rex", "Goldie", "Rusty"
    ];

    for (let i = 0; i < 50; i++) {
        const owner = insertedUsers[i % insertedUsers.length];
        const isDog = Math.random() > 0.3;
        const breedPool = isDog ? dogBreeds : catBreeds;
        const breed = breedPool[Math.floor(Math.random() * breedPool.length)];

        const petLoc = {
            type: "Point",
            coordinates: [
                owner.loc.coordinates[0] + (Math.random() - 0.5) * 0.05,
                owner.loc.coordinates[1] + (Math.random() - 0.5) * 0.05
            ]
        };

        await db.insert(pets).values({
            ownerId: owner.id,
            name: petNames[i],
            species: isDog ? 'dog' : 'cat',
            breed: breed,
            gender: Math.random() > 0.5 ? "male" : "female",
            location: JSON.stringify(petLoc),
            bio: `I am a happy ${breed} from ${locations[owner.id % locations.length]?.name || 'Unknown'}! I love making new friends.`,
            personalityVector: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
            avatarUrl: `https://loremflickr.com/400/400/${isDog ? 'dog' : 'cat'},${breed.replace(/\s/g, '')}`
        } as any);
    }

    console.log("✅ Seeding Complete! 10 Owners and 50 Pets are now live globally.");
    process.exit(0);
}

seed().catch(err => {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
});
