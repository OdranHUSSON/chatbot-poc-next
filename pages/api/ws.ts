import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from '@/types/io';
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/ws",
      addTrailingSlash: false
    });

    io.on('connection', (socket) => {
      console.log('New client connected');

      // When a user joins a chat
      socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
      });

      // When a user leaves a chat
      socket.on('leaveRoom', (chatId) => {
        socket.leave(chatId);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};
