/**
 * 🧠 MEGA PROMPT SYSTEM - 10000x REALISM ENGINE
 * The "Brain" that turns simple user ideas into masterpiece prompts.
 */

class MegaPromptSystem {
    constructor() {
        // 🎨 1. BASE STYLES (The "Vibe")
        this.styles = {
            'photorealistic': 'Ultra-realistic 8K photography, highly detailed, photorealistic, shot on Canon EOS R5, 85mm f/1.2 lens, sharp focus, cinematic lighting, hyper-detailed textures',
            'cinematic': 'Cinematic movie scene, IMAX quality, dramatic lighting, color graded, anamorphic lens flares, depth of field, blockbuster movie aesthetic',
            'fantasy': 'Magical fantasy art, ethereal atmosphere, glowing particles, dreamy lighting, soft focus, intricate details, masterpiece, trending on ArtStation',
            'studio': 'Professional studio photography, solid background, 3-point lighting, rim light, high contrast, commercial quality, sharp details'
        };

        // 🌟 2. GENERATION MODES (The "Double Barrel" Strategy)
        this.modes = {
            // OPTION B (Default): The "Hollywood" Look - High Sales Conversion
            'HOLLYWOOD_GLAM': `
                Flawless skin texture, soft flattering lighting, beauty dish illumination, 
                perfect complexion, cinematic color grading, magazine cover aesthetic, 
                slight airbrush effect, glowing skin, vibrant eyes, perfect hair styling, 
                heroic pose, confident expression, Vogue editorial style.
                Negative prompt: wrinkles, blemishes, scars, acne, dull skin, harsh shadows.
            `,

            // OPTION A (Upsell): The "Raw Masterpiece" - Artistic Detail
            'RAW_MASTERPIECE': `
                Hyper-realistic skin texture with visible pores, micro-details, 
                authentic imperfections, raw unedited photography style, 
                National Geographic aesthetic, sharp harsh details, 
                complex lighting, rugged texture, extreme definition, 
                documentary style realism, 100% authentic look.
                Negative prompt: plastic skin, blur, airbrushed, cartoonish, makeup.
            `
        };

        // 💡 3. LIGHTING PRESETS (The "Mood")
        this.lighting = {
            'dawn': 'Soft morning golden hour light, warm hues, long shadows, volumetric sun rays breaking through, atmospheric haze, serene morning mood',
            'noon': 'Bright natural daylight, high contrast, vivid colors, clear blue sky, sharp shadows, energetic atmosphere',
            'sunset': 'Dramatic sunset lighting, purple and orange sky, silhouette effects, warm rim lighting, romantic atmosphere',
            'night': 'City night lights, bokeh background, neon reflections, moody atmosphere, low key lighting, high ISO grain',
            'studio_dark': 'Dramatic chiaroscuro lighting, deep shadows, rembrandt lighting, moody and elegant',
            'studio_light': 'High key lighting, softbox illumination, bright and airy, clean look'
        };

        // 📸 4. CAMERA ANGLES (The "Perspective")
        this.cameras = {
            'portrait': '85mm portrait lens, f/1.8 aperture, bokeh background, focus on eyes',
            'wide': '24mm wide angle lens, capturing full scene, f/8 aperture, deep depth of field',
            'macro': '100mm macro lens, extreme close-up, visible pores and fur texture, f/2.8',
            'drone': 'Aerial drone shot, top-down view, wide landscape perspective'
        };
    }

    /**
     * 🚀 MAIN FUNCTION: GENERATE THE MEGA PROMPT
     * @param {Object} input - The simple user inputs
     */
    generate(input) {
        const {
            subjects = [],
            scenario = 'paris cafe',
            timeOfDay = 'dawn',
            vibe = 'photorealistic',
            groupDynamics = 'friends',
            mode = 'HOLLYWOOD_GLAM' // Default to the "Seller"
        } = input;

        // 1. CONSTRUCT SUBJECTS (The "Cast")
        const subjectText = this._buildSubjects(subjects, groupDynamics, mode);

        // 2. ENHANCE SCENARIO (The "Set")
        const scenarioText = this._enhanceScenario(scenario, timeOfDay);

        // 3. APPLY TECHNICAL SPECS (The "Gear")
        const technicalText = this.styles[vibe] || this.styles['photorealistic'];
        const lightingText = this.lighting[timeOfDay] || this.lighting['dawn'];
        const modeText = this.modes[mode] || this.modes['HOLLYWOOD_GLAM'];

        // 4. ASSEMBLE THE MASTERPIECE
        const megaPrompt = `
            ${technicalText}. 
            ${subjectText}. 
            ${scenarioText}. 
            ${lightingText}. 
            ${modeText}
            Ultra-detailed, 8K resolution, unreal engine 5 render style, 
            perfect composition, rule of thirds, color graded, 
            no artifacts, perfect eyes, perfect hands, 
            masterpiece, award winning photography.
        `.replace(/\s+/g, ' ').trim();

        return megaPrompt;
    }

    // 🧩 HELPER: Build the subjects string
    _buildSubjects(subjects, dynamic, mode) {
        if (!subjects.length) return "A beautiful scene";

        let description = "";
        const count = subjects.length;
        const people = subjects.filter(s => s.type === 'human');
        const pets = subjects.filter(s => s.type === 'pet');

        // Adjust description based on mode
        const humanDetail = mode === 'HOLLYWOOD_GLAM'
            ? "perfect skin and radiant appearance"
            : "highly detailed skin texture and authentic features";

        if (count === 1) {
            description = `A stunning portrait of a ${subjects[0].description}`;
        } else {
            description = `A group of ${people.length} people and ${pets.length} pets, representing a ${dynamic}, interacting naturally. `;

            const details = subjects.map(s => {
                return s.type === 'human'
                    ? `a ${s.description} with ${humanDetail}`
                    : `a hyper-realistic ${s.description} with detailed fur texture`;
            }).join(', and ');

            description += `Featuring ${details}.`;
        }

        return description + " They are positioned naturally in the scene, showing genuine emotion and connection.";
    }

    // 🧩 HELPER: Enhance the scenario
    _enhanceScenario(scenario, time) {
        return `
            Located in ${scenario}. 
            The background is filled with intricate details relevant to the location. 
            The architecture and environment are perfectly rendered. 
            Atmospheric depth adds realism to the scene.
        `;
    }
}

module.exports = new MegaPromptSystem();
