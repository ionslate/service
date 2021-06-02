import migrationConfig from '@config/mikro-orm.migrations.config';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

async function runMigration() {
  console.log('Running migrations...');
  const orm = await MikroORM.init<PostgreSqlDriver>(migrationConfig);

  try {
    const migrator = orm.getMigrator();

    const [result] = await orm.em.execute(
      `SELECT EXISTS ( SELECT FROM information_schema."tables" WHERE table_schema = 'public' AND "table_name"='mikro_orm_migrations' )`,
    );

    await orm.em.transactional(async (em) => {
      if (result?.exists) {
        await em.execute('LOCK TABLE mikro_orm_migrations IN EXCLUSIVE MODE');
      }

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
