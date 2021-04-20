import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    ammoById: (_, { ammoId }, { ammoService }) =>
      ammoService.findAmmoById(ammoId),
    ammoList: (_, { search, page, limit }, { ammoService }) =>
      ammoService.getAmmoList(
        search ?? undefined,
        page ?? undefined,
        limit ?? undefined,
      ),
  },
  Mutation: {
    createAmmo: (_, { request }, { ammoService }) =>
      ammoService.createAmmo(request),
    updateAmmo: (_, { ammoId, request }, { ammoService }) =>
      ammoService.updateAmmo(ammoId, request),
  },
  Ammo: {
    combinedAmmo: (ammoEntity, _, { combinedAmmoLoader }) =>
      combinedAmmoLoader.load(ammoEntity.id),
  },
} as Resolvers;
