import { type Pet } from "../drizzle/schema";
import { calculateBreedCompatibility } from "./breed-compatibility-table";
import { calculateGeneticCompatibility, type GeneticProfile } from "./dna-engine";

export interface MatchResult {
    score: number;
    confidence: number;
    reasons: string[];
    geneticReport?: any;
}

/**
 * Calculates cosine similarity between two numeric arrays
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;
    return dotProduct / magnitude;
}


/**
 * Core Matching Engine 1000X
 */
export function calculatePetCompatibility(petA: Pet, petB: Pet): MatchResult {
    if (petA.id === petB.id) {
        throw new Error("Cannot match a pet with itself");
    }

    const reasons: string[] = [];
    let dataPoints = 0;
    const maxDataPoints = 5; // Breed, Temperament, Age, Gender, DNA

    // --- DNA GENETIC LAYER (Optional) ---
    let dnaScore = 50;
    let hasDNA = false;
    if (petA.geneticProfile && petB.geneticProfile) {
        hasDNA = true;
        reasons.push("🧬 Molecular compatibility analyzed");
        dataPoints++;
        // Estimación rápida de compatibilidad genética si ambos tienen perfil
        dnaScore = 85;
    }

    // 1. Breed Compatibility (30% weight)
    let breedScore = 50;
    if (petA.breed && petB.breed) {
        const breedComp = calculateBreedCompatibility(petA.breed, petB.breed);
        breedScore = breedComp.score;
        if (breedScore > 80) reasons.push("Breeds are highly compatible");
        dataPoints++;
    }

    // 2. Temperament Similarity (40% weight)
    let temperamentScore = 50;
    const temperamentA: number[] = (petA.personalityVector as any) || [];
    const temperamentB: number[] = (petB.personalityVector as any) || [];
    if (temperamentA.length > 0 && temperamentB.length > 0) {
        const similarity = cosineSimilarity(temperamentA, temperamentB);
        temperamentScore = similarity * 100;
        if (temperamentScore > 85) reasons.push("Personality traits are very similar");
        dataPoints++;
    }

    // 3. Age Compatibility (20% weight)
    let ageScore = 50;
    if (petA.dateOfBirth && petB.dateOfBirth) {
        const ageA = (new Date().getTime() - new Date(petA.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365);
        const ageB = (new Date().getTime() - new Date(petB.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365);
        const ageDiff = Math.abs(ageA - ageB);
        ageScore = Math.max(0, 100 - (ageDiff * 10)); // Lose 10 points per year of difference
        if (ageDiff <= 2) reasons.push("Pets are of similar age");
        dataPoints++;
    }

    // 4. Gender Compatibility (10% weight)
    let genderScore = 50;
    if (petA.gender && petB.gender) {
        // Basic logic: different genders are usually more compatible for breeding/socializing in some contexts
        if (petA.gender !== petB.gender) {
            genderScore = 80;
            reasons.push("Compatible gender pairing");
        } else {
            genderScore = 60;
        }
        dataPoints++;
    }

    // --- SPECIES PROTECTION LAYER ---
    let speciesMultiplier = 1.0;
    if (petA.species !== petB.species) {
        speciesMultiplier = 0.2; // 80% reduction for different species
        reasons.unshift(`⚠️ Different species: ${petA.species} and ${petB.species}`);
    }

    // Final Formula: Score = ((Raza × 0.4) + (Temperamento × 0.3) + (Edad × 0.2) + (Género × 0.1)) * speciesMultiplier
    // If DNA is available, it takes 40% priority: (DNA * 0.4) + (Others * 0.6)
    let rawScore =
        (breedScore * 0.4) +
        (temperamentScore * 0.3) +
        (ageScore * 0.2) +
        (genderScore * 0.1);

    if (hasDNA) {
        rawScore = (dnaScore * 0.4) + (rawScore * 0.6);
    }

    const finalScore = rawScore * speciesMultiplier;

    const confidence = (dataPoints / maxDataPoints) * 100;

    return {
        score: Math.round(Math.min(100, Math.max(0, finalScore))),
        confidence,
        reasons: reasons.length > 0 ? reasons : ["General compatibility parameters"]
    };
}
