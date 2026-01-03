import { io } from 'socket.io-client';

// Replace with your backend URL
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We connect manually after login
});

export const initSocket = () => {
  const token = localStorage.getItem('token');
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
    console.log("WebSocket connected");
  }
};