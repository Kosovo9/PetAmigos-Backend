// @ts-ignore
import { User } from '../../models/User';
// @ts-ignore
import { Post } from '../../models/Post';
// @ts-ignore
import { Like } from '../../models/Like';

export class RecommendationEngine {
    // Recomendar posts basados en los likes del usuario
    async recommendPosts(userId: string, limit: number = 10): Promise<any[]> {
        const userLikes = await Like.find({ userId: userId }).select('postId');
        const likedPostIds = userLikes.map((like: any) => like.postId);

        const recommendedPosts = await Post.aggregate([
            {
                $match: {
                    _id: { $nin: likedPostIds } // Excluir los que ya le gustaron
                }
            },
            {
                $sample: { size: limit }
            }
        ]);

        return recommendedPosts;
    }

    // Recomendar usuarios similares
    async recommendUsers(userId: string, limit: number = 5): Promise<any[]> {
        const currentUser = await User.findById(userId);
        if (!currentUser) return [];

        const recommendedUsers = await User.find({
            _id: { $ne: userId },
            interests: { $in: currentUser.interests || [] }
        }).limit(limit);

        return recommendedUsers;
    }
}
