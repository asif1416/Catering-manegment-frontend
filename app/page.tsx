'use client';

import React, { useEffect } from 'react';
import Home from './home/page';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';

const Page = () => {
    const { initializeCart } = useCartStore();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const authenticated = await checkAuth();
                if (authenticated) {
                    await initializeCart();
                }
            } catch (err: any) {
                console.error('Failed to initialize app', err);
                toast.error('Failed to initialize. Please try again.');
            }
        };

        initializeApp();
    }, [checkAuth, initializeCart]);

    return (
        <div>
            <Home />
        </div>
    );
};

export default Page;