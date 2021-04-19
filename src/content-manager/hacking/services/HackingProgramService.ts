import { EntityRepository } from '@mikro-orm/postgresql';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';

export class HackingProgramService {
  constructor(
    private hackingProgramRepository: EntityRepository<HackingProgramEntity>,
  ) {}
}
