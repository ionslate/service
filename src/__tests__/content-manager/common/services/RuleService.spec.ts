import {
  RuleEntity,
  ruleSchema,
} from '@content-manager/common/entities/RuleEntity';
import { RuleService } from '@content-manager/common/services/RuleService';
import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { IBackup, newDb } from 'pg-mem';
import { findOneOrFailHandler } from '@root/utils';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';

let orm: MikroORM;
let ruleService: RuleService;
let ruleRepository: EntityRepository<RuleEntity>;
let backup: IBackup;

beforeAll(async () => {
  const db = newDb();
  orm = await db.adapters.createMikroOrm({
    entities: [ruleSchema],
    findOneOrFailHandler,
  });

  await orm.getSchemaGenerator().createSchema();

  ruleRepository = orm.em.getRepository(RuleEntity);
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

      const foundRule = await ruleRepository.findOneOrFail({ id: newRule.id });
      expect(foundRule.toObject()).toEqual({
        id: expect.any(String),
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });
    });
  });

  describe('updateRule', () => {
    it('should update a rule', async () => {
      const rule = ruleRepository.create({
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });
      await ruleRepository.persistAndFlush(rule);

      const updatedRule = await ruleService.updateRule(rule.id, {
        name: 'AI Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });

      const foundRule = await ruleRepository.findOneOrFail({
        id: updatedRule.id,
      });
      expect(foundRule.toObject()).toEqual(rule.toObject());
    });
  });

  describe('findRuleById', () => {
    it('should find the rule by id', async () => {
      const rule = ruleRepository.create({
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });
      await ruleRepository.persistAndFlush(rule);

      const foundRule = await ruleService.findRuleById(rule.id);

      expect(foundRule?.toObject()).toEqual(rule.toObject());
    });

    it('should throw an error if the rule does not exist', async () => {
      const rule = ruleRepository.create({
        name: 'Motorcycle',
        link: 'http://motorcycle.example.com',
        type: 'MOTORCYCLE',
      });
      await ruleRepository.persistAndFlush(rule);
      return await ruleService.findRuleById('fake-id').catch((e: Error) => {
        expect(e).toBeInstanceOf(ResourceNotFound);
        expect(e.message).toBe('Rule not found');
      });
    });
  });

  describe('getRulesList', () => {
    it('should return a paginated list of rules if page and limit are provided', async () => {
      const rule1 = ruleRepository.create({
        name: 'Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule1);
      const rule2 = ruleRepository.create({
        name: 'AI Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule2);
      const rule3 = ruleRepository.create({
        name: 'Stealth',
      });
      await ruleRepository.persistAndFlush(rule3);

      const rulePage = await ruleService.getRulesList(undefined, 0, 1);

      expect(rulePage.count).toBe(3);
      expect(rulePage.last).toBeFalsy();
      expect(rulePage.limit).toBe(1);
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([
        rule2.toObject(),
      ]);
    });

    it('should return all rules when no arguments are provided', async () => {
      const rule1 = ruleRepository.create({
        name: 'Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule1);
      const rule2 = ruleRepository.create({
        name: 'AI Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule2);
      const rule3 = ruleRepository.create({
        name: 'Stealth',
      });
      await ruleRepository.persistAndFlush(rule3);

      const rulePage = await ruleService.getRulesList();

      expect(rulePage.count).toBe(3);
      expect(rulePage.last).toBeTruthy();
      expect(rulePage.limit).toBeUndefined();
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([
        rule2.toObject(),
        rule1.toObject(),
        rule3.toObject(),
      ]);
    });

    it('should return a filtered list of rules when serch is provided', async () => {
      const rule1 = ruleRepository.create({
        name: 'Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule1);
      const rule2 = ruleRepository.create({
        name: 'AI Motorcycle',
        type: 'MOTORCYCLE',
      });
      ruleRepository.persist(rule2);
      const rule3 = ruleRepository.create({
        name: 'Stealth',
      });
      await ruleRepository.persistAndFlush(rule3);

      const rulePage = await ruleService.getRulesList({ name: 'AI' });

      expect(rulePage.count).toBe(1);
      expect(rulePage.last).toBeTruthy();
      expect(rulePage.limit).toBeUndefined();
      expect(rulePage.page).toBe(0);
      expect(rulePage.content.map((rule) => rule.toObject())).toEqual([
        rule2.toObject(),
      ]);
    });
  });
});
