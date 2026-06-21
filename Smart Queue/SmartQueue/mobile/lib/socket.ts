import { Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/lib/config';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket && socket.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // Use websocket-first on mobile, polling-first on web
  const transports: string[] =
    Platform.OS === 'web' ? ['polling', 'websocket'] : ['websocket', 'polling'];

  socket = io(API_BASE_URL, {
    transports,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
    forceNew: false,
  });

  socket.on('connect', () => console.log('[socket] connected:', socket?.id));
  socket.on('disconnect', (reason) => console.log('[socket] disconnected:', reason));
  socket.on('connect_error', (err) => console.log('[socket] error:', err.message));

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
