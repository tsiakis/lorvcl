'use client';

import { SocketContext } from '@/contexts/socket-context-value';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

interface SocketProviderProps {
    children: ReactNode;
    url?: string;
}

const VPS_URL = process.env.NEXT_PUBLIC_VPS_URL?.replace(/\/$/, '') || '';

const SocketProvider = ({ children, url }: SocketProviderProps) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const pageIsHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        // HTTPS page cannot open HTTP VPS (browser mixed-content block).
        // Talk to same origin; Vercel/next rewrites /socket.io -> VPS.
        const origin = url || (pageIsHttps ? window.location.origin : VPS_URL || window.location.origin);
        if (!origin) return;

        const socket = io(origin, {
            path: '/socket.io',
            transports: pageIsHttps ? ['polling'] : ['polling', 'websocket'],
            upgrade: !pageIsHttps,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            timeout: 20000
        });

        socketRef.current = socket;

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('connect_error', (err) => {
            setIsConnected(false);
            console.warn('socket connect_error:', err.message, 'origin=', origin);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [url]);

    const value = useMemo(
        () => ({
            socket: socketRef.current,
            isConnected
        }),
        [isConnected]
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
