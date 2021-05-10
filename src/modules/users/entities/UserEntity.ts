import {
  ArrayType,
  BaseEntity,
  BigIntType,
  EntitySchema,
  ReferenceType,
} from '@mikro-orm/core';
import { UserRole } from '@root/__generatedTypes__';
import { v4 as uuid } from 'uuid';

export class UserEntity extends BaseEntity<UserEntity, 'id'> {
  id!: string;
  username!: string;
  password?: string;
  email!: string;
  roles: UserRole[] = ['USER'];
  active = true;
  reset: PasswordReset = new PasswordReset();
}

export const userSchema = new EntitySchema({
  class: UserEntity,
  extends: 'BaseEntity',
  tableName: 'app_user',
  properties: {
    id: { type: 'string', onCreate: () => uuid(), primary: true },
    username: { type: 'string', unique: true, index: true },
    password: { type: 'string', hidden: true, nullable: true },
    email: { type: 'string', unique: true, index: true },
    roles: { type: ArrayType, default: ['USER'] },
    active: { type: 'boolean', default: true, hidden: true },
    reset: {
      entity: () => PasswordReset,
      reference: ReferenceType.EMBEDDED,
      hidden: true,
    },
  },
  indexes: [
    { properties: ['id', 'active'] },
    { properties: ['username', 'active'] },
    { properties: ['email', 'active'] },
  ],
});

export class PasswordReset {
  resetId?: string;
  resetExpiration?: string;
}

export const passwordResetSchema = new EntitySchema({
  class: PasswordReset,
  properties: {
    resetId: { type: 'string', nullable: true, index: true },
    resetExpiration: { type: BigIntType, nullable: true },
  },
  embeddable: true,
});
