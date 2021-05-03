import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponEntity } from '@content-manager/weapons/entities/WeaponEntity';
import { WeaponRangeEntity } from '@content-manager/weapons/entities/WeaponRangeEntity';
import {
  BaseEntity,
  Collection,
  EntitySchema,
  ReferenceType,
} from '@mikro-orm/core';
import { generateId } from '@root/utils';

export class WeaponModeEntity extends BaseEntity<WeaponModeEntity, 'id'> {
  id!: string;
  name!: string;
  range!: WeaponRangeEntity;
  damage?: string;
  burst?: string;
  savingAttribute?: string;
  ammo = new Collection<AmmoEntity>(this);
  traits = new Collection<RuleEntity>(this);
  weapon!: WeaponEntity;
}

export const weaponModeSchema = new EntitySchema({
  class: WeaponModeEntity,
  extends: 'BaseEntity',
  tableName: 'weapon_mode',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    range: {
      entity: () => WeaponRangeEntity,
      reference: ReferenceType.EMBEDDED,
    },
    damage: { type: 'string', nullable: true },
    burst: { type: 'string', nullable: true },
    savingAttribute: { type: 'string', nullable: true },
    ammo: {
      reference: 'm:n',
      entity: () => AmmoEntity,
      inversedBy: 'weaponModes',
      fixedOrder: true,
    },
    traits: {
      reference: 'm:n',
      entity: () => RuleEntity,
      inversedBy: 'weaponModes',
    },
    weapon: {
      reference: 'm:1',
      entity: () => WeaponEntity,
    },
  },
});
