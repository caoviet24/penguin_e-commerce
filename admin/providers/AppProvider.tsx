"use client"
import React from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SocketProvider } from "./socket.provider";

const queryClient = new QueryClient()
export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SocketProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        </SocketProvider>

    )
}