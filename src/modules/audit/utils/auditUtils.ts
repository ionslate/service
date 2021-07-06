import capitalize from 'lodash/capitalize';
import { Audit } from '@root/__generatedTypes__';
import { AuditData, AuditEntity } from '@audit/entities/AuditEntity';
import {
  auditIsCreate,
  auditIsUpdate,
  auditIsDelete,
} from '@audit/utils/auditTypeGuards';
import { buildAuditUpdateFields } from '@audit/utils/buildAuditUpdateFields';
import isBefore from 'date-fns/isBefore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

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
  const datePerformed = auditEntity.createdAt;
  const oneWeekAgo = addDays(new Date(), -7);

  const performedAt = isBefore(oneWeekAgo, datePerformed)
    ? formatDistanceToNow(datePerformed, { addSuffix: true })
    : format(datePerformed, 'MM/dd/yyyy');

  return {
    id: `${auditEntity.id}`,
    performedBy: auditEntity.user?.username || 'SYSTEM',
    performedAt,
    action: getAction(auditEntity.data),
    resource: capitalize(auditEntity.data.entityName.replace('Entity', '')),
    resourceName: auditEntity.data.resourceName,
    parentResourceName: auditEntity.data.parentResourceName,
    auditFields: buildAuditUpdateFields(auditEntity),
  };
}
