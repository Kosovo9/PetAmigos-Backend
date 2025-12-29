import { db, getDb } from '../db';
import { communities, communityMembers, communityPosts } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function createCommunity(data: { name: string; slug: string; ownerId: number }) {
    const d = await getDb();
    if (!d) return;

    const [c] = await d.insert(communities).values(data);
    // Row inserted, usually we'd need the ID. MySQL returns an object with insertId.
    const communityId = (c as any).insertId;

    await d.insert(communityMembers).values({
        communityId,
        userId: data.ownerId,
        role: 'owner'
    });

    return { id: communityId, ...data };
}

export async function joinCommunity(communityId: number, userId: number) {
    const d = await getDb();
    if (!d) return;

    return d.insert(communityMembers).values({ communityId, userId, role: 'member' });
}

export async function getCommunityFeed(communityId: number, userId: number) {
    const d = await getDb();
    if (!d) return [];

    // Check membership
    const member = await d.select()
        .from(communityMembers)
        .where(and(
            eq(communityMembers.communityId, communityId),
            eq(communityMembers.userId, userId)
        ))
        .limit(1);

    if (!member.length) throw new Error('Not a member of this community');

    return d.select()
        .from(communityPosts)
        .where(and(
            eq(communityPosts.communityId, communityId),
            eq(communityPosts.approved, true)
        ))
        .orderBy(desc(communityPosts.createdAt));
}

export async function createCommunityPost(data: { communityId: number; authorId: number; content: string; mediaUrls?: string[] }) {
    const d = await getDb();
    if (!d) return;

    return d.insert(communityPosts).values({
        ...data,
        approved: true // Auto-approve for now or integrate moderation
    });
}
