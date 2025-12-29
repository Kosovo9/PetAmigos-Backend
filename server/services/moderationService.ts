
import { db } from "../db";
import { moderationQueue } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface FlagContentParams {
    contentId: string;
    contentType: 'image' | 'text' | 'bio' | 'post';
    contentData: string; // Text or URL
    reason: string;
    confidenceScore?: number;
}

export const addToModerationQueue = async (params: FlagContentParams) => {
    try {
        await db.insert(moderationQueue).values({
            contentId: params.contentId,
            contentType: params.contentType,
            contentData: params.contentData,
            reason: params.reason,
            confidenceScore: params.confidenceScore || 0,
            status: 'pending'
        });
        console.log(`[Moderation] Added item to queue: ${params.contentType} (${params.reason})`);
        return true;
    } catch (error) {
        console.error("Failed to add to moderation queue:", error);
        return false;
    }
};

export const approveContent = async (queueId: number, moderatorId: number) => {
    await db.update(moderationQueue)
        .set({ status: 'approved', moderatorId, resolvedAt: new Date() })
        .where(eq(moderationQueue.id, queueId));
};

export const rejectContent = async (queueId: number, moderatorId: number) => {
    await db.update(moderationQueue)
        .set({ status: 'rejected', moderatorId, resolvedAt: new Date() })
        .where(eq(moderationQueue.id, queueId));
};
