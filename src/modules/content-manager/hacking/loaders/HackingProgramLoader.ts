import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import Dataloader from 'dataloader';

export class HackingProgramLoader {
  constructor(private hackingProgramService: HackingProgramService) {}

  createHackingProgramLoader = (): Dataloader<
    string,
    HackingProgramEntity[],
    string
  > =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.hackingProgramService.getHackingProgramsByHackingDeviceIds(
        ids as string[],
      ),
    );
}
