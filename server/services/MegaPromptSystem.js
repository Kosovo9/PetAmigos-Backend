// MEGA PROMPT SYSTEM - NIVEL DIOS
// Sistema quirúrgico de prompts para máxima calidad

const PROMPT_TEMPLATES = {
    // CHRISTMAS EDITION
    christmas: {
        base: "Professional pet photography, Christmas theme, ultra-realistic 8K resolution, studio lighting setup, National Geographic quality, cinematic composition, volumetric lighting, hyper-detailed fur texture with individual hair strands visible, bokeh background with Christmas lights, festive decorations, warm color grading, shot on Sony A7R IV with 85mm f/1.4 lens, shallow depth of field",

        scenarios: {
            santa: "Pet wearing authentic Santa Claus hat, sitting regally by professionally decorated Christmas tree with twinkling lights, cozy fireplace with real flames in soft-focus background, warm golden hour lighting streaming through window, luxurious home interior, magazine-quality composition",

            sweater: "Pet modeling premium Christmas sweater with intricate knit patterns, gentle snow falling in background creating magical atmosphere, winter wonderland scene with frosted trees, professional fashion photography style, dramatic rim lighting, bokeh lights creating dreamy effect",

            presents: "Pet surrounded by elegantly wrapped Christmas presents with silk ribbons, professional studio setup with seamless white background, commercial product photography lighting, ultra-sharp focus on pet's expressive eyes, soft shadows, catalog-quality image",

            family: "Pet with family members in matching Christmas pajamas, cozy living room with decorated tree, candid moment captured with professional timing, warm ambient lighting, lifestyle photography style, emotional connection visible, Life magazine quality"
        },

        styles: {
            professional: ", professional studio portrait, commercial photography quality, perfect exposure, color-corrected, retouched",
            artistic: ", artistic interpretation, painterly quality, fine art photography, museum-worthy composition",
            candid: ", candid lifestyle shot, authentic moment, photojournalism style, natural expressions captured",
            glamour: ", glamour photography, high-fashion editorial style, dramatic lighting, Vogue-quality composition"
        }
    },

    // PROFESSIONAL YEAR-ROUND
    professional: {
        portrait: {
            base: "Professional pet portrait photography, ultra-sharp focus on eyes, hyper-realistic fur detail showing individual hairs, 8K resolution, shallow depth of field (f/1.4), clean neutral background, commercial photography quality, perfect studio lighting with softbox and rim light, color-graded, professionally retouched",

            moods: {
                regal: ", dignified pose, noble expression, royal portrait style, museum-quality",
                playful: ", joyful expression, dynamic energy, captured mid-action, Sports Illustrated quality",
                serene: ", calm demeanor, peaceful atmosphere, zen-like composition, fine art quality",
                heroic: ", powerful stance, dramatic lighting, epic composition, movie poster style"
            }
        },

        action: {
            base: "Dynamic pet action photography, frozen motion at 1/8000s shutter speed, professional sports photography style, dramatic lighting, ultra-detailed, National Geographic wildlife quality, 8K resolution, perfect timing, award-winning composition",

            activities: {
                running: ", mid-stride with all paws off ground, motion blur in background, speed lines effect",
                jumping: ", suspended in mid-air, perfect form, dynamic composition, gravity-defying",
                playing: ", catching toy/ball, intense focus, athletic prowess visible, decisive moment",
                swimming: ", water droplets frozen in air, splash dynamics, underwater visibility"
            }
        },

        lifestyle: {
            base: "Lifestyle pet photography, authentic candid moment, natural lighting, photojournalism style, emotional storytelling, Life magazine quality, genuine expressions, perfect timing",

            settings: {
                home: ", cozy home environment, comfortable furniture, warm ambient light, family atmosphere",
                outdoor: ", natural outdoor setting, golden hour lighting, scenic background, adventure theme",
                urban: ", city environment, modern architecture, street photography style, contemporary feel",
                beach: ", beach setting, sunset lighting, ocean background, vacation vibes, carefree mood"
            }
        }
    },

    // SPECIAL OCCASIONS
    occasions: {
        birthday: "Pet celebrating birthday, festive party hat, birthday cake with candles, colorful balloons, joyful celebration atmosphere, professional event photography, warm lighting, candid happiness",

        valentine: "Pet with Valentine's Day theme, romantic setting, soft pink and red tones, heart decorations, love-themed props, romantic portrait photography, dreamy bokeh",

        halloween: "Pet in creative Halloween costume, spooky but cute atmosphere, autumn colors, professional costume photography, dramatic lighting with shadows, festive decorations",

        graduation: "Pet in miniature graduation cap and gown, diploma prop, proud achievement theme, formal portrait style, academic setting, professional school photography",

        wedding: "Pet as part of wedding celebration, elegant attire, romantic setting, wedding photography style, soft romantic lighting, special moment captured"
    },

    // TECHNICAL MODIFIERS (Always append)
    technical: {
        quality: ", shot on professional camera (Sony A7R IV / Canon R5), prime lens (85mm f/1.4 / 50mm f/1.2), RAW format, professionally color-graded, expertly retouched, print-ready quality",

        lighting: ", professional 3-point lighting setup, key light with softbox, fill light for shadow detail, rim light for separation, perfectly exposed, no clipping in highlights or shadows",

        detail: ", hyper-realistic detail, individual fur strands visible, whisker detail, eye catchlights, texture detail in nose leather, paw pad detail, ultra-sharp focus where needed",

        postProcessing: ", professionally edited, color-corrected, contrast optimized, sharpened appropriately, noise reduced, vignette added subtly, final polish applied"
    }
};

