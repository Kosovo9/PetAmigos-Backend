import { Request, Response } from 'express';
// @ts-ignore
import { User } from '../../models/User';
import axios from 'axios';

export class KYCHandler {
    private kycProviderApiKey: string;
    private kycProviderUrl: string;

    constructor() {
        this.kycProviderApiKey = process.env.KYC_PROVIDER_API_KEY || '';
        this.kycProviderUrl = process.env.KYC_PROVIDER_URL || 'https://api.kycprovider.com/v1';
    }

    // Iniciar proceso de KYC para un usuario
    async startKYC(userId: string, documentType: string, documentImage: Buffer): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const formData = new FormData();
        formData.append('document_type', documentType);
        const blob = new Blob([documentImage]);
        formData.append('document_image', blob as any);

        const response = await axios.post(`${this.kycProviderUrl}/verify`, formData, {
            headers: {
                'Authorization': `Bearer ${this.kycProviderApiKey}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        user.kycVerificationId = response.data.verification_id;
        user.kycStatus = 'pending';
        await user.save();

        return response.data;
    }

    // Verificar el estado de KYC
    async checkKYCStatus(userId: string): Promise<string> {
        const user = await User.findById(userId);
        if (!user || !user.kycVerificationId) {
            return 'not_started';
        }

        const response = await axios.get(`${this.kycProviderUrl}/verification/${user.kycVerificationId}`, {
            headers: {
                'Authorization': `Bearer ${this.kycProviderApiKey}`
            }
        });

        const status = response.data.status;
        user.kycStatus = status;
        await user.save();

        return status;
    }

    // Webhook para recibir actualizaciones de KYC
    async handleKYCWebhook(req: Request, res: Response): Promise<void> {
        const { verification_id, status } = req.body;

        await User.findOneAndUpdate(
            { kycVerificationId: verification_id },
            { kycStatus: status }
        );

        res.status(200).send('OK');
    }
}
