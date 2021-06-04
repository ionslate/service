import { EntityRepository } from '@mikro-orm/postgresql';
import { difference } from '@root/utils';
import { UserEntity } from '../../users/entities/UserEntity';
import { AuditEntity } from '../entities/AuditEntity';
import isEqual from 'lodash/isEqual';

interface CreateAuditArgs {
  entityName: string;
  userId?: string;
  resourceName: string;
  parentResourceName?: string;
}

interface DeleteAuditArgs {
  entityName: string;
  userId?: string;
  resourceName: string;
  parentResourceName?: string;
}

interface UpdateAuditArgs {
  entityName: string;
  userId?: string;
  resourceName: string;
  parentResourceName?: string;
  originalValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
}

export class AuditService {
  constructor(
    private auditRepository: EntityRepository<AuditEntity>,
    private userRepository: EntityRepository<UserEntity>,
  ) {}

  async addCreateAudit({
    entityName,
    resourceName,
    parentResourceName,
    userId,
  }: CreateAuditArgs): Promise<void> {
    const userEntity = await this.userRepository.findOne({ id: userId });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      data: {
        action: 'CREATE',
        entityName,
        resourceName,
        parentResourceName,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }

  async addUpdateAudit({
    entityName,
    resourceName,
    parentResourceName,
    originalValue,
    newValue,
    userId,
  }: UpdateAuditArgs): Promise<void> {
    const originalDiff = difference(originalValue, newValue);
    const newDiff = difference(newValue, originalValue);

    if (!isEqual(originalDiff, newDiff)) {
      const userEntity = await this.userRepository.findOne({ id: userId });

      const auditEntity = this.auditRepository.create({
        user: userEntity,
        data: {
          action: 'UPDATE',
          entityName,
          resourceName,
          parentResourceName,
          diff: [originalDiff, newDiff],
        },
      });

      await this.auditRepository.persistAndFlush(auditEntity);
    }
  }

  async addDeleteAudit({
    entityName,
    resourceName,
    parentResourceName,
    userId,
  }: DeleteAuditArgs): Promise<void> {
    const userEntity = await this.userRepository.findOne({ id: userId });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      data: {
        action: 'DELETE',
        entityName,
        resourceName,
        parentResourceName,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }

  async addAuditMessage(message: string, userId?: string): Promise<void> {
    const userEntity = await this.userRepository.findOne({ id: userId });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      data: {
        action: 'MESSAGE',
        message,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }
}
