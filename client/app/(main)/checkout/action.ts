'use server';

import axios from 'axios';


export interface IItem {
    name: string;
    price: number;
    quantity: number;
}

export interface IFormPaymetData {
    amount: number;
    description: string;
    items: IItem[]
    returnUrl: string;
    cancelUrl: string;
}

export async function createPayment(formData: IFormPaymetData) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, formData);

    return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw new Error('Failed to create payment');
    }
}
