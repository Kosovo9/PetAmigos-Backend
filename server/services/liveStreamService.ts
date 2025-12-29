import { RoomServiceClient } from 'livekit-server-sdk';

const getClient = () => {
    const host = process.env.LIVEKIT_WS_URL || 'http://localhost:7880';
    const apiKey = process.env.LIVEKIT_API_KEY || 'dev_key';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'dev_secret';
    return new RoomServiceClient(host, apiKey, apiSecret);
};

export async function createLiveRoom(streamId: string) {
    const client = getClient();
    return client.createRoom({ name: streamId, emptyTimeout: 60 });
}
