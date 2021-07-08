import { AuditField } from '@root/__generatedTypes__';
import { AuditEntity, UpdateAuditData } from '@audit/entities/AuditEntity';
import { auditIsUpdate } from '@audit/utils/auditTypeGuards';
import { UserEntity } from '@users/entities/UserEntity';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { AmmoEntity } from '@content-manager/weapons/entities/AmmoEntity';
import { WeaponEntity } from '@content-manager/weapons/entities/WeaponEntity';
import { WeaponModeEntity } from '@content-manager/weapons/entities/WeaponModeEntity';
import { HackingProgramEntity } from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingDeviceEntity } from '@content-manager/hacking/entities/HackingDeviceEntity';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string | number | symbol, unknown>
    ? RecursivePartial<T[P]>
    : T[P];
};

export function buildAuditUpdateFields(
  auditEntity: AuditEntity,
): AuditField[] | null {
  if (!auditIsUpdate(auditEntity.data)) {
    return null;
  }

  const { entityName, diff } = auditEntity.data;

  switch (entityName) {
    case UserEntity.name:
      return buildUserEntityAuditFields(diff);
    case RuleEntity.name:
      return buildRuleEntityAuditFields(diff);
    case AmmoEntity.name:
      return buildAmmoEntityAuditFields(diff);
    case WeaponEntity.name:
      return buildWeaponEntityAuditFields(diff);
    case WeaponModeEntity.name:
      return buildWeaponModeEntityAuditFields(diff);
    case HackingProgramEntity.name:
      return buildHackingProgramEntityAuditFields(diff);
    case HackingDeviceEntity.name:
      return buildHackingDeviceEntityAuditFields(diff);
    default:
      return [];
  }
}

function buildUserEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<UserEntity>,
    RecursivePartial<UserEntity>,
  ];

  if (oldValues.username || newValues.username) {
    auditFields.push({
      fieldName: 'username',
      oldValue: oldValues.username,
      newValue: newValues.username,
    });
  }

  if (oldValues.email || newValues.email) {
    auditFields.push({
      fieldName: 'email',
      oldValue: oldValues.email,
      newValue: newValues.email,
    });
  }

  if (oldValues.roles || newValues.roles) {
    auditFields.push({
      fieldName: 'roles',
      oldValue: oldValues.roles
        ?.map((role) => lowerCase(role).split(' ').map(capitalize).join(' '))
        .join(', '),
      newValue: newValues.roles
        ?.map((role) => lowerCase(role).split(' ').map(capitalize).join(' '))
        .join(', '),
    });
  }

  return auditFields;
}

function buildRuleEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<RuleEntity>,
    RecursivePartial<RuleEntity>,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.link || newValues.link) {
    auditFields.push({
      fieldName: 'link',
      oldValue: oldValues.link,
      newValue: newValues.link,
    });
  }

  if (oldValues.type || newValues.type) {
    auditFields.push({
      fieldName: 'type',
      oldValue: oldValues.type
        ? lowerCase(oldValues.type).split(' ').map(capitalize).join(' ')
        : undefined,
      newValue: newValues.type
        ? lowerCase(newValues.type).split(' ').map(capitalize).join(' ')
        : undefined,
    });
  }

  return auditFields;
}

function buildAmmoEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<
      Omit<AmmoEntity, 'combinedAmmo'> & { combinedAmmo: AmmoEntity[] }
    >,
    RecursivePartial<
      Omit<AmmoEntity, 'combinedAmmo'> & { combinedAmmo: AmmoEntity[] }
    >,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.link || newValues.link) {
    auditFields.push({
      fieldName: 'link',
      oldValue: oldValues.link,
      newValue: newValues.link,
    });
  }

  if (oldValues.combinedAmmo || newValues.combinedAmmo) {
    auditFields.push({
      fieldName: 'combined ammo',
      oldValue: oldValues.combinedAmmo?.map((ammo) => ammo.name).join(', '),
      newValue: newValues.combinedAmmo?.map((ammo) => ammo.name).join(', '),
    });
  }

  return auditFields;
}

function buildWeaponEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<
      Omit<WeaponEntity, 'modes'> & { modes: WeaponModeEntity[] }
    >,
    RecursivePartial<
      Omit<WeaponEntity, 'modes'> & { modes: WeaponModeEntity[] }
    >,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.link || newValues.link) {
    auditFields.push({
      fieldName: 'link',
      oldValue: oldValues.link,
      newValue: newValues.link,
    });
  }

  return auditFields;
}

function buildWeaponModeEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<
      Omit<WeaponModeEntity, 'ammo' | 'traits'> & {
        ammo: AmmoEntity[];
        traits: RuleEntity[];
      }
    >,
    RecursivePartial<
      Omit<WeaponModeEntity, 'ammo' | 'traits'> & {
        ammo: AmmoEntity[];
        traits: RuleEntity[];
      }
    >,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.damage || newValues.damage) {
    auditFields.push({
      fieldName: 'damage',
      oldValue: oldValues.damage,
      newValue: newValues.damage,
    });
  }

  if (oldValues.burst || newValues.burst) {
    auditFields.push({
      fieldName: 'burst',
      oldValue: oldValues.burst,
      newValue: newValues.burst,
    });
  }

  if (oldValues.savingAttribute || newValues.savingAttribute) {
    auditFields.push({
      fieldName: 'saving attribute',
      oldValue: oldValues.savingAttribute,
      newValue: newValues.savingAttribute,
    });
  }

  if (oldValues.range?._8 || newValues.range?._8) {
    auditFields.push({
      fieldName: '8" range',
      oldValue: oldValues.range?._8,
      newValue: newValues.range?._8,
    });
  }

  if (oldValues.range?._16 || newValues.range?._16) {
    auditFields.push({
      fieldName: '16" range',
      oldValue: oldValues.range?._16,
      newValue: newValues.range?._16,
    });
  }

  if (oldValues.range?._24 || newValues.range?._24) {
    auditFields.push({
      fieldName: '24" range',
      oldValue: oldValues.range?._24,
      newValue: newValues.range?._24,
    });
  }

  if (oldValues.range?._32 || newValues.range?._32) {
    auditFields.push({
      fieldName: '32" range',
      oldValue: oldValues.range?._32,
      newValue: newValues.range?._32,
    });
  }

  if (oldValues.range?._40 || newValues.range?._40) {
    auditFields.push({
      fieldName: '40" range',
      oldValue: oldValues.range?._40,
      newValue: newValues.range?._40,
    });
  }

  if (oldValues.range?._48 || newValues.range?._48) {
    auditFields.push({
      fieldName: '48" range',
      oldValue: oldValues.range?._48,
      newValue: newValues.range?._48,
    });
  }

  if (oldValues.range?._96 || newValues.range?._96) {
    auditFields.push({
      fieldName: '96" range',
      oldValue: oldValues.range?._96,
      newValue: newValues.range?._96,
    });
  }

  if (oldValues.ammo || newValues.ammo) {
    auditFields.push({
      fieldName: 'ammo',
      oldValue: oldValues.ammo?.map((ammo) => ammo.name).join(', '),
      newValue: newValues.ammo?.map((ammo) => ammo.name).join(', '),
    });
  }

  if (oldValues.traits || newValues.traits) {
    auditFields.push({
      fieldName: 'traits',
      oldValue: oldValues.traits?.map((traits) => traits.name).join(', '),
      newValue: newValues.traits?.map((traits) => traits.name).join(', '),
    });
  }

  return auditFields;
}

function buildHackingProgramEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<HackingProgramEntity>,
    RecursivePartial<HackingProgramEntity>,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.link || newValues.link) {
    auditFields.push({
      fieldName: 'link',
      oldValue: oldValues.link,
      newValue: newValues.link,
    });
  }

  if (oldValues.attackMod || newValues.attackMod) {
    auditFields.push({
      fieldName: 'attack mod',
      oldValue: oldValues.attackMod,
      newValue: newValues.attackMod,
    });
  }

  if (oldValues.opponentMod || newValues.opponentMod) {
    auditFields.push({
      fieldName: 'opponent mod',
      oldValue: oldValues.opponentMod,
      newValue: newValues.opponentMod,
    });
  }

  if (oldValues.damage || newValues.damage) {
    auditFields.push({
      fieldName: 'damage',
      oldValue: oldValues.damage,
      newValue: newValues.damage,
    });
  }

  if (oldValues.burst || newValues.burst) {
    auditFields.push({
      fieldName: 'burst',
      oldValue: oldValues.burst,
      newValue: newValues.burst,
    });
  }

  if (oldValues.target || newValues.target) {
    auditFields.push({
      fieldName: 'target',
      oldValue: oldValues.target
        ?.map((target) =>
          lowerCase(target).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
      newValue: newValues.target
        ?.map((target) =>
          lowerCase(target).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
    });
  }

  if (oldValues.skillType || newValues.skillType) {
    auditFields.push({
      fieldName: 'skill type',
      oldValue: oldValues.skillType
        ?.map((skillType) =>
          lowerCase(skillType).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
      newValue: newValues.skillType
        ?.map((skillType) =>
          lowerCase(skillType).split(' ').map(capitalize).join(' '),
        )
        .join(', '),
    });
  }

  if (oldValues.special || newValues.special) {
    auditFields.push({
      fieldName: 'special',
      oldValue: oldValues.special,
      newValue: newValues.special,
    });
  }

  return auditFields;
}

function buildHackingDeviceEntityAuditFields(
  diff: UpdateAuditData['diff'],
): AuditField[] {
  const auditFields: AuditField[] = [];

  const [oldValues, newValues] = diff as [
    RecursivePartial<
      Omit<HackingDeviceEntity, 'programs'> & {
        programs: HackingProgramEntity[];
      }
    >,
    RecursivePartial<
      Omit<HackingDeviceEntity, 'programs'> & {
        programs: HackingProgramEntity[];
      }
    >,
  ];

  if (oldValues.name || newValues.name) {
    auditFields.push({
      fieldName: 'name',
      oldValue: oldValues.name,
      newValue: newValues.name,
    });
  }

  if (oldValues.link || newValues.link) {
    auditFields.push({
      fieldName: 'link',
      oldValue: oldValues.link,
      newValue: newValues.link,
    });
  }

  if (oldValues.programs || newValues.programs) {
    auditFields.push({
      fieldName: 'programs',
      oldValue: oldValues.programs?.map((program) => program.name).join(', '),
      newValue: newValues.programs?.map((program) => program.name).join(', '),
    });
  }

  return auditFields;
}
