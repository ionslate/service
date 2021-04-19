import { BaseEntity, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';
import { RuleType } from '@root/__generatedTypes__';

export class RuleEntity extends BaseEntity<RuleEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
  type?: RuleType;
}

export const ruleSchema = new EntitySchema({
  class: RuleEntity,
  extends: 'BaseEntity',
  tableName: 'rule',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string', unique: true },
    link: { type: 'string', nullable: true },
    type: { type: 'string', nullable: true },
  },
});
