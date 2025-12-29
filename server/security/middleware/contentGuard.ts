import { Request, Response, NextFunction } from 'express';
import { scanText } from '../contentScanner';
import { scanImageForText, scanImageMetadata } from '../imageScanner';

export const contentGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Scan Text Body
        if (req.body) {
            const textFields = ['bio', 'name', 'description', 'message', 'petName', 'content', 'title'];
            for (const field of textFields) {
                if (req.body[field] && typeof req.body[field] === 'string') {
                    const result = scanText(req.body[field]);
                    if (!result.safe) {
                        return res.status(400).json({ error: "Content Violation", details: result.reason });
                    }
                }
            }
        }

        // 2. Scan Uploaded Files (Requires Multer to populate req.file or req.files)
        // Assuming single file upload for now available at req.file
        if (req.file && req.file.buffer) {
            // Metadata scan
            const metaResult = await scanImageMetadata(req.file.buffer);
            if (!metaResult.safe) {
                return res.status(400).json({ error: "Image Violation", details: metaResult.reason });
            }

            // OCR Scan (Computationally expensive, maybe use worker threads in prod)
            // For MVP/Free Tier, running direct is fine for low volume
            const ocrResult = await scanImageForText(req.file.buffer);
            if (!ocrResult.safe) {
                // Log violation to moderation queue for audit
                await import('../../services/moderationService').then(s =>
                    s.addToModerationQueue({
                        contentId: 'upload-' + Date.now(),
                        contentType: 'image',
                        contentData: 'Image upload blocked: ' + ocrResult.reason,
                        reason: ocrResult.reason || 'OCR violation',
                        confidenceScore: 1.0
                    })
                );
                return res.status(400).json({ error: "Image Content Violation", details: ocrResult.reason });
            }
        }

        next();
    } catch (error) {
        console.error("Content Guard Error:", error);
        res.status(500).json({ error: "Security check failed" });
    }
};
