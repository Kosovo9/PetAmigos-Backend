const { GoogleGenerativeAI } = require('@google/generative-ai');
const sharp = require('sharp');
const MegaPromptSystem = require('./MegaPromptSystem');

/**
 * 🔍 IMAGE ANALYSIS SERVICE - 10X OPTIMIZED
 * Auto-generates hyper-realistic prompts from uploaded images
 * Categorizes images by pet type, breed, scenario
 */

class ImageAnalysisService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }

    /**
     * Analyze single image and generate hyper-realistic prompt
     */
    async analyzeImage(imageBuffer, filename = 'image.jpg') {
        try {
            // Convert to base64
            const base64Image = imageBuffer.toString('base64');
            const mimeType = this.getMimeType(filename);

            const prompt = `Analyze this image in extreme detail for AI image generation (Reverse Engineering).
            
            Extract these specific elements:
            1. SUBJECT: Species, breed, age, color, distinct features.
            2. COMPOSITION: Camera angle, framing, depth of field.
            3. LIGHTING: Type (natural, studio), direction, color temp, intensity.
            4. ENVIRONMENT: Location, background details, atmosphere.
            5. STYLE: Artistic style, mood, aesthetic.

            FORMAT AS JSON:
            {
                "species": "...",
                "breed": "...",
                "scenario": "...",
                "timeOfDay": "...",
                "vibe": "...",
                "subjects": [
                    { "type": "pet/human", "description": "detailed description" }
                ],
                "category": "...",
                "rawAnalysis": "full detailed description"
            }`;

            const result = await this.model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType,
                        data: base64Image
                    }
                }
            ]);

            const response = result.response.text();

            // Extract JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Failed to parse AI response');

            const analysis = JSON.parse(jsonMatch[0]);

            // 🚀 INTEGRATION: Use MegaPromptSystem to generate the 10000x Prompts
            // We generate BOTH versions (Hollywood & Raw) based on the image analysis

            const commonInput = {
                subjects: analysis.subjects || [{ type: 'pet', description: `${analysis.breed} ${analysis.species}` }],
                scenario: analysis.scenario,
                timeOfDay: analysis.timeOfDay || 'noon',
                vibe: analysis.vibe || 'photorealistic',
                groupDynamics: (analysis.subjects && analysis.subjects.length > 1) ? 'friends' : 'solo'
            };

            // 1. Hollywood Glam Version (For Sales)
            analysis.hollywoodPrompt = MegaPromptSystem.generate({
                ...commonInput,
                mode: 'HOLLYWOOD_GLAM'
            });

            // 2. Raw Masterpiece Version (For Upsell)
            analysis.rawPrompt = MegaPromptSystem.generate({
                ...commonInput,
                mode: 'RAW_MASTERPIECE'
            });

            // Legacy support
            analysis.hyperRealisticPrompt = analysis.hollywoodPrompt;

            return {
                success: true,
                analysis,
                rawResponse: response
            };

        } catch (error) {
            console.error('Error analyzing image:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.getFallbackAnalysis(filename)
            };
        }
    }

    /**
     * Batch analyze multiple images
     */
    async analyzeBatch(images) {
        const results = [];

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            console.log(`📸 Analyzing image ${i + 1}/${images.length}: ${image.filename}`);

            const analysis = await this.analyzeImage(image.buffer, image.filename);

            results.push({
                filename: image.filename,
                index: i,
                ...analysis
            });

            // Delay to avoid rate limits
            if (i < images.length - 1) {
                await this.delay(1000); // 1 second between requests
            }
        }

        return this.categorizeResults(results);
    }

    /**
     * Categorize analyzed results
     */
    categorizeResults(results) {
        const categories = {
            portrait: [],
            action: [],
            lifestyle: [],
            nature: [],
            studio: [],
            holiday: [],
            family: [],
            uncategorized: []
        };

        const bySpecies = {
            dog: [],
            cat: [],
            bird: [],
            rabbit: [],
            other: []
        };

        const byBreed = {};

        results.forEach(result => {
            if (result.success && result.analysis) {
                const { category, species, breed } = result.analysis;

                // Categorize by type
                const categoryKey = category?.toLowerCase() || 'uncategorized';
                if (categories[categoryKey]) {
                    categories[categoryKey].push(result);
                } else {
                    categories.uncategorized.push(result);
                }

                // Categorize by species
                const speciesKey = species?.toLowerCase() || 'other';
                if (bySpecies[speciesKey]) {
                    bySpecies[speciesKey].push(result);
                } else {
                    bySpecies.other.push(result);
                }

                // Categorize by breed
                if (breed) {
                    if (!byBreed[breed]) {
                        byBreed[breed] = [];
                    }
                    byBreed[breed].push(result);
                }
            } else {
                categories.uncategorized.push(result);
            }
        });

        return {
            all: results,
            byCategory: categories,
            bySpecies,
            byBreed,
            stats: {
                total: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                categories: Object.keys(categories).map(cat => ({
                    name: cat,
                    count: categories[cat].length
                }))
            }
        };
    }

    /**
     * Fallback analysis for when AI fails
     */
    getFallbackAnalysis(filename) {
        return {
            species: 'unknown',
            breed: 'mixed',
            category: 'uncategorized',
            hyperRealisticPrompt: `A beautiful pet photographed in natural setting, hyper-realistic 8K quality, professional photography, perfect lighting, National Geographic style`,
            note: 'AI analysis failed, using fallback prompt'
        };
    }

    /**
     * Get MIME type from filename
     */
    getMimeType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif'
        };
        return mimeTypes[ext] || 'image/jpeg';
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Optimize image for analysis (reduce size if needed)
     */
    async optimizeForAnalysis(buffer) {
        try {
            const metadata = await sharp(buffer).metadata();

            // If image is too large, resize it
            if (metadata.width > 2048 || metadata.height > 2048) {
                return await sharp(buffer)
                    .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 90 })
                    .toBuffer();
            }

            return buffer;
        } catch (error) {
            console.error('Error optimizing image:', error);
            return buffer;
        }
    }
}

module.exports = new ImageAnalysisService();
