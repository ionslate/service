import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { WeaponService } from '@content-manager/weapons/services/WeaponService';
import Dataloader from 'dataloader';

export class WeaponLoader {
  constructor(private weaponService: WeaponService) {}

  createWeaponModesLoader = (): Dataloader<
    string,
    WeaponModeEntity[],
    string
  > =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.weaponService.getWeaponModesByWeaponIds(ids as string[]),
    );

  createAmmoLoader = (): Dataloader<string, AmmoEntity[], string> =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.weaponService.getAmmoByWeaponModeIds(ids as string[]),
    );

  createTraitsLoader = (): Dataloader<string, RuleEntity[], string> =>
    new Dataloader((ids: Readonly<string[]>) =>
      this.weaponService.getTraitsByWeaponModeIds(ids as string[]),
    );
}
