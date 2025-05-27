import { useUser } from '@/hooks/useAuth';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
    socket: Socket | null;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    emit: (event: string, data: unknown) => void;
    off: (event: string) => void;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false); // isConnected can be used by consumers of this context
    const { user } = useUser();

    useEffect(() => {
        // Ensure this environment variable is set in your .env.local file for development
        // and in your production environment variables.
        // Example: NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';
        const socket = io(socketUrl, {
            reconnectionAttempts: 5, // Attempt to reconnect 5 times
            reconnectionDelay: 1000, // Start with 1 second delay
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            // Optionally, you could implement a retry mechanism here or notify the user
        });

        return () => {
            socket.disconnect();
            console.log('Socket disconnected on cleanup');
        };
    }, []);

    useEffect(() => {
        if (user) {
            socketRef.current?.emit('join_room', user); // Emit a join-room event with the user ID
        }
    }, [user]);
  

    const on = (event: string, callback: (...args: unknown[]) => void) => {
        socketRef.current?.on(event, callback);
    };

    const emit = (event: string, data: unknown) => {
        socketRef.current?.emit(event, data);
    };

    const off = (event: string) => {
        socketRef.current?.off(event);
    };

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                on,
                emit,
                off,
                isConnected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
