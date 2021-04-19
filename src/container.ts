import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { RuleService } from '@content-manager/common/services/RuleService';
import dbConfig from '@config/mikro-orm.config';
import { AmmoEntity } from '@content-manager/ammo/entities/AmmoEntity';
import { AmmoService } from '@content-manager/ammo/services/AmmoService';
import { AmmoLoader } from '@content-manager/ammo/loaders/AmmoLoader';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingDeviceEntity } from './content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import { HackingDeviceService } from '@content-manager/hacking/services/HackingDeviceService';

export type Container = {
  orm: MikroORM<PostgreSqlDriver>;
  entityManager: EntityManager<PostgreSqlDriver>;
  ruleRepository: EntityRepository<RuleEntity>;
  ruleService: RuleService;
  ammoRepository: EntityRepository<AmmoEntity>;
  ammoService: AmmoService;
  ammoLoader: AmmoLoader;
  hackingProgramRepository: EntityRepository<HackingProgramEntity>;
  hackingProgramService: HackingProgramService;
  hackingDeviceRepository: EntityRepository<HackingDeviceEntity>;
  hackingDeviceService: HackingDeviceService;
};

export async function createContainer(): Promise<Container> {
  const orm = await MikroORM.init(dbConfig);

  const ruleRepository = orm.em.getRepository(RuleEntity);
  const ruleService = new RuleService(ruleRepository);

  const ammoRepository = orm.em.getRepository(AmmoEntity);
  const ammoService = new AmmoService(ammoRepository);
  const ammoLoader = new AmmoLoader(ammoService);

  const hackingProgramRepository = orm.em.getRepository(HackingProgramEntity);
  const hackingProgramService = new HackingProgramService(
    hackingProgramRepository,
  );
  const hackingDeviceRepository = orm.em.getRepository(HackingDeviceEntity);
  const hackingDeviceService = new HackingDeviceService(
    hackingDeviceRepository,
    hackingProgramRepository,
  );

  return {
    orm,
    entityManager: orm.em,
    ruleRepository,
    ruleService,
    ammoRepository,
    ammoService,
    ammoLoader,
    hackingProgramRepository,
    hackingProgramService,
    hackingDeviceRepository,
    hackingDeviceService,
  };
}
