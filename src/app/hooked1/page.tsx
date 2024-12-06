"use client"
import { useEffect, useState } from 'react';

export default function WebSocketExample() {
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Only runs on the client
    const socket = new WebSocket('wss://crashserver.onrender.com');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ message: 'Hello Server!' }));
    };

    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      setMessage(event.data);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    // Cleanup on unmount
    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>WebSocket Client</h1>
      <p>Message from server: {message}</p>
      <button onClick={() => ws && ws.send('Hello again!')}>
        Send Message
      </button>
    </div>
  );
}