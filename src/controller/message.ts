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

export const getOneMessage = async (messageId, chatId) => {
    if (messageId) {
        return await Message.findOneById(messageId, chatId);
    }
}

export const getMessages = async (chatId) => {
    return await Message.findAll(chatId);
}

export const createMessage = async (messageData, socketIO: SocketIOServer, chatId) => {
    const message = await Message.create({ ...messageData, chatId });
    socketIO.emit('messageCreated', {id :message.id, chatId});
    return message;
}

export const updateMessage = async (updatedMessageData, socketIO: SocketIOServer, chatId) => {
    await Message.update(updatedMessageData, {
        where: { id: updatedMessageData.id }
    });
    socketIO.emit('messageUpdated', updatedMessageData.id, chatId);
}

export const deleteMessage = async (id, truncate, socketIO: SocketIOServer, chatId) => {
    if (truncate === 'true') {
        await Message.truncate(chatId);
        socketIO.emit('messagesTruncated', chatId);
    } else {
        await Message.destroy({
            where: { id: id, chatId }
        });
        socketIO.emit('messageDeleted', id, chatId);
    }
}
