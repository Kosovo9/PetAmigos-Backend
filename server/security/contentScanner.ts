import { allBannedWords } from './bannedWords.js'; // Assuming .js extension for direct node usage or handled by tsconfig paths
// For typescript importing directly:
// import { allBannedWords } from './bannedWords';

export const scanText = (text: string = ''): { safe: boolean; reason?: string } => {
    if (!text) return { safe: true };

    const normalized = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = normalized.split(/\s+/);

    for (const word of words) {
        if (allBannedWords.includes(word)) {
            return { safe: false, reason: `Forbidden word detected: ${word}` };
        }
    }

    return { safe: true };
};
