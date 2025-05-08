'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Button } from '@mui/material';
import { createPayment, IFormData } from './action';
import MagicButton from '@/components/magic-button';

export default function Test() {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<IFormData | null>(null);

    useEffect(() => {
        setFormData({
            amount: 10000,
            description: 'Test payment',
            items: [
                {
                    name: 'Áo thun nam',
                    price: 7000,
                    quantity: 1,
                },
                {
                    name: 'Quần jean nam',
                    price: 1500,
                    quantity: 2,
                },
            ],
            returnUrl: process.env.NEXT_PUBLIC_RETURN_PAYMENT_URL || '',
            cancelUrl: process.env.NEXT_PUBLIC_CANCEL_PAYMENT_URL || '',
        });
    }, []);

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                if (formData) {
                    const result = await createPayment(formData);
                    console.log('Payment result:', result);
                }
            } catch (error) {
                console.error('Error creating payment:', error);
            }
        });
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Payment Form</h1>
            <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Processing...' : 'Test'}
            </Button>
            <MagicButton onContentGenerated={(content) => console.log(content)} />
        </div>
    );
}
