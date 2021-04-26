import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import fs from 'fs';
import path from 'path';

const connection = {
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(process.cwd(), 'certs/ca.pem')).toString(),
  },
};

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
  },
  driverOptions: config.isProduction ? { connection } : undefined,
} as Options<PostgreSqlDriver>;
