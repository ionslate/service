import { EntitySchema } from '@mikro-orm/core';

export class WeaponRangeEntity {
  _8?: string;
  _16?: string;
  _24?: string;
  _32?: string;
  _40?: string;
  _48?: string;
  _96?: string;
}

export const weaponRangeSchema = new EntitySchema({
  class: WeaponRangeEntity,
  properties: {
    _8: { type: 'string', nullable: true },
    _16: { type: 'string', nullable: true },
    _24: { type: 'string', nullable: true },
    _32: { type: 'string', nullable: true },
    _40: { type: 'string', nullable: true },
    _48: { type: 'string', nullable: true },
    _96: { type: 'string', nullable: true },
  },
  embeddable: true,
});
