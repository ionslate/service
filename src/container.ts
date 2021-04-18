import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RuleEntity } from '@content/common/entities/RuleEntity';
import { RuleService } from '@content/common/services/RuleService';
import dbConfig from '@config/mikro-orm.config';
import { AmmoEntity } from '@content/ammo/entities/AmmoEntity';
import { AmmoService } from '@content/ammo/services/AmmoService';
import { AmmoLoader } from '@content/ammo/loaders/AmmoLoader';

export type Container = {
  orm: MikroORM<PostgreSqlDriver>;
  entityManager: EntityManager<PostgreSqlDriver>;
  ruleRepository: EntityRepository<RuleEntity>;
  ruleService: RuleService;
  ammoRepository: EntityRepository<AmmoEntity>;
  ammoService: AmmoService;
  ammoLoader: AmmoLoader;
};

export async function createContainer(): Promise<Container> {
  const orm = await MikroORM.init(dbConfig);

  const ruleRepository = orm.em.getRepository(RuleEntity);
  const ruleService = new RuleService(ruleRepository);

  const ammoRepository = orm.em.getRepository(AmmoEntity);
  const ammoService = new AmmoService(ammoRepository);
  const ammoLoader = new AmmoLoader(ammoService);

  return {
    orm,
    entityManager: orm.em,
    ruleRepository,
    ruleService,
    ammoRepository,
    ammoService,
    ammoLoader,
  };
}
