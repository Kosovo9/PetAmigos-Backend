const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateMemories, getPetMemories } = require('../services/MemoryGenerator');
const Memory = require('../models/Memory');

// Obtener recuerdos de una mascota
router.get('/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const memories = await getPetMemories(petId);
    res.status(200).json({ success: true, memories });
  } catch (error) {
    console.error('Error obteniendo recuerdos:', error);
    res.status(500).json({ error: 'Error al obtener recuerdos' });
  }
});

// Generar recuerdos automáticamente (trigger manual o cron)
router.post('/generate/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const memories = await generateMemories(petId);
    res.status(200).json({ success: true, memories, count: memories.length });
  } catch (error) {
    console.error('Error generando recuerdos:', error);
    res.status(500).json({ error: 'Error al generar recuerdos' });
  }
});

// Compartir recuerdo
router.post('/share/:memoryId', auth, async (req, res) => {
  try {
    const { memoryId } = req.params;
    const memory = await Memory.findById(memoryId);
    
    if (!memory) {
      return res.status(404).json({ error: 'Recuerdo no encontrado' });
    }
    
    // Generar URL de compartir si no existe
    if (!memory.shareUrl) {
      memory.shareUrl = `https://petamigos.com/memory/${memoryId}`;
      await memory.save();
    }
    
    res.status(200).json({ success: true, shareUrl: memory.shareUrl });
  } catch (error) {
    console.error('Error compartiendo recuerdo:', error);
    res.status(500).json({ error: 'Error al compartir recuerdo' });
  }
});

module.exports = router;



