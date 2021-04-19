import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    hackingDeviceById: (_, { hackingDeviceId }, { hackingDeviceService }) =>
      hackingDeviceService.findHackingDevicById(hackingDeviceId),
    allHackingDevices: (_, { page, limit }, { hackingDeviceService }) =>
      hackingDeviceService.findAllHackingDevices(
        page || undefined,
        limit || undefined,
      ),
    searchHackingDevices: (
      _,
      { name, page, limit },
      { hackingDeviceService },
    ) =>
      hackingDeviceService.findHackingDeviceByName(
        name,
        page || undefined,
        limit || undefined,
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
