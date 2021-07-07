import {
  RuleEntity,
  ruleSchema,
} from '@content-manager/common/entities/RuleEntity';
import {
  AmmoEntity,
  ammoSchema,
} from '@content-manager/weapons/entities/AmmoEntity';
import {
  WeaponEntity,
  weaponSchema,
} from '@content-manager/weapons/entities/WeaponEntity';
import {
  WeaponModeEntity,
  weaponModeSchema,
} from '@content-manager/weapons/entities/WeaponModeEntity';
import { weaponRangeSchema } from '@content-manager/weapons/entities/WeaponRangeEntity';
import { WeaponService } from '@content-manager/weapons/services/WeaponService';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { findOneOrFailHandler } from '@root/utils';
import { WeaponModeRequest } from '@root/__generatedTypes__';
import { convertColToCamelCase } from '@test-utils/convertColumnCase';
import { IBackup, IMemoryDb, newDb } from 'pg-mem';

let db: IMemoryDb;
let orm: MikroORM;
let weaponService: WeaponService;
let backup: IBackup;

const auditService = {
  addCreateAudit: jest.fn(),
  addCustomAudit: jest.fn(),
  addDeleteAudit: jest.fn(),
  addUpdateAudit: jest.fn(),
  getAuditList: jest.fn(),
};

beforeAll(async () => {
  db = newDb();
  orm = await db.adapters.createMikroOrm({
    entities: [
      ruleSchema,
      weaponModeSchema,
      weaponRangeSchema,
      weaponSchema,
      ammoSchema,
    ],
    findOneOrFailHandler,
  });

  await orm.getSchemaGenerator().createSchema();

  const weaponRepository: EntityRepository<WeaponEntity> = orm.em.getRepository(
    WeaponEntity,
  );
  const weaponModeRepository: EntityRepository<WeaponModeEntity> = orm.em.getRepository(
    WeaponModeEntity,
  );
  const ammoRepository: EntityRepository<AmmoEntity> = orm.em.getRepository(
    AmmoEntity,
  );
  const ruleRepository: EntityRepository<RuleEntity> = orm.em.getRepository(
    RuleEntity,
  );
  weaponService = new WeaponService(
    weaponRepository,
    weaponModeRepository,
    ammoRepository,
    ruleRepository,
    auditService as never,
  );
  backup = db.backup();
});

beforeEach(async () => {
  orm.em.clear();
  backup.restore();
});

