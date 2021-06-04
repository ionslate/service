import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponEntity } from '@content-manager/weapons/entities/WeaponEntity';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { LoadStrategy, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import {
  Search,
  WeaponModeRequest,
  WeaponRequest,
} from '@root/__generatedTypes__';
import groupBy from 'lodash/groupBy';
import { AuditService } from '@audit/services/AuditService';

export class WeaponService {
  constructor(
    private weaponRepository: EntityRepository<WeaponEntity>,
    private weaponModeRepository: EntityRepository<WeaponModeEntity>,
    private ammoRepository: EntityRepository<AmmoEntity>,
    private ruleRepository: EntityRepository<RuleEntity>,
    private auditService: AuditService,
  ) {}

  async createWeapon(request: WeaponRequest): Promise<WeaponEntity> {
    const weaponEntity = this.weaponRepository.create({
      name: request.name,
      link: request.link,
    });

    await this.weaponRepository.persistAndFlush(weaponEntity);

    await this.auditService.addCreateAudit({
      entityName: WeaponEntity.name,
      resourceName: weaponEntity.name,
    });

    return weaponEntity;
  }

  async createWeaponMode(
    weaponId: string,
    request: WeaponModeRequest,
  ): Promise<WeaponModeEntity> {
    const weaponEntity = await this.weaponRepository.findOneOrFail({
      id: weaponId,
    });
    const ammoEntities = await this.ammoRepository.find({
      id: { $in: request.ammoIds },
    });
    const traitEntities = await this.ruleRepository.find(
      { id: { $in: request.traitIds } },
      { orderBy: { name: QueryOrder.ASC } },
    );

    const weaponModeEntity = this.weaponModeRepository
      .create({
        name: request.name,
        damage: request.damage,
        burst: request.burst,
        savingAttribute: request.savingAttribute,
        ammo: ammoEntities,
        traits: traitEntities,
      })
      .assign(
        {
          range: {
            _8: request.range._8,
            _16: request.range._16,
            _24: request.range._24,
            _32: request.range._32,
            _40: request.range._40,
            _48: request.range._48,
            _96: request.range._96,
          },
        },
        { mergeObjects: true },
      );

    weaponEntity.modes.add(weaponModeEntity);

    await this.weaponRepository.persistAndFlush(weaponModeEntity);

    await this.auditService.addCreateAudit({
      entityName: WeaponModeEntity.name,
      resourceName: weaponModeEntity.name,
      parentResourceName: weaponEntity.name,
    });

    return weaponModeEntity;
  }

  async updateWeapon(
    weaponId: string,
    request: WeaponRequest,
  ): Promise<WeaponEntity> {
    const weaponEntity = await this.weaponRepository.findOneOrFail({
      id: weaponId,
    });
    const originalWeapon = weaponEntity.toPOJO();

    weaponEntity.assign({
      name: request.name,
      link: request.link,
    });

    await this.weaponRepository.persistAndFlush(weaponEntity);

    await this.auditService.addUpdateAudit({
      entityName: WeaponEntity.name,
      resourceName: weaponEntity.name,
      originalValue: originalWeapon,
      newValue: weaponEntity.toPOJO(),
    });

    return weaponEntity;
  }

  async updateWeaponMode(
    weaponId: string,
    weaponModeId: string,
    request: WeaponModeRequest,
  ): Promise<WeaponModeEntity> {
    const weaponModeEntity = await this.weaponModeRepository.findOneOrFail(
      {
        id: weaponModeId,
      },
      { weapon: true },
    );

    if (weaponModeEntity.weapon.id !== weaponId) {
      throw new ResourceNotFound('WeaponMode not found');
    }

    await weaponModeEntity.ammo.init();
    await weaponModeEntity.traits.init();
    const originalWeaponMode = weaponModeEntity.toPOJO();

    const ammoEntities = await this.ammoRepository.find({
      id: { $in: request.ammoIds },
    });
    const traitEntities = await this.ruleRepository.find(
      { id: { $in: request.traitIds } },
      { orderBy: { name: QueryOrder.ASC } },
    );

    weaponModeEntity.ammo.removeAll();
    weaponModeEntity.traits.removeAll();

    weaponModeEntity.assign({
      name: request.name,
      range: {
        _8: request.range._8,
        _16: request.range._16,
        _24: request.range._24,
        _32: request.range._32,
        _40: request.range._40,
        _48: request.range._48,
        _96: request.range._96,
      },
      damage: request.damage,
      burst: request.burst,
      savingAttribute: request.savingAttribute,
      ammo: ammoEntities,
      traits: traitEntities,
    });

    await this.weaponModeRepository.persistAndFlush(weaponModeEntity);

    await this.auditService.addUpdateAudit({
      entityName: WeaponModeEntity.name,
      resourceName: weaponModeEntity.name,
      parentResourceName: weaponModeEntity.weapon.name,
      originalValue: originalWeaponMode,
      newValue: weaponModeEntity.toPOJO(),
    });

    return weaponModeEntity;
  }

  async removeWeaponMode(
    weaponId: string,
    weaponModeId: string,
  ): Promise<string> {
    const weaponModeEntity = await this.weaponModeRepository.findOneOrFail(
      {
        id: weaponModeId,
      },
      { weapon: true },
    );

    if (weaponModeEntity.weapon.id !== weaponId) {
      throw new ResourceNotFound('WeaponMode not found');
    }

    await this.weaponModeRepository.removeAndFlush(weaponModeEntity);

    this.auditService.addDeleteAudit({
      entityName: WeaponModeEntity.name,
      resourceName: weaponModeEntity.name,
      parentResourceName: weaponModeEntity.weapon.name,
    });

    return weaponModeId;
  }

  async findWeaponById(weaponId: string): Promise<WeaponEntity> {
    return await this.weaponRepository.findOneOrFail({ id: weaponId });
  }

  async getWeaponsList(
    search?: Search,
    page?: number,
    limit?: number,
  ): Promise<Page<WeaponEntity>> {
    const [weaponEntities, count] = await this.weaponRepository.findAndCount(
      search ? { name: { $ilike: `%${search.name}%` } } : {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(weaponEntities, count, page, limit);
  }

  async getWeaponModesByWeaponIds(
    weaponIds: string[],
  ): Promise<WeaponModeEntity[][]> {
    const weaponModeEntities = await this.weaponModeRepository.find(
      {
        weapon: { id: { $in: weaponIds } },
      },
      { orderBy: { name: QueryOrder.ASC } },
    );

    const weaponModeWeaponIdMap = groupBy(
      weaponModeEntities,
      (weaponModeEntity) => weaponModeEntity.weapon.id,
    );

    return weaponIds.map((weaponId) => weaponModeWeaponIdMap[weaponId] || []);
  }

  async getAmmoByWeaponModeIds(
    weaponModeIds: string[],
  ): Promise<AmmoEntity[][]> {
    const ammoEntities = await this.ammoRepository.find(
      {
        weaponModes: { id: { $in: weaponModeIds } },
      },
      { populate: { weaponModes: true }, strategy: LoadStrategy.JOINED },
    );

    return weaponModeIds.map((weaponModeId) =>
      ammoEntities.filter((ammo) =>
        ammo.weaponModes.getIdentifiers('id').includes(weaponModeId),
      ),
    );
  }

  async getTraitsByWeaponModeIds(
    weaponModeIds: string[],
  ): Promise<RuleEntity[][]> {
    const ruleEntities = await this.ruleRepository.find(
      {
        weaponModes: { id: { $in: weaponModeIds } },
      },
      { populate: { weaponModes: true }, strategy: LoadStrategy.JOINED },
    );

    return weaponModeIds.map((weaponModeId) =>
      ruleEntities.filter((rule) =>
        rule.weaponModes.getIdentifiers('id').includes(weaponModeId),
      ),
    );
  }
}
