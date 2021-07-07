import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { LoadStrategy, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { AmmoRequest, Search } from '@root/__generatedTypes__';
import { AuditService } from '@audit/services/AuditService';

export class AmmoService {
  constructor(
    private ammoRepository: EntityRepository<AmmoEntity>,
    private auditService: AuditService,
  ) {}

  async createAmmo(request: AmmoRequest): Promise<AmmoEntity> {
    const ammoEntity = this.ammoRepository.create({
      name: request.name,
      link: request.link,
    });

    await this.addCombinedAmmo(request.combinedAmmoIds, ammoEntity);

    await this.ammoRepository.persistAndFlush(ammoEntity);

    await this.auditService.addCreateAudit({
      entityName: AmmoEntity.name,
      resourceId: ammoEntity.id,
      resourceName: ammoEntity.name,
    });

    return ammoEntity;
  }

  async updateAmmo(ammoId: string, request: AmmoRequest): Promise<AmmoEntity> {
    const ammoEntity = await this.ammoRepository.findOneOrFail({ id: ammoId });
    await ammoEntity.combinedAmmo.init();
    const originalAmmo = ammoEntity.toPOJO();

    ammoEntity.assign({
      name: request.name,
      link: request.link,
    });

    ammoEntity.combinedAmmo.removeAll();

    await this.addCombinedAmmo(request.combinedAmmoIds, ammoEntity);

    await this.ammoRepository.persistAndFlush(ammoEntity);

    await this.auditService.addUpdateAudit({
      entityName: AmmoEntity.name,
      resourceId: ammoEntity.id,
      resourceName: originalAmmo.name,
      originalValue: originalAmmo,
      newValue: ammoEntity.toPOJO(),
    });

    return ammoEntity;
  }

  private async addCombinedAmmo(
    combinedAmmoIds: string[],
    ammoEntity: AmmoEntity,
  ): Promise<void> {
    const combinedAmmoEntities = await this.ammoRepository.find({
      id: { $in: combinedAmmoIds },
    });

    ammoEntity.combinedAmmo.add(...combinedAmmoEntities);
  }

  async findAmmoById(ammoId: string): Promise<AmmoEntity> {
    return await this.ammoRepository.findOneOrFail({ id: ammoId });
  }

  async getAmmoList(
    search?: Search,
    page?: number,
    limit?: number,
  ): Promise<Page<AmmoEntity>> {
    const [ammoEntities, count] = await this.ammoRepository.findAndCount(
      search ? { name: { $ilike: `%${search.name}%` } } : {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(ammoEntities, count, page, limit);
  }

  async getCombinedAmmoByAmmoIds(ammoIds: string[]): Promise<AmmoEntity[][]> {
    const combinedAmmoEntities = await this.ammoRepository.find(
      {
        parentAmmo: { id: { $in: ammoIds } },
      },
      {
        populate: {
          parentAmmo: true,
        },
        strategy: LoadStrategy.JOINED,
      },
    );

    return ammoIds.map((ammoId) =>
      combinedAmmoEntities.filter((childAmmo) =>
        childAmmo.parentAmmo.getIdentifiers('id').includes(ammoId),
      ),
    );
  }
}
