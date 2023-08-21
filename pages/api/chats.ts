import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import { getAllChats } from '@/controller/message';

const handlecChats = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    const socketIO = res.socket.server.io;
    const chatId = req.query.chatId;

    try {
        switch (req.method) {
            case 'GET':
                const chats = await getAllChats();
                res.json(chats);
                break;
            default:
                res.status(405).end();
                break;
        }
    } catch (error) {
        console.error("Error in /api/chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handlecChats;
