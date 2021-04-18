import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';

export default {
  type: 'postgresql',
  clientUrl: config.clientUrl,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  debug: true,
} as Options<PostgreSqlDriver>;
