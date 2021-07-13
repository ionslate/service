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
  resourceId: string;
  resourceName: string;
  parentResourceName?: string;
  data: Record<string, unknown>;
}

interface DeleteAuditArgs {
  entityName: string;
  resourceId: string;
  resourceName: string;
  parentResourceName?: string;
}

interface UpdateAuditArgs {
  entityName: string;
  resourceName: string;
  resourceId: string;
  parentResourceName?: string;
  originalValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
}

interface CustomAuditArgs {
  action: string;
  entityName: string;
  resourceId: string;
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
    resourceId,
    resourceName,
    parentResourceName,
    data,
  }: CreateAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      resourceId,
      data: {
        type: 'CREATE',
        entityName,
        resourceName,
        parentResourceName,
        data,
      },
    });

    await this.auditRepository.persistAndFlush(auditEntity);
  }

  async addUpdateAudit({
    entityName,
    resourceId,
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
        resourceId,
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
    resourceId,
    resourceName,
    parentResourceName,
  }: DeleteAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      resourceId,
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
    resourceId,
    resourceName,
    parentResourceName,
  }: CustomAuditArgs): Promise<void> {
    const { user } = getAppContext();
    const userEntity = await this.userRepository.findOne({ id: user?.id });

    const auditEntity = this.auditRepository.create({
      user: userEntity,
      resourceId,
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
