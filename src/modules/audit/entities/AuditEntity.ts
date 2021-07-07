import { BaseEntity, EntitySchema, JsonType } from '@mikro-orm/core';
import { UserEntity } from '@users/entities/UserEntity';

export interface CreateAuditData {
  type: 'CREATE';
  entityName: string;
  parentResourceName?: string;
  resourceName: string;
}

export interface UpdateAuditData {
  type: 'UPDATE';
  entityName: string;
  resourceName: string;
  parentResourceName?: string;
  diff: [Record<string, unknown>, Record<string, unknown>];
}

export interface DeleteAuditData {
  type: 'DELETE';
  entityName: string;
  parentResourceName?: string;
  resourceName: string;
}

export interface AuditCustomData {
  type: 'CUSTOM';
  action: string;
  entityName: string;
  resourceName: string;
  parentResourceName?: string;
}

export type AuditData =
  | CreateAuditData
  | UpdateAuditData
  | DeleteAuditData
  | AuditCustomData;

export class AuditEntity extends BaseEntity<AuditEntity, 'id'> {
  id!: number;
  user?: UserEntity;
  createdAt!: Date;
  data!: AuditData;
  resourceId!: string;
}

export const auditSchema = new EntitySchema({
  class: AuditEntity,
  extends: 'BaseEntity',
  tableName: 'audit',
  properties: {
    id: { type: 'number', primary: true },
    user: {
      reference: 'm:1',
      entity: () => UserEntity,
      nullable: true,
    },
    createdAt: { type: Date, onCreate: () => new Date() },
    data: { type: JsonType },
    resourceId: { type: 'string' },
  },
});
