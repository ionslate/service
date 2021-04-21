import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    hackingDeviceById: (_, { hackingDeviceId }, { hackingDeviceService }) =>
      hackingDeviceService.findHackingDeviceById(hackingDeviceId),
    hackingDevicesList: (
      _,
      { search, page, limit },
      { hackingDeviceService },
    ) =>
      hackingDeviceService.getHackingDevicesList(
        search ?? undefined,
        page ?? undefined,
        limit ?? undefined,
      ),
  },
  Mutation: {
    createHackingDevice: (_, { request }, { hackingDeviceService }) =>
      hackingDeviceService.createHackingDevice(request),
    updateHackingDevice: (
      _,
      { hackingDeviceId, request },
      { hackingDeviceService },
    ) => hackingDeviceService.updateHackingDevice(hackingDeviceId, request),
  },
  HackingDevice: {
    programs: (hackingDeviceEntity, _, { hackingProgramLoader }) =>
      hackingProgramLoader.load(hackingDeviceEntity.id),
  },
} as Resolvers;
