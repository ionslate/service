import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import { findOneOrFailHandler } from '@root/utils';

export default {
  type: 'postgresql',
  dbName: config.dbName,
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  findOneOrFailHandler,
  driverOptions: config.isProduction
    ? {
        ssl: {
          rejectUnauthorized: false,
          ca: Buffer.from(config.dbCert as string, 'base64').toString(),
        },
      }
    : undefined,
  debug: !config.isProduction,
} as Options<PostgreSqlDriver>;
