import { EntityRepository } from '@mikro-orm/postgresql';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';

export class HackingDeviceService {
  constructor(
    private hackingDeviceRepository: EntityRepository<HackingDeviceEntity>,
    private hackingProgramRepository: EntityRepository<HackingProgramEntity>,
  ) {}
}
