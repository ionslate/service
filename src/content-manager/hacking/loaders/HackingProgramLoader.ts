import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import Dataloader from 'dataloader';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';

export class HackingProgramLoader {
  constructor(private hackingProgramService: HackingProgramService) {}

  createHackingProgramLoader = (): Dataloader<
    string,
    HackingProgramEntity[],
    string
  > =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.hackingProgramService.findHackingProgramsByHackingDeviceIds(
        ids as string[],
      ),
    );
}