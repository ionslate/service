import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  AmmoResolvers,
} from '@root/__generatedTypes__';

const ammoById: QueryResolvers['ammoById'] = async (
  _,
  { ammoId },
  { ammoService },
) => {
  const ammoEntity = await ammoService.findAmmoById(ammoId);

  return ammoEntity as never;
};

const ammoList: QueryResolvers['ammoList'] = async (
  _,
  { search, page, limit },
  { ammoService },
) => {
  const pagedAmmoEntities = await ammoService.getAmmoList(
    search ?? undefined,
    page ?? undefined,
    limit ?? undefined,
  );

  return pagedAmmoEntities as never;
};

const createAmmo: MutationResolvers['createAmmo'] = async (
  _,
  { request },
  { ammoService },
) => {
  const ammoEntity = await ammoService.createAmmo(request);

  return ammoEntity as never;
};

const updateAmmo: MutationResolvers['updateAmmo'] = async (
  _,
  { ammoId, request },
  { ammoService },
) => {
  const ammoEntity = await ammoService.updateAmmo(ammoId, request);

  return ammoEntity as never;
};

const combinedAmmo: AmmoResolvers['combinedAmmo'] = async (
  ammoEntity,
  _,
  { combinedAmmoLoader },
) => {
  const combinedAmmoEntities = await combinedAmmoLoader.load(ammoEntity.id);
  return combinedAmmoEntities as never;
};

export default {
  Query: {
    ammoById,
    ammoList,
  },
  Mutation: {
    createAmmo,
    updateAmmo,
  },
  Ammo: {
    combinedAmmo,
  },
} as Resolvers;