// NEGATIVE PROMPTS (What to avoid)
const NEGATIVE_PROMPTS = {
    common: "blurry, out of focus, low quality, low resolution, pixelated, jpeg artifacts, watermark, text, signature, amateur, phone camera, poor lighting, overexposed, underexposed, noisy, grainy, distorted, deformed, ugly, bad anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, disfigured, cartoon, anime, illustration, painting, drawing, art, sketch",

    pet_specific: "extra tails, extra ears, extra legs, missing tail, missing ears, deformed face, asymmetrical eyes, wrong number of paws, unnatural proportions, human hands, human feet"
};

// PROMPT BUILDER FUNCTION
function buildMegaPrompt(options) {
    const {
        category = 'christmas',      // christmas, professional, occasions
        scenario = 'santa',           // specific scenario
        style = 'professional',       // artistic style
        mood = 'regal',              // emotional tone
        petType = 'dog',             // dog, cat, etc.
        petBreed = '',               // specific breed
        customDetails = ''           // user additions
    } = options;

    let prompt = '';
    let negativePrompt = NEGATIVE_PROMPTS.common + ', ' + NEGATIVE_PROMPTS.pet_specific;

    // Build base prompt
    if (category === 'christmas') {
        prompt = PROMPT_TEMPLATES.christmas.base;
        if (PROMPT_TEMPLATES.christmas.scenarios[scenario]) {
            prompt += ', ' + PROMPT_TEMPLATES.christmas.scenarios[scenario];
        }
        if (PROMPT_TEMPLATES.christmas.styles[style]) {
            prompt += PROMPT_TEMPLATES.christmas.styles[style];
        }
    } else if (category === 'professional') {
        const subCategory = scenario; // portrait, action, lifestyle
        if (PROMPT_TEMPLATES.professional[subCategory]) {
            prompt = PROMPT_TEMPLATES.professional[subCategory].base;
            if (mood && PROMPT_TEMPLATES.professional[subCategory].moods) {
                prompt += PROMPT_TEMPLATES.professional[subCategory].moods[mood];
            }
        }
    } else if (category === 'occasions') {
        prompt = PROMPT_TEMPLATES.occasions[scenario] || PROMPT_TEMPLATES.occasions.birthday;
    }

    // Add pet-specific details
    if (petType && petBreed) {
        prompt = `${petBreed} ${petType}, ` + prompt;
    } else if (petType) {
        prompt = `${petType}, ` + prompt;
    }

    // Add custom user details
    if (customDetails) {
        prompt += ', ' + customDetails;
    }

    // Add technical modifiers
    prompt += PROMPT_TEMPLATES.technical.quality;
    prompt += PROMPT_TEMPLATES.technical.lighting;
    prompt += PROMPT_TEMPLATES.technical.detail;
    prompt += PROMPT_TEMPLATES.technical.postProcessing;

    return {
        prompt,
        negativePrompt,
        settings: {
            steps: 50,                    // High quality = more steps
            cfg_scale: 7.5,              // Creativity vs accuracy balance
            width: 1024,                 // Base resolution
            height: 1024,
            sampler: 'DPM++ 2M Karras',  // Best quality sampler
            seed: -1                     // Random
        }
    };
}

// EXPORT
module.exports = {
    PROMPT_TEMPLATES,
    NEGATIVE_PROMPTS,
    buildMegaPrompt
};
