import { Sequelize } from 'sequelize';
import { initUserModel, User } from './models/user';
import { initFeedModel, Feed } from './models/feed';

// Create Sequelize instance with environment variables
const sequelize = new Sequelize(
  process.env.DB_DATABASE || '',
  process.env.DB_USERNAME || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      freezeTableName: true,
    },
  }
);

// Initialize models
initUserModel(sequelize);
initFeedModel(sequelize);

// Set up associations
User.associate({ Feed });
Feed.associate({ User });

// Export the sequelize instance and models
export { sequelize, User, Feed };

// Export a function to test the database connection
export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Export a function to sync models (use with caution in production)
export async function syncModels(options?: { force?: boolean; alter?: boolean }): Promise<void> {
  await sequelize.sync(options);
}
