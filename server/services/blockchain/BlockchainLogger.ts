// @ts-ignore
import { ethers } from 'ethers';
import { createHash } from 'crypto';

/**
 * BlockchainLogger 1000X - Advertising Integrity Service
 * High-speed bridging between marketing events and the blockchain ledger.
 */
export class BlockchainLogger {
    private static instance: BlockchainLogger;
    private provider: any;
    private wallet: any;
    private contract: any;

    private constructor() {
        // Config for a fast L2 (e.g., Polygon, Arbitrum, or Base)
        const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'https://rpc.ankr.com/polygon_mumbai';
        const PRIV_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
        const CONTRACT_ADDR = process.env.AD_CONTRACT_ADDRESS;

        if (PRIV_KEY && CONTRACT_ADDR) {
            this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
            this.wallet = new ethers.Wallet(PRIV_KEY, this.provider);
            // ABI minimized for size
            this.contract = new ethers.Contract(CONTRACT_ADDR, [
                "function logEvent(string _campaignId, string _eventType, bytes32 _dataHash) public returns (bytes32)"
            ], this.wallet);
        }
    }

    static getInstance(): BlockchainLogger {
        if (!BlockchainLogger.instance) {
            BlockchainLogger.instance = new BlockchainLogger();
        }
        return BlockchainLogger.instance;
    }

    /**
     * Logs a marketing event to the blockchain for total transparency.
     */
    async logAdEvent(campaignId: string, eventType: string, eventData: any) {
        if (!this.contract) {
            console.warn("[BlockchainLogger] Service not configured. Skipping on-chain logging.");
            return null;
        }

        try {
            // 1. Create Data Hash for Integrity
            const dataString = JSON.stringify(eventData);
            const dataHash = '0x' + createHash('sha256').update(dataString).digest('hex');

            // 2. Commit to Blockchain (Async to not block main thread)
            console.log(`[BlockchainLogger] Committing ${eventType} for ${campaignId}...`);
            const tx = await this.contract.logEvent(campaignId, eventType, dataHash);

            // We don't wait for confirmation to keep 10X speed, but we log the hash
            return { txHash: tx.hash, dataHash };
        } catch (error) {
            console.error("[BlockchainLogger] Failed to log to blockchain", error);
            return null;
        }
    }
}

export const blockchainLogger = BlockchainLogger.getInstance();
