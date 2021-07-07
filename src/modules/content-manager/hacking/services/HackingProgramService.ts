import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { LoadStrategy, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { HackingProgramRequest, Search } from '@root/__generatedTypes__';
import { AuditService } from '@audit/services/AuditService';

export class HackingProgramService {
  constructor(
    private hackingProgramRepository: EntityRepository<HackingProgramEntity>,
    private auditService: AuditService,
  ) {}

  async createHackingProgram(
    request: HackingProgramRequest,
  ): Promise<HackingProgramEntity> {
    const hackingProgramEntity = this.hackingProgramRepository.create({
      name: request.name,
      link: request.link,
      attackMod: request.attackMod,
      opponentMod: request.opponentMod,
      damage: request.damage,
      burst: request.burst,
      target: request.target,
      skillType: request.skillType,
      special: request.special,
    });

    await this.hackingProgramRepository.persistAndFlush(hackingProgramEntity);

    await this.auditService.addCreateAudit({
      entityName: HackingProgramEntity.name,
      resourceId: hackingProgramEntity.id,
      resourceName: hackingProgramEntity.name,
    });

    return hackingProgramEntity;
  }

  async updateHackingProgram(
    hackingDeviceId: string,
    request: HackingProgramRequest,
  ): Promise<HackingProgramEntity> {
    const hackingProgramEntity = await this.hackingProgramRepository.findOneOrFail(
      { id: hackingDeviceId },
    );
    const originalHackingProgram = hackingProgramEntity.toPOJO();

    hackingProgramEntity.assign({
      name: request.name,
      link: request.link,
      attackMod: request.attackMod,
      opponentMod: request.opponentMod,
      damage: request.damage,
      burst: request.burst,
      target: request.target,
      skillType: request.skillType,
      special: request.special,
    });

    await this.hackingProgramRepository.persistAndFlush(hackingProgramEntity);

    await this.auditService.addUpdateAudit({
      entityName: HackingProgramEntity.name,
      resourceId: hackingProgramEntity.id,
      resourceName: hackingProgramEntity.name,
      originalValue: originalHackingProgram,
      newValue: hackingProgramEntity.toPOJO(),
    });

    return hackingProgramEntity;
  }

  async findHackingProgramById(
    hackingProgramId: string,
  ): Promise<HackingProgramEntity> {
    return await this.hackingProgramRepository.findOneOrFail({
      id: hackingProgramId,
    });
  }

  async getHackingProgramsList(
    search?: Search,
    page?: number,
    limit?: number,
  ): Promise<Page<HackingProgramEntity>> {
    const [
      hackingProgramEntities,
      count,
    ] = await this.hackingProgramRepository.findAndCount(
      search ? { name: { $ilike: `%${search.name}%` } } : {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(hackingProgramEntities, count, page, limit);
  }

  async getHackingProgramsByHackingDeviceIds(
    hackingDeviceIds: string[],
  ): Promise<HackingProgramEntity[][]> {
    const hackingProgramEntities = await this.hackingProgramRepository.find(
      {
        devices: { id: { $in: hackingDeviceIds } },
      },
      {
        populate: { devices: true },
        orderBy: { name: QueryOrder.ASC },
        strategy: LoadStrategy.JOINED,
      },
    );

    return hackingDeviceIds.map((deviceId) =>
      hackingProgramEntities.filter((program) =>
        program.devices.getIdentifiers('id').includes(deviceId),
      ),
    );
  }
}
