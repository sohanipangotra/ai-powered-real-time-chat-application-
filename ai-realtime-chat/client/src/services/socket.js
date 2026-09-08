import { io } from 'socket.io-client';
import { CONFIG } from '../config';

export const socket = io(CONFIG.SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: CONFIG.RECONNECT_ATTEMPTS,
  reconnectionDelay: CONFIG.RECONNECT_DELAY_MS,
});

export const connectSocket = (username, room = CONFIG.DEFAULT_ROOM) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('join_room', { username, room });
};

export const switchRoom = (username, newRoom) => {
  socket.emit('join_room', { username, room: newRoom });
};
