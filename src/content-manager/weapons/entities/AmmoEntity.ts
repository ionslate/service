import { BaseEntity, Collection, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';

export class AmmoEntity extends BaseEntity<AmmoEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
  combinedAmmo = new Collection<AmmoEntity>(this);
  parentAmmo = new Collection<AmmoEntity>(this);
  weaponModes = new Collection<WeaponModeEntity>(this);
}

export const ammoSchema = new EntitySchema({
  class: AmmoEntity,
  extends: 'BaseEntity',
  tableName: 'ammo',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    link: { type: 'string', nullable: true },
    combinedAmmo: {
      reference: 'm:n',
      entity: () => AmmoEntity,
      inversedBy: 'parentAmmo',
      fixedOrder: true,
    },
    parentAmmo: {
      reference: 'm:n',
      entity: () => AmmoEntity,
      mappedBy: 'combinedAmmo',
      hidden: true,
    },
    weaponModes: {
      reference: 'm:n',
      entity: () => WeaponModeEntity,
      mappedBy: 'ammo',
      hidden: true,
    },
  },
});
