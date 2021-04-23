import { Container } from '@root/container';
import { HackingProgramLoader } from '@root/content-manager/hacking/loaders/HackingProgramLoader';
import { AmmoLoader } from '@root/content-manager/weapons/loaders/AmmoLoader';

type TestContainerOptions = Partial<
  Record<keyof Container, jest.Mock | Record<string, jest.Mock>>
>;

export function createTestContainer(options?: TestContainerOptions): Container {
  const orm = options?.orm || jest.fn();
  const entityManager = options?.entityManager || { fork: jest.fn() };

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

  return ({
    orm,
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
  } as unknown) as Container;
}