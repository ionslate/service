import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  HackingDeviceResolvers,
} from '@root/__generatedTypes__';

const hackingDeviceById: QueryResolvers['hackingDeviceById'] = async (
  _,
  { hackingDeviceId },
  { hackingDeviceService },
) => {
  const hackingDeviceEntity = await hackingDeviceService.findHackingDeviceById(
    hackingDeviceId,
  );

  return hackingDeviceEntity as never;
};

const hackingDevicesList: QueryResolvers['hackingDevicesList'] = async (
  _,
  { search, page, limit },
  { hackingDeviceService },
) => {
  const pagedHackingDevicesEntities = await hackingDeviceService.getHackingDevicesList(
    search ?? undefined,
    page ?? undefined,
    limit ?? undefined,
  );

  return pagedHackingDevicesEntities as never;
};

const createHackingDevice: MutationResolvers['createHackingDevice'] = async (
  _,
  { request },
  { hackingDeviceService, req },
) => {
  const hackingDeviceEntity = await hackingDeviceService.createHackingDevice(
    request,
    req.session.user?.id,
  );

  return hackingDeviceEntity as never;
};

const updateHackingDevice: MutationResolvers['updateHackingDevice'] = async (
  _,
  { hackingDeviceId, request },
  { hackingDeviceService, req },
) => {
  const hackingDeviceEntity = await hackingDeviceService.updateHackingDevice(
    hackingDeviceId,
    request,
    req.session.user?.id,
  );

  return hackingDeviceEntity as never;
};

const programs: HackingDeviceResolvers['programs'] = (
  hackingDeviceEntity,
  _,
  { hackingProgramLoader },
) => hackingProgramLoader.load(hackingDeviceEntity.id);

export default {
  Query: {
    hackingDeviceById,
    hackingDevicesList,
  },
  Mutation: {
    createHackingDevice,
    updateHackingDevice,
  },
  HackingDevice: {
    programs,
  },
} as Resolvers;
