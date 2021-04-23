import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import { findOneOrFailHandler } from '@root/utils';

export default {
  type: 'postgresql',
  clientUrl: config.clientUrl,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  findOneOrFailHandler,
  driverOptions: {
    connection: {
      ssl: config.isProduction ? { rejectUnauthorized: false } : undefined,
    },
  },
} as Options<PostgreSqlDriver>;
