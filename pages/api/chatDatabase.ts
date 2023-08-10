import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/database';
import Chat from '@/models/Chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            const messages = await Chat.find({});
            return res.json(messages);
        case 'POST':
            const { type, message } = req.body;
            const newMessage = new Chat({ type, message });
            await newMessage.save();
            return res.json({ success: true });
        case 'PUT':
            const { id, updatedMessage } = req.body;
            if (!id || !updatedMessage) {
                return res.status(400).json({ error: 'Invalid request data.' });
            }
            await Chat.findByIdAndUpdate(id, { message: updatedMessage });
            return res.json({ success: true });
        case 'DELETE':
            await Chat.deleteMany({});
            return res.json({ success: true });
        default:
            return res.status(405).end();
    }
}
