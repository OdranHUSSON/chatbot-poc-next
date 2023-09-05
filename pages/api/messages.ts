import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import { getOneMessage, getMessages, createMessage, updateMessage, deleteMessage } from '@/controller/message';

const handleMessages = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    const socketIO = res.socket.server.io;
    const chatId = req.query.chatId;

    try {
        switch (req.method) {
            case 'GET':
                try {
                    const messageId = req.query.id;
                    if (!req.query.id) {
                        const message = await getMessages(chatId);
                        if (message) {
                            res.json(message);
                        } else {
                            res.status(404).json({ error: "Message not found" });
                        }
                    }
                    else {
                        const message = await getOneMessage(messageId, chatId);
                        if (message) {
                            res.json(message[0]);
                        } else {
                            res.status(404).json({ error: "Message not found" });
                        }
                    }
                } catch (ex) {
                    res.status(500).json({ error: "Error fetching messages" });
                }
                break;
            case 'POST':
                const message = await createMessage(req.body, socketIO, req.body.chatId);
                console.log("createMessage", req.body)
                res.json(message);
                break;
            case 'PUT':
                const updatedMessageData = req.body;
                await updateMessage(updatedMessageData, socketIO, req.body.chatId);
                res.json({ success: true });
                break;
            case 'DELETE':
                await deleteMessage(req.body.id, req.query.truncate, socketIO, chatId);
                res.json({ success: true });
                break;
            default:
                res.status(405).end();
                break;
        }
    } catch (error) {
        console.error("Error in /api/messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handleMessages;
