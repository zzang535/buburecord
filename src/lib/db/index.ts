import { Sequelize } from 'sequelize';
import { initUserModel, User } from './models/user';
import { initFeedModel, Feed } from './models/feed';

// globalThis singleton pattern to prevent connection pool leaks during Next.js HMR
declare global {
  // eslint-disable-next-line no-var
  var __buburecord_sequelize: Sequelize | undefined;
}

function createSequelize(): Sequelize {
  const instance = new Sequelize(
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
  initUserModel(instance);
  initFeedModel(instance);

  // Set up associations
  User.associate({ Feed });
  Feed.associate({ User });

  return instance;
}

const sequelize = globalThis.__buburecord_sequelize ?? createSequelize();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__buburecord_sequelize = sequelize;
}

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
