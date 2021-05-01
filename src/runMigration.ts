import { MikroORM } from '@mikro-orm/core';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

dotenv.config();

const ca = fs.readFileSync(path.join(process.cwd(), 'certs/ca.pem')).toString();

assert(ca, new Error('Missing ca.pem file'));

const connection = {
  ssl: {
    rejectUnauthorized: false,
    ca,
  },
};

async function runMigration() {
  console.log('Running migrations...');
  const orm = await MikroORM.init<PostgreSqlDriver>({
    type: 'postgresql',
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as never,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: ['./dist/**/entities/*'],
    entitiesTs: ['./src/**/entities/*'],
    migrations: {
      path: './src/__migrations__',
      disableForeignKeys: false,
    },
    driverOptions:
      process.env.NODE_ENV === 'production' ? { connection } : undefined,
  });

  try {
    const migrator = orm.getMigrator();

    await orm.em.transactional(async (em) => {
      await em.execute('LOCK TABLE mikro_orm_migrations IN EXCLUSIVE MODE');

      await migrator.up({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        transaction: em.getTransactionContext(),
      });
    });
  } catch (e) {
    console.error(e);
  } finally {
    await orm.em.getConnection().close();
  }
}

runMigration().catch(console.error);
