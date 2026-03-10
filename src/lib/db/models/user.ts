import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Feed } from './feed';

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  salt: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare password: string;
  declare salt: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly feeds?: Feed[];

  static associate(models: { Feed: typeof Feed }) {
    User.hasMany(models.Feed, {
      foreignKey: 'user_id',
      as: 'feeds',
    });
  }
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'user',
      timestamps: true,
      underscored: true,
    }
  );

  return User;
}
