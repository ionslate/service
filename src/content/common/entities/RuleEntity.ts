import { BaseEntity, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';

export class RuleEntity extends BaseEntity<RuleEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
}

export const ruleSchema = new EntitySchema({
  class: RuleEntity,
  extends: 'BaseEntity',
  tableName: 'rule',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string' },
    link: { type: 'string', nullable: true },
  },
});
