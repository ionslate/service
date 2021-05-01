import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroOrmConfig from '@root/config/mikro-orm.config';

export default {
  ...mikroOrmConfig,
  migrations: {
    path: './src/__migrations__',
    disableForeignKeys: false,
  },
} as Options<PostgreSqlDriver>;
