import { NextApiRequest, NextApiResponse } from 'next';
import Chat from '../../../models/chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const chat = await Chat.findByPk(id);
      res.status(200).json(chat);
      break;
    case 'PUT':
      await Chat.update(req.body, { where: { id } });
      res.status(200).json({ message: 'Chat updated' });
      break;
    case 'DELETE':
      await Chat.destroy({ where: { id } });
      res.status(200).json({ message: 'Chat deleted' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
