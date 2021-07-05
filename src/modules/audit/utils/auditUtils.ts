import capitalize from 'lodash/capitalize';
import { Audit } from '@root/__generatedTypes__';
import { AuditData, AuditEntity } from '@audit/entities/AuditEntity';
import {
  auditIsCreate,
  auditIsUpdate,
  auditIsDelete,
} from '@audit/utils/auditTypeGuards';
import { buildAuditUpdateFields } from '@audit/utils/buildAuditUpdateFields';

export function getAction(data: AuditData): string {
  if (auditIsCreate(data)) {
    return 'created';
  }

  if (auditIsUpdate(data)) {
    return 'updated';
  }

  if (auditIsDelete(data)) {
    return 'deleted';
  }

  return data.action;
}

export function buildAudit(auditEntity: AuditEntity): Audit {
  const auditData = auditEntity.data;

  console.log(auditEntity.toJSON());

  return {
    id: `${auditEntity.id}`,
    performedBy: auditEntity.user?.username || 'SYSTEM',
    performedAt: auditEntity.createdAt.toLocaleDateString('en-US', {
      timeZone: 'UTC',
    }),
    action: getAction(auditData),
    resource: capitalize(auditData.entityName.replace('Entity', '')),
    resourceName: auditData.resourceName,
    parentResourceName: auditData.parentResourceName,
    auditFields: buildAuditUpdateFields(auditEntity),
  };
}
