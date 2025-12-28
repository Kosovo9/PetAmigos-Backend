import "dotenv/config";
import { getDb } from "./server/db.ts";
import { users, pets } from "./drizzle/schema.ts";

async function testSeed() {
    const db = await getDb();
    if (!db) {
        console.error("No DB connection");
        process.exit(1);
    }

    console.log("Testing user insertion...");
    try {
        const result = await db.insert(users).values({
            openId: "test_user_" + Date.now(),
            name: "Test User",
            email: "test@example.com",
            role: "user"
        });
        console.log("User Insert Result:", result);

        // For MySQL, result often has an insertId directly or in a specific property
        const userId = (result as any)[0]?.insertId || (result as any).insertId;
        console.log("User ID:", userId);

        if (userId) {
            console.log("Testing pet insertion...");
            const petResult = await db.insert(pets).values({
                ownerId: userId,
                name: "Test Pet",
                species: "dog",
                breed: "Golden Retriever"
            });
            console.log("Pet Insert Result:", petResult);
        }
    } catch (err) {
        console.error("Test Seed Failed:", err);
    }
    process.exit(0);
}

testSeed();
