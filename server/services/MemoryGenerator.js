const PetProfile = require('../models/PetProfile');
const Memory = require('../models/Memory');

// ============================================
// MEMORY GENERATOR SERVICE
// Generación automática de Cápsulas del Tiempo IA
// ============================================

/**
 * Generar recuerdos automáticamente basados en hitos
 */
exports.generateMemories = async (petId) => {
  try {
    const pet = await PetProfile.findById(petId);
    if (!pet) return [];

    const memories = [];
    const now = new Date();
    const creationDate = pet.createdAt || pet.dateOfBirth;
    const daysSinceCreation = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));

    // Hito 1: Primer mes (30 días)
    if (daysSinceCreation >= 30 && daysSinceCreation < 60) {
      const memory = await createMemory(pet, {
        title: `Hace 1 Mes: ¡Bienvenido a PetAmigos!`,
        description: `Tu primera semana juntos fue increíble. ${pet.name} ya es parte de la familia.`,
        milestone: 'FIRST_MONTH',
        date: new Date(creationDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      });
      if (memory) memories.push(memory);
    }

    // Hito 2: Primer cumpleaños
    if (pet.dateOfBirth) {
      const nextBirthday = new Date(pet.dateOfBirth);
      nextBirthday.setFullYear(now.getFullYear());
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }
      const daysUntilBirthday = Math.floor((nextBirthday - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilBirthday === 0) {
        const age = Math.floor((now - pet.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
        const memory = await createMemory(pet, {
          title: `¡Feliz Cumpleaños! ${pet.name} cumple ${age} ${age === 1 ? 'año' : 'años'}`,
          description: `Celebremos este día especial con ${pet.name}. ¡Que cumpla muchos más!`,
          milestone: 'BIRTHDAY',
          date: now
        });
        if (memory) memories.push(memory);
      }
    }

    // Hito 3: Primer aniversario (365 días)
    if (daysSinceCreation >= 365 && daysSinceCreation < 395) {
      const memory = await createMemory(pet, {
        title: `¡1 Año Juntos! 🎉`,
        description: `Hace exactamente un año, ${pet.name} se unió a tu familia. ¡Qué increíble viaje!`,
        milestone: 'FIRST_ANNIVERSARY',
        date: new Date(creationDate.getTime() + 365 * 24 * 60 * 60 * 1000)
      });
      if (memory) memories.push(memory);
    }

    // Hito 4: Hitos de salud (basados en biologicalAge)
    if (pet.biologicalAge && pet.lastCheckup) {
      const daysSinceCheckup = Math.floor((now - pet.lastCheckup) / (1000 * 60 * 60 * 24));
      if (daysSinceCheckup >= 60) {
        const memory = await createMemory(pet, {
          title: `Recordatorio: Es hora de un chequeo`,
          description: `${pet.name} necesita un chequeo de salud. Cuida su bienestar.`,
          milestone: 'HEALTH_REMINDER',
          date: now
        });
        if (memory) memories.push(memory);
      }
    }

    return memories;
  } catch (error) {
    console.error('Error generando recuerdos:', error);
    return [];
  }
};

/**
 * Crear un recuerdo en la base de datos
 */
async function createMemory(pet, data) {
  try {
    // Verificar si el recuerdo ya existe
    const existing = await Memory.findOne({
      petId: pet._id,
      milestone: data.milestone
    });

    if (existing) return null;

    // Crear recuerdo
    const memory = await Memory.create({
      petId: pet._id,
      ownerId: pet.owner,
      title: data.title,
      description: data.description,
      milestone: data.milestone,
      date: data.date,
      thumbnail: generateThumbnail(pet, data.milestone),
      videoUrl: null, // Se genera en background job
      isPremiumUnlocked: false,
      status: 'GENERATING'
    });

    // Trigger background job para generar video (simulado)
    // En producción, usar queue system (Bull, BullMQ, etc.)
    generateVideoInBackground(memory._id);

    return memory;
  } catch (error) {
    console.error('Error creando recuerdo:', error);
    return null;
  }
}

/**
 * Generar URL de thumbnail (simulado)
 */
function generateThumbnail(pet, milestone) {
  // En producción, usar servicio de generación de imágenes IA
  // o seleccionar foto existente del perfil
  return pet.photo || `https://via.placeholder.com/400?text=${milestone}`;
}

/**
 * Generar video en background (simulado)
 */
async function generateVideoInBackground(memoryId) {
  // En producción, esto sería un job queue
  // Por ahora, solo marcamos como generado después de un delay
  setTimeout(async () => {
    try {
      await Memory.findByIdAndUpdate(memoryId, {
        status: 'READY',
        videoUrl: `https://storage.petamigos.com/memories/${memoryId}.mp4`
      });
    } catch (error) {
      console.error('Error actualizando video:', error);
    }
  }, 5000); // Simular 5 segundos de generación
}

/**
 * Obtener recuerdos de una mascota
 */
exports.getPetMemories = async (petId) => {
  try {
    const memories = await Memory.find({ petId })
      .sort({ date: -1 })
      .lean();

    return memories;
  } catch (error) {
    console.error('Error obteniendo recuerdos:', error);
    return [];
  }
};


