import {
  RuleEntity,
  ruleSchema,
} from '@content-manager/common/entities/RuleEntity';
import { ammoSchema } from '@content-manager/weapons/entities/AmmoEntity';
import { weaponSchema } from '@content-manager/weapons/entities/WeaponEntity';
import { weaponModeSchema } from '@content-manager/weapons/entities/WeaponModeEntity';
import { weaponRangeSchema } from '@content-manager/weapons/entities/WeaponRangeEntity';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { RuleService } from '@root/modules/content-manager/common/services/RuleService';
import { findOneOrFailHandler } from '@root/utils';
import { IBackup, IMemoryDb, newDb } from 'pg-mem';

let db: IMemoryDb;
let orm: MikroORM;
let ruleService: RuleService;
let backup: IBackup;

beforeAll(async () => {
  db = newDb();

  orm = await db.adapters.createMikroOrm({
    entities: [
      ammoSchema,
      ruleSchema,
      weaponModeSchema,
      weaponRangeSchema,
      weaponSchema,
    ],
    findOneOrFailHandler,
  });

  await orm.getSchemaGenerator().createSchema();
  const ruleRepository: EntityRepository<RuleEntity> = orm.em.getRepository(
    RuleEntity,
  );
  ruleService = new RuleService(ruleRepository);
  backup = db.backup();
});

beforeEach(async () => {
  orm.em.clear();
  backup.restore();
});

describe('RuleService', () => {
  describe('createRule', () => {
    it('should create a new rule', async () => {
      const newRule = await ruleService.createRule({
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });

      const ruleRow = db.public.one(
        `SELECT * FROM rule WHERE id = '${newRule.id}'`,
      );

      expect(ruleRow).toEqual(
        expect.objectContaining({
          name: 'Motorcycle',
          link: 'http://motorcycle.example.com',
          type: 'MOTORCYCLE',
        }),
      );
    });
  });

  describe('updateRule', () => {
    it('should update a rule', async () => {
      const rule = {
        id: '1234',
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      };

      db.getTable('rule').insert(rule);

      const updatedRule = await ruleService.updateRule(rule.id, {
        name: 'AI Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });

      const ruleRow = db.public.one(
        `SELECT * FROM rule WHERE id = '${rule.id}'`,
      );

      expect(ruleRow).toEqual(expect.objectContaining(updatedRule.toObject()));
    });
  });

  describe('findRuleById', () => {
    it('should find the rule by id', async () => {
      const rule = {
        id: '1234',
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      };

      db.getTable('rule').insert(rule);

      const foundRule = await ruleService.findRuleById(rule.id);

      expect(foundRule.toObject()).toEqual(rule);
    });

    it('should throw an error if the rule does not exist', async () => {
      expect.assertions(2);
      await ruleService.findRuleById('fake-id').catch((e: Error) => {
        expect(e).toBeInstanceOf(ResourceNotFound);
        expect(e.message).toBe('Resource Not Found - Rule not found');
      });
    });
  });

  describe('getRulesList', () => {
    it('should return a paginated list of rules if page and limit are provided', async () => {
      const rule1 = {
        id: '1',
        name: 'Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule1);
      const rule2 = {
        id: '2',
        name: 'AI Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule2);
      const rule3 = {
        id: '3',
        link: null,
        name: 'Stealth',
        type: null,
      };
      db.getTable('rule').insert(rule3);

      const rulePage = await ruleService.getRulesList(undefined, 0, 1);

      expect(rulePage.count).toBe(3);
      expect(rulePage.last).toBeFalsy();
      expect(rulePage.limit).toBe(1);
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([rule2]);
    });

    it('should return all rules when no arguments are provided', async () => {
      const rule1 = {
        id: '1',
        name: 'Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule1);
      const rule2 = {
        id: '2',
        name: 'AI Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule2);
      const rule3 = {
        id: '3',
        link: null,
        name: 'Stealth',
        type: null,
      };
      db.getTable('rule').insert(rule3);

      const rulePage = await ruleService.getRulesList();

      expect(rulePage.count).toBe(3);
      expect(rulePage.last).toBeTruthy();
      expect(rulePage.limit).toBeUndefined();
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([
        rule2,
        rule1,
        rule3,
      ]);
    });

    it('should return a filtered list of rules when serch is provided', async () => {
      const rule1 = {
        id: '1',
        name: 'Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule1);
      const rule2 = {
        id: '2',
        name: 'AI Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };
      db.getTable('rule').insert(rule2);
      const rule3 = {
        id: '3',
        link: null,
        name: 'Stealth',
        type: null,
      };
      db.getTable('rule').insert(rule3);

      const rulePage = await ruleService.getRulesList({ name: 'AI' });

      expect(rulePage.count).toBe(1);
      expect(rulePage.last).toBeTruthy();
      expect(rulePage.limit).toBeUndefined();
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([rule2]);
    });
  });
});
