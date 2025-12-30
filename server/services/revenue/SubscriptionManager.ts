// @ts-ignore
import { User } from '../../models/User';
import { PaymentGateway } from './PaymentGateway';

export class SubscriptionManager {
    private paymentGateway: PaymentGateway;

    constructor() {
        this.paymentGateway = new PaymentGateway();
    }

    // Crear una suscripción
    async createSubscription(userId: string, planId: string, paymentMethod: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const plan = this.getPlanDetails(planId);
        let paymentResult;

        if (paymentMethod === 'paypal') {
            paymentResult = await this.paymentGateway.createPayPalPayment(plan.amount, plan.currency, plan.description);
            user.subscription = {
                planId: planId,
                status: 'pending',
                paymentOrderId: paymentResult.id,
                paymentMethod: 'paypal'
            };
        } else if (paymentMethod === 'mercado_pago') {
            paymentResult = await this.paymentGateway.createMercadoPagoPayment(plan.amount, plan.description, user.email);
            user.subscription = {
                planId: planId,
                status: 'pending',
                paymentOrderId: paymentResult.id,
                paymentMethod: 'mercado_pago'
            };
        } else {
            throw new Error('Unsupported payment method');
        }

        await user.save();
        return paymentResult;
    }

    // Confirmar y activar la suscripción
    async activateSubscription(userId: string, orderId: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user || user.subscription?.paymentOrderId !== orderId) {
            throw new Error('Invalid subscription activation');
        }

        if (user.subscription.paymentMethod === 'paypal') {
            const captureResult = await this.paymentGateway.capturePayPalPayment(orderId);
            if (captureResult.status === 'COMPLETED') {
                this.enableSubscription(user, user.subscription.planId);
            } else {
                throw new Error('Payment capture failed');
            }
        } else {
            // Para MercadoPago asumimos webhook o verificación externa
            this.enableSubscription(user, user.subscription.planId);
        }
        await user.save();
    }

    private enableSubscription(user: any, planId: string) {
        user.subscription.status = 'active';
        user.subscription.startDate = new Date();
        user.subscription.endDate = this.calculateEndDate(planId);
    }

    private getPlanDetails(planId: string): { amount: number, currency: string, description: string } {
        const plans: Record<string, any> = {
            'monthly': { amount: 9.99, currency: 'USD', description: 'Monthly Subscription' },
            'yearly': { amount: 99.99, currency: 'USD', description: 'Yearly Subscription' },
            'lifetime': { amount: 299.99, currency: 'USD', description: 'Lifetime Access' }
        };
        return plans[planId] || plans['monthly'];
    }

    private calculateEndDate(planId: string): Date {
        const date = new Date();
        if (planId === 'monthly') date.setMonth(date.getMonth() + 1);
        else if (planId === 'yearly') date.setFullYear(date.getFullYear() + 1);
        else if (planId === 'lifetime') date.setFullYear(date.getFullYear() + 100);
        return date;
    }
}
