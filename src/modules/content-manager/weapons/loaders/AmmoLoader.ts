import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { AmmoService } from '@content-manager/weapons/services/AmmoService';
import Dataloader from 'dataloader';

export class AmmoLoader {
  constructor(private ammoService: AmmoService) {}

  createCombinedAmmoLoader = (): Dataloader<string, AmmoEntity[], string> =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.ammoService.getCombinedAmmoByAmmoIds(ids as string[]),
    );
}
