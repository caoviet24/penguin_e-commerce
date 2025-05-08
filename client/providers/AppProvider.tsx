'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { SocketProvider } from './socket.provider';
import { PersistGate } from 'redux-persist/integration/react';
import { UserProvider } from './AuthProvider';

const queryClient = new QueryClient();
export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SocketProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>{children}</UserProvider>
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </SocketProvider>
    );
}
