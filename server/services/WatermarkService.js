const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// 🎨 WATERMARK SERVICE
// Aplica marca de agua a imágenes para usuarios free

class WatermarkService {

    constructor() {
        this.watermarkText = 'PetMatch.fun';
        this.watermarkOpacity = 0.3;
    }

    // 🖼️ APLICAR WATERMARK A IMAGEN
    async applyWatermark(imageBuffer, options = {}) {
        try {
            const {
                text = this.watermarkText,
                opacity = this.watermarkOpacity,
                position = 'center', // 'center', 'bottom-right', 'diagonal'
                fontSize = 48,
                color = 'rgba(255, 255, 255, 0.5)'
            } = options;

            console.log('🎨 Aplicando watermark...');

            // Obtener dimensiones de la imagen
            const image = sharp(imageBuffer);
            const metadata = await image.metadata();
            const { width, height } = metadata;

            // Crear SVG del watermark
            let svgWatermark;

            if (position === 'diagonal') {
                // Watermark diagonal repetido
                svgWatermark = this.createDiagonalWatermark(width, height, text, fontSize, opacity);
            } else if (position === 'center') {
                // Watermark centrado grande
                svgWatermark = this.createCenterWatermark(width, height, text, fontSize * 2, opacity);
            } else {
                // Watermark en esquina inferior derecha
                svgWatermark = this.createCornerWatermark(width, height, text, fontSize, opacity);
            }

            // Aplicar watermark a la imagen
            const watermarkedImage = await image
                .composite([{
                    input: Buffer.from(svgWatermark),
                    gravity: 'center'
                }])
                .jpeg({ quality: 90 })
                .toBuffer();

            console.log('✅ Watermark aplicado');

            return watermarkedImage;

        } catch (error) {
            console.error('❌ Error aplicando watermark:', error);
            throw error;
        }
    }

    // 📐 CREAR WATERMARK DIAGONAL
    createDiagonalWatermark(width, height, text, fontSize, opacity) {
        const spacing = 200;
        const angle = -45;

        let watermarks = '';

        for (let y = -height; y < height * 2; y += spacing) {
            for (let x = -width; x < width * 2; x += spacing) {
                watermarks += `
          <text
            x="${x}"
            y="${y}"
            font-family="Arial, sans-serif"
            font-size="${fontSize}"
            font-weight="bold"
            fill="white"
            opacity="${opacity}"
            transform="rotate(${angle} ${x} ${y})"
          >${text}</text>
        `;
            }
        }

        return `
      <svg width="${width}" height="${height}">
        ${watermarks}
      </svg>
    `;
    }

    // 🎯 CREAR WATERMARK CENTRADO
    createCenterWatermark(width, height, text, fontSize, opacity) {
        return `
      <svg width="${width}" height="${height}">
        <text
          x="${width / 2}"
          y="${height / 2}"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="bold"
          fill="white"
          opacity="${opacity}"
          text-anchor="middle"
          dominant-baseline="middle"
        >${text}</text>
      </svg>
    `;
    }

    // 📍 CREAR WATERMARK EN ESQUINA
    createCornerWatermark(width, height, text, fontSize, opacity) {
        const padding = 20;

        return `
      <svg width="${width}" height="${height}">
        <text
          x="${width - padding}"
          y="${height - padding}"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="bold"
          fill="white"
          opacity="${opacity}"
          text-anchor="end"
        >${text}</text>
      </svg>
    `;
    }

    // 🔓 REMOVER WATERMARK (SOLO PARA VERIFICACIÓN)
    // En realidad, guardamos 2 versiones: con y sin watermark
    async generateBothVersions(imageBuffer) {
        try {
            console.log('🎨 Generando versión con y sin watermark...');

            // Versión sin watermark (original)
            const cleanImage = await sharp(imageBuffer)
                .jpeg({ quality: 95 })
                .toBuffer();

            // Versión con watermark
            const watermarkedImage = await this.applyWatermark(imageBuffer, {
                position: 'diagonal',
                opacity: 0.4
            });

            return {
                clean: cleanImage,
                watermarked: watermarkedImage
            };

        } catch (error) {
            console.error('❌ Error generando versiones:', error);
            throw error;
        }
    }
}

// Exportar instancia singleton
const watermarkService = new WatermarkService();

module.exports = {
    applyWatermark: (imageBuffer, options) => watermarkService.applyWatermark(imageBuffer, options),
    generateBothVersions: (imageBuffer) => watermarkService.generateBothVersions(imageBuffer),
    WatermarkService
};
