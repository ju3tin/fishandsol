import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

let io: SocketIOServer | undefined;

interface SocketWithServer extends NodeJS.Socket {
  server: NetServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) return res.end();

  if (!io) {
    const httpServer: NetServer = (res.socket as unknown as SocketWithServer).server;
    io = new SocketIOServer(httpServer);

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('chat message', (msg) => {
        io?.emit('chat message', msg); // Broadcast the message
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    console.log('Socket.io server initialized');
  }

  res.end();
}