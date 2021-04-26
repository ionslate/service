import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ca = fs.readFileSync(path.join(process.cwd(), 'certs/ca.pem')).toString();

console.log('is prod', config.isProduction);
assert(ca, new Error('Missing ca.pem file'));

const connection = {
  ssl: {
    rejectUnauthorized: false,
    ca,
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
  pool: {
    max: 5,
  },
  migrations: {
    path: './src/__migrations__',
    disableForeignKeys: false,
  },
  driverOptions: config.isProduction ? { connection } : undefined,
} as Options<PostgreSqlDriver>;
