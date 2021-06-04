import { BaseEntity, DateType, EntitySchema, JsonType } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { UserEntity } from '../../users/entities/UserEntity';

interface CreateAuditData {
  action: 'CREATE';
  enitityName: string;
  parentResourceName?: string;
  resourceName: string;
}

interface UpdateAuditData {
  action: 'UPDATE';
  enitityName: string;
  resourceName: string;
  parentResourceName?: string;
  diff: [Record<string, unknown>, Record<string, unknown>];
}

interface DeleteAuditData {
  action: 'DELETE';
  enitityName: string;
  parentResourceName?: string;
  resourceName: string;
}

interface AuditMessageData {
  action: 'MESSAGE';
  message: string;
}

type AuditData =
  | CreateAuditData
  | UpdateAuditData
  | DeleteAuditData
  | AuditMessageData;

export class AuditEntity extends BaseEntity<AuditEntity, 'id'> {
  id!: string;
  user?: UserEntity;
  createdAt!: Date;
  data!: AuditData;
}

export const auditSchema = new EntitySchema({
  class: AuditEntity,
  extends: 'BaseEntity',
  tableName: 'audit',
  properties: {
    id: { type: 'string', onCreate: () => uuid(), primary: true },
    user: {
      reference: 'm:1',
      entity: () => UserEntity,
      nullable: true,
    },
    createdAt: { type: DateType, onCreate: () => new Date() },
    data: { type: JsonType },
  },
});
