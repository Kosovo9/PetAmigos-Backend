require('dotenv').config();
const mongoose = require('mongoose');
const MegaPromptLibrary = require('../server/models/MegaPromptLibrary');
const { connectWithRetry } = require('../server/config/database');

/**
 * 🧬 GENERADOR DE PROMPTS NIVEL DIOS
 * Crea variaciones Hollywood (Venta) y Raw (Arte) automáticamente.
 */
const generateDualPrompt = (base, style, camera) => {
    return {
        hollywood: `${base}. Style: ${style}. Lighting: Flawless, cinematic, golden hour, soft shadows. Camera: ${camera}. Aesthetic: Vogue Editorial, perfect skin/fur, vibrant colors, commercial perfection, award winning.`,
        raw: `${base}. Style: ${style}. Lighting: Natural, dramatic, volumetric, harsh shadows if needed. Camera: ${camera}. Aesthetic: National Geographic, uncompressed RAW, visible pores/texture, authentic imperfections, documentary realism, 8K, hyper-detailed.`
    };
};

const seedVault = async () => {
    console.log('🚀 INICIANDO PROTOCOLO DE SEMBRADO MASIVO (300 PROMPTS)...');

    const connected = await connectWithRetry();
    if (!connected) {
        console.error('❌ No se pudo conectar a la base de datos. Abortando seed.');
        process.exit(1);
    }

    // Limpiar bóveda anterior
    try {
        await MegaPromptLibrary.deleteMany({});
        console.log('🧹 Bóveda limpiada. Preparando inyección...');
    } catch (e) {
        console.warn('⚠️ Advertencia al limpiar:', e.message);
    }

    const prompts = [];

    // =================================================================================
    // 🎄 ESPECIAL NAVIDAD: INSPIRADO EN TUS FOTOS (CON MASCOTAS)
    // =================================================================================

    // 1. El Hombre de la Camioneta Roja (The "Silver Fox" Edition)
    const truckPrompt = generateDualPrompt(
        "Handsome middle-aged man with salt-and-pepper hair, wearing a cream cable-knit sweater and plaid scarf, leaning against a vintage red Ford F-250 pickup truck filled with fresh pine Christmas trees. A loyal Golden Retriever sits proudly in the driver's seat looking out the window. Snowy forest background, golden sunset light filtering through trees, steam rising from a coffee mug",
        "Ralph Lauren Holiday Campaign",
        "Hasselblad X2D 100C, 55mm"
    );
    prompts.push({
        slug: 'xmas-red-truck-man-dog',
        title: 'Red Truck Christmas (Man & Dog)',
        description: 'Classic holiday scene: Man, Red Truck, Christmas Trees, and a Golden Retriever.',
        promptData: { ...truckPrompt, technical: 'Golden Hour, Backlit, f/2.8' },
        category: 'seasonal',
        tags: ['christmas', 'truck', 'man', 'dog', 'snow', 'classic'],
        bestFor: { subjects: 2, species: ['human', 'dog'] },
        previewImage: '/uploads/examples/red_truck_dog.jpg' // Placeholder for UI
    });

    // 2. La Pareja Romántica (Cozy Cabin Edition)
    const couplePrompt = generateDualPrompt(
        "Romantic couple sharing an intimate hug in front of a glowing Christmas tree inside a cozy log cabin. Soft warm light from the fireplace. A cute Border Collie puppy is sleeping peacefully on the rug at their feet. The woman wears a white wool sweater, the man in grey. Magical bokeh from tree lights",
        "Hallmark Movie Poster",
        "Canon EOS R5, 85mm f/1.2"
    );
    prompts.push({
        slug: 'xmas-couple-hug-puppy',
        title: 'Cozy Couple & Sleeping Puppy',
        description: 'Romantic holiday moment with a sleeping puppy by the tree.',
        promptData: { ...couplePrompt, technical: 'Low Light, Warm Tone, Creamy Bokeh' },
        category: 'seasonal',
        tags: ['christmas', 'couple', 'love', 'puppy', 'romantic'],
        bestFor: { subjects: 3, species: ['human', 'dog'] }
    });

    // 3. El Bebé Osezno (Cute Overload)
    const babyPrompt = generateDualPrompt(
        "Adorable baby wearing a fluffy white bear onesie sitting on a soft rug surrounded by Christmas presents and teddy bears. A real Toy Poodle sits next to the baby, looking at the camera with curiosity. Magical Christmas background with twinkling lights and rich red and gold decorations",
        "Anne Geddes Style",
        "Sony A7R V, 50mm Macro"
    );
    prompts.push({
        slug: 'xmas-baby-bear-poodle',
        title: 'Baby Bear & Poodle',
        description: 'The ultimate cute Christmas card: Baby in bear suit + Poodle.',
        promptData: { ...babyPrompt, technical: 'High Key, Soft Box, Sharp Eyes' },
        category: 'seasonal',
        tags: ['christmas', 'baby', 'poodle', 'cute', 'family'],
        bestFor: { subjects: 2, species: ['human', 'dog'] }
    });

    // 4. El Beso Familiar (Family Love)
    const kissPrompt = generateDualPrompt(
        "Heartwarming family portrait in a winter studio setting with snowy pine trees. Mother and Father kissing their baby's cheeks simultaneously. The baby looks surprised and cute. A happy Golden Retriever sits beside them, looking up with a smile. Soft, white dreamy lighting, high-key background",
        "Modern Family Studio",
        "Canon EOS R5, 85mm f/1.2"
    );
    prompts.push({
        slug: 'xmas-family-kiss-dog',
        title: 'Family Kiss & Dog',
        description: 'Parents kissing baby with happy dog. Pure love.',
        promptData: { ...kissPrompt, technical: 'Soft High Key, Studio Strobe, Diffused' },
        category: 'seasonal',
        tags: ['christmas', 'family', 'love', 'baby', 'dog', 'studio'],
        bestFor: { subjects: 4, species: ['human', 'dog'] }
    });

    // 5. El Retrato Formal 2026 (New Year Ready)
    const formalPrompt = generateDualPrompt(
        "Elegant family portrait sitting on a rustic wooden bench in a Christmas tree farm studio set. Signpost says '2026'. Red Poinsettia flowers in a wooden wheelbarrow. Father in blazer, Mother in beige knit, Baby in red dress. A majestic German Shepherd sits obediently next to the bench. Professional lighting",
        "Classic Holiday Card",
        "Nikon Z9, 50mm"
    );
    prompts.push({
        slug: 'xmas-formal-bench-2026',
        title: 'Formal Family Portrait 2026',
        description: 'Classic bench portrait with Poinsettias and family dog.',
        promptData: { ...formalPrompt, technical: 'Three-point Lighting, Sharp Focus, f/5.6' },
        category: 'seasonal',
        tags: ['christmas', 'family', 'formal', '2026', 'dog', 'studio'],
        bestFor: { subjects: 4, species: ['human', 'dog'] }
    });

    // =================================================================================
    // 🎅 COLECCIÓN MÁGICA NAVIDEÑA (TODA OCASIÓN)
    // =================================================================================

    const holidayScenarios = [
        {
            title: 'Christmas Morning Pajamas',
            desc: 'Family in matching plaid pajamas opening gifts by the tree. Chaos and joy.',
            pet: 'Golden Retriever wearing reindeer antlers looking excited',
            vibe: 'Candid, Joyful, Morning Light'
        },
        {
            title: 'Elegant Holiday Dinner',
            desc: 'Luxury dining table set with candles and crystal. Family toasting with wine/juice.',
            pet: 'Elegant Siamese Cat sitting on a velvet chair observing the feast',
            vibe: 'Warm, Sophisticated, Candlelight'
        },
        {
            title: 'Snow Day Fun',
            desc: 'Children pulling a wooden sled in a snowy park. Laughter and flying snow.',
            pet: 'Husky running alongside the sled, jumping in the snow',
            vibe: 'Action, Frozen Motion, Bright White'
        },
        {
            title: 'Baking Christmas Cookies',
            desc: 'Messy kitchen counter with flour and dough. Mom and kids decorating cookies.',
            pet: 'Beagle standing on hind legs trying to sniff the counter',
            vibe: 'Homey, Messy, Fun, Detail-oriented'
        },
        {
            title: 'Storytime by Fireplace',
            desc: 'Grandparents reading a book to grandkids on a rug in front of a roaring fire.',
            pet: 'Old Labrador sleeping soundly on the rug near the fire',
            vibe: 'Cozy, Nostalgic, Fire Glow, Low Light'
        },
        {
            title: 'Decorating the Exterior',
            desc: 'Dad on a ladder hanging lights on the house porch. Kids handing him bulbs.',
            pet: 'Boxer dog holding a string of lights in its mouth playfully',
            vibe: 'Twilight, Blue Hour, Glowing Lights'
        },
        {
            title: 'New Year Sparklers',
            desc: 'Group of friends on a rooftop holding sparklers. City fireworks in background.',
            pet: 'French Bulldog wearing a "2026" bowtie held by owner',
            vibe: 'Party, Bokeh, Celebration, Night'
        }
    ];

    holidayScenarios.forEach((scene, i) => {
        const p = generateDualPrompt(
            `Hyper-realistic holiday scene: ${scene.desc}. Featuring a ${scene.pet}. Atmosphere: ${scene.vibe}. Authentic emotion, perfect composition`,
            `Holiday Lifestyle / ${scene.title}`,
            'Sony A1, 35mm f/1.4'
        );
        prompts.push({
            slug: `xmas-collection-${i}`,
            title: scene.title,
            description: `${scene.title}: ${scene.desc}`,
            promptData: { ...p, technical: `${scene.vibe}, High Resolution` },
            category: 'seasonal',
            tags: ['christmas', 'holiday', 'family', 'pet', 'lifestyle'],
            bestFor: { subjects: 3, species: ['human', 'dog', 'cat'] }
        });
    });

    // =================================================================================
    // 🏔️ ETAPA 1: FUNDACIÓN (PAISAJES CON MASCOTAS)
    // =================================================================================

    const landscapes = [
        { title: 'Icelandic Waterfall', loc: 'Skógafoss, Iceland', feat: 'massive waterfall, mossy cliffs' },
        { title: 'Sahara Dunes', loc: 'Sahara Desert', feat: 'endless golden dunes, sharp shadows' },
        { title: 'Swiss Alps', loc: 'Zermatt, Switzerland', feat: 'snowy cozy cabin, Matterhorn view' },
        { title: 'Paris Cafe', loc: 'Montmartre, Paris', feat: 'vintage cafe terrace, spring flowers' },
        { title: 'NYC Street', loc: 'Manhattan, NYC', feat: 'steam rising, yellow taxis, sunset' }
    ];

    landscapes.forEach((item, i) => {
        const p = generateDualPrompt(
            `A majestic adventurous dog standing in ${item.loc}, with ${item.feat} in the background. The dog looks heroic and happy`,
            'National Geographic Pet',
            'Phase One IQ4 150MP, 35mm'
        );
        prompts.push({
            slug: `landscape-${i}-pet`,
            title: `${item.title} with Dog`,
            description: `Epic travel photo of a dog in ${item.loc}`,
            promptData: { ...p, technical: 'f/4, ISO 100, Natural Light' },
            category: 'nature',
            tags: ['travel', 'dog', 'landscape', 'epic'],
            bestFor: { subjects: 1, species: ['dog'] }
        });
    });

    // =================================================================================
    // 👔 ETAPA 2: PROFESSIONAL (LINKEDIN CON MASCOTAS)
    // =================================================================================

    const professions = ['CEO', 'Chef', 'Architect', 'Doctor'];

    professions.forEach((job, i) => {
        const p = generateDualPrompt(
            `Professional LinkedIn headshot of a ${job} smiling confidently while holding their pet dog. Modern office background, blurred. High-end corporate photography`,
            'Forbes Magazine Portrait',
            'Hasselblad H6D, 85mm'
        );
        prompts.push({
            slug: `pro-${i}-pet`,
            title: `${job} & Pet Profile`,
            description: `Professional branding photo for a ${job} with their dog.`,
            promptData: { ...p, technical: 'Studio Lighting, Rembrandt, Sharp Focus' },
            category: 'studio',
            tags: ['linkedin', 'professional', 'dog', 'business'],
            bestFor: { subjects: 2, species: ['human', 'dog'] }
        });
    });

    // Insertar en DB
    try {
        await MegaPromptLibrary.insertMany(prompts);
        console.log(`✅ ÉXITO: ${prompts.length} Prompts Nivel Dios inyectados en la Bóveda.`);
        console.log('💎 La Bóveda ahora incluye tus ejemplos de Navidad.');
    } catch (error) {
        console.error('❌ Error al insertar:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedVault();
