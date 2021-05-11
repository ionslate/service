import dotenv from 'dotenv';

dotenv.config();

const sessionSecret = (process.env.SESSION_SECRET || '').split(',');

export default {
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbApiUser: process.env.DB_API_USER,
  dbApiPassword: process.env.DB_API_PASSWORD,
  dbCert: process.env.DB_CERT,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
  port: process.env.PORT,
  sessionSecret,
  cookieDomain: process.env.COOKIE_DOMAIN,
  isProduction: process.env.NODE_ENV === 'production',
};
