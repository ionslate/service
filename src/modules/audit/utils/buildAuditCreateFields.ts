import { AuditEntity } from '@audit/entities/AuditEntity';
import { auditIsCreate } from '@audit/utils/auditTypeGuards';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponEntity } from '@content-manager/weapons/entities/WeaponEntity';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { AuditField } from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import capitalize from 'lodash/capitalize';
import lowerCase from 'lodash/lowerCase';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string | number | symbol, unknown>
    ? RecursivePartial<T[P]>
    : T[P];
};

export function buildAuditCreateFields(
  auditEntity: AuditEntity,
): AuditField[] | null {
  if (!auditIsCreate(auditEntity.data)) {
    return null;
  }

  const { entityName, data } = auditEntity.data;

  switch (entityName) {
    case UserEntity.name:
      return buildUserEntityAuditFields(data);
    case RuleEntity.name:
      return buildRuleEntityAuditFields(data);
    case AmmoEntity.name:
      return buildAmmoEntityAuditFields(data);
    case WeaponEntity.name:
      return buildWeaponEntityAuditFields(data);
    case WeaponModeEntity.name:
      return buildWeaponModeEntityAuditFields(data);
    case HackingProgramEntity.name:
      return buildHackingProgramEntityAuditFields(data);
    case HackingDeviceEntity.name:
      return buildHackingDeviceEntityAuditFields(data);
    default:
      return [];
  }
}

function buildUserEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const user = data as RecursivePartial<UserEntity>;

  auditFields.push({
    fieldName: 'username',
    newValue: user.username,
  });

  auditFields.push({
    fieldName: 'email',
    newValue: user.email,
  });

  auditFields.push({
    fieldName: 'roles',
    newValue: user.roles
      ?.map((role) => lowerCase(role).split(' ').map(capitalize).join(' '))
      .join(', '),
  });

  return auditFields;
}

function buildRuleEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const rule = data as RecursivePartial<RuleEntity>;

  auditFields.push({
    fieldName: 'name',
    newValue: rule.name,
  });

  if (rule.link) {
    auditFields.push({
      fieldName: 'link',
      newValue: rule.link,
    });
  }

  if (rule.type) {
    auditFields.push({
      fieldName: 'type',
      newValue: rule.type
        ? lowerCase(rule.type).split(' ').map(capitalize).join(' ')
        : undefined,
    });
  }

  return auditFields;
}

function buildAmmoEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const ammo = data as RecursivePartial<
    Omit<AmmoEntity, 'combinedAmmo'> & { combinedAmmo: AmmoEntity[] }
  >;

  auditFields.push({
    fieldName: 'name',
    newValue: ammo.name,
  });

  if (ammo.link) {
    auditFields.push({
      fieldName: 'link',
      newValue: ammo.link,
    });
  }

  if (ammo.combinedAmmo?.length) {
    auditFields.push({
      fieldName: 'combined ammo',
      newValue: ammo.combinedAmmo?.map((ammo) => ammo.name).join(', '),
    });
  }

  return auditFields;
}

function buildWeaponEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const weapon = data as RecursivePartial<
    Omit<WeaponEntity, 'modes'> & { modes: WeaponModeEntity[] }
  >;

  auditFields.push({
    fieldName: 'name',
    newValue: weapon.name,
  });

  if (weapon.link) {
    auditFields.push({
      fieldName: 'link',
      newValue: weapon.link,
    });
  }

  return auditFields;
}

function buildWeaponModeEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const weaponMode = data as RecursivePartial<
    Omit<WeaponModeEntity, 'ammo' | 'traits'> & {
      ammo: AmmoEntity[];
      traits: RuleEntity[];
    }
  >;

  auditFields.push({
    fieldName: 'name',
    newValue: weaponMode.name,
  });

  if (weaponMode.damage) {
    auditFields.push({
      fieldName: 'damage',
      newValue: weaponMode.damage,
    });
  }

  if (weaponMode.burst) {
    auditFields.push({
      fieldName: 'burst',
      newValue: weaponMode.burst,
    });
  }

  if (weaponMode.savingAttribute) {
    auditFields.push({
      fieldName: 'saving attribute',
      newValue: weaponMode.savingAttribute,
    });
  }

  if (weaponMode.range?._8) {
    auditFields.push({
      fieldName: '8" range',
      newValue: weaponMode.range?._8,
    });
  }

  if (weaponMode.range?._16) {
    auditFields.push({
      fieldName: '16" range',
      newValue: weaponMode.range?._16,
    });
  }

  if (weaponMode.range?._24) {
    auditFields.push({
      fieldName: '24" range',
      newValue: weaponMode.range?._24,
    });
  }

  if (weaponMode.range?._32) {
    auditFields.push({
      fieldName: '32" range',
      newValue: weaponMode.range?._32,
    });
  }

  if (weaponMode.range?._40) {
    auditFields.push({
      fieldName: '40" range',
      newValue: weaponMode.range?._40,
    });
  }

  if (weaponMode.range?._48) {
    auditFields.push({
      fieldName: '48" range',
      newValue: weaponMode.range?._48,
    });
  }

  if (weaponMode.range?._96) {
    auditFields.push({
      fieldName: '96" range',
      newValue: weaponMode.range?._96,
    });
  }

  if (weaponMode.ammo?.length) {
    auditFields.push({
      fieldName: 'ammo',
      newValue: weaponMode.ammo?.map((ammo) => ammo.name).join(', '),
    });
  }

  if (weaponMode.traits?.length) {
    auditFields.push({
      fieldName: 'traits',
      newValue: weaponMode.traits?.map((traits) => traits.name).join(', '),
    });
  }

  return auditFields;
}

function buildHackingProgramEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const hackingProgram = data as RecursivePartial<HackingProgramEntity>;

  auditFields.push({
    fieldName: 'name',
    newValue: hackingProgram.name,
  });

  if (hackingProgram.link) {
    auditFields.push({
      fieldName: 'link',
      newValue: hackingProgram.link,
    });
  }

  if (hackingProgram.attackMod) {
    auditFields.push({
      fieldName: 'attack mod',
      newValue: hackingProgram.attackMod,
    });
  }

  if (hackingProgram.opponentMod) {
    auditFields.push({
      fieldName: 'opponent mod',
      newValue: hackingProgram.opponentMod,
    });
  }

  if (hackingProgram.damage) {
    auditFields.push({
      fieldName: 'damage',
      newValue: hackingProgram.damage,
    });
  }

  if (hackingProgram.burst) {
    auditFields.push({
      fieldName: 'burst',
      newValue: hackingProgram.burst,
    });
  }

  if (hackingProgram.target?.length) {
    auditFields.push({
      fieldName: 'target',
      newValue: hackingProgram.target
        ?.map((target) =>
          lowerCase(target).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
    });
  }

  if (hackingProgram.skillType?.length) {
    auditFields.push({
      fieldName: 'skill type',
      newValue: hackingProgram.skillType
        ?.map((skillType) =>
          lowerCase(skillType).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
    });
  }

  if (hackingProgram.special) {
    auditFields.push({
      fieldName: 'special',
      newValue: hackingProgram.special,
    });
  }

  return auditFields;
}

function buildHackingDeviceEntityAuditFields(
  data: Record<string, unknown>,
): AuditField[] {
  const auditFields: AuditField[] = [];

  const hackingDevice = data as RecursivePartial<
    Omit<HackingDeviceEntity, 'programs'> & {
      programs: HackingProgramEntity[];
    }
  >;

  auditFields.push({
    fieldName: 'name',
    newValue: hackingDevice.name,
  });

  if (hackingDevice.link) {
    auditFields.push({
      fieldName: 'link',
      newValue: hackingDevice.link,
    });
  }

  if (hackingDevice.programs?.length) {
    auditFields.push({
      fieldName: 'programs',
      newValue: hackingDevice.programs
        ?.map((program) => program.name)
        .join(', '),
    });
  }

  return auditFields;
}
