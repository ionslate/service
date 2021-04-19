import { BaseEntity, Collection, EntitySchema } from '@mikro-orm/core';
import {
  HackingProgramSkillType,
  HackingProgramTarget,
} from '@root/__generatedTypes__';
import { generateId } from '@root/utils';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';

export class HackingProgramEntity extends BaseEntity<
  HackingProgramEntity,
  'id'
> {
  id!: string;
  name!: string;
  link?: string;
  attackMod?: string;
  opponentMod?: string;
  damage?: string;
  burst?: string;
  target: HackingProgramTarget[] = [];
  skillType: HackingProgramSkillType[] = [];
  special?: string;
  devices: Collection<HackingDeviceEntity> = new Collection<HackingDeviceEntity>(
    this,
  );
}

export const hackingProgramSchema = new EntitySchema({
  class: HackingProgramEntity,
  extends: 'BaseEntity',
  tableName: 'hacking_program',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    link: { type: 'string', nullable: true },
    attackMod: { type: 'string', nullable: true },
    opponentMod: { type: 'string', nullable: true },
    damage: { type: 'string', nullable: true },
    burst: { type: 'string', nullable: true },
    target: { enum: true, array: true },
    skillType: { enum: true, array: true },
    special: { type: 'string', columnType: 'text', nullable: true },
    devices: {
      reference: 'm:n',
      entity: () => HackingDeviceEntity,
      mappedBy: 'programs',
      hidden: true,
    },
  },
});
