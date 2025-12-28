# 🩺 Breed Compatibility Engine Documentation

## 1. Overview
The **Breed Compatibility Engine** is a core component of PetMatch Global, designed to calculate the physical and behavioral compatibility between different animal breeds. It uses a multi-factor weighted formula to provide a score from 0 to 100.

## 2. Architecture
- **Data Source**: A master dictionary of 200+ breeds categorized by species, AKC group, size, energy, and temperament.
- **Engine Logic**: A singleton class `BreedCompatibilityEngine` with LRU caching for O(1) retrieval of previously calculated scores.
- **Weights**:
    - **Group Compatibility (40%)**: Biological and historical breeding compatibility.
    - **Physical Size (30%)**: Important for safety and shared play space.
    - **Energy Levels (20%)**: Alignment in activity requirements.
    - **Temperament (10%)**: Shared personality traits.

## 3. Mathematical Formula
```
Score = 50 + (Group_Score - 50) * 0.4 
          + (Size_Score - 50) * 0.3 
          + (Energy_Score - 50) * 0.2 
          + (Trait_Score - 50) * 0.1
```
*Note: The score is clamped between 0 and 100.*

## 4. Public API
### `calculateBreedCompatibility(breedA, breedB)`
Returns `{ score: number, reason: string[], confidence: number }`.

### `getCompatibleBreeds(breed, minScore)`
Returns a sorted list of breeds that meet the minimum compatibility threshold.

### `searchBreeds(query)`
Returns a filtered list of breeds matching the name or group.

### `getAllBreeds()`
Returns the complete database of breed information.

## 5. Performance Benchmarks
- **Cold Boot**: < 5ms
- **Lookup (Cached)**: < 0.1ms
- **Throughput**: 1000+ calculations/sec
- **Memory Footprint**: < 2MB for the entire database.

## 6. Coverage
- **Dogs**: 150+ breeds (Sporting, Working, Herding, Toy, etc.)
- **Cats**: Main breeds (Maine Coon, Siamese, Bengal, etc.)
- **Birds**: Common companion parrots.

## 7. Integration Guide
Integrate this into your tRPC routers or REST endpoints to provide real-time matching suggestions based on breed characteristics.
