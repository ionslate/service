import dotenv from 'dotenv';

dotenv.config();

export default {
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbApiUser: process.env.DB_API_USER,
  dbApiPassword: process.env.DB_API_PASSWORD,
  dbCert: process.env.DB_CERT,
  port: process.env.PORT,
  authIssuer: process.env.AUTH_ISSUER,
  expectedAudience: process.env.EXPECTED_AUDIENCE,
  isProduction: process.env.NODE_ENV === 'production',
};
