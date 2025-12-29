// Simple mock Redis for development
// In production, use 'ioredis' and process.env.REDIS_URL

class MockRedis {
    private store = new Map<string, string>();

    async get(key: string) {
        return this.store.get(key);
    }

    async set(key: string, value: string) {
        this.store.set(key, value);
        return 'OK';
    }

    async setex(key: string, seconds: number, value: string) {
        this.store.set(key, value);
        setTimeout(() => this.store.delete(key), seconds * 1000);
        return 'OK';
    }

    async del(key: string) {
        return this.store.delete(key);
    }

    async incr(key: string) {
        const val = parseInt(this.store.get(key) || '0');
        this.store.set(key, (val + 1).toString());
        return val + 1;
    }

    async expire(key: string, seconds: number) {
        const val = this.store.get(key);
        if (val) {
            setTimeout(() => this.store.delete(key), seconds * 1000);
        }
        return 1;
    }
}

export const redis = new MockRedis();
