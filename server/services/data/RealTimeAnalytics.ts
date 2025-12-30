// @ts-ignore
import { Event } from '../../models/Event'; // Need to create or assume Event model
// @ts-ignore
import { User } from '../../models/User';

export class RealTimeAnalytics {
    // Registrar un evento
    async trackEvent(userId: string, eventType: string, metadata: any = {}): Promise<void> {
        const event = new Event({ // Ensure Event model is available or use generic collection
            userId,
            eventType,
            metadata,
            timestamp: new Date()
        });
        await event.save();
    }

    // Métricas clave en tiempo real
    async getRealtimeMetrics(): Promise<any> {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        const activeUsersLastHour = await Event.distinct('userId', { timestamp: { $gte: oneHourAgo } });
        const eventsLastHour = await Event.countDocuments({ timestamp: { $gte: oneHourAgo } });
        const eventsLastDay = await Event.countDocuments({ timestamp: { $gte: oneDayAgo } });

        return {
            activeUsersLastHour: activeUsersLastHour.length,
            eventsLastHour,
            eventsLastDay
        };
    }
}
