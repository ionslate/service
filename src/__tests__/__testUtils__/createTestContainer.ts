import { HackingProgramLoader } from '@content-manager/hacking/loaders/HackingProgramLoader';
import { AmmoLoader } from '@content-manager/weapons/loaders/AmmoLoader';
import { WeaponLoader } from '@content-manager/weapons/loaders/WeaponLoader';
import { Container } from '@root/container';
import connectRedis from 'connect-redis';
import session from 'express-session';
import redis from 'redis-mock';
import { UserRole } from '@root/__generatedTypes__';

type TestContainerOptions = Partial<
  Record<keyof Container, jest.Mock | Record<string, jest.Mock>>
>;

export function createTestContainer(
  options?: TestContainerOptions,
  userRoles?: UserRole[],
): Container {
  const roles = userRoles || [
    'USER',
    'USER_ADMIN',
    'CONTENT_MANAGER',
    'CONTENT_PUBLISHER',
  ];

  const orm = options?.orm || jest.fn();
  const entityManager = options?.entityManager || { fork: jest.fn() };

  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);
  const sessionStore = new RedisStore({ client: redisClient });

  const auditRepository = options?.auditRepository || jest.fn();
  const auditService = options?.auditService || jest.fn();

  const ruleRepository = options?.ruleRepository || jest.fn();
  const ruleService = options?.ruleService || jest.fn();

  const ammoRepository = options?.ammoRepository || jest.fn();
  const ammoService = options?.ammoService || jest.fn();
  const ammoLoader =
    options?.ammoLoader || new AmmoLoader(ammoService as never);

  const hackingProgramRepository =
    options?.hackingProgramRepository || jest.fn();
  const hackingProgramService = options?.hackingProgramService || jest.fn();
  const hackingDeviceRepository =
    options?.hackingProgramRepository || jest.fn();
  const hackingDeviceService = options?.hackingDeviceService || jest.fn();
  const hackingProgramLoader =
    options?.hackingProgramLoader ||
    new HackingProgramLoader(hackingProgramService as never);

  const weaponRepository = options?.weaponRepository || jest.fn();
  const weaponModeRepository = options?.weaponModeRepository || jest.fn();
  const weaponService = options?.weaponService || jest.fn();
  const weaponLoader =
    options?.weaponLoader || new WeaponLoader(weaponService as never);

  const userRepository = options?.userRepository || jest.fn();
  const userService = options?.userService || jest.fn();

  const authService = options?.authService || {
    login: jest.fn().mockResolvedValue({
      id: '1234',
      username: 'foo',
      password: 'bar',
      email: 'foobar@example.com',
      roles,
    }),
  };

  return ({
    orm,
    redisClient,
    sessionStore,
    entityManager,
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
    auditRepository,
    auditService,
  } as unknown) as Container;
}
