import { AuditField } from '@root/__generatedTypes__';
import { AuditEntity, UpdateAuditData } from '@audit/entities/AuditEntity';
import { auditIsUpdate } from '@audit/utils/auditTypeGuards';
import { UserEntity } from '@users/entities/UserEntity';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export function buildAuditUpdateFields(
  auditEntity: AuditEntity,
): AuditField[] | null {
  if (!auditIsUpdate(auditEntity.data)) {
    return null;
  }

  if (auditEntity.data.entityName === UserEntity.name) {
    return buildUserEntityAuditFields(auditEntity.data.diff);
  }

  return [];
}

function buildUserEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<UserEntity>,
    RecursivePartial<UserEntity>,
  ];

  if (oldValues.username || newValues.username) {
    auditFields.push({
      fieldName: 'username',
      oldValue: oldValues.username,
      newValue: newValues.username,
    });
  }

  if (oldValues.email || newValues.email) {
    auditFields.push({
      fieldName: 'email',
      oldValue: oldValues.email,
      newValue: newValues.email,
    });
  }

  if (oldValues.roles || newValues.roles) {
    auditFields.push({
      fieldName: 'roles',
      oldValue: oldValues.roles
        ?.map((role) => lowerCase(role).split(' ').map(capitalize).join(' '))
        .join(', '),
      newValue: newValues.roles
        ?.map((role) => lowerCase(role).split(' ').map(capitalize).join(' '))
        .join(', '),
    });
  }

  return auditFields;
}
