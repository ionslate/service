import { AmmoService } from '@content/ammo/services/AmmoService';
import Dataloader from 'dataloader';

export class AmmoLoader {
  constructor(private ammoService: AmmoService) {}

  combinedAmmoLoader = new Dataloader((ids: Readonly<string[]>) =>
    this.ammoService.findCombinedAmmoByAmmoIds(ids as string[]),
  );
}
