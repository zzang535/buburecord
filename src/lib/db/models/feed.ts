import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from './user';

export interface FeedAttributes {
  id: number;
  date: string;
  comment: string;
  image_url: string;
  user_id: number;
}

export interface FeedCreationAttributes extends Optional<FeedAttributes, 'id'> {}

export class Feed extends Model<FeedAttributes, FeedCreationAttributes> implements FeedAttributes {
  declare id: number;
  declare date: string;
  declare comment: string;
  declare image_url: string;
  declare user_id: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly user?: User;

  static associate(models: { User: typeof User }) {
    Feed.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export function initFeedModel(sequelize: Sequelize): typeof Feed {
  Feed.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'feed',
      timestamps: true,
      underscored: true,
    }
  );

  return Feed;
}
