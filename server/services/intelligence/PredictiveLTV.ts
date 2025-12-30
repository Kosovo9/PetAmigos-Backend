// @ts-ignore
import { User } from '../../models/User';
// @ts-ignore
import { Order } from '../../models/Order'; // Assuming an Order model exists

export class PredictiveLTV {
    // Calcular LTV histórico
    async calculateHistoricalLTV(userId: string): Promise<number> {
        // @ts-ignore
        const orders = await Order.find({ userId: userId, status: 'completed' });
        const totalSpent = orders.reduce((sum: number, order: any) => sum + order.amount, 0);
        return totalSpent;
    }

    // Predecir LTV futuro (Algoritmo simple)
    async predictFutureLTV(userId: string): Promise<number> {
        const historicalLTV = await this.calculateHistoricalLTV(userId);
        const user = await User.findById(userId);

        let factor = 1.0;
        if (user?.subscription?.planId === 'yearly') factor = 1.5;
        if (user?.subscription?.planId === 'lifetime') factor = 2.0;

        return historicalLTV * factor;
    }
}
