import { Model, DataTypes, Sequelize } from 'sequelize';

class ChatTemplate extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public rateLimit!: number;
  public tokenLimit!: number;
  public enforcedModel!: 'none' | 'gpt3' | 'gpt4';
  public additionalContext!: object;
}

ChatTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(128),
      allowNull: false,
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
  },
  {
    tableName: 'chatTemplates',
    sequelize, 
  },
);

export { ChatTemplate };
