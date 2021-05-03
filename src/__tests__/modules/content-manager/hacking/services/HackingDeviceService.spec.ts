import {
  HackingDeviceEntity,
  hackingDeviceSchema,
} from '@content-manager/hacking/entities/HackingDeviceEntity';
import {
  HackingProgramEntity,
  hackingProgramSchema,
} from '@content-manager/hacking/entities/HackingProgramEntity';
import { HackingDeviceService } from '@content-manager/hacking/services/HackingDeviceService';
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
let hackingDeviceService: HackingDeviceService;
let backup: IBackup;

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
  const hackingDeviceRepository: EntityRepository<HackingDeviceEntity> = orm.em.getRepository(
    HackingDeviceEntity,
  );
  hackingDeviceService = new HackingDeviceService(
    hackingDeviceRepository,
    hackingProgramRepository,
  );
  backup = db.backup();
});

beforeEach(async () => {
  orm.em.clear();
  backup.restore();
});

describe('HackingDeviceService', () => {
  describe('createHackingDevice', () => {
    it('should create a hacking device', async () => {
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

      const hackingDevice = await hackingDeviceService.createHackingDevice({
        name: 'Hacking Device',
        link: null,
        programIds: ['1234'],
      });

      const hackingDeviceRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM hacking_device WHERE id = '${hackingDevice.id}'`,
        ),
      );

      const pivotTableRow = db.public.one(
        `SELECT * FROM hacking_device_programs WHERE hacking_device_entity_id = '${hackingDevice.id}'`,
      );

      expect(hackingDevice.toObject()).toEqual(
        expect.objectContaining(hackingDeviceRow),
      );
      expect(pivotTableRow).toEqual(
        expect.objectContaining({
          hacking_device_entity_id: hackingDevice.id,
          hacking_program_entity_id: hackingProgram.id,
        }),
      );
    });
  });

  describe('updateHackingDevice', () => {
    it('should update a hacking device', async () => {
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
      const hackingDeviceId = '2345';
      db.getTable('hacking_device').insert(
        convertColToSnakeCase({
          id: hackingDeviceId,
          name: 'Hacking Device',
          link: null,
        }),
      );

      const hackingDevice = await hackingDeviceService.updateHackingDevice(
        hackingDeviceId,
        {
          name: 'Killer Hacking Device',
          link: null,
          programIds: ['1234'],
        },
      );

      const hackingDeviceRow = convertColToCamelCase(
        db.public.one(
          `SELECT * FROM hacking_device WHERE id = '${hackingDevice.id}'`,
        ),
      );

      const pivotTableRow = db.public.one(
        `SELECT * FROM hacking_device_programs WHERE hacking_device_entity_id = '${hackingDevice.id}'`,
      );

      expect(hackingDevice.toObject()).toEqual(
        expect.objectContaining(hackingDeviceRow),
      );
      expect(pivotTableRow).toEqual(
        expect.objectContaining({
          hacking_device_entity_id: hackingDevice.id,
          hacking_program_entity_id: hackingProgram.id,
        }),
      );
    });
  });

  describe('findHackingDeviceById', () => {
    it('should find a hacking device by id', async () => {
      const hackingDevice = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice),
      );

      const foundHackingDevice = await hackingDeviceService.findHackingDeviceById(
        hackingDevice.id,
      );

      expect(foundHackingDevice.toObject()).toEqual(
        expect.objectContaining(hackingDevice),
      );
    });

    it('should find a hacking device by id', async () => {
      const hackingDevice = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice),
      );

      expect.assertions(2);

      await hackingDeviceService
        .findHackingDeviceById('fake-id')
        .catch((e: Error) => {
          expect(e).toBeInstanceOf(ResourceNotFound);
          expect(e.message).toBe('HackingDevice not found');
        });
    });
  });

  describe('getHackingDevicesList', () => {
    it('should return a paginated list of hacking devices if the page and limit are provided', async () => {
      const hackingDevice1 = {
        id: '1234',
        name: 'Killer Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice1),
      );
      const hackingDevice2 = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice2),
      );
      const hackingDevice3 = {
        id: '3456',
        name: 'Hacking Device Plus',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice3),
      );

      const devicePage = await hackingDeviceService.getHackingDevicesList(
        undefined,
        0,
        1,
      );

      expect(devicePage.count).toBe(3);
      expect(devicePage.last).toBeFalsy();
      expect(devicePage.limit).toBe(1);
      expect(devicePage.page).toBe(0);
      expect(devicePage.content.map((device) => device.toObject())).toEqual([
        hackingDevice2,
      ]);
    });

    it('should return all hacking devices when no arguments are provided', async () => {
      const hackingDevice1 = {
        id: '1234',
        name: 'Killer Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice1),
      );
      const hackingDevice2 = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice2),
      );
      const hackingDevice3 = {
        id: '3456',
        name: 'Hacking Device Plus',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice3),
      );

      const devicePage = await hackingDeviceService.getHackingDevicesList();

      expect(devicePage.count).toBe(3);
      expect(devicePage.last).toBeTruthy();
      expect(devicePage.limit).toBeUndefined();
      expect(devicePage.page).toBe(0);
      expect(devicePage.content.map((device) => device.toObject())).toEqual([
        hackingDevice2,
        hackingDevice3,
        hackingDevice1,
      ]);
    });

    it('should return a filtered list of hacking programs when search is provided', async () => {
      const hackingDevice1 = {
        id: '1234',
        name: 'Killer Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice1),
      );
      const hackingDevice2 = {
        id: '2345',
        name: 'Hacking Device',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice2),
      );
      const hackingDevice3 = {
        id: '3456',
        name: 'Hacking Device Plus',
        link: null,
      };
      db.getTable('hacking_device').insert(
        convertColToSnakeCase(hackingDevice3),
      );

      const devicePage = await hackingDeviceService.getHackingDevicesList({
        name: 'killer',
      });

      expect(devicePage.count).toBe(1);
      expect(devicePage.last).toBeTruthy();
      expect(devicePage.limit).toBeUndefined();
      expect(devicePage.page).toBe(0);
      expect(devicePage.content.map((device) => device.toObject())).toEqual([
        hackingDevice1,
      ]);
    });
  });
});
