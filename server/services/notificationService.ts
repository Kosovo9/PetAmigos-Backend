export async function createNotification(userId: number, type: string, message: string) {
    console.log(`[NOTIFICATION] To User ${userId}: [${type}] ${message}`);
    // TODO: Implement actual DB notification insert or WebSocket push
}
