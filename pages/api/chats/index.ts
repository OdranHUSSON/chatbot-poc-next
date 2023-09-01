import { NextApiRequest, NextApiResponse } from 'next';
import Chat from '../../../models/chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const chats = await Chat.findAll();
      res.status(200).json(chats);
      break;
    case 'POST':
      const chat = await Chat.create(req.body);
      res.status(201).json(chat);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
