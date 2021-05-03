import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { BaseEntity, Collection, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';

export class WeaponEntity extends BaseEntity<WeaponEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
  modes = new Collection<WeaponModeEntity>(this);
}

export const weaponSchema = new EntitySchema({
  class: WeaponEntity,
  extends: 'BaseEntity',
  tableName: 'weapon',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    link: { type: 'string', nullable: true },
    modes: {
      reference: '1:m',
      entity: () => WeaponModeEntity,
      mappedBy: 'weapon',
      hidden: true,
    },
  },
});
