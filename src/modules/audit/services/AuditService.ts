import { AuditEntity } from '@audit/entities/AuditEntity';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { getAppContext } from '@root/appContext';
import { difference, Page, paginateEntites } from '@root/utils';
import { Audit } from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import isEqual from 'lodash/isEqual';
import { buildAudit } from '@audit/utils/auditUtils';

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

interface CustomAuditArgs {
  action: string;
  entityName: string;
  resourceName: string;
  parentResourceName?: string;
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
        type: 'CREATE',
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
          type: 'UPDATE',
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
        type: 'DELETE',
        entityName,
        resourceName,
        parentResourceName,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }

  async addCustomAudit({
    action,
    entityName,
    resourceName,
    parentResourceName,
  }: CustomAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      data: {
        type: 'CUSTOM',
        action,
        entityName,
        resourceName,
        parentResourceName,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }

  async getAuditList(page?: number, limit?: number): Promise<Page<Audit>> {
    const [auditEntities, count] = await this.auditRepository.findAndCount(
      {},
      {
        populate: { user: true },
        orderBy: { id: QueryOrder.DESC, createdAt: QueryOrder.DESC },
        limit,
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(auditEntities.map(buildAudit), count, page, limit);
  }
}