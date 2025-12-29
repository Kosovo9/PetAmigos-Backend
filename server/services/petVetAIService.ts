import { openai } from '../openai';
import { getDb } from '../db';
import { vetConsultations, pets } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { createNotification } from './notificationService';

const VET_KNOWLEDGE_BASE = `
Eres un veterinario experto. Evalúa síntomas y proporciona:
1. Diagnóstico probable (0-100% confianza)
2. Gravedad: low/medium/high/emergency
3. Primeros auxilios inmediatos
4. ¿Necesita veterinario urgente?
5. Cuidados en casa
6. Medicación sugerida (mg/kg)
`;

export async function consultVet(userId: number, petId: number, symptoms: string) {
    const d = await getDb();
    if (!d) throw new Error('DB not available');

    const [pet] = await d.select().from(pets).where(eq(pets.id, petId));
    if (!pet) throw new Error('Mascota no encontrada');

    let aiResponse = "";
    if (process.env.OPENAI_API_KEY) {
        const prompt = `${VET_KNOWLEDGE_BASE}
      Mascota: ${pet.breed}, ${pet.age || 'Unknown'} años
      Síntomas: ${symptoms}
      Historial: ${pet.bio || 'Ninguno'}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: prompt }],
            max_tokens: 800,
            temperature: 0.3,
        });
        aiResponse = response.choices[0].message.content!;
    } else {
        aiResponse = `[MOCK AI] Based on symptoms "${symptoms}", your pet ${pet.name} might need checkup. Severity: medium.`;
    }

    // Extract severity
    const severityMatch = aiResponse.match(/Gravedad: (\w+)/i);
    const severity = severityMatch?.[1]?.toLowerCase() || 'medium';

    await d.insert(vetConsultations).values({
        userId,
        petId,
        symptoms,
        aiResponse,
        severity,
    });

    if (severity === 'emergency') {
        await sendEmergencyAlert(userId, pet.name!, symptoms);
    }

    return { userId, petId, symptoms, aiResponse, severity };
}

async function sendEmergencyAlert(userId: number, petName: string, symptoms: string) {
    await createNotification(userId, 'emergency',
        `🚨 EMERGENCIA VETERINARIA para ${petName}: ${symptoms}. Busca atención inmediata.`);
}
