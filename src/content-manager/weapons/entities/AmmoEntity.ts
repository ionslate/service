import { BaseEntity, Collection, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';

export class AmmoEntity extends BaseEntity<AmmoEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
  combinedAmmo = new Collection<AmmoEntity>(this);
  parentAmmo = new Collection<AmmoEntity>(this);
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
  },
});
