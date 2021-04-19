import { AmmoService } from '@root/content-manager/weapons/services/AmmoService';
import Dataloader from 'dataloader';
import { AmmoEntity } from '@root/content-manager/weapons/entities/AmmoEntity';

export class AmmoLoader {
  constructor(private ammoService: AmmoService) {}

  createCombinedAmmoLoader = (): Dataloader<string, AmmoEntity[], string> =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.ammoService.getCombinedAmmoByAmmoIds(ids as string[]),
    );
}
