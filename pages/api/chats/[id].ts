import { NextApiRequest, NextApiResponse } from 'next';
import Chat, { initialize } from '../../../models/chat';
import Config from '../../../config/config.json';
import { Sequelize } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const env = process.env.NODE_ENV || 'development';
  const config = Config[env];
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });

  initialize(sequelize);

  let chat;
  let created;

  console.log("chatId", id)
  try {
    switch (method) {
      case 'GET':
        chat = await Chat.findByPk(id);
        if (!chat) {
          res.status(404).json({ message: 'Chat not found' });
          return;
        }
        res.status(200).json(chat);
        break;

      case 'PUT':
        [chat, created] = await Chat.upsert(req.body, { returning: true });
        if (created) {
          res.status(201).json({ message: 'Chat created', chat });
        } else {
          res.status(200).json({ message: 'Chat updated', chat });
        }
        break;

      case 'DELETE':
        const deleteResult = await Chat.destroy({ where: { id } });
        if (deleteResult === 0) {
          res.status(404).json({ message: 'Chat not found' });
          return;
        }
        res.status(200).json({ message: 'Chat deleted' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}
