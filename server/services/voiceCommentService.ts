import fs from 'fs';
import { getDb } from '../db';
import { comments } from '../../drizzle/schema';
import { openai } from '../openai';
import ffmpeg from 'fluent-ffmpeg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
    },
});

export async function processVoiceComment(userId: number, filePath: string, postId: number | null) {
    // 1. Get Duration
    let duration = 0;
    try {
        duration = await new Promise<number>((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) reject(err);
                else resolve(metadata.format.duration || 0);
            });
        });
    } catch (e) {
        console.warn('FFprobe failed or not installed, defaulting duration to 0');
    }

    // 2. Transcribe
    let transcription = "";
    if (process.env.OPENAI_API_KEY) {
        try {
            const fileStream = fs.createReadStream(filePath);
            const response = await openai.audio.transcriptions.create({
                file: fileStream,
                model: "whisper-1",
            });
            transcription = response.text;
        } catch (e) {
            console.error("Transcription error:", e);
            transcription = "[Audio Comment]";
        }
    } else {
        transcription = "Simulation: Great video! (Audio Comment)";
    }

    // 3. Sentiment
    let sentiment = 'neutral';
    if (transcription && process.env.OPENAI_API_KEY) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Analyze sentiment as one word: positive, negative, or neutral." },
                    { role: "user", content: transcription }
                ]
            });
            const content = response.choices[0].message.content?.toLowerCase() || '';
            if (content.includes('positive')) sentiment = 'positive';
            else if (content.includes('negative')) sentiment = 'negative';
        } catch (e) { console.error("Sentiment analysis error", e); }
    }

    // 4. Upload (Mock/S3)
    let audioUrl = "";
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'mock') {
        const key = `voice-comments/${Date.now()}-${path.basename(filePath)}`;
        const fileContent = fs.readFileSync(filePath);
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME || 'petamigos',
            Key: key,
            Body: fileContent,
            ContentType: 'audio/webm',
            ACL: 'public-read',
        }));
        audioUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } else {
        // Mock local URL
        audioUrl = `/uploads/${path.basename(filePath)}`;
    }

    // 5. DB Insert
    const d = await getDb();
    if (d) {
        if (!postId) throw new Error("postId is required");
        await d.insert(comments).values({
            authorId: userId,
            postId,
            content: transcription,
            audioUrl,
            audioDuration: Math.round(duration),
            sentiment
        });
    }

    return { audioUrl, transcription, sentiment, duration };
}
