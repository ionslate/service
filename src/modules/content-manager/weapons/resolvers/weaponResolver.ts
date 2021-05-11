import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  WeaponResolvers,
} from '@root/__generatedTypes__';

const weaponById: QueryResolvers['weaponById'] = async (
  _,
  { weaponId },
  { weaponService },
) => {
  const weaponEntity = await weaponService.findWeaponById(weaponId);

  return weaponEntity as never;
};

const weaponsList: QueryResolvers['weaponsList'] = async (
  _,
  { search, page, limit },
  { weaponService },
) => {
  const weaponsEntityPage = await weaponService.getWeaponsList(
    search ?? undefined,
    page ?? undefined,
    limit ?? undefined,
  );

  return weaponsEntityPage as never;
};

const createWeapon: MutationResolvers['createWeapon'] = async (
  _,
  { request },
  { weaponService },
) => {
  const weaponEntity = await weaponService.createWeapon(request);

  return weaponEntity as never;
};

const updateWeapon: MutationResolvers['updateWeapon'] = async (
  _,
  { weaponId, request },
  { weaponService },
) => {
  const weaponEntity = await weaponService.updateWeapon(weaponId, request);

  return weaponEntity as never;
};

const modes: WeaponResolvers['modes'] = async (
  weapon,
  _,
  { weaponModesLoader },
) => {
  const weaponModeEntities = await weaponModesLoader.load(weapon.id);

  return weaponModeEntities as never;
};

export default {
  Query: {
    weaponById,
    weaponsList,
  },
  Mutation: {
    createWeapon,
    updateWeapon,
  },
  Weapon: {
    modes,
  },
} as Resolvers;
