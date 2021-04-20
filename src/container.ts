import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { RuleService } from '@content-manager/common/services/RuleService';
import dbConfig from '@config/mikro-orm.config';
import { AmmoEntity } from '@root/content-manager/weapons/entities/AmmoEntity';
import { AmmoService } from '@root/content-manager/weapons/services/AmmoService';
import { AmmoLoader } from '@root/content-manager/weapons/loaders/AmmoLoader';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import { HackingDeviceService } from '@content-manager/hacking/services/HackingDeviceService';
import { HackingProgramLoader } from '@root/content-manager/hacking/loaders/HackingProgramLoader';
import Dataloader from 'dataloader';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';

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
  hackingProgramLoader: HackingProgramLoader;
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
  const hackingProgramLoader = new HackingProgramLoader(hackingProgramService);

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
    hackingProgramLoader,
  };
}

export type AppContext = {
  ruleService: RuleService;
  ammoService: AmmoService;
  combinedAmmoLoader: Dataloader<string, AmmoEntity[], string>;
  hackingProgramService: HackingProgramService;
  hackingDeviceService: HackingDeviceService;
  hackingProgramLoader: Dataloader<string, HackingProgramEntity[], string>;
};

export const createContext = (
  container: Container,
): ContextFunction<ExpressContext, AppContext> => () => ({
  ruleService: container.ruleService,
  ammoService: container.ammoService,
  combinedAmmoLoader: container.ammoLoader.createCombinedAmmoLoader(),
  hackingProgramService: container.hackingProgramService,
  hackingDeviceService: container.hackingDeviceService,
  hackingProgramLoader: container.hackingProgramLoader.createHackingProgramLoader(),
});
