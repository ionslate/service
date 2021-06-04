import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { HackingDeviceRequest, Search } from '@root/__generatedTypes__';
import { AuditService } from '@audit/services/AuditService';

export class HackingDeviceService {
  constructor(
    private hackingDeviceRepository: EntityRepository<HackingDeviceEntity>,
    private hackingProgramRepository: EntityRepository<HackingProgramEntity>,
    private auditService: AuditService,
  ) {}

  async createHackingDevice(
    request: HackingDeviceRequest,
  ): Promise<HackingDeviceEntity> {
    const hackingDeviceEntity = this.hackingDeviceRepository.create({
      name: request.name,
      link: request.link,
    });

    const hackingProgramEntities = await this.hackingProgramRepository.find({
      id: { $in: request.programIds },
    });

    hackingDeviceEntity.programs.add(...hackingProgramEntities);

    await this.hackingProgramRepository.persistAndFlush(hackingDeviceEntity);

    await this.auditService.addCreateAudit({
      entityName: HackingDeviceEntity.name,
      resourceName: hackingDeviceEntity.name,
    });

    return hackingDeviceEntity;
  }

  async updateHackingDevice(
    hackingDeviceId: string,
    request: HackingDeviceRequest,
  ): Promise<HackingDeviceEntity> {
    const hackingDeviceEntity = await this.hackingDeviceRepository.findOneOrFail(
      { id: hackingDeviceId },
    );
    await hackingDeviceEntity.programs.init();

    const originalHackingDevice = hackingDeviceEntity.toPOJO();

    hackingDeviceEntity.assign({
      name: request.name,
      link: request.link,
    });

    hackingDeviceEntity.programs.removeAll();

    const hackingProgramEntities = await this.hackingProgramRepository.find({
      id: { $in: request.programIds },
    });

    hackingDeviceEntity.programs.add(...hackingProgramEntities);

    await this.hackingProgramRepository.persistAndFlush(hackingDeviceEntity);

    await this.auditService.addUpdateAudit({
      entityName: HackingDeviceEntity.name,
      resourceName: hackingDeviceEntity.name,
      originalValue: originalHackingDevice,
      newValue: hackingDeviceEntity.toPOJO(),
    });

    return hackingDeviceEntity;
  }

  async findHackingDeviceById(
    hackingDeviceId: string,
  ): Promise<HackingDeviceEntity> {
    return await this.hackingDeviceRepository.findOneOrFail({
      id: hackingDeviceId,
    });
  }

  async getHackingDevicesList(
    search?: Search,
    page?: number,
    limit?: number,
  ): Promise<Page<HackingDeviceEntity>> {
    const [
      hackingDeviceEntities,
      count,
    ] = await this.hackingDeviceRepository.findAndCount(
      search ? { name: { $ilike: `%${search.name}%` } } : {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(hackingDeviceEntities, count, page, limit);
  }
}
