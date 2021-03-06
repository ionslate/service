import { AuthService } from '@auth/services/AuthService';
import dbConfig from '@config/mikro-orm.config';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { RuleService } from '@content-manager/common/services/RuleService';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingProgramLoader } from '@content-manager/hacking/loaders/HackingProgramLoader';
import { HackingDeviceService } from '@content-manager/hacking/services/HackingDeviceService';
import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponEntity } from '@content-manager/weapons/entities/WeaponEntity';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { AmmoLoader } from '@content-manager/weapons/loaders/AmmoLoader';
import { WeaponLoader } from '@content-manager/weapons/loaders/WeaponLoader';
import { AmmoService } from '@content-manager/weapons/services/AmmoService';
import { WeaponService } from '@content-manager/weapons/services/WeaponService';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserEntity } from '@users/entities/UserEntity';
import { UserService } from '@users/services/UserService';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import connectRedis, { RedisStore } from 'connect-redis';
import Dataloader from 'dataloader';
import config from '@config/config';
import { Request, Response } from 'express-serve-static-core';
import session from 'express-session';
import RedisClient, { Redis } from 'ioredis';
import { RateLimiter } from '@common/service/RateLimiter';
import { AuditService } from '@audit/services/AuditService';
import { AuditEntity } from '@audit/entities/AuditEntity';

export type Container = {
  orm: MikroORM<PostgreSqlDriver>;
  redisClient: Redis;
  sessionStore: RedisStore;
  entityManager: EntityManager<PostgreSqlDriver>;
  auditService: AuditService;
  auditRepository: EntityRepository<AuditEntity>;
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
  weaponRepository: EntityRepository<WeaponEntity>;
  weaponModeRepository: EntityRepository<WeaponModeEntity>;
  weaponService: WeaponService;
  weaponLoader: WeaponLoader;
  userRepository: EntityRepository<UserEntity>;
  authService: AuthService;
  userService: UserService;
};

export async function createContainer(): Promise<Container> {
  const orm = await MikroORM.init(dbConfig);

  const redisClient = new RedisClient(
    Number(config.redisPort),
    config.redisHost,
    {
      password: config.redisPassword,
    },
  );
  const RedisStore = connectRedis(session);
  const sessionStore = new RedisStore({ client: redisClient });

  const ruleRepository = orm.em.getRepository(RuleEntity);
  const ammoRepository = orm.em.getRepository(AmmoEntity);
  const hackingProgramRepository = orm.em.getRepository(HackingProgramEntity);
  const hackingDeviceRepository = orm.em.getRepository(HackingDeviceEntity);
  const weaponRepository = orm.em.getRepository(WeaponEntity);
  const weaponModeRepository = orm.em.getRepository(WeaponModeEntity);
  const userRepository = orm.em.getRepository(UserEntity);
  const auditRepository = orm.em.getRepository(AuditEntity);

  const auditService = new AuditService(auditRepository, userRepository);

  const ruleService = new RuleService(ruleRepository, auditService);
  const ammoService = new AmmoService(ammoRepository, auditService);
  const hackingProgramService = new HackingProgramService(
    hackingProgramRepository,
    auditService,
  );
  const hackingDeviceService = new HackingDeviceService(
    hackingDeviceRepository,
    hackingProgramRepository,
    auditService,
  );
  const weaponService = new WeaponService(
    weaponRepository,
    weaponModeRepository,
    ammoRepository,
    ruleRepository,
    auditService,
  );
  const userService = new UserService(
    userRepository,
    sessionStore,
    orm.em,
    auditService,
  );
  const authService = new AuthService(userRepository);

  const ammoLoader = new AmmoLoader(ammoService);
  const hackingProgramLoader = new HackingProgramLoader(hackingProgramService);
  const weaponLoader = new WeaponLoader(weaponService);

  return {
    orm,
    redisClient,
    sessionStore,
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
    weaponRepository,
    weaponModeRepository,
    weaponService,
    weaponLoader,
    userRepository,
    userService,
    authService,
    auditService,
    auditRepository,
  };
}

export type AppContext = {
  ruleService: RuleService;
  ammoService: AmmoService;
  auditService: AuditService;
  combinedAmmoLoader: Dataloader<string, AmmoEntity[], string>;
  hackingProgramService: HackingProgramService;
  hackingDeviceService: HackingDeviceService;
  hackingProgramLoader: Dataloader<string, HackingProgramEntity[], string>;
  weaponService: WeaponService;
  weaponModesLoader: Dataloader<string, WeaponModeEntity[], string>;
  ammoLoader: Dataloader<string, AmmoEntity[], string>;
  traitsLoader: Dataloader<string, RuleEntity[], string>;
  userService: UserService;
  authService: AuthService;
  req: Request;
  res: Response;
  rateLimiter: RateLimiter;
};

export const createContext = (
  container: Container,
): ContextFunction<ExpressContext, AppContext> => ({ req, res }) => {
  return {
    req,
    res,
    rateLimiter: new RateLimiter(container.redisClient, req, res),
    ruleService: container.ruleService,
    ammoService: container.ammoService,
    auditService: container.auditService,
    combinedAmmoLoader: container.ammoLoader.createCombinedAmmoLoader(),
    hackingProgramService: container.hackingProgramService,
    hackingDeviceService: container.hackingDeviceService,
    hackingProgramLoader: container.hackingProgramLoader.createHackingProgramLoader(),
    weaponService: container.weaponService,
    weaponModesLoader: container.weaponLoader.createWeaponModesLoader(),
    ammoLoader: container.weaponLoader.createAmmoLoader(),
    traitsLoader: container.weaponLoader.createTraitsLoader(),
    userService: container.userService,
    authService: container.authService,
  };
};
