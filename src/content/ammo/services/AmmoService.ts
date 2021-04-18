import { EntityRepository } from '@mikro-orm/postgresql';
import { AmmoRequest } from '@root/__generatedTypes__';
import { AmmoEntity } from '@content/ammo/entities/AmmoEntity';
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
    const combinedAmmoEntities = await Promise.all(
      combinedAmmoIds.map((ammoId) =>
        this.ammoRepository.findOneOrFail({ id: ammoId }),
      ),
    );

    await Promise.all(
      combinedAmmoEntities.map((ammo) => ammoEntity.combinedAmmo.add(ammo)),
    );
  }

  async findAmmoById(ammoId: string): Promise<AmmoEntity | null> {
    return await this.ammoRepository.findOne({ id: ammoId });
  }

  async findAmmoByName(
    name: string,
    page?: number,
    limit?: number,
  ): Promise<Page<AmmoEntity>> {
    const [ruleEntities, count] = await this.ammoRepository.findAndCount(
      { name },
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(ruleEntities, count, page, limit);
  }

  async findAllAmmo(page?: number, limit?: number): Promise<Page<AmmoEntity>> {
    const ruleEntities = await this.ammoRepository.findAll({
      orderBy: { name: QueryOrder.ASC },
      limit,
      offset: page,
    });
    const count = await this.ammoRepository.count();

    return paginateEntites(ruleEntities, count, page, limit);
  }
}
