import { Migration } from '@mikro-orm/migrations';
import dotenv from 'dotenv';

dotenv.config();

export class Migration20210418180403 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${process.env.DB_API_USER}`,
    );
    this.addSql(
      'create table "ammo" ("id" varchar(255) not null, "name" varchar(255) not null, "link" varchar(255) null);',
    );
    this.addSql(
      'alter table "ammo" add constraint "ammo_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "ammo_combined_ammo" ("id" serial primary key, "ammo_entity_1_id" varchar(255) not null, "ammo_entity_2_id" varchar(255) not null);',
    );

    this.addSql(
      'alter table "ammo_combined_ammo" add constraint "ammo_combined_ammo_ammo_entity_1_id_foreign" foreign key ("ammo_entity_1_id") references "ammo" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "ammo_combined_ammo" add constraint "ammo_combined_ammo_ammo_entity_2_id_foreign" foreign key ("ammo_entity_2_id") references "ammo" ("id") on update cascade on delete cascade;',
    );
  }
}
