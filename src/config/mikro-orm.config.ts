import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '@root/config/config';
import { ResourceNotFound } from '@root/error/exceptions/ResourceNotFound';

export default {
  type: 'postgresql',
  clientUrl: config.clientUrl,
  entities: ['./dist/**/entities/*'],
  entitiesTs: ['./src/**/entities/*'],
  debug: true,
  findOneOrFailHandler: (entityName) =>
    new ResourceNotFound(`${entityName.replace('Entity', '')} not found`),
} as Options<PostgreSqlDriver>;
