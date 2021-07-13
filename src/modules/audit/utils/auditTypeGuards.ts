import {
  AuditCustomData,
  AuditData,
  CreateAuditData,
  DeleteAuditData,
  UpdateAuditData,
} from '@audit/entities/AuditEntity';

export function auditIsCreate(data: AuditData): data is CreateAuditData {
  return data.type === 'CREATE';
}

export function auditIsUpdate(data: AuditData): data is UpdateAuditData {
  return data.type === 'UPDATE';
}

export function auditIsDelete(data: AuditData): data is DeleteAuditData {
  return data.type === 'DELETE';
}

export function auditIsCustom(data: AuditData): data is AuditCustomData {
  return data.type === 'CUSTOM';
}
