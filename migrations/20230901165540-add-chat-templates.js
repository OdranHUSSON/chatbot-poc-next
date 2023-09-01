import { Model, DataTypes, Sequelize } from 'sequelize';

export class ChatTemplate extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public rateLimit!: number;
  public tokenLimit!: number;
  public enforcedModel!: 'none' | 'gpt3' | 'gpt4';
  public additionalContext!: object;

  static async create(body: any): Promise<ChatTemplate> {
    return super.create(body);
  }

  static async update(body: any, options: { where: { id: any; }; }): Promise<[number, ChatTemplate[]]> {
    return super.update(body, options);
  }

  static async findAll(): Promise<ChatTemplate[]> {
    return super.findAll({ order: [['createdAt', 'ASC']] });
  }

  static async findOneById(id: string): Promise<ChatTemplate | null> {
    return super.findOne({ where: { 'id': id } });
  }

  static async destroyById(id: string): Promise<number> {
    return super.destroy({ where: { id } });
  }
}

export function initialize(sequelize: Sequelize) {
  ChatTemplate.init({
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
    rateLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enforcedModel: {
      type: DataTypes.ENUM('none', 'gpt3', 'gpt4'),
      allowNull: false,
    },
    additionalContext: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'chatTemplate',
  });
}
