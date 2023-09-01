import { Model, DataTypes, Sequelize } from 'sequelize';

export class Chat extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public isPrivate!: boolean;
  public additionalContext!: object;

  static async create(body: any): Promise<Chat> {
    return super.create(body);
  }

  static async update(body: any, options: { where: { id: any; }; }): Promise<[number, Chat[]]> {
    return super.update(body, options);
  }

  static async findAll(): Promise<Chat[]> {
    return super.findAll({ order: [['createdAt', 'ASC']] });
  }

  static async findOneById(id: string): Promise<Chat | null> {
    return super.findOne({ where: { 'id': id } });
  }

  static async destroyById(id: string): Promise<number> {
    return super.destroy({ where: { id } });
  }
}

export function initialize(sequelize: Sequelize) {
  Chat.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    additionalContext: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'chat',
  });
}
