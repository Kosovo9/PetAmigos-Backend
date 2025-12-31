/**
 * Gestor offline-first con sincronización inteligente
 * Queue system con retry exponential y conflict resolution
 */

import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';
// Note: In a real RN project, you'd use a uuid library or a simple generator
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

interface Operation {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    data: any;
    timestamp: number;
    retryCount: number;
    lastRetry?: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    error?: string;
}

interface SyncConfig {
    maxRetries: number;
    retryDelay: number;
    batchSize: number;
    maxQueueSize: number;
    syncInterval: number;
}

class OfflineManager {
    private storage: MMKV;
    private queue: Operation[] = [];
    private isSyncing = false;
    private syncInterval?: NodeJS.Timeout;
    private config: SyncConfig = {
        maxRetries: 5,
        retryDelay: 1000,
        batchSize: 10,
        maxQueueSize: 1000,
        syncInterval: 30000, // 30 segundos
    };

    constructor() {
        this.storage = new MMKV();
        this.loadQueue();
        this.setupNetworkListener();
        this.startSyncInterval();
    }

    private loadQueue(): void {
        try {
            const queueData = this.storage.getString('offline.queue');
            if (queueData) {
                this.queue = JSON.parse(queueData);
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
            this.queue = [];
        }
    }

    private saveQueue(): void {
        try {
            this.storage.set('offline.queue', JSON.stringify(this.queue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    }

    private setupNetworkListener(): void {
        NetInfo.addEventListener(state => {
            if (state.isConnected && !state.isInternetReachable) {
                // Red disponible pero sin internet
                this.pauseSync();
            } else if (state.isConnected && state.isInternetReachable) {
                // Internet disponible
                this.resumeSync();
                this.processQueue();
            } else {
                // Sin conexión
                this.pauseSync();
            }
        });
    }

    private startSyncInterval(): void {
        this.syncInterval = setInterval(() => {
            this.processQueue();
        }, this.config.syncInterval);
    }

    enqueue(operation: Omit<Operation, 'id' | 'timestamp' | 'retryCount' | 'status'>): string {
        const id = uuidv4();
        const fullOperation: Operation = {
            ...operation,
            id,
            timestamp: Date.now(),
            retryCount: 0,
            status: 'PENDING',
        };

        // Evitar queue overflow
        if (this.queue.length >= this.config.maxQueueSize) {
            // Remover operaciones más antiguas
            this.queue.sort((a, b) => a.timestamp - b.timestamp);
            this.queue = this.queue.slice(-this.config.maxQueueSize + 1);
        }

        this.queue.push(fullOperation);
        this.saveQueue();

        // Intentar procesar inmediatamente si hay conexión
        NetInfo.fetch().then(state => {
            if (state.isConnected && state.isInternetReachable) {
                this.processQueue();
            }
        });

        return id;
    }

    async processQueue(): Promise<void> {
        if (this.isSyncing || this.queue.length === 0) return;

        this.isSyncing = true;

        try {
            // Filtrar operaciones pendientes
            const pendingOps = this.queue
                .filter(op => op.status === 'PENDING' || op.status === 'FAILED')
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(0, this.config.batchSize);

            for (const operation of pendingOps) {
                await this.processOperation(operation);
            }

            // Limpiar operaciones completadas (más de 24 horas)
            const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
            this.queue = this.queue.filter(
                op => op.status !== 'COMPLETED' || op.timestamp > twentyFourHoursAgo
            );

            this.saveQueue();

        } catch (error) {
            console.error('Error processing queue:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async processOperation(operation: Operation): Promise<void> {
        try {
            operation.status = 'PROCESSING';
            this.saveQueue();

            // Ejecutar operación según tipo
            let result;
            switch (operation.type) {
                case 'CREATE':
                    result = await this.executeCreate(operation);
                    break;
                case 'UPDATE':
                    result = await this.executeUpdate(operation);
                    break;
                case 'DELETE':
                    result = await this.executeDelete(operation);
                    break;
            }

            operation.status = 'COMPLETED';
            this.emitOperationComplete(operation, result);

        } catch (error: any) {
            operation.retryCount++;
            operation.lastRetry = Date.now();
            operation.error = error.message;

            if (operation.retryCount >= this.config.maxRetries) {
                operation.status = 'FAILED';
                this.emitOperationFailed(operation, error);
            } else {
                operation.status = 'FAILED';
                // Programar retry con exponential backoff
                const delay = this.config.retryDelay * Math.pow(2, operation.retryCount);
                setTimeout(() => {
                    operation.status = 'PENDING';
                    this.saveQueue();
                    this.processQueue();
                }, delay);
            }
        } finally {
            this.saveQueue();
        }
    }

    private async executeCreate(operation: Operation): Promise<any> {
        const { entity, data } = operation;

        switch (entity) {
            case 'pet':
                return this.apiCall('POST', '/pets', data);
            case 'message':
                return this.apiCall('POST', '/messages', data);
            case 'like':
                return this.apiCall('POST', '/likes', data);
            default:
                throw new Error(`Unknown entity: ${entity}`);
        }
    }

    private async executeUpdate(operation: Operation): Promise<any> {
        const { entity, data } = operation;

        switch (entity) {
            case 'pet':
                return this.apiCall('PATCH', `/pets/${data.id}`, data);
            case 'user':
                return this.apiCall('PATCH', '/users/profile', data);
            default:
                throw new Error(`Unknown entity: ${entity}`);
        }
    }

    private async executeDelete(operation: Operation): Promise<any> {
        const { entity, data } = operation;

        switch (entity) {
            case 'pet':
                return this.apiCall('DELETE', `/pets/${data.id}`);
            case 'message':
                return this.apiCall('DELETE', `/messages/${data.id}`);
            default:
                throw new Error(`Unknown entity: ${entity}`);
        }
    }

    private async apiCall(method: string, endpoint: string, data?: any): Promise<any> {
        const token = this.storage.getString('user.authToken');

        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    private emitOperationComplete(operation: Operation, result: any): void {
        // Emitir evento para que los componentes escuchen
        // Note: window.dispatchEvent is for web, in RN we might use DeviceEventEmitter or a custom event bus
        // using a simplified CustomEvent simulation for now
        const event = {
            type: 'offline:operation:complete',
            detail: { operation, result },
        };
        // If global.dispatchEvent exists (some RN environments or with polyfills)
        if ((global as any).dispatchEvent) {
            (global as any).dispatchEvent(event);
        }
        console.log('Operation completed:', operation.id);
    }

    private emitOperationFailed(operation: Operation, error: Error): void {
        // Emitir evento para que los componentes escuchen
        const event = {
            type: 'offline:operation:failed',
            detail: { operation, error },
        };
        if ((global as any).dispatchEvent) {
            (global as any).dispatchEvent(event);
        }
        console.warn('Operation failed:', operation.id, error.message);
    }

    getQueueStatus(): { total: number; pending: number; failed: number } {
        const pending = this.queue.filter(op => op.status === 'PENDING').length;
        const failed = this.queue.filter(op => op.status === 'FAILED').length;

        return {
            total: this.queue.length,
            pending,
            failed,
        };
    }

    clearQueue(): void {
        this.queue = [];
        this.saveQueue();
    }

    pauseSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }

    resumeSync(): void {
        this.startSyncInterval();
    }

    // Métodos helpers para operaciones comunes
    createPet(petData: any): string {
        return this.enqueue({
            type: 'CREATE',
            entity: 'pet',
            data: petData,
        });
    }

    sendMessage(messageData: any): string {
        return this.enqueue({
            type: 'CREATE',
            entity: 'message',
            data: messageData,
        });
    }

    updateProfile(profileData: any): string {
        return this.enqueue({
            type: 'UPDATE',
            entity: 'user',
            data: profileData,
        });
    }
}

export const offlineManager = new OfflineManager();
export default OfflineManager;
