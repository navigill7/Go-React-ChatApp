import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080'; // Update with your backend URL

export const initSocket = (userId) => {
  const socket = io(`${SOCKET_URL}/ws/${userId}`, {
    transports: ['websocket'],
    autoConnect: true,
  });

  // Handle connection events
  socket.on('connect', () => {
    console.log('WebSocket connected:', socket.id);
    // Send join event
    socket.emit('join', userId);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  return socket;
};