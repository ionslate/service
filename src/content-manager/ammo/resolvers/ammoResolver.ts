import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    ammoById: (_, { id }, { ammoService }) => ammoService.findAmmoById(id),
    allAmmo: (_, { page, limit }, { ammoService }) =>
      ammoService.findAllAmmo(page || undefined, limit || undefined),
    searchAmmo: (_, { name, page, limit }, { ammoService }) =>
      ammoService.findAmmoByName(name, page || undefined, limit || undefined),
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
