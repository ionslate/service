import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RuleEntity } from '@content/common/entities/RuleEntity';
import { RuleService } from '@content/common/services/RuleService';
import dbConfig from '@config/mikro-orm.config';

export type Container = {
  orm: MikroORM<PostgreSqlDriver>;
  entityManager: EntityManager<PostgreSqlDriver>;
  ruleRepository: EntityRepository<RuleEntity>;
  ruleService: RuleService;
};

export async function createContainer(): Promise<Container> {
  const orm = await MikroORM.init(dbConfig);

  const ruleRepository = orm.em.getRepository(RuleEntity);
  const ruleService = new RuleService(ruleRepository);

  return {
    orm,
    entityManager: orm.em,
    ruleRepository,
    ruleService,
  };
}
