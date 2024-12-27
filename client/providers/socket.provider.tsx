import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, data: any) => void;
  off: (event: string) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const socket = io('http://localhost:8080');
  //   socketRef.current = socket;

  //   socket.on('connect', () => {
  //     setIsConnected(true); 
  //   });

  //   socket.on('disconnect', () => {
  //     setIsConnected(false);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
  };

  const emit = (event: string, data: any) => {
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
