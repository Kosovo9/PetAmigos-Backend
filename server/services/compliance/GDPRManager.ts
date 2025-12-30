import { Request, Response } from 'express';
// @ts-ignore
import { User } from '../../models/User';
// @ts-ignore
import { Post } from '../../models/Post';
// @ts-ignore
import { Message } from '../../models/Message';

export class GDPRManager {
    // Obtener todos los datos de un usuario
    async getUserData(userId: string): Promise<any> {
        const user = await User.findById(userId).select('-password');
        const posts = await Post.find({ authorId: userId });
        const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });

        return {
            user,
            posts,
            messages
        };
    }

    // Eliminar todos los datos de un usuario (derecho al olvido)
    async deleteUserData(userId: string): Promise<void> {
        // Eliminar usuario
        await User.findByIdAndDelete(userId);
        // Eliminar sus posts
        await Post.deleteMany({ authorId: userId });
        // Eliminar mensajes donde es remitente o destinatario
        await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    }

    // Exportar datos en formato JSON (para derecho de acceso)
    async exportUserData(userId: string, res: Response): Promise<void> {
        const data = await this.getUserData(userId);
        const jsonData = JSON.stringify(data, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=user-data-${userId}.json`);
        res.send(jsonData);
    }

    // Anonimizar datos
    async anonymizeUserData(userId: string): Promise<void> {
        const anonymizedData = {
            name: 'Deleted User',
            email: `deleted_${userId}@example.com`,
            profilePicture: null,
            bio: null
        };

        await User.findByIdAndUpdate(userId, anonymizedData);
        await Post.updateMany({ authorId: userId }, { authorId: null, authorName: 'Deleted User' });
        await Message.updateMany(
            { $or: [{ senderId: userId }, { receiverId: userId }] },
            { $set: { senderId: null, receiverId: null, senderName: 'Deleted User', receiverName: 'Deleted User' } }
        );
    }
}
