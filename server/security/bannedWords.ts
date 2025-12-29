
export const bannedWords = {
    es: [
        'porno', 'puta', 'mierda', 'nazi', 'pendejo', 'chinga', 'aborto', 'diablo', 'allah', 'jesús', 'elecciones', 'comunismo', 'racista', 'suicidio', 'matar', 'droga'
    ],
    en: [
        'porn', 'slut', 'fuck', 'nazi', 'idiot', 'racist', 'allah', 'jesus', 'election', 'communism', 'whore', 'cock', 'kill', 'suicide', 'drug'
    ]
};
export const allBannedWords = [...bannedWords.es, ...bannedWords.en];
