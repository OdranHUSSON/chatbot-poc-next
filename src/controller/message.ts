import { Sequelize } from 'sequelize';
import { Message, initialize } from '../../models/messages';
import Config from '../../config/config.json';
import { Server as SocketIOServer } from "socket.io";

const env = process.env.NODE_ENV || 'development';
const config = Config[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: console.log
})

initialize(sequelize);

export const getMessage = async (messageId) => {
    if (messageId) {
        return await Message.findOneById(messageId);
    } else {
        return await Message.findAll();
    }
}

export const createMessage = async (messageData, socketIO: SocketIOServer) => {
    const message = await Message.create(messageData);
    socketIO.emit('messageCreated', message.id);
    return message;
}

export const updateMessage = async (updatedMessageData, socketIO: SocketIOServer) => {
    await Message.update(updatedMessageData, {
        where: { id: updatedMessageData.id }
    });
    socketIO.emit('messageUpdated', updatedMessageData.id);
}

export const deleteMessage = async (id, truncate, socketIO: SocketIOServer) => {
    if (truncate === 'true') {
        await Message.truncate();
        socketIO.emit('messagesTruncated');
    } else {
        await Message.destroy({
            where: { id: id }
        });
        socketIO.emit('messageDeleted', id);
    }
}
