import dotenv from 'dotenv';

dotenv.config();

export default {
  clientUrl: process.env.DB_CONNECTION_APP,
  migrationUrl: process.env.DB_CONNECTION_MIGRATION,
  port: process.env.PORT,
};
