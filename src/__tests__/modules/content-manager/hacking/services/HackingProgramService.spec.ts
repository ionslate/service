import { hackingDeviceSchema } from '@content-manager/hacking/entities/HackingDeviceEntity';
import {
  HackingProgramEntity,
  hackingProgramSchema,
} from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingProgramService } from '@content-manager/hacking/services/HackingProgramService';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { findOneOrFailHandler } from '@root/utils';
import {
  convertColToCamelCase,
  convertColToSnakeCase,
} from '@root/__tests__/__testUtils__/convertColumnCase';
import { IBackup, IMemoryDb, newDb } from 'pg-mem';

let db: IMemoryDb;
let orm: MikroORM;
let hackingProgramService: HackingProgramService;
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
    entities: [hackingProgramSchema, hackingDeviceSchema],
    findOneOrFailHandler,
  });

  await orm.getSchemaGenerator().createSchema();

  const hackingProgramRepository: EntityRepository<HackingProgramEntity> = orm.em.getRepository(
    HackingProgramEntity,
  );
  hackingProgramService = new HackingProgramService(
    hackingProgramRepository,
    auditService as never,
  );
  backup = db.backup();
});

beforeEach(async () => {
  orm.em.clear();
  backup.restore();
});

describe('HackingProgramService', () => {
  describe('createHackingProgram', () => {
    it('should create a new hacking program', async () => {
      const newHackingProgram = await hackingProgramService.createHackingProgram(
        {
          name: 'Carbonite',
          link: null,
          attackMod: '0',
          opponentMod: '0',
          damage: '13',
          burst: '2',
          target: ['TAG', 'HI', 'REM', 'HACKER'],
          skillType: ['SHORT_SKILL', 'ARO'],
          special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
        },
      );

      const hackingProgramRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM hacking_program WHERE id = '${newHackingProgram.id}'`,
        ),
      );

      expect(newHackingProgram.toObject()).toEqual(hackingProgramRow);
      expect(auditService.addCreateAudit).toBeCalledWith({
        entityName: HackingProgramEntity.name,
        resourceName: newHackingProgram.name,
      });
    });
  });

  describe('updateHackingProgram', () => {
    it('should update the hacking program', async () => {
      const hackingProgram = {
        id: '1234',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram),
      );

      const updatedHackingProgram = await hackingProgramService.updateHackingProgram(
        hackingProgram.id,
        {
          name: 'Super Carbonite',
          link: null,
          attackMod: '0',
          opponentMod: '0',
          damage: '13',
          burst: '2',
          target: ['TAG', 'HI', 'REM', 'HACKER'],
          skillType: ['SHORT_SKILL', 'ARO'],
          special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
        },
      );

      const hackingProgramRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM hacking_program WHERE id = '${updatedHackingProgram.id}'`,
        ),
      );

      expect(updatedHackingProgram.toObject()).toEqual(hackingProgramRow);
      expect(auditService.addUpdateAudit).toBeCalledWith({
        entityName: HackingProgramEntity.name,
        resourceName: updatedHackingProgram.name,
        originalValue: hackingProgram,
        newValue: { ...hackingProgram, name: updatedHackingProgram.name },
      });
    });
  });

  describe('findHackingProgramById', () => {
    it('should find the hacking program by id', async () => {
      const hackingProgram = {
        id: '1234',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram),
      );

      const foundHackingProgram = await hackingProgramService.findHackingProgramById(
        hackingProgram.id,
      );

      expect(foundHackingProgram.toObject()).toEqual(hackingProgram);
    });

    it('should throw an error if the hacking program does not exist', async () => {
      expect.assertions(2);

      await hackingProgramService
        .findHackingProgramById('fake-id')
        .catch((e: Error) => {
          expect(e).toBeInstanceOf(ResourceNotFound);
          expect(e.message).toBe(
            'Resource Not Found - HackingProgram not found',
          );
        });
    });
  });

  describe('getHackingProgramsList', () => {
    it('should return a paginated list of hacking programs if page and limit are provided', async () => {
      const hackingProgram1 = {
        id: '1234',
        name: 'Spotlight',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: null,
        burst: '1',
        target: [],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'Non-Lethal, State: Targeted.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram1),
      );
      const hackingProgram2 = {
        id: '2345',
        name: 'Oblivion',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '16',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'AP Ammo, Non-Lethal, State: Isolated',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram2),
      );
      const hackingProgram3 = {
        id: '3456',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram3),
      );

      const programPage = await hackingProgramService.getHackingProgramsList(
        undefined,
        0,
        1,
      );
      expect(programPage.count).toBe(3);
      expect(programPage.last).toBeFalsy();
      expect(programPage.limit).toBe(1);
      expect(programPage.page).toBe(0);
      expect(programPage.content.map((program) => program.toObject())).toEqual([
        hackingProgram3,
      ]);
    });

    it('should return all hacking programs when no arguments are provided', async () => {
      const hackingProgram1 = {
        id: '1234',
        name: 'Spotlight',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: null,
        burst: '1',
        target: [],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'Non-Lethal, State: Targeted.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram1),
      );
      const hackingProgram2 = {
        id: '2345',
        name: 'Oblivion',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '16',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'AP Ammo, Non-Lethal, State: Isolated',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram2),
      );
      const hackingProgram3 = {
        id: '3456',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram3),
      );

      const programPage = await hackingProgramService.getHackingProgramsList();
      expect(programPage.count).toBe(3);
      expect(programPage.last).toBeTruthy();
      expect(programPage.limit).toBeUndefined();
      expect(programPage.page).toBe(0);
      expect(programPage.content.map((program) => program.toObject())).toEqual([
        hackingProgram3,
        hackingProgram2,
        hackingProgram1,
      ]);
    });

    it('should return a filtered list of hacking programs when search is provided', async () => {
      const hackingProgram1 = {
        id: '1234',
        name: 'Spotlight',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: null,
        burst: '1',
        target: [],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'Non-Lethal, State: Targeted.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram1),
      );
      const hackingProgram2 = {
        id: '2345',
        name: 'Oblivion',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '16',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'AP Ammo, Non-Lethal, State: Isolated',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram2),
      );
      const hackingProgram3 = {
        id: '3456',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram3),
      );

      const programPage = await hackingProgramService.getHackingProgramsList({
        name: 'car',
      });
      expect(programPage.count).toBe(1);
      expect(programPage.last).toBeTruthy();
      expect(programPage.limit).toBeUndefined();
      expect(programPage.page).toBe(0);
      expect(programPage.content.map((program) => program.toObject())).toEqual([
        hackingProgram3,
      ]);
    });
  });

  describe('getHackingProgramsByHackingDeviceIds', () => {
    it('should return a 2D array of hacking programs', async () => {
      const hackingProgram = {
        id: '1234',
        name: 'Carbonite',
        link: null,
        attackMod: '0',
        opponentMod: '0',
        damage: '13',
        burst: '2',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
        special: 'DA Ammo, Non-Lethal, State: Immobilized-B.',
      };
      db.getTable('hacking_program').insert(
        convertColToSnakeCase(hackingProgram),
      );

      const hackingDevice = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice),
      );
      db.getTable('hacking_device_programs').insert({
        hacking_device_entity_id: hackingDevice.id,
        hacking_program_entity_id: hackingProgram.id,
      });

      const hackingPrograms = await hackingProgramService.getHackingProgramsByHackingDeviceIds(
        [hackingDevice.id],
      );

      expect(
        hackingPrograms.map((programs) =>
          programs.map((program) => program.toObject()),
        ),
      ).toEqual([[hackingProgram]]);
    });
  });
});
