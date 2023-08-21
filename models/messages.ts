// models/message.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Message extends Model {
    public id!: string;
    public type!: 'user' | 'bot';
    public message!: string;
    public chatId!: string;

    static async create(body: any): Promise<Message> {
        return super.create(body);
    }

    static async update(body: any, options: { where: { id: any; }; }): Promise<[number, Message[]]> {
        return super.update(body, options);
    }

    static async findAll(chatId: string): Promise<Message[]> {
        return super.findAll({
            where: { 'chatId': chatId },
            order: [['createdAt', 'ASC']]
        });
    }

    static async truncate(chatId: string): Promise<void> {
        return super.destroy({
            where: { 'chatId': chatId },
            truncate: true
        });
    }

    static async findOneById(id: string, chatId: string): Promise<Message | null> {
        return super.findAll({
            where: { 'id': id, 'chatId': chatId }
        });
    }

    static async destroyById(id: string, chatId: string): Promise<number> {
        return super.destroy({
            where: { id, chatId }
        });
    }
}

export function initialize(sequelize: Sequelize) {
    Message.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM('user', 'bot'),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "<Loading>",
        },
        chatId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'message',
    });
}
