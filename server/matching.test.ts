import { describe, it, expect } from 'vitest';
import { calculatePetCompatibility } from './matching';
import { type Pet } from '../drizzle/schema';

describe('Matching Engine - Core Functionality (18 tests)', () => {
    const basePet: Partial<Pet> = {
        id: 1,
        name: "Max",
        species: "dog",
        breed: "Golden Retriever",
        gender: "male",
        dateOfBirth: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000), // 4 years old
        personalityVector: [0.9, 0.8, 0.7, 0.9, 0.8]
    };

    it('should return high compatibility score for same breed with similar temperament', () => {
        const petA = { ...basePet } as Pet;
        const petB = {
            ...basePet,
            id: 2,
            name: "Luna",
            gender: "female",
            personalityVector: [0.89, 0.81, 0.69, 0.91, 0.79]
        } as Pet;

        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeGreaterThan(90);
        expect(result.reasons).toContain("Breeds are highly compatible");
    });

    it('should return good compatibility for compatible breeds', () => {
        const petA = { ...basePet } as Pet;
        const petB = {
            ...basePet,
            id: 2,
            breed: "Labrador Retriever",
            gender: "female"
        } as Pet;

        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeGreaterThan(70);
    });

    it('should return moderate compatibility for less compatible breeds', () => {
        const petA = { ...basePet } as Pet;
        const petB = {
            ...basePet,
            id: 2,
            breed: "Chihuahua",
            gender: "female"
        } as Pet;

        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeLessThan(80);
    });

    it('should throw error when trying to match pet with itself', () => {
        const petA = { ...basePet } as Pet;
        expect(() => calculatePetCompatibility(petA, petA)).toThrow("Cannot match a pet with itself");
    });

    it('should correctly calculate temperament similarity using cosine similarity', () => {
        const petA = { ...basePet, personalityVector: [1, 0, 0] } as Pet;
        const petB = { ...basePet, id: 2, personalityVector: [1, 0, 0] } as Pet;
        const result = calculatePetCompatibility(petA, petB);

        const petC = { ...basePet, id: 3, personalityVector: [0, 1, 0] } as Pet;
        const resultNoSim = calculatePetCompatibility(petA, petC);

        expect(result.score).toBeGreaterThan(resultNoSim.score);
    });

    it('should prioritize pets of similar age', () => {
        const petA = { ...basePet } as Pet; // 4 years
        const petB = { ...basePet, id: 2, dateOfBirth: new Date(Date.now() - 4.1 * 365 * 24 * 60 * 60 * 1000) } as Pet; // ~4 years
        const petC = { ...basePet, id: 3, dateOfBirth: new Date(Date.now() - 12 * 365 * 24 * 60 * 60 * 1000) } as Pet; // 12 years

        const resSimilar = calculatePetCompatibility(petA, petB);
        const resDifferent = calculatePetCompatibility(petA, petC);

        expect(resSimilar.score).toBeGreaterThan(resDifferent.score);
        expect(resSimilar.reasons).toContain("Pets are of similar age");
    });

    it('should consider gender compatibility', () => {
        const petA = { ...basePet, gender: "male" } as Pet;
        const petB = { ...basePet, id: 2, gender: "female" } as Pet;
        const petC = { ...basePet, id: 3, gender: "male" } as Pet;

        const resDiff = calculatePetCompatibility(petA, petB);
        const resSame = calculatePetCompatibility(petA, petC);

        expect(resDiff.score).toBeGreaterThan(resSame.score);
    });

    it('should calculate confidence based on data completeness', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2 } as Pet;
        const resFull = calculatePetCompatibility(petA, petB);

        const petIncomplete = { id: 3, breed: "Poodle" } as Pet;
        const resPartial = calculatePetCompatibility(petA, petIncomplete);

        expect(resFull.confidence).toBe(100);
        expect(resPartial.confidence).toBeLessThan(100);
    });

    it('should always return score between 0 and 100', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2, breed: "Unknown", personalityVector: [0, 0, 0, 0, 0] } as Pet;
        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should provide clear match reasons', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2, gender: "female" } as Pet;
        const result = calculatePetCompatibility(petA, petB);
        expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('should be deterministic (same input always produces same output)', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2 } as Pet;
        const res1 = calculatePetCompatibility(petA, petB);
        const res2 = calculatePetCompatibility(petA, petB);
        expect(res1.score).toBe(res2.score);
    });

    it('should handle very young pets correctly', () => {
        const petA = { ...basePet, dateOfBirth: new Date(Date.now() - 0.5 * 365 * 24 * 60 * 60 * 1000) } as Pet; // 6 months
        const petB = { ...basePet, id: 2, dateOfBirth: new Date(Date.now() - 0.6 * 365 * 24 * 60 * 60 * 1000) } as Pet; // 7 months
        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeGreaterThan(80);
    });

    it('should handle very old pets correctly', () => {
        const petA = { ...basePet, dateOfBirth: new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000) } as Pet; // 15 years
        const petB = { ...basePet, id: 2, dateOfBirth: new Date(Date.now() - 14 * 365 * 24 * 60 * 60 * 1000) } as Pet; // 14 years
        const result = calculatePetCompatibility(petA, petB);
        expect(result.reasons).toContain("Pets are of similar age");
    });

    it('should handle large breed differences', () => {
        const petA = { ...basePet, breed: "Great Dane" } as Pet;
        const petB = { ...basePet, id: 2, breed: "Chihuahua" } as Pet;
        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeLessThan(70);
    });

    it('should calculate compatibility in less than 10ms', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2 } as Pet;
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            calculatePetCompatibility(petA, petB);
        }
        const end = performance.now();
        expect((end - start) / 100).toBeLessThan(10);
    });

    it('should throw error when pet is null or undefined', () => {
        expect(() => calculatePetCompatibility(null as any, basePet as Pet)).toThrow();
    });

    it('should return same score regardless of pet order (symmetry)', () => {
        const petA = { ...basePet } as Pet;
        const petB = { ...basePet, id: 2, breed: "Poodle" } as Pet;
        const res1 = calculatePetCompatibility(petA, petB);
        const res2 = calculatePetCompatibility(petB, petA);
        expect(res1.score).toBe(res2.score);
    });

    it('should handle empty personality vectors gracefully', () => {
        const petA = { ...basePet, personalityVector: [] } as Pet;
        const petB = { ...basePet, id: 2, personalityVector: [] } as Pet;
        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeDefined();
        expect(result.confidence).toBeLessThan(100);
    });

    it('should handle cat-to-cat matching', () => {
        const catA = { ...basePet, species: "cat", breed: "Maine Coon", id: 10 } as Pet;
        const catB = { ...basePet, species: "cat", breed: "Siamese", id: 11 } as Pet;
        const result = calculatePetCompatibility(catA, catB);
        expect(result.score).toBeGreaterThan(60);
        expect(result.confidence).toBeGreaterThan(0);
    });

    it('should assign very low score for different species', () => {
        const dog = { ...basePet, species: "dog", breed: "Golden Retriever", id: 12 } as Pet;
        const cat = { ...basePet, species: "cat", breed: "Siamese", id: 13 } as Pet;
        const result = calculatePetCompatibility(dog, cat);
        expect(result.score).toBeLessThan(30);
        expect(result.reasons[0]).toContain("Different species");
    });

    it('should handle herding breeds correctly', () => {
        const petA = { ...basePet, breed: "Border Collie", id: 14 } as Pet;
        const petB = { ...basePet, breed: "Australian Shepherd", id: 15 } as Pet;
        const result = calculatePetCompatibility(petA, petB);
        expect(result.score).toBeGreaterThan(85);
        expect(result.reasons).toContain("Breeds are highly compatible");
    });
});
