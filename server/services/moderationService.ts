import { db, getDb } from '../db';
import { communityPosts, moderationTickets } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Mocking OpenAI for now. In production, use openai.moderations.create
export async function moderateText(text: string): Promise<'safe' | 'warn' | 'block'> {
    const flags = ['hate', 'violence', 'abuse'];
    const lowerText = text.toLowerCase();

    if (flags.some(flag => lowerText.includes(flag))) {
        return 'block';
    }

    return 'safe';
}

export async function moderatePost(postId: number, content: string) {
    const d = await getDb();
    if (!d) return;

    const decision = await moderateText(content);

    if (decision === 'block') {
        await d.update(communityPosts)
            .set({ approved: false })
            .where(eq(communityPosts.id, postId));

        await escalateToHuman(postId, 'community_post', 'Flagged by AI Moderation: Potential violation detected.');
    }
}

export async function escalateToHuman(targetId: number, targetType: string, reason: string) {
    const d = await getDb();
    if (!d) return;

    await d.insert(moderationTickets).values({
        targetId,
        targetType,
        reason,
        status: 'pending'
    });
}
