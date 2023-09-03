import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Chat extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public isPrivate!: boolean;
  public additionalContext!: object;
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
