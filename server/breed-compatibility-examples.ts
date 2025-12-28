/**
 * Breed Compatibility Examples for PetMatch Global
 * 
 * This file contains 12 practical examples of how to use the BreedCompatibilityEngine.
 */

import {
    calculateBreedCompatibility,
    getCompatibleBreeds,
    searchBreeds,
    getAllBreeds,
    getBreedCompatibilityEngine
} from "./breed-compatibility-table.ts";

// 1. Basic Compatibility Calculation
console.log("--- 1. Basic Compatibility ---");
const basicResult = calculateBreedCompatibility("Golden Retriever", "Labrador Retriever");
console.log(`Golden vs Labrador: ${basicResult.score}% (Reason: ${basicResult.reason.join(", ")})`);

// 2. Cross-Species Compatibility (Safety Check)
console.log("\n--- 2. Safety Check ---");
const crossSpecies = calculateBreedCompatibility("Golden Retriever", "Maine Coon");
console.log(`Dog vs Cat Score: ${crossSpecies.score}% (Caution: ${crossSpecies.reason[0]})`);

// 3. Finding High-Match Partners
console.log("\n--- 3. Best Matches ---");
const matches = getCompatibleBreeds("German Shepherd", 85);
console.log("Top matches for German Shepherd:");
matches.slice(0, 3).forEach(m => console.log(`- ${m.breed}: ${m.score}%`));

// 4. Searching for Breeds
console.log("\n--- 4. Breed Search ---");
const retrievers = searchBreeds("Retriever");
console.log(`Found ${retrievers.length} retrievers.`);

// 5. Integration with Matching Logic
console.log("\n--- 5. AI Matching Logic ---");
const myPet = { breed: "French Bulldog", personality: [0.8, 0.2, 0.9] };
const candidate = { breed: "Boston Terrier", personality: [0.75, 0.25, 0.85] };
const breedComp = calculateBreedCompatibility(myPet.breed, candidate.breed);
const totalScore = (breedComp.score * 0.4) + (0.6 * 100); // Weighted average example
console.log(`Hybrid Match Score: ${totalScore}%`);

// 6. Cache and Performance Monitoring
console.log("\n--- 6. Performance ---");
const startTime = Date.now();
for (let i = 0; i < 1000; i++) calculateBreedCompatibility("Golden Retriever", "Beagle");
console.log(`1000 lookups took: ${Date.now() - startTime}ms (Thanks to LRU Cache)`);

// 7. Group Analysis
console.log("\n--- 7. Group Analysis ---");
const allBreeds = getAllBreeds();
const herdingGroup = allBreeds.filter(b => b.group === "herding");
console.log(`Total Herding Breeds: ${herdingGroup.length}`);

// 8. Compatibility Matrix Generation
console.log("\n--- 8. Matrix Generation ---");
const sample = ["Chihuahua", "Poodle", "Rottweiler"];
sample.forEach(a => {
    sample.forEach(b => {
        if (a < b) {
            const res = calculateBreedCompatibility(a, b);
            console.log(`${a} + ${b} = ${res.score}%`);
        }
    });
});

// 9. Intelligent Recommendations
console.log("\n--- 9. Recommendations ---");
function recommendForSmallApartment() {
    return getAllBreeds().filter(b => b.size === "small" && b.energy === "low");
}
console.log("Recommended for small apartments:", recommendForSmallApartment().map(b => b.name));

// 10. Data Statistics
console.log("\n--- 10. Statistics ---");
const stats = allBreeds.reduce((acc: any, b) => {
    acc[b.species] = (acc[b.species] || 0) + 1;
    return acc;
}, {});
console.log("Database Stats:", stats);

// 11. Error Handling and Validations
console.log("\n--- 11. Validation ---");
const invalidResult = calculateBreedCompatibility("Dragon", "Unicorn");
console.log(`Unknown Breeds Result: ${invalidResult.score}% (Reason: ${invalidResult.reason[0]})`);

// 12. Engine Management
console.log("\n--- 12. Engine Management ---");
const engine = getBreedCompatibilityEngine();
engine.clearCache();
console.log("Engine cache cleared successfully.");
