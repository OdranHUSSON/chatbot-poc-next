// socketInstance.ts

import { Server } from 'socket.io';

let io: Server | null = null;

export const getIOInstance = () => {
  return io;
};

export const setIOInstance = (socketIO: Server) => {
  io = socketIO;
};
