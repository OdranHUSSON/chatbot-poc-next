import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import { Sequelize } from 'sequelize';
import { Message, initialize } from '../../models/messages'; 
import Config  from '../../config/config.json';


const handleMessages = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    const env = process.env.NODE_ENV || 'development';
    console.log("nodeenv:", process.env.NODE_ENV )
    console.log("actual:", env)
    const config = Config[env];

    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
    })
    initialize(sequelize);
    try {
        switch (req.method) {
            case 'GET':
                try {
                    const messages = await Message.findAll();
                    res.json(messages);
                } catch ( ex ) {
                    res.status(500).json({ error: "Error fetching messages" });
                }
                break;
            case 'POST':
                const message = await Message.create(req.body);
                res?.socket?.server?.io?.emit("messageCreated", message);
                console.log('Emitting messageCreated event with data:', req.body)
                res.json(message);
                break;
            case 'PUT':
                await Message.update(req.body, {
                    where: { id: req.body.id }
                });
                res?.socket?.server?.io?.emit("messageUpdated", req.body);
                console.log('Emitting messageUpdated event with data:', req.body)
                res.json({ success: true });
                break;
            case 'DELETE':
                if (req.query.truncate === 'true') {
                    await Message.truncate();
                    // Optionally emit a 'messagesTruncated' event if necessary
                    // res?.socket?.server?.io?.emit("messagesTruncated");
                } else {
                    await Message.destroy({
                        where: { id: req.body.id }
                    });
                    res?.socket?.server?.io?.emit("messageDeleted", req.body.id);
                    console.log('Emitting messageDeleted event with data:', req.body.id)
                }
                res.json({ success: true });
                break;
            default:
                res.status(405).end(); // Method not allowed
                break;
        }
    } catch (error) {
        console.error("Error in /api/messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handleMessages;

