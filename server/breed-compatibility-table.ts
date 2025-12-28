/**
 * Breed Compatibility Engine for PetMatch Global
 * 
 * This module provides a high-performance, O(1) lookup for breed compatibility
 * based on AKC groups, size, energy levels, and temperament traits.
 * 
 * Optimized with LRU caching and singleton pattern.
 */

export interface BreedInfo {
    name: string;
    species: 'dog' | 'cat' | 'bird' | 'reptile' | 'exotic';
    group: string;
    size: 'small' | 'medium' | 'large' | 'giant';
    energy: 'low' | 'medium' | 'high';
    temperament: string[];
}

export interface CompatibilityResult {
    score: number;
    reason: string[];
    confidence: number;
}

const BREED_DATA: Record<string, BreedInfo> = {
    // --- DOGS ---
    "Golden Retriever": {
        name: "Golden Retriever",
        species: "dog",
        group: "sporting",
        size: "large",
        energy: "high",
        temperament: ["friendly", "intelligent", "devoted", "playful"]
    },
    "Labrador Retriever": {
        name: "Labrador Retriever",
        species: "dog",
        group: "sporting",
        size: "large",
        energy: "high",
        temperament: ["friendly", "intelligent", "outgoing", "playful"]
    },
    "German Shepherd": {
        name: "German Shepherd",
        species: "dog",
        group: "herding",
        size: "large",
        energy: "high",
        temperament: ["confident", "intelligent", "loyal", "courageous"]
    },
    "French Bulldog": {
        name: "French Bulldog",
        species: "dog",
        group: "non-sporting",
        size: "small",
        energy: "medium",
        temperament: ["adaptable", "playful", "intelligent", "quiet"]
    },
    "Poodle": {
        name: "Poodle",
        species: "dog",
        group: "non-sporting",
        size: "medium",
        energy: "high",
        temperament: ["intelligent", "active", "proud", "elegant"]
    },
    "Beagle": {
        name: "Beagle",
        species: "dog",
        group: "hound",
        size: "small",
        energy: "high",
        temperament: ["friendly", "curious", "merry", "stubborn"]
    },
    "Rottweiler": {
        name: "Rottweiler",
        species: "dog",
        group: "working",
        size: "large",
        energy: "medium",
        temperament: ["loyal", "loving", "confident", "guardian"]
    },
    "Dachshund": {
        name: "Dachshund",
        species: "dog",
        group: "hound",
        size: "small",
        energy: "medium",
        temperament: ["clever", "lively", "courageous", "stubborn"]
    },
    "Siberian Husky": {
        name: "Siberian Husky",
        species: "dog",
        group: "working",
        size: "medium",
        energy: "high",
        temperament: ["loyal", "mischievous", "outgoing", "friendly"]
    },
    "Boxer": {
        name: "Boxer",
        species: "dog",
        group: "working",
        size: "large",
        energy: "high",
        temperament: ["intelligent", "fun-loving", "active", "loyal"]
    },
    "Jack Russell Terrier": {
        name: "Jack Russell Terrier",
        species: "dog",
        group: "terrier",
        size: "small",
        energy: "high",
        temperament: ["alert", "active", "fearless", "intelligent"]
    },
    "Pomeranian": {
        name: "Pomeranian",
        species: "dog",
        group: "toy",
        size: "small",
        energy: "medium",
        temperament: ["bold", "extroverted", "vivacious", "playful"]
    },
    "Chihuahua": {
        name: "Chihuahua",
        species: "dog",
        group: "toy",
        size: "small",
        energy: "medium",
        temperament: ["charming", "graceful", "sassy", "loyal"]
    },
    "Great Dane": {
        name: "Great Dane",
        species: "dog",
        group: "working",
        size: "giant",
        energy: "low",
        temperament: ["friendly", "patient", "dependable", "noble"]
    },
    "Border Collie": {
        name: "Border Collie",
        species: "dog",
        group: "herding",
        size: "medium",
        energy: "high",
        temperament: ["intelligent", "energetic", "alert", "responsive"]
    },
    "Australian Shepherd": {
        name: "Australian Shepherd",
        species: "dog",
        group: "herding",
        size: "medium",
        energy: "high",
        temperament: ["intelligent", "energetic", "alert", "loyal"]
    },
    "Corgi (Pembroke Welsh)": {
        name: "Corgi (Pembroke Welsh)",
        species: "dog",
        group: "herding",
        size: "small",
        energy: "medium",
        temperament: ["affectionate", "intelligent", "alert", "active"]
    },
    "Bulldog": {
        name: "Bulldog",
        species: "dog",
        group: "non-sporting",
        size: "medium",
        energy: "low",
        temperament: ["friendly", "courageous", "calm", "dignified"]
    },
    "Yorkshire Terrier": {
        name: "Yorkshire Terrier",
        species: "dog",
        group: "toy",
        size: "small",
        energy: "high",
        temperament: ["sprightly", "intelligent", "affectionate", "brave"]
    },
    "Maltese": {
        name: "Maltese",
        species: "dog",
        group: "toy",
        size: "small",
        energy: "medium",
        temperament: ["gentle", "playful", "charming", "fearless"]
    },
    "Bernese Mountain Dog": {
        name: "Bernese Mountain Dog",
        species: "dog",
        group: "working",
        size: "large",
        energy: "medium",
        temperament: ["good-natured", "calm", "strong", "loyal"]
    },
    "Shiba Inu": {
        name: "Shiba Inu",
        species: "dog",
        group: "non-sporting",
        size: "small",
        energy: "medium",
        temperament: ["alert", "active", "attentive", "independent"]
    },

    // --- CATS ---
    "Maine Coon": {
        name: "Maine Coon",
        species: "cat",
        group: "longhair",
        size: "large",
        energy: "medium",
        temperament: ["gentle", "friendly", "intelligent", "playful"]
    },
    "Siamese": {
        name: "Siamese",
        species: "cat",
        group: "shorthair",
        size: "medium",
        energy: "high",
        temperament: ["vocal", "social", "intelligent", "active"]
    },
    "Persian": {
        name: "Persian",
        species: "cat",
        group: "longhair",
        size: "medium",
        energy: "low",
        temperament: ["quiet", "sweet", "docile", "affectionate"]
    },
    "Bengal": {
        name: "Bengal",
        species: "cat",
        group: "shorthair",
        size: "medium",
        energy: "high",
        temperament: ["active", "playful", "curious", "intelligent"]
    },
    "Ragdoll": {
        name: "Ragdoll",
        species: "cat",
        group: "longhair",
        size: "large",
        energy: "low",
        temperament: ["affectionate", "placid", "gentle", "relaxed"]
    }
};

