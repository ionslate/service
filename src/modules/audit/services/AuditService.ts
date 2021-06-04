import { EntityRepository } from '@mikro-orm/postgresql';
import { difference } from '@root/utils';
import { UserEntity } from '@users/entities/UserEntity';
import { AuditEntity } from '@audit/entities/AuditEntity';
import isEqual from 'lodash/isEqual';
import { getAppContext } from '@root/appContext';

interface CreateAuditArgs {
  entityName: string;
  resourceName: string;
  parentResourceName?: string;
}

interface DeleteAuditArgs {
  entityName: string;
  resourceName: string;
  parentResourceName?: string;
}

interface UpdateAuditArgs {
  entityName: string;
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
  }: CreateAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

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
  }: UpdateAuditArgs): Promise<void> {
    const originalDiff = difference(originalValue, newValue);
    const newDiff = difference(newValue, originalValue);

    if (!isEqual(originalDiff, newDiff)) {
      const { user } = getAppContext();
      const userEntity = await this.userRepository.findOne({ id: user?.id });

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
  }: DeleteAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

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

  async addAuditMessage(message: string): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

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
