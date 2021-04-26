import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import { findOneOrFailHandler } from '@root/utils';
import fs from 'fs';
import path from 'path';

const connection = {
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(process.cwd(), 'certs/ca.pem')).toString(),
  },
};

console.log(config.isProduction, 'is production');

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
  driverOptions: config.isProduction ? { connection } : undefined,
  debug: !config.isProduction,
} as Options<PostgreSqlDriver>;
