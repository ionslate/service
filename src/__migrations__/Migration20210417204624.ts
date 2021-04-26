import { Migration } from '@mikro-orm/migrations';
import dotenv from 'dotenv';

dotenv.config();

export class Migration20210417204624 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE USER ${process.env.DB_API_USER} PASSWORD '${process.env.DB_API_PASSWORD}';`,
    );
    this.addSql(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES to ${process.env.DB_API_USER};`,
    );
    this.addSql(
      `REVOKE ALL PRIVILEGES ON TABLE mikro_orm_migrations FROM ${process.env.DB_API_USER};`,
    );
  }
}
