import { AmmoService } from '@content-manager/ammo/services/AmmoService';
import Dataloader from 'dataloader';
import { AmmoEntity } from '../entities/AmmoEntity';

export class AmmoLoader {
  constructor(private ammoService: AmmoService) {}

  createCombinedAmmoLoader = (): Dataloader<string, AmmoEntity[], string> =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.ammoService.findCombinedAmmoByAmmoIds(ids as string[]),
    );
}
