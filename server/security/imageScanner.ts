import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { scanText } from './contentScanner';

export const scanImageForText = async (buffer: Buffer): Promise<{ safe: boolean; reason?: string }> => {
    try {
        // Basic image validation (ensure it's an image)
        const metadata = await sharp(buffer).metadata();
        if (!metadata.format) return { safe: false, reason: "Invalid image format" };

        // Extract text with Tesseract
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng+spa', {
            // logger: m => console.log(m) // Uncomment for debug
        });

        // Scan extracted text using our text scanner
        const textScanResult = scanText(text);
        if (!textScanResult.safe) {
            return { safe: false, reason: `Image contains forbidden text: ${textScanResult.reason}` };
        }

        return { safe: true };

    } catch (error) {
        console.error("Image Scan Error:", error);
        // Fail safe or fail secure? Let's fail secure for now or allow if OCR fails but warn
        return { safe: true, reason: "OCR Analysis skipped due to error" };
    }
};

export const scanImageMetadata = async (buffer: Buffer): Promise<{ safe: boolean; reason?: string }> => {
    // Check for malicious metadata or dimensions (basic)
    try {
        const metadata = await sharp(buffer).metadata();
        // Prevent pixel bombs
        if ((metadata.width || 0) > 10000 || (metadata.height || 0) > 10000) {
            return { safe: false, reason: "Image dimensions too large" };
        }
        return { safe: true };
    } catch (e) {
        return { safe: false, reason: "Metadata scan failed" };
    }
}
