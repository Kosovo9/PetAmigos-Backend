require('dotenv').config();
const mongoose = require('mongoose');
const { connectWithRetry } = require('../server/config/database');
const MegaPromptLibrary = require('../server/models/MegaPromptLibrary');

const generatePrompts = () => {
    const prompts = [];
    const genders = ['Man', 'Woman'];

    const pets = [
        'Golden Retriever', 'French Bulldog', 'Maine Coon Cat', 'Border Collie',
        'Siamese Cat', 'Labrador', 'Husky', 'Corgi', 'Bengal Cat', 'Rescue Mutt',
        'Pair of Dalmatians', 'Trio of Kittens', 'German Shepherd & Pug duo'
    ];

    // --- LINKEDIN (50 Prompts - Pet Friendly / Industry) ---
    const linkedinRoles = [
        'Pet Tech CEO', 'Veterinary Director', 'Creative Freelancer', 'Startup Founder',
        'Animal Behaviorist', 'Remote Software Engineer', 'Pet Brand Marketer', 'Non-Profit Director',
        'Modern Architect', 'Lifestyle Blogger'
    ];

    const linkedinLocations = [
        'modern pet-friendly glass office', 'bright home office with garden view',
        'high-end veterinary clinic lobby', 'creative studio with bean bags',
        'outdoor co-working space', 'minimalist desk setup', 'sunny boardroom',
        'urban rooftop workspace', 'boutique pet store interior', 'university campus bench'
    ];

    const linkedinLighting = [
        'professional studio lighting', 'soft natural window light', 'cinematic rim lighting',
        'clean corporate lighting', 'bright airy daylight'
    ];

    // Generate 50 LinkedIn with Pets
    for (let i = 0; i < 50; i++) {
        const gender = genders[i % 2];
        const role = linkedinRoles[i % linkedinRoles.length];
        const pet = pets[i % pets.length];
        const loc = linkedinLocations[i % linkedinLocations.length];
        const light = linkedinLighting[i % linkedinLighting.length];

        const title = `${role} & ${pet} - Professional`;
        const desc = `Professional LinkedIn headshot for a ${role} posing confidently with their ${pet}.`;

        const hollywoodPrompt = `Hyper-realistic professional portrait of a ${gender} ${role} posing with a ${pet}, ${loc}, confident expression, human smiling at camera, pet looking attentive, perfect grooming, ${light}, 8k resolution, highly detailed skin texture and fur, sharp focus on eyes of both, shot on Hasselblad X2D, 100MP, 85mm f/1.2 lens, cinematic color grading, depth of field, corporate masterpiece, authentic connection.`;

        const rawPrompt = `Raw photo, professional headshot, ${gender} ${role} holding or sitting next to ${pet}, ${loc}, natural office lighting, authentic look, slight imperfections, 4k, shot on Sony A7IV, neutral color profile, no filter, sharp details.`;

        prompts.push({
            slug: `linkedin-pet-${i}-${Date.now()}`,
            title: `LinkedIn: ${title}`,
            description: desc,
            promptData: {
                hollywood: hollywoodPrompt,
                raw: rawPrompt,
                technical: 'Hasselblad X2D, 85mm f/1.2, ISO 100'
            },
            category: 'linkedin',
            tags: ['professional', 'headshot', 'business', 'pet', 'dog', 'cat', 'office'],
            bestFor: {
                subjects: 2,
                species: ['human', 'pet']
            }
        });
    }

    // --- FACEBOOK / SOCIAL (50 Prompts - Lifestyle with Pets) ---
    const socialVibes = [
        'Morning Cuggles', 'Beach Day Fun', 'Mountain Hiking', 'City Walk',
        'Cozy Reading Nook', 'Park Frisbee', 'Cafe Date', 'Road Trip Adventure',
        'Festival Vibes', 'Sunday Nap'
    ];

    const socialLocations = [
        'sun-drenched bedroom', 'golden hour sandy beach', 'misty mountain trail',
        'bustling NYC street', 'window seat with rain outside', 'green city park',
        'pet-friendly cafe patio', 'vintage van interior', 'sunset music festival',
        'plush living room sofa'
    ];

    // Generate 50 Social with Pets
    for (let i = 0; i < 50; i++) {
        const gender = genders[i % 2];
        const vibe = socialVibes[i % socialVibes.length];
        const pet = pets[i % pets.length]; // Cycles through single and plural pets
        const loc = socialLocations[i % socialLocations.length];

        const title = `${vibe} with ${pet}`;
        const desc = `Lifestyle social media photo: ${vibe} featuring ${pet}.`;

        const hollywoodPrompt = `Cinematic lifestyle shot of a ${gender} and their ${pet}, ${vibe} theme, located at ${loc}, candid laughter, genuine love, dynamic interaction, wind in hair/fur, golden hour lighting, 8k, hyper-realistic, shot on Canon EOS R5, 50mm f/1.2, bokeh, color graded like a movie, instagram aesthetic, viral quality, emotional bond.`;

        const rawPrompt = `iPhone 15 Pro Max photo, ${gender} with ${pet}, ${loc}, candid moment, natural lighting, #nofilter, authentic lifestyle, snapshot aesthetic, sharp details, happy vibes.`;

        prompts.push({
            slug: `social-pet-${i}-${Date.now()}`,
            title: `Social: ${title}`,
            description: desc,
            promptData: {
                hollywood: hollywoodPrompt,
                raw: rawPrompt,
                technical: 'Canon EOS R5, 50mm f/1.2, Golden Hour'
            },
            category: 'social',
            tags: ['lifestyle', 'facebook', 'instagram', 'pet', 'family', 'love', 'viral'],
            bestFor: {
                subjects: 2,
                species: ['human', 'pet']
            }
        });
    }

    return prompts;
};

const seed = async () => {
    try {
        console.log('🚀 Iniciando inyección de 100 Prompts Premium (LinkedIn & Social con Mascotas)...');
        const connected = await connectWithRetry();
        if (!connected) process.exit(1);

        const prompts = generatePrompts();

        await MegaPromptLibrary.insertMany(prompts);

        console.log(`✅ ÉXITO: ${prompts.length} Prompts (Human + Pet) inyectados correctamente.`);
        console.log('   - 50 LinkedIn Professional (Pet Friendly)');
        console.log('   - 50 Facebook/Social Lifestyle (Pet Adventures)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding prompts:', error);
        process.exit(1);
    }
};

seed();