// Map groups to compatibility scores
const GROUP_COMPATIBILITY: Record<string, Record<string, number>> = {
    "sporting": { "sporting": 95, "working": 60, "hound": 70, "toy": 40, "non-sporting": 65, "terrier": 40, "herding": 75 },
    "working": { "sporting": 60, "working": 90, "hound": 50, "toy": 20, "non-sporting": 60, "terrier": 50, "herding": 65 },
    "hound": { "sporting": 70, "working": 50, "hound": 95, "toy": 40, "non-sporting": 55, "terrier": 45, "herding": 60 },
    "toy": { "sporting": 40, "working": 20, "hound": 40, "toy": 95, "non-sporting": 70, "terrier": 30, "herding": 50 },
    "terrier": { "sporting": 40, "working": 50, "hound": 45, "toy": 30, "non-sporting": 50, "terrier": 90, "herding": 45 },
    "non-sporting": { "sporting": 65, "working": 60, "hound": 55, "toy": 70, "non-sporting": 90, "terrier": 50, "herding": 60 },
    "herding": { "sporting": 75, "working": 65, "hound": 60, "toy": 50, "non-sporting": 60, "terrier": 45, "herding": 95 },
    "longhair": { "longhair": 95, "shorthair": 80 },
    "shorthair": { "longhair": 80, "shorthair": 95 }
};


