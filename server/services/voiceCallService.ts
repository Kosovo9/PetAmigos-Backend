import { AccessToken } from 'livekit-server-sdk';

export function generateVoiceToken(room: string, userId: string) {
    const apiKey = process.env.LIVEKIT_API_KEY || 'dev_key';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'dev_secret';

    const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        ttl: '1h',
    });

    at.addGrant({ roomJoin: true, room });
    return at.toJwt();
}
