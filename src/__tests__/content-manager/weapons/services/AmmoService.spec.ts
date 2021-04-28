import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { findOneOrFailHandler } from '@root/utils';
import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import { convertColToCamelCase } from '@root/__tests__/__testUtils__/convertColumnCase';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { AmmoService } from '@content-manager/weapons/services/AmmoService';
import {
  AmmoEntity,
  ammoSchema,
} from '@content-manager/weapons/entities/AmmoEntity';
import { ruleSchema } from '@content-manager/common/entities/RuleEntity';
import { weaponSchema } from '@content-manager/weapons/entities/WeaponEntity';
import { weaponModeSchema } from '@content-manager/weapons/entities/WeaponModeEntity';
import { weaponRangeSchema } from '@content-manager/weapons/entities/WeaponRangeEntity';

let db: IMemoryDb;
let orm: MikroORM;
let ammoService: AmmoService;
let backup: IBackup;

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

  const ammoRepository: EntityRepository<AmmoEntity> = orm.em.getRepository(
    AmmoEntity,
  );
  ammoService = new AmmoService(ammoRepository);
  backup = db.backup();
});

beforeEach(async () => {
  orm.em.clear();
  backup.restore();
});

describe('AmmoService', () => {
  describe('createAmmo', () => {
    it('should create new ammo', async () => {
      const ammo1 = {
        id: '1234',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));

      const newAmmo = await ammoService.createAmmo({
        name: 'AP+DA',
        link: null,
        combinedAmmoIds: [ammo1.id, ammo2.id],
      });

      const ammoRow = convertColToCamelCase(
        db.public.one(`SELECT * FROM ammo WHERE id = '${newAmmo.id}'`),
      );
      const pivotTableRows = db.public.many(
        `SELECT * FROM ammo_combined_ammo WHERE ammo_entity_1_id = '${newAmmo.id}'`,
      );

      expect(newAmmo.toObject()).toEqual(expect.objectContaining(ammoRow));
      expect(pivotTableRows).toEqual([
        expect.objectContaining({
          id: 1,
          ammo_entity_1_id: newAmmo.id,
          ammo_entity_2_id: ammo1.id,
        }),
        expect.objectContaining({
          id: 2,
          ammo_entity_1_id: newAmmo.id,
          ammo_entity_2_id: ammo2.id,
        }),
      ]);
    });
  });

  describe('updateAmmo', () => {
    it('should update the ammo', async () => {
      const ammo1 = {
        id: '1234',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));
      const ammo3 = {
        id: '3456',
        name: 'EXP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo3));
      const ammo = db.getTable('ammo').insert({
        id: '4567',
        name: 'AP+DA',
        link: null,
      });
      db.getTable('ammo_combined_ammo').insert({
        id: 1,
        ammo_entity_1_id: ammo.id,
        ammo_entity_2_id: ammo1.id,
      });
      db.getTable('ammo_combined_ammo').insert({
        id: 2,
        ammo_entity_1_id: ammo.id,
        ammo_entity_2_id: ammo2.id,
      });

      const updatedAmmo = await ammoService.updateAmmo(ammo.id, {
        name: 'AP+EXP',
        link: null,
        combinedAmmoIds: [ammo1.id, ammo3.id],
      });

      const ammoRow = convertColToCamelCase(
        db.public.one(`SELECT * FROM ammo WHERE id = '${updatedAmmo.id}'`),
      );
      const pivotTableRows = db.public.many(
        `SELECT * FROM ammo_combined_ammo WHERE ammo_entity_1_id = '${updatedAmmo.id}'`,
      );

      expect(updatedAmmo.toObject()).toEqual(expect.objectContaining(ammoRow));
      expect(pivotTableRows).toEqual([
        expect.objectContaining({
          id: 1,
          ammo_entity_1_id: updatedAmmo.id,
          ammo_entity_2_id: ammo1.id,
        }),
        expect.objectContaining({
          id: 2,
          ammo_entity_1_id: updatedAmmo.id,
          ammo_entity_2_id: ammo3.id,
        }),
      ]);
    });
  });

  describe('findAmmoById', () => {
    it('should find the ammo by id', async () => {
      const ammo = {
        id: '1234',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo));

      const foundAmmo = await ammoService.findAmmoById(ammo.id);

      expect(foundAmmo.toObject()).toEqual(expect.objectContaining(ammo));
    });

    it('should find the ammo by id', async () => {
      ammoService.findAmmoById('fake-id').catch((e: Error) => {
        expect(e).toBeInstanceOf(ResourceNotFound);
        expect(e.message).toBe('Ammo not found');
      });
    });
  });

  describe('getAmmoList', () => {
    it('should return a paginated list of ammo if page and limit are provided', async () => {
      const ammo1 = {
        id: '1234',
        name: 'EXP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));
      const ammo3 = {
        id: '3456',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo3));

      const ammoPage = await ammoService.getAmmoList(undefined, 0, 1);

      expect(ammoPage.count).toBe(3);
      expect(ammoPage.last).toBeFalsy();
      expect(ammoPage.limit).toBe(1);
      expect(ammoPage.page).toBe(0);
      expect(ammoPage.content.map((ammo) => ammo.toObject())).toEqual([ammo2]);
    });

    it('should return all ammo when no arguments are provided', async () => {
      const ammo1 = {
        id: '1234',
        name: 'EXP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));
      const ammo3 = {
        id: '3456',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo3));

      const ammoPage = await ammoService.getAmmoList();

      expect(ammoPage.count).toBe(3);
      expect(ammoPage.last).toBeTruthy();
      expect(ammoPage.limit).toBeUndefined();
      expect(ammoPage.page).toBe(0);
      expect(ammoPage.content.map((ammo) => ammo.toObject())).toEqual([
        ammo2,
        ammo3,
        ammo1,
      ]);
    });

    it('should return a filtered list of ammo when search is provided', async () => {
      const ammo1 = {
        id: '1234',
        name: 'EXP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));
      const ammo3 = {
        id: '3456',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo3));

      const ammoPage = await ammoService.getAmmoList({ name: 'da' });

      expect(ammoPage.count).toBe(1);
      expect(ammoPage.last).toBeTruthy();
      expect(ammoPage.limit).toBeUndefined();
      expect(ammoPage.page).toBe(0);
      expect(ammoPage.content.map((ammo) => ammo.toObject())).toEqual([ammo3]);
    });
  });

  describe('getCombinedAmmoByAmmoIds', () => {
    it('should return a 2D array of ammo', async () => {
      const ammo1 = {
        id: '1234',
        name: 'AP',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo1));
      const ammo2 = {
        id: '2345',
        name: 'DA',
        link: null,
      };
      db.getTable('ammo').insert(convertColToCamelCase(ammo2));
      const parentAmmo = db.getTable('ammo').insert({
        id: '4567',
        name: 'AP+DA',
        link: null,
      });
      db.getTable('ammo_combined_ammo').insert({
        id: 1,
        ammo_entity_1_id: parentAmmo.id,
        ammo_entity_2_id: ammo1.id,
      });
      db.getTable('ammo_combined_ammo').insert({
        id: 2,
        ammo_entity_1_id: parentAmmo.id,
        ammo_entity_2_id: ammo2.id,
      });

      const ammo = await ammoService.getCombinedAmmoByAmmoIds([parentAmmo.id]);

      expect(
        ammo.map((ammoList) =>
          ammoList.map((childAmmo) => childAmmo.toObject()),
        ),
      ).toEqual([[ammo1, ammo2]]);
    });
  });
});
