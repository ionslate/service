import { EntityRepository } from '@mikro-orm/postgresql';
import { AmmoRequest, Search } from '@root/__generatedTypes__';
import { AmmoEntity } from '@root/content-manager/weapons/entities/AmmoEntity';
import { Page, paginateEntites } from '@root/utils';
import { QueryOrder } from '@mikro-orm/core';

export class AmmoService {
  constructor(private ammoRepository: EntityRepository<AmmoEntity>) {}

  async createAmmo(request: AmmoRequest): Promise<AmmoEntity> {
    const ammoEntity = this.ammoRepository.create({
      name: request.name,
      link: request.link,
    });

    await this.addCombinedAmmo(request.combinedAmmoIds, ammoEntity);

    await this.ammoRepository.persistAndFlush(ammoEntity);

    return ammoEntity;
  }

  async updateAmmo(ammoId: string, request: AmmoRequest): Promise<AmmoEntity> {
    const ammoEntity = await this.ammoRepository.findOneOrFail({ id: ammoId });

    ammoEntity.assign({
      name: request.name,
      link: request.link,
    });

    await ammoEntity.combinedAmmo.init();

    ammoEntity.combinedAmmo.removeAll();

    await this.addCombinedAmmo(request.combinedAmmoIds, ammoEntity);

    await this.ammoRepository.persistAndFlush(ammoEntity);

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
        offset: page,
      },
    );

    return paginateEntites(ammoEntities, count, page, limit);
  }

  async getCombinedAmmoByAmmoIds(ammoIds: string[]): Promise<AmmoEntity[][]> {
    const combinedAmmoEntities = await this.ammoRepository.find(
      {
        parentAmmo: { id: { $in: ammoIds } },
      },
      ['parentAmmo'],
    );

    return ammoIds.map((ammoId) =>
      combinedAmmoEntities.filter((childAmmo) =>
        childAmmo.parentAmmo.getIdentifiers('id').includes(ammoId),
      ),
    );
  }
}