describe('WeaponService', () => {
  describe('createWeapon', () => {
    it('should create a new weapon', async () => {
      const weaponRequest = {
        name: 'Combi Rifle',
        link: null,
      };
      const weapon = await weaponService.createWeapon(weaponRequest);

      const weaponRow = convertColToCamelCase(
        db.public.one(`SELECT * FROM weapon WHERE id = '${weapon.id}'`),
      );

      expect(weaponRow).toEqual(expect.objectContaining(weaponRequest));
      expect(auditService.addCreateAudit).toBeCalledWith({
        entityName: WeaponEntity.name,
        resourceId: weapon.id,
        resourceName: weapon.name,
      });
    });
  });

  describe('createWeaponMode', () => {
    it('should creater a weapon mode and attach it to a weapon', async () => {
      const weapon = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const ammo = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
      };
      db.getTable('rule').insert(trait);

      const weaponModeRequest: WeaponModeRequest = {
        name: 'Combi Rifle',
        range: {
          _8: 'PLUS_THREE',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'ARM',
        ammoIds: [ammo.id],
        traitIds: [trait.id],
      };

      const weaponMode = await weaponService.createWeaponMode(
        weapon.id,
        weaponModeRequest,
      );

      const weaponModeRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode WHERE id = '${weaponMode.id}'`,
        ),
      );
      const weaponModeAmmoRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode_ammo WHERE weapon_mode_entity_id = '${weaponMode.id}'`,
        ),
      );
      const weaponModeTraitRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode_traits WHERE weapon_mode_entity_id = '${weaponMode.id}'`,
        ),
      );

      expect(weaponModeRow).toEqual({
        id: weaponMode.id,
        name: weaponMode.name,
        damage: weaponMode.damage,
        burst: weaponMode.burst,
        savingAttribute: weaponMode.savingAttribute,
        range8: weaponMode.range?._8,
        range16: weaponMode.range?._16,
        range24: weaponMode.range?._24,
        range32: weaponMode.range?._32,
        range40: weaponMode.range?._40,
        range48: weaponMode.range?._48,
        range96: null,
        weaponId: weapon.id,
      });
      expect(weaponModeAmmoRow).toEqual(
        expect.objectContaining({
          weaponModeEntityId: weaponMode.id,
          ammoEntityId: ammo.id,
        }),
      );
      expect(weaponModeTraitRow).toEqual(
        expect.objectContaining({
          weaponModeEntityId: weaponMode.id,
          ruleEntityId: trait.id,
        }),
      );
      expect(auditService.addCreateAudit).toBeCalledWith({
        entityName: WeaponModeEntity.name,
        resourceId: weaponMode.id,
        resourceName: weaponMode.name,
        parentResourceName: weapon.name,
      });
    });
  });

  describe('updateWeapon', () => {
    it('should update the weapon', async () => {
      const weapon = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const weaponRequest = {
        name: 'Breaker Combi Rifle',
        link: 'example.com',
      };

      const updatedWeapon = await weaponService.updateWeapon(
        weapon.id,
        weaponRequest,
      );

      const weaponRow = convertColToCamelCase(
        db.public.one(`SELECT * FROM weapon WHERE id = '${weapon.id}'`),
      );

      expect(updatedWeapon.toObject()).toEqual(
        expect.objectContaining(weaponRow),
      );
      expect(auditService.addUpdateAudit).toBeCalledWith({
        entityName: WeaponEntity.name,
        resourceId: updatedWeapon.id,
        resourceName: updatedWeapon.name,
        originalValue: { id: weapon.id, name: weapon.name, link: weapon.link },
        newValue: {
          id: weapon.id,
          name: updatedWeapon.name,
          link: updatedWeapon.link,
        },
      });
    });
  });

  describe('updateWeaponMode', () => {
    it('should update the weapon mode', async () => {
      const weapon = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const ammo1 = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo1);
      const ammo2 = {
        id: '4567',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(ammo2);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
        type: null,
      };
      db.getTable('rule').insert(trait);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);
      db.getTable('weapon_mode_ammo').insert({
        id: 1,
        weapon_mode_entity_id: weaponMode.id,
        ammo_entity_id: ammo1.id,
      });
      db.getTable('weapon_mode_traits').insert({
        weapon_mode_entity_id: weaponMode.id,
        rule_entity_id: trait.id,
      });

      const weaponModeRequest: WeaponModeRequest = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: [ammo2.id],
        traitIds: [trait.id],
      };

      const updatedWeaponMode = await weaponService.updateWeaponMode(
        weapon.id,
        weaponMode.id,
        weaponModeRequest,
      );

      const weaponModeRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode WHERE id = '${weaponMode.id}'`,
        ),
      );
      const weaponModeAmmoRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode_ammo WHERE weapon_mode_entity_id = '${weaponMode.id}'`,
        ),
      );
      const weaponModeTraitRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM weapon_mode_traits WHERE weapon_mode_entity_id = '${weaponMode.id}'`,
        ),
      );

      expect(weaponModeRow).toEqual({
        id: updatedWeaponMode.id,
        name: updatedWeaponMode.name,
        damage: updatedWeaponMode.damage,
        burst: updatedWeaponMode.burst,
        savingAttribute: updatedWeaponMode.savingAttribute,
        range8: updatedWeaponMode.range._8,
        range16: updatedWeaponMode.range._16,
        range24: updatedWeaponMode.range._24,
        range32: updatedWeaponMode.range._32,
        range40: updatedWeaponMode.range._40,
        range48: updatedWeaponMode.range._48,
        range96: null,
        weaponId: weapon.id,
      });
      expect(weaponModeAmmoRow).toEqual(
        expect.objectContaining({
          weaponModeEntityId: weaponMode.id,
          ammoEntityId: ammo2.id,
        }),
      );
      expect(weaponModeTraitRow).toEqual(
        expect.objectContaining({
          weaponModeEntityId: weaponMode.id,
          ruleEntityId: trait.id,
        }),
      );
      expect(auditService.addUpdateAudit).toBeCalledWith({
        entityName: WeaponModeEntity.name,
        resourceId: updatedWeaponMode.id,
        resourceName: updatedWeaponMode.name,
        parentResourceName: weapon.name,
        originalValue: expect.objectContaining({
          ammo: [ammo1],
          burst: weaponMode.burst,
          damage: weaponMode.damage,
          id: weaponMode.id,
          name: weaponMode.name,
          range: {
            _8: weaponMode.range__8,
            _16: weaponMode.range__16,
            _24: weaponMode.range__24,
            _32: weaponMode.range__32,
            _40: weaponMode.range__40,
            _48: weaponMode.range__48,
            _96: null,
          },
          savingAttribute: weaponMode.saving_attribute,
          traits: [trait],
        }),
        newValue: expect.objectContaining({
          ammo: [ammo2],
          burst: updatedWeaponMode.burst,
          damage: updatedWeaponMode.damage,
          id: updatedWeaponMode.id,
          name: updatedWeaponMode.name,
          range: updatedWeaponMode.range,
          savingAttribute: updatedWeaponMode.savingAttribute,
          traits: [trait],
        }),
      });
    });

    it('should throw if the weapon mode does not exist on the weapon', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '2345',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon1.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);

      const weaponModeRequest: WeaponModeRequest = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: [],
        traitIds: [],
      };

      expect.assertions(3);

      await weaponService
        .updateWeaponMode(weapon2.id, weaponMode.id, weaponModeRequest)
        .catch((e: Error) => {
          expect(e).toBeInstanceOf(ResourceNotFound);
          expect(e.message).toBe('Resource Not Found - WeaponMode not found');
          expect(auditService.addUpdateAudit).not.toBeCalled();
        });
    });
  });

  describe('findWeaponById', () => {
    it('should find the weapon by id', async () => {
      const weapon = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);

      const foundWeapon = await weaponService.findWeaponById(weapon.id);

      expect(foundWeapon.toObject()).toEqual(expect.objectContaining(weapon));
    });

    it('should throw if no weapon is not found', async () => {
      expect.assertions(2);
      await weaponService.findWeaponById('fake-id').catch((e: Error) => {
        expect(e).toBeInstanceOf(ResourceNotFound);
        expect(e.message).toBe('Resource Not Found - Weapon not found');
      });
    });
  });

  describe('getWeaponsList', () => {
    it('should return a paginated list of weapons if page and limit are provided', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '2345',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const weapon3 = {
        id: '3456',
        name: 'Plasma Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon3);

      const weaponPage = await weaponService.getWeaponsList(undefined, 0, 1);

      expect(weaponPage.count).toBe(3);
      expect(weaponPage.last).toBeFalsy();
      expect(weaponPage.limit).toBe(1);
      expect(weaponPage.page).toBe(0);
      expect(weaponPage.content.map((weapon) => weapon.toObject())).toEqual([
        weapon2,
      ]);
    });

    it('should return all weapons when no arguments are provided', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '2345',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const weapon3 = {
        id: '3456',
        name: 'Plasma Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon3);

      const weaponPage = await weaponService.getWeaponsList();

      expect(weaponPage.count).toBe(3);
      expect(weaponPage.last).toBeTruthy();
      expect(weaponPage.limit).toBeUndefined();
      expect(weaponPage.page).toBe(0);
      expect(weaponPage.content.map((weapon) => weapon.toObject())).toEqual([
        weapon2,
        weapon1,
        weapon3,
      ]);
    });

    it('should return a filtered list of weapons when search is provided', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '2345',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const weapon3 = {
        id: '3456',
        name: 'Plasma Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon3);

      const weaponPage = await weaponService.getWeaponsList({ name: 'combi' });

      expect(weaponPage.count).toBe(2);
      expect(weaponPage.last).toBeTruthy();
      expect(weaponPage.limit).toBeUndefined();
      expect(weaponPage.page).toBe(0);
      expect(weaponPage.content.map((weapon) => weapon.toObject())).toEqual([
        weapon2,
        weapon1,
      ]);
    });
  });

  describe('removeWeaponMode', () => {
    it('should remove the weapon mode from the weapon', async () => {
      const weapon = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const ammo = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
      };
      db.getTable('rule').insert(trait);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);
      db.getTable('weapon_mode_ammo').insert({
        id: 1,
        weapon_mode_entity_id: weaponMode.id,
        ammo_entity_id: ammo.id,
      });
      db.getTable('weapon_mode_traits').insert({
        weapon_mode_entity_id: weaponMode.id,
        rule_entity_id: trait.id,
      });

      await weaponService.removeWeaponMode(weapon.id, weaponMode.id);

      const weaponModeRows = db.public.many(`SELECT * FROM weapon_mode`);
      const weaponModeAmmoRows = db.public.many(
        `SELECT * FROM weapon_mode_ammo`,
      );
      const weaponModeTraitsRows = db.public.many(
        `SELECT * FROM weapon_mode_traits`,
      );

      expect(weaponModeRows.length).toBe(0);
      expect(weaponModeAmmoRows.length).toBe(0);
      expect(weaponModeTraitsRows.length).toBe(0);
      expect(auditService.addDeleteAudit).toBeCalledWith({
        entityName: WeaponModeEntity.name,
        resourceId: weaponMode.id,
        resourceName: weaponMode.name,
        parentResourceName: weapon.name,
      });
    });

    it('should throw if the weapon mode does not exist on the weapon', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '6789',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const ammo = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
      };
      db.getTable('rule').insert(trait);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon1.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);
      db.getTable('weapon_mode_ammo').insert({
        id: 1,
        weapon_mode_entity_id: weaponMode.id,
        ammo_entity_id: ammo.id,
      });
      db.getTable('weapon_mode_traits').insert({
        weapon_mode_entity_id: weaponMode.id,
        rule_entity_id: trait.id,
      });

      expect.assertions(3);

      await weaponService
        .removeWeaponMode(weapon2.id, weaponMode.id)
        .catch((e: Error) => {
          expect(e).toBeInstanceOf(ResourceNotFound);
          expect(e.message).toBe('Resource Not Found - WeaponMode not found');
          expect(auditService.addDeleteAudit).not.toBeCalled();
        });
    });
  });

  describe('getWeaponModesByWeaponIds', () => {
    it('should return a 2d array of weapon modes for the provided weapon ids', async () => {
      const weapon1 = {
        id: '1234',
        name: 'Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon1);
      const weapon2 = {
        id: '2345',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon2);
      const weapon1Mode = {
        id: '3456',
        name: 'Combi Rifle',
        weapon_id: weapon1.id,
      };
      db.getTable('weapon_mode').insert(weapon1Mode);
      const weapon2Mode = {
        id: '4567',
        name: 'Breaker Combi Rifle',
        weapon_id: weapon2.id,
      };
      db.getTable('weapon_mode').insert(weapon2Mode);

      const weaponModes = await weaponService.getWeaponModesByWeaponIds([
        weapon1.id,
        weapon2.id,
      ]);

      expect(weaponModes).toEqual([
        [expect.objectContaining({ id: weapon1Mode.id })],
        [expect.objectContaining({ id: weapon2Mode.id })],
      ]);
    });
  });

  describe('getAmmoByWeaponModeIds', () => {
    it('should return a 2d array of ammo for the provided weapon mode ids', async () => {
      const weapon = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const ammo = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
      };
      db.getTable('rule').insert(trait);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);
      db.getTable('weapon_mode_ammo').insert({
        id: 1,
        weapon_mode_entity_id: weaponMode.id,
        ammo_entity_id: ammo.id,
      });
      db.getTable('weapon_mode_traits').insert({
        weapon_mode_entity_id: weaponMode.id,
        rule_entity_id: trait.id,
      });

      const ammoForWeaponMode = await weaponService.getAmmoByWeaponModeIds([
        weaponMode.id,
      ]);

      expect(ammoForWeaponMode).toEqual([
        [expect.objectContaining({ id: ammo.id })],
      ]);
    });
  });

  describe('getTraitsByWeaponModeIds', () => {
    it('should return a 2d array of traits for the provided weapon mode ids', async () => {
      const weapon = {
        id: '1234',
        name: 'Breaker Combi Rifle',
        link: null,
      };
      db.getTable('weapon').insert(weapon);
      const ammo = {
        id: '2345',
        name: 'N',
        link: null,
      };
      db.getTable('ammo').insert(ammo);
      const trait = {
        id: '3456',
        name: 'Suppressive Fire',
        link: null,
      };
      db.getTable('rule').insert(trait);
      const weaponMode = {
        id: '5678',
        name: 'Combi Rifle',
        damage: '13',
        burst: '3',
        saving_attribute: 'ARM',
        range__8: 'PLUS_THREE',
        range__16: 'PLUS_THREE',
        range__24: 'MINUS_THREE',
        range__32: 'MINUS_THREE',
        range__40: 'MINUS_SIX',
        range__48: 'MINUS_SIX',
        range__96: null,
        weapon_id: weapon.id,
      };
      db.getTable('weapon_mode').insert(weaponMode);
      db.getTable('weapon_mode_ammo').insert({
        id: 1,
        weapon_mode_entity_id: weaponMode.id,
        ammo_entity_id: ammo.id,
      });
      db.getTable('weapon_mode_traits').insert({
        weapon_mode_entity_id: weaponMode.id,
        rule_entity_id: trait.id,
      });

      const ammoForWeaponMode = await weaponService.getTraitsByWeaponModeIds([
        weaponMode.id,
      ]);

      expect(ammoForWeaponMode).toEqual([
        [expect.objectContaining({ id: trait.id })],
      ]);
    });
  });
});
