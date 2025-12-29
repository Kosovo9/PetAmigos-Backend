import { db, getDb } from '../db';
import { users, datingProfiles, swipes, datingMatches } from '../../drizzle/schema';
import { eq, ne, and, sql, notInArray, inArray } from 'drizzle-orm';

export async function getQueue(userId: number) {
    const d = await getDb();
    if (!d) return [];

    const me = await d.select().from(datingProfiles).where(eq(datingProfiles.userId, userId)).then(r => r[0]);
    if (!me) return [];

    // Excluir ya swiped
    const swiped = await d.select({ toUserId: swipes.toUserId }).from(swipes).where(eq(swipes.fromUserId, userId));
    const excluded = swiped.map(s => s.toUserId);
    excluded.push(userId); // Exclude self

    // candidate filters
    const candidates = await d
        .select()
        .from(datingProfiles)
        .where(and(
            ne(datingProfiles.userId, userId),
            excluded.length > 0 ? notInArray(datingProfiles.userId, excluded) : sql`1=1`,
            eq(datingProfiles.isVisible, true),
            // Simplified location filter for now, or use ST_Distance if possible
            sql`(${me.lookingFor} = 'both' OR gender = ${me.lookingFor})`
        ))
        .limit(50);

    // Score = breedMatch * 0.5 + distScore * 0.5
    const scored = candidates.map(c => {
        const breedMatch = me.breed === c.breed ? 1 : 0;
        // Mock distance score for now
        const distScore = 0.8;
        return { ...c, score: breedMatch * 0.5 + distScore * 0.5 };
    });

    return scored.sort((a, b) => (b.score || 0) - (a.score || 0));
}

export async function swipe(fromUserId: number, toUserId: number, liked: boolean) {
    const d = await getDb();
    if (!d) return;

    await d.insert(swipes).values({ fromUserId, toUserId, liked });

    if (liked) {
        const reverse = await d.select()
            .from(swipes)
            .where(and(
                eq(swipes.fromUserId, toUserId),
                eq(swipes.toUserId, fromUserId),
                eq(swipes.liked, true)
            ));

        if (reverse.length > 0) {
            await d.insert(datingMatches).values({ user1Id: fromUserId, user2Id: toUserId });
            return { isMatch: true };
        }
    }
    return { isMatch: false };
}