class BreedCompatibilityEngine {
    private cache: Map<string, CompatibilityResult> = new Map();
    private readonly MAX_CACHE_SIZE = 1000;

    public calculate(breedA: string, breedB: string): CompatibilityResult {
        const key = [breedA, breedB].sort().join("|");
        if (this.cache.has(key)) return this.cache.get(key)!;

        const dataA = BREED_DATA[breedA];
        const dataB = BREED_DATA[breedB];

        if (!dataA || !dataB) {
            return { score: 50, reason: ["Unknown breed data, using neutral baseline"], confidence: 0.5 };
        }

        if (dataA.species !== dataB.species) {
            return { score: 10, reason: [`Different species: ${dataA.species} and ${dataB.species} require supervised introduction`], confidence: 1.0 };
        }

        const reasons: string[] = [];
        let score = 50;

        // 1. Group Compatibility (40%)
        const groupScore = GROUP_COMPATIBILITY[dataA.group]?.[dataB.group] ?? 70;
        score += (groupScore - 50) * 0.4;
        if (groupScore > 80) reasons.push("Breeds come from compatible phylogenetic groups");

        // 2. Size Compatibility (30%)
        const sizeMap = { small: 1, medium: 2, large: 3, giant: 4 };
        const sizeDiff = Math.abs(sizeMap[dataA.size] - sizeMap[dataB.size]);
        const sizeScore = Math.max(0, 100 - (sizeDiff * 45)); // Increased penalty
        score += (sizeScore - 50) * 0.3;

        if (sizeDiff === 0) reasons.push("Perfect match in physical size");
        else if (sizeDiff === 1) reasons.push("Compatible physical sizes");

        // 3. Energy Levels (20%)
        const energyMap = { low: 1, medium: 2, high: 3 };
        const energyDiff = Math.abs(energyMap[dataA.energy] - energyMap[dataB.energy]);
        const energyScore = Math.max(0, 100 - (energyDiff * 50)); // Increased penalty
        score += (energyScore - 50) * 0.2;
        if (energyDiff === 0) reasons.push("Activity levels are perfectly aligned");

        // 4. Temperament (10%)
        const commonTraits = dataA.temperament.filter(t => dataB.temperament.includes(t));
        const traitScore = commonTraits.length > 0 ? Math.min(100, 50 + (commonTraits.length * 15)) : 20; // Lower base for no common traits
        score += (traitScore - 50) * 0.1;
        if (commonTraits.length > 0) reasons.push(`Shared temperament traits: ${commonTraits.join(", ")}`);


        const finalScore = Math.min(100, Math.max(0, score));
        const result: CompatibilityResult = {
            score: Math.round(finalScore),
            reason: reasons.length > 0 ? reasons : ["General compatibility based on breed standards"],
            confidence: 0.95
        };

        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }
        this.cache.set(key, result);

        return result;
    }

    public getCompatibleBreeds(breed: string, minScore = 70): { breed: string; score: number }[] {
        if (!BREED_DATA[breed]) return [];

        return Object.keys(BREED_DATA)
            .filter(b => b !== breed)
            .map(b => ({ breed: b, score: this.calculate(breed, b).score }))
            .filter(res => res.score >= minScore)
            .sort((a, b) => b.score - a.score);
    }

    public searchBreeds(query: string): BreedInfo[] {
        const q = query.toLowerCase();
        return Object.values(BREED_DATA).filter(b =>
            b.name.toLowerCase().includes(q) ||
            b.group.toLowerCase().includes(q)
        );
    }
}

export const breedEngine = new BreedCompatibilityEngine();

// Export helper for simple usage
export const calculateBreedCompatibility = (a: string, b: string) => breedEngine.calculate(a, b);
export const getCompatibleBreeds = (breed: string, minScore?: number) => breedEngine.getCompatibleBreeds(breed, minScore);
export const searchBreeds = (query: string) => breedEngine.searchBreeds(query);
export { BREED_DATA };
