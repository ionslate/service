import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import {
  BaseEntity,
  Collection,
  EntitySchema,
  QueryOrder,
} from '@mikro-orm/core';
import { generateId } from '@root/utils';

export class HackingDeviceEntity extends BaseEntity<HackingDeviceEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string;
  programs: Collection<HackingProgramEntity> = new Collection<HackingProgramEntity>(
    this,
  );
}

export const hackingDeviceSchema = new EntitySchema({
  class: HackingDeviceEntity,
  extends: 'BaseEntity',
  tableName: 'hacking_device',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    link: { type: 'string', nullable: true },
    programs: {
      reference: 'm:n',
      entity: () => HackingProgramEntity,
      inversedBy: 'devices',
      orderBy: { name: QueryOrder.ASC },
    },
  },
});
