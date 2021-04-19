import { EntityRepository } from '@mikro-orm/postgresql';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingProgramRequest } from '@root/__generatedTypes__';
import { Page, paginateEntites } from '@root/utils';
import { QueryOrder } from '@mikro-orm/core';

export class HackingProgramService {
  constructor(
    private hackingProgramRepository: EntityRepository<HackingProgramEntity>,
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

    return hackingProgramEntity;
  }

  async updateHackingProgram(
    hackingDeviceId: string,
    request: HackingProgramRequest,
  ): Promise<HackingProgramEntity> {
    const hackingProgramEntity = await this.hackingProgramRepository.findOneOrFail(
      { id: hackingDeviceId },
    );

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

    return hackingProgramEntity;
  }

  async findHackingProgramById(
    hackingProgramId: string,
  ): Promise<HackingProgramEntity | null> {
    return await this.hackingProgramRepository.findOne({
      id: hackingProgramId,
    });
  }

  async findHackingProgramByName(
    name: string,
    page?: number,
    limit?: number,
  ): Promise<Page<HackingProgramEntity>> {
    const [
      hackingProgramEntities,
      count,
    ] = await this.hackingProgramRepository.findAndCount(
      { name: { $ilike: `%${name}%` } },
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(hackingProgramEntities, count, page, limit);
  }

  async findAllHackingPrograms(
    page?: number,
    limit?: number,
  ): Promise<Page<HackingProgramEntity>> {
    const [
      hackingProgramEntities,
      count,
    ] = await this.hackingProgramRepository.findAndCount(
      {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(hackingProgramEntities, count, page, limit);
  }

  async findHackingProgramsByHackingDeviceIds(
    hackingDeviceIds: string[],
  ): Promise<HackingProgramEntity[][]> {
    const hackingProgramEntities = await this.hackingProgramRepository.find(
      {
        devices: { id: { $in: hackingDeviceIds } },
      },
      { populate: ['devices'], orderBy: { name: QueryOrder.ASC } },
    );

    return hackingDeviceIds.map((deviceId) =>
      hackingProgramEntities.filter((program) =>
        program.devices.getIdentifiers('id').includes(deviceId),
      ),
    );
  }
}
