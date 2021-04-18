import { EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';
import { Rule } from '@root/__generatedTypes__';

export class RuleEntity implements Rule {
  id!: string;
  name!: string;
  link?: string | null;
}

export const ruleSchema = new EntitySchema({
  class: RuleEntity,
  tableName: 'rule',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string' },
    link: { type: 'string', nullable: true },
  },
});
