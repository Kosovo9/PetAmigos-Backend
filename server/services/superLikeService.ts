import { getDb } from '../db';
import { superLikes, datingMatches } from '../../drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';
import { redis } from '../redis';
import { createNotification } from './notificationService';

const COOLDOWN_BASE = 12 * 60 * 60 * 1000; // 12h
const STREAK_MULTIPLIER = 0.85; // -15% por streak
const MAX_STREAK = 10;

export async function getSuperLikeStatus(userId: number) {
    const cacheKey = `sl:status:${userId}`;
    const cache = await redis.get(cacheKey);
    if (cache) return JSON.parse(cache);

    const d = await getDb();
    if (!d) return { canUse: false, remaining: 0, streak: 0 };

    const last = await d
        .select()
        .from(superLikes)
        .where(eq(superLikes.fromUserId, userId))
        .orderBy(desc(superLikes.createdAt))
        .limit(1);

    if (!last.length) return { canUse: true, remaining: 0, streak: 0 };

    const streak = Math.min(last[0].streak || 0, MAX_STREAK);
    const cooldown = Math.floor(COOLDOWN_BASE * Math.pow(STREAK_MULTIPLIER, streak));
    const elapsed = Date.now() - new Date(last[0].createdAt).getTime();
    const remaining = Math.max(0, cooldown - elapsed);

    const result = {
        canUse: remaining === 0,
        remaining: Math.ceil(remaining / 1000),
        streak: streak,
        nextCooldown: Math.floor(cooldown / 1000 / 60), // minutos
    };

    await redis.setex(cacheKey, 60, JSON.stringify(result));
    return result;
}

export async function useSuperLike(fromUserId: number, toUserId: number) {
    const status = await getSuperLikeStatus(fromUserId);
    if (!status.canUse) throw new Error('Super Like en cooldown');

    const d = await getDb();
    if (!d) throw new Error('Database connection failed');

    await d.insert(superLikes).values({
        fromUserId,
        toUserId,
        streak: status.streak + 1
    });

    // Verificar match (reverse Super Like)
    const reverse = await d
        .select()
        .from(superLikes)
        .where(and(
            eq(superLikes.fromUserId, toUserId),
            eq(superLikes.toUserId, fromUserId)
        ))
        .orderBy(desc(superLikes.createdAt))
        .limit(1);

    if (reverse.length) {
        await d.insert(datingMatches).values({ user1Id: fromUserId, user2Id: toUserId });
        await createNotification(toUserId, 'match', '¡Es un Super Match! ⭐');
        await createNotification(fromUserId, 'match', '¡Es un Super Match! ⭐');
    }

    await createNotification(toUserId, 'super_like', 'Recibiste un Super Like ⭐');

    // Invalidar cache
    await redis.del(`sl:status:${fromUserId}`);
}

export async function getSuperLikeStreak(userId: number) {
    const d = await getDb();
    if (!d) return 0;

    const rows = await d
        .select({ streak: superLikes.streak })
        .from(superLikes)
        .where(eq(superLikes.fromUserId, userId))
        .orderBy(desc(superLikes.createdAt))
        .limit(1);

    return rows[0]?.streak || 0;
}
