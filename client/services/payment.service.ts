import axios from 'axios';

export interface IItem {
    name: string;
    price: number;
    quantity: number;
}

export interface IFormPaymentData {
    amount: number;
    description: string;
    items: IItem[];
}

async function create(formData: IFormPaymentData) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
            ...formData,
            returnUrl: process.env.NEXT_PUBLIC_RETURN_PAYMENT_URL || '',
            cancelUrl: process.env.NEXT_PUBLIC_CANCEL_PAYMENT_URL || '',
        });

        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw new Error('Failed to create payment');
    }
}

export const paymentService = {
    create,
};
