import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';

export default {
  type: 'postgresql',
  clientUrl: config.migrationUrl,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  migrations: {
    path: './src/__migrations__',
  },
  debug: true,
} as Options<PostgreSqlDriver>;
