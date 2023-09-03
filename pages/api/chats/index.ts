import { NextApiRequest, NextApiResponse } from 'next';
import { Sequelize } from 'sequelize';
import Chat, { initialize } from '../../../models/chat';
import Config from '../../../config/config.json';

const env = process.env.NODE_ENV || 'development';
const config = Config[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log,
});

// Initialize Chat model
initialize(sequelize);

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
