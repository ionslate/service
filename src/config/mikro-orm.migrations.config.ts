import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';

export default {
  type: 'postgresql',
  dbName: config.dbName,
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  migrations: {
    path: './src/__migrations__',
    disableForeignKeys: false,
  },
  driverOptions: config.isProduction
    ? {
        ssl: {
          rejectUnauthorized: false,
          ca: Buffer.from(config.dbCert as string, 'base64').toString(),
        },
      }
    : undefined,
} as Options<PostgreSqlDriver>;
